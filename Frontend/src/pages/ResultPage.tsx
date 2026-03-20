import { useLocation, useNavigate } from "react-router-dom";

const ResultPage = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const { score, total } = location.state || {};

  return (
    <div className="flex items-center justify-center h-screen">

      <div className="p-8 border rounded-xl shadow text-center">

        <h1 className="text-2xl font-bold mb-4">🎉 Exam Result</h1>

        <p className="text-lg">
          Your Score: <span className="font-bold">{score} / {total}</span>
        </p>

        <button
          onClick={() => navigate("/student")}
          className="mt-5 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back to Dashboard
        </button>

      </div>

    </div>
  );
};

export default ResultPage;