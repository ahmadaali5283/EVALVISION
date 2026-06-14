import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Shield,
  Zap,
  Clock,
  Users,
  Brain,
  FileSearch,
  Star,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
  }),
};

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="-mx-4 -mt-8 sm:-mx-6 lg:-mx-8">
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        {/* Decorative blurs */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2">
          <div className="h-[500px] w-[800px] rounded-full bg-indigo-400/20 blur-[120px]" />
        </div>
        <div className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full bg-purple-400/15 blur-[100px]" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-fuchsia-400/10 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by Advanced AI
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            Grade Exams in Seconds,{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Not Hours
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500"
          >
            Upload scanned answer sheets, let AI extract handwriting via OCR,
            and receive detailed rubric-based grades with feedback — all
            automatically. Built for educators who value their time.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                >
                  Start Grading Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-400 hover:-translate-y-0.5"
                >
                  Sign In
                </Link>
              </>
            )}
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-400"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Setup in under 2 minutes
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Works with handwritten text
            </span>
          </motion.div>
        </div>

        {/* Abstract UI mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10">
            <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 sm:p-8">
              {/* Fake dashboard header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <div className="h-4 w-40 rounded-full bg-slate-200" />
              </div>
              {/* Fake stat cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Exams Created", value: "24", color: "indigo" },
                  { label: "Submissions Graded", value: "1,287", color: "emerald" },
                  { label: "Hours Saved", value: "186", color: "purple" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-white p-4 shadow-sm">
                    <div className="h-2.5 w-16 rounded-full bg-slate-200" />
                    <p className={`mt-3 text-2xl font-bold text-${s.color}-600`}>{s.value}</p>
                    <p className="mt-1 text-xs text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>
              {/* Fake table rows */}
              <div className="mt-6 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 rounded-lg bg-white p-3 shadow-sm">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-2.5 w-32 rounded-full bg-slate-200" />
                      <div className="h-2 w-48 rounded-full bg-slate-100" />
                    </div>
                    <div className="h-6 w-16 rounded-full bg-emerald-100" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── LOGOS / SOCIAL PROOF ─────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-12">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Trusted by educators worldwide
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-40">
            {["Stanford University", "MIT", "Oxford", "Harvard", "Cambridge"].map(
              (name) => (
                <span key={name} className="text-lg font-bold text-slate-800">
                  {name}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              Simple Workflow
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Three Steps to Automated Grading
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-500">
              From exam creation to AI-generated scores — the entire workflow
              takes minutes, not days.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                icon: FileText,
                title: "Create Your Exam",
                desc: "Define questions with point values, model answers, and a grading rubric that guides the AI evaluator.",
                color: "indigo",
              },
              {
                step: "02",
                icon: Upload,
                title: "Upload Answer Sheets",
                desc: "Scan student work as PDFs or high-resolution images. Our OCR engine handles messy handwriting.",
                color: "purple",
              },
              {
                step: "03",
                icon: Sparkles,
                title: "Get AI Grades",
                desc: "Receive per-question scores, detailed feedback, and overall evaluations in seconds — ready to review.",
                color: "fuchsia",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                custom={i}
                className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-lg hover:-translate-y-1"
              >
                <span className="absolute -top-3 left-5 rounded-full bg-slate-900 px-3 py-0.5 text-xs font-bold text-white">
                  {item.step}
                </span>
                <div className={`mb-4 mt-2 inline-flex rounded-xl bg-${item.color}-50 p-3 text-${item.color}-600`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES BENTO GRID ──────────────────────────── */}
      <section className="bg-slate-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              Features
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything You Need to Automate Grading
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              A complete platform that handles the entire grading pipeline — from
              document scanning to detailed score reports.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Brain,
                title: "AI-Powered Evaluation",
                desc: "Advanced language models analyze student responses against your rubric for accurate, consistent grading.",
              },
              {
                icon: FileSearch,
                title: "OCR Text Extraction",
                desc: "Extract handwritten and printed text from scanned documents. Supports PDFs, JPGs, and PNGs.",
              },
              {
                icon: BarChart3,
                title: "Detailed Analytics",
                desc: "Per-question score breakdowns, trend analysis, and class-wide performance insights at a glance.",
              },
              {
                icon: Zap,
                title: "Instant Results",
                desc: "Grade an entire class of submissions in the time it takes to grade one paper manually.",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                desc: "Your exam content and student data are fully protected with strict access controls and encryption.",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                desc: "Teachers and admins can share exams, review AI grades, and override scores collaboratively.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                custom={i}
                className="group rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 transition-all hover:border-indigo-500/40 hover:bg-slate-800"
              >
                <div className="mb-4 inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400 transition-colors group-hover:bg-indigo-500/20">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS BANNER ─────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:grid-cols-4 sm:p-10">
            {[
              { value: "10x", label: "Faster Grading" },
              { value: "95%", label: "Accuracy Rate" },
              { value: "50+", label: "Subjects Supported" },
              { value: "24/7", label: "Always Available" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                custom={i}
                className="text-center"
              >
                <p className="text-3xl font-extrabold text-indigo-600 sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────── */}
      <section className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              Testimonials
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Loved by Educators
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                quote:
                  "EvalVision cut my grading time from 6 hours to 30 minutes. The AI feedback is incredibly detailed and consistent.",
                name: "Dr. Sarah Chen",
                role: "Physics Professor",
              },
              {
                quote:
                  "The OCR handles my students' handwriting better than I expected. It even reads messy diagrams and equations.",
                name: "Prof. James Miller",
                role: "Mathematics Dept.",
              },
              {
                quote:
                  "Finally, a grading tool that understands rubrics. The per-criterion breakdown saves me hours of writing feedback.",
                name: "Emily Rodriguez",
                role: "High School Teacher",
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                custom={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-slate-600">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="mt-12 space-y-4">
            {[
              {
                q: "What file formats are supported?",
                a: "You can upload PDF, JPG, JPEG, and PNG files. Multi-page PDFs are fully supported.",
              },
              {
                q: "How accurate is the AI grading?",
                a: "Our AI achieves 95%+ alignment with human graders when provided with clear rubrics and model answers. You can always review and adjust scores.",
              },
              {
                q: "Can I customize the grading rubric?",
                a: "Absolutely. Each exam has its own rubric with custom criteria, point values, and grading instructions that guide the AI's evaluation.",
              },
              {
                q: "Is student data secure?",
                a: "Yes. All data is protected with strict access controls. We never share or use student data for training purposes.",
              },
              {
                q: "Does it work with handwritten answers?",
                a: "Yes. Our OCR pipeline is optimized for handwritten text extraction, including cursive writing and mathematical notation.",
              },
            ].map((faq, i) => (
              <motion.details
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                custom={i}
                className="group rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-semibold text-slate-800 [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <svg
                    className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-45"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </summary>
                <p className="px-6 pb-4 text-sm leading-relaxed text-slate-500">
                  {faq.a}
                </p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 py-20 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-white/10 blur-[80px]" />
          <div className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-fuchsia-400/20 blur-[80px]" />
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Transform Your Grading Workflow?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-indigo-100">
            Join thousands of educators who are saving hours each week with
            AI-powered exam evaluation. Get started in minutes.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition-all hover:bg-indigo-50 hover:-translate-y-0.5"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-indigo-700 shadow-lg transition-all hover:bg-indigo-50 hover:-translate-y-0.5"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:-translate-y-0.5"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-bold text-slate-800">EvalVision AI</span>
          </div>
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} EvalVision AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
