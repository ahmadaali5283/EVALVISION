"""POST /ai/grade — accepts file upload or JSON text for AI grading."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.models.schemas import GradeResponse, GradeTextRequest, Rubric
from app.services.grading_service import grade_submission
from app.utils.file_utils import cleanup, save_temp_file, validate_mime

router = APIRouter(prefix="/ai", tags=["grading"])


# ── Option A: file upload (multipart/form-data) ────────

@router.post("/grade", response_model=GradeResponse)
async def grade_file(
    file: UploadFile = File(...),
    rubricFile: UploadFile = File(None),
    questions: str = Form(...),
    assignmentTitle: str = Form(""),
    courseName: str = Form(""),
) -> GradeResponse:
    """Grade a PDF or image submission via OCR + LLM."""

    # Validate mime
    if not validate_mime(file.content_type or ""):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. "
                   "Allowed: PDF, DOCX, TXT, JPEG, PNG, WEBP.",
        )

    # Parse questions JSON sent as a form string
    try:
        questions_list = json.loads(questions)
        from app.models.schemas import RubricCriterion
        criteria = [
            RubricCriterion(
                id=f"q{idx}",
                title=q.get("questionText", "")[:80],
                description=q.get("questionText", ""),
                maxScore=q.get("maxMarks", 0)
            ) for idx, q in enumerate(questions_list)
        ]
        rubric_obj = Rubric(title="Exam Rubric", criteria=criteria)
    except (json.JSONDecodeError, Exception) as exc:
        raise HTTPException(status_code=400, detail=f"Invalid questions JSON: {exc}")

    # Save to temp
    suffix = Path(file.filename or "upload").suffix
    tmp_path: Optional[Path] = None
    tmp_rubric_path: Optional[Path] = None

    try:
        contents = await file.read()
        tmp_path = save_temp_file(contents, suffix=suffix)

        if rubricFile and rubricFile.filename:
            rubric_contents = await rubricFile.read()
            tmp_rubric_path = save_temp_file(rubric_contents, suffix=Path(rubricFile.filename).suffix)

        from app.services.ocr_service import extract_text
        rubric_text = ""
        if tmp_rubric_path:
            rubric_text = await extract_text(tmp_rubric_path, rubricFile.content_type or "application/pdf")
            rubric_obj.title = f"Exam Rubric\n\nADDITIONAL RUBRIC DOCUMENT DETAILS:\n{rubric_text}"

        result = await grade_submission(
            rubric=rubric_obj,
            assignment_title=assignmentTitle,
            course_name=courseName,
            file_path=tmp_path,
            mime_type=file.content_type,
        )
        return result
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Grading failed: {exc}")
    finally:
        if tmp_path:
            cleanup(tmp_path)
        if tmp_rubric_path:
            cleanup(tmp_rubric_path)


# ── Option B: plain text (JSON body) ───────────────────

@router.post("/grade/text", response_model=GradeResponse)
async def grade_text(body: GradeTextRequest) -> GradeResponse:
    """Grade pre-extracted submission text via LLM (no OCR needed)."""
    try:
        from app.models.schemas import RubricCriterion
        criteria = [
            RubricCriterion(
                id=f"q{idx}",
                title=q.get("questionText", "")[:80],
                description=q.get("questionText", ""),
                maxScore=q.get("maxMarks", 0)
            ) for idx, q in enumerate(body.questions)
        ]
        rubric_obj = Rubric(title="Exam Rubric", criteria=criteria)
        result = await grade_submission(
            rubric=rubric_obj,
            assignment_title=body.assignmentTitle,
            course_name=body.courseName,
            submission_text=body.text,
        )
        return result
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Grading failed: {exc}")
