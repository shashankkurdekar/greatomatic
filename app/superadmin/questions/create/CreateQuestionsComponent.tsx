"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type Question = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number | null;
  marks: number | string;
};

const MAX_TOTAL_MARKS = 100;

export default function CreateQuestionsComponent() {
  const params = useSearchParams();
  const office = params.get("office") ?? "";
  const branch = params.get("branch") ?? "";
  const jobType = params.get("jobType") ?? "";
  const jobName = params.get("jobName") ?? "";
  const newJobName = jobName.split(" ")[0];

  let i = 0;
  const [questions, setQuestions] = useState<Question[]>(() => [
    {
      id: i++,
      question: "",
      options: ["", "", "", ""],
      correctIndex: null,
      marks: "",
    },
  ]);

  const totalMarks = useMemo(
    () =>
      questions.reduce((sum, question) => sum + Number(question.marks || 0), 0),
    [questions],
  );

  const remainingMarks = MAX_TOTAL_MARKS - totalMarks;

  const updateQuestion = (
    id: number,
    field: keyof Omit<Question, "id">,
    value: string | number | string[],
  ) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== id) return question;
        if (field === "options" && Array.isArray(value)) {
          return { ...question, options: value };
        }
        if (field === "marks" && typeof value === "number") {
          return { ...question, marks: value };
        }
        if (field === "correctIndex" && typeof value === "number") {
          return { ...question, correctIndex: value };
        }
        if (field === "question" && typeof value === "string") {
          return { ...question, question: value };
        }
        return question;
      }),
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: i++,
        question: "",
        options: ["", "", "", ""],
        correctIndex: null,
        marks: "",
      },
    ]);
  };

  const removeQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((question) => question.id !== id));
  };

  const isValidQuestion = (question: Question) => {
    return (
      question.question.trim().length > 0 &&
      question.options.every((option) => option.trim().length > 0) &&
      question.correctIndex !== null &&
      Number(question.marks) > 0
    );
  };

  const canSubmit =
    totalMarks === MAX_TOTAL_MARKS && questions.every(isValidQuestion);

    async function handleSubmit() {
        try {
            const res = await fetch("/api/superadmin/questions/create", {
                method: "POST",
                body: JSON.stringify({
                    office,
                    branch,
                    jobType,
                    jobName: newJobName,
                    questions
                })
            })
            if (res.ok) {
                alert("1")
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong")
        }
        console.log(questions)
    }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create Questions
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Build the exam questions and assign marks for each item.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Job Name</p>
            <p className="mt-1 text-base text-slate-900">{jobName || "N/A"}</p>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Maximum exam marks</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {MAX_TOTAL_MARKS}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total assigned marks</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {totalMarks}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Remaining marks</p>
            <p
              className={`mt-1 text-lg font-semibold ${remainingMarks < 0 ? "text-rose-600" : "text-emerald-600"}`}
            >
              {remainingMarks}
            </p>
            {remainingMarks < 0 && (
              <p className="mt-2 text-sm text-rose-600">
                Total marks exceed {MAX_TOTAL_MARKS}. Adjust question marks.
              </p>
            )}
          </div>
        </section>

        <div className="mt-8 space-y-6">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold text-slate-900">
                  Question {index + 1}
                </h2>
                <button
                  type="button"
                  onClick={() => removeQuestion(question.id)}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Remove question
                </button>
              </div>

              <div className="mt-6 grid gap-6">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Text
                  </span>
                  <input
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    type="text"
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(question.id, "question", e.target.value)
                    }
                  />
                </label>

                <div className="space-y-4">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                    >
                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">
                          Option {optionIndex + 1}
                        </span>
                        <input
                          className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...question.options];
                            newOptions[optionIndex] = e.target.value;
                            updateQuestion(question.id, "options", newOptions);
                          }}
                        />
                      </label>
                      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={question.correctIndex === optionIndex}
                          onChange={() =>
                            updateQuestion(
                              question.id,
                              "correctIndex",
                              optionIndex,
                            )
                          }
                          className="h-4 w-4 rounded-full border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                        Correct answer
                      </label>
                    </div>
                  ))}
                </div>

                <label className="block max-w-xs">
                  <span className="text-sm font-medium text-slate-700">
                    Marks
                  </span>
                  <input
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    type="text"
                    value={question.marks!}
                    onChange={(e) =>
                      updateQuestion(
                        question.id,
                        "marks",
                        Number(e.target.value),
                      )
                    }
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={addQuestion}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            Add question
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`inline-flex min-h-11 items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 ${
              canSubmit
                ? "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-400"
                : "cursor-not-allowed bg-slate-300 text-slate-600"
            }`}
          >
            Save exam
          </button>
        </div>
      </div>
    </div>
  );
}
