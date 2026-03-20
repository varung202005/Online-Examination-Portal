import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";

const ExamAttempt = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any>({});
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {

    const fetchExam = async () => {

      const token = localStorage.getItem("token");

      const res = await api.get(`/exams/${id}`, {
        headers: { Authorization: token }
      });

      setQuestions(res.data.questions);
      setTimeLeft(res.data.exam.duration * 60);
    };

    fetchExam();

  }, [id]);

  // TIMER
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSelect = (qId: number, option: string) => {
    setAnswers((prev: any) => ({
      ...prev,
      [qId]: option
    }));
  };

  const handleSubmit = async () => {

    const token = localStorage.getItem("token");

    const res = await api.post(
      "/exams/submit",
      { exam_id: Number(id), answers },
      { headers: { Authorization: token } }
    );

    navigate("/result", { state: res.data });
  };

  return (
    <div className="p-6">

      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">📝 Exam</h1>
        <div className="text-red-500 font-bold">{formatTime()}</div>
      </div>

      {questions.map((q, index) => (
        <div key={q.id} className="mb-5 p-4 border rounded-xl shadow">

          <p className="font-semibold mb-3">
            {index + 1}. {q.question_text}
          </p>

          {["A","B","C","D"].map((opt) => {

            const text =
              opt === "A" ? q.option_a :
              opt === "B" ? q.option_b :
              opt === "C" ? q.option_c :
              q.option_d;

            return (
              <div
                key={opt}
                onClick={() => handleSelect(q.id, opt)}
                className={`p-2 border rounded mb-2 cursor-pointer 
                ${answers[q.id] === opt ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
              >
                {opt}) {text}
              </div>
            );
          })}

        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-6 py-2 rounded-lg"
      >
        Submit Exam
      </button>

    </div>
  );
};

export default ExamAttempt;