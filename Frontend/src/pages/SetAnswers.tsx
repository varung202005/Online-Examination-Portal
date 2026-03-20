import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "@/services/api";

const SetAnswers = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const { questions, examId } = location.state;

  const [answers, setAnswers] = useState<any>({});

  const handleSelect = (index: number, option: string) => {
    setAnswers({ ...answers, [index]: option });
  };

  const handleSubmit = async () => {

    try {

      const token = localStorage.getItem("token");

      // ✅ Prepare data for backend
      const formattedQuestions = questions.map((q: any, index: number) => ({
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_option: answers[index] || "A"
      }));

      console.log("Sending to backend:", formattedQuestions);

      await api.post(
        "/exams/add-questions",
        {
          exam_id: examId,
          questions: formattedQuestions
        },
        {
          headers: {
            Authorization: token
          }
        }
      );

      alert("Questions saved successfully!");

      navigate("/teacher");

    } catch (err: any) {

      console.error("Save error:", err);

      alert("Error saving questions");

    }
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Set Correct Answers
      </h1>

      {/* 🔹 Questions List */}
      {questions.map((q: any, index: number) => (
        <div key={index} className="mb-6 border p-4 rounded">

          {/* ✅ Question */}
          <p className="font-semibold mb-2">
            {index + 1}. {q.question_text}
          </p>

          {/* ✅ Options */}
          {["A", "B", "C", "D"].map((opt) => {

            const optionText =
              opt === "A" ? q.option_a :
              opt === "B" ? q.option_b :
              opt === "C" ? q.option_c :
              q.option_d;

            return (
              <label key={opt} className="block mb-1">

                <input
                  type="radio"
                  name={`q-${index}`}
                  checked={answers[index] === opt}
                  onChange={() => handleSelect(index, opt)}
                  className="mr-2"
                />

                <span>
                  {opt}) {optionText}
                </span>

              </label>
            );
          })}

        </div>
      ))}

      {/* 🔹 Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Save Questions
      </button>

    </div>
  );
};

export default SetAnswers;