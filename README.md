# EvalVision

EvalVision is an AI-assisted exam grading platform built for educators. It lets teachers create exams, upload student submissions, run OCR on handwritten work, and generate rubric-based feedback and scores with an AI grading service.

## What it does

- Create and manage exams with questions, scoring, and rubric files.
- Upload student submissions as scanned files or extracted text.
- Grade submissions automatically with OCR and AI-assisted evaluation.
- Review per-question scores, feedback, and submission status in the dashboard.
- Check submissions for plagiarism-style similarity across graded work.

## Project Structure

- `client/` - React + Vite frontend with Tailwind CSS.
- `server/` - Node.js + Express backend with MongoDB and JWT authentication.
- `ai-service/` - FastAPI service for OCR and AI grading.
- `uploads/` - Local storage for exam files, rubrics, and submission artifacts.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, React Router
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Multer
- AI Service: Python, FastAPI, OCR utilities, Google Gemini integration

## Prerequisites

- Node.js 18+
- npm 9+
- Python 3.10+ for the AI service
- MongoDB running locally or accessible remotely

## Setup

### 1. Install dependencies

From the repository root:

```bash
npm install
```

Then install the AI service dependencies:

```bash
cd ai-service
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
```

### 2. Configure environment variables

Create the required `.env` files for the backend and AI service based on your deployment needs. Common values include:

- MongoDB connection string
- JWT secret
- Server port
- AI service base URL
- Gemini API key

## Run the project

### Frontend and backend

From the repository root:

```bash
npm run dev
```

This starts the client and server together.

### Frontend only

```bash
npm run dev:client
```

### Backend only

```bash
npm run dev:server
```

### AI service

```bash
npm run dev:ai
```

## Main User Flows

- Public landing page with registration and login.
- Teacher dashboard for managing exams and submissions.
- Exam creation and editing.
- Submission upload and grading workflow.
- AI result review with detailed scoring feedback.

## Notes

- The server uses local disk storage under `uploads/` for exam and submission files.
- The AI service expects the backend to send file or text payloads for grading.
- If you deploy the app, make sure uploaded files and environment variables are handled securely.

## License

No license has been specified yet.
