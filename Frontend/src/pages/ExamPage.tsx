import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/services/api";

const ExamPage = () => {

  const { id } = useParams();

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState<number | null>(null);

  // 🔹 Fetch exam + questions
  useEffect(() => {

    const fetchExam = async () => {

      try {

        const token = localStorage.getItem("token");

        // Get all exams
        const examRes = await api.get("/exams", {
          headers: { Authorization: token }
        });

        const currentExam = examRes.data.find((e: any) => e.id == id);

        setExam(currentExam);

        // Set timer from DB
        setTimeLeft(currentExam.duration * 60);

        // Get questions
        const qRes = await api.get(`/exams/${id}`, {
          headers: { Authorization: token }
        });

        setQuestions(qRes.data);

      } catch (err) {
        console.error("Error loading exam:", err);
      }

    };

    fetchExam();

  }, [id]);

  // 🔹 Timer logic
  useEffect(() => {

    if (timeLeft <= 0) return;

    const timer = setInterval(() => {

      setTimeLeft(prev => {

        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }

        return prev - 1;
      });

    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft]);

  // 🔹 Handle option selection
  const handleOptionChange = (qId: number, option: string) => {
    setAnswers({ ...answers, [qId]: option });
  };

  // 🔹 Submit exam
  const handleSubmit = async () => {

    try {

      const token = localStorage.getItem("token");

      const formattedAnswers = Object.keys(answers).map(qId => ({
        question_id: Number(qId),
        selected_option: answers[qId]
      }));

      const res = await api.post("/exams/submit", {
        exam_id: id,
        answers: formattedAnswers
      }, {
        headers: { Authorization: token }
      });

      setScore(res.data.score);

    } catch (err) {
      console.error("Submit error:", err);
    }

  };

  // 🔹 Result screen
  if (score !== null) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">Exam Completed</h1>
        <p className="mt-4 text-lg">Your Score: {score}</p>
      </div>
    );
  }

  // 🔹 Loading state
  if (!exam) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold mb-2">{exam.title}</h1>
      <p className="mb-2">{exam.subject}</p>

      {/* ⏱ Timer */}
      <p className="mb-4 text-red-500 font-semibold">
        Time Left: {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </p>

      {/* 🔹 Questions */}
      {questions.map((q) => (
        <div key={q.id} className="mb-4 border p-4 rounded">

          <p className="font-medium mb-2">{q.question_text}</p>

          {["A", "B", "C", "D"].map(opt => (
            <label key={opt} className="block mb-1">

              <input
                type="radio"
                name={`q-${q.id}`}
                checked={answers[q.id] === opt}
                onChange={() => handleOptionChange(q.id, opt)}
                className="mr-2"
              />

              {q[`option_${opt.toLowerCase()}`]}

            </label>
          ))}

        </div>
      ))}

      {/* 🔹 Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Submit Exam
      </button>

    </div>
  );
};

export default ExamPage;