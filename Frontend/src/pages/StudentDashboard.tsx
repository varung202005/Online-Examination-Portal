import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/services/api";

const StudentDashboard = () => {

  const [exams, setExams] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchExams = async () => {

      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/exams", {
          headers: { Authorization: token }
        });

        setExams(res.data);

      } catch (err) {
        console.error("Error fetching exams:", err);
      }

    };

    fetchExams();

  }, []);

  return (
    <DashboardLayout title="Student Dashboard">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Available Exams
          </h1>
          <p className="text-sm text-muted-foreground">
            View and attempt your exams
          </p>
        </div>

      </div>

      {/* EXAM LIST */}
      {exams.length === 0 ? (
        <p className="text-muted-foreground">No exams available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {exams.map((exam) => (
            <div
              key={exam.id}
              className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition"
            >

              {/* SUBJECT TAG */}
              <span className="inline-block text-xs px-3 py-1 bg-secondary rounded-full">
                {exam.subject || "Subject"}
              </span>

              {/* TITLE */}
              <h2 className="text-lg font-semibold mt-3 text-foreground">
                {exam.title}
              </h2>

              {/* DURATION */}
              <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                <span>⏱ {exam.duration} MIN</span>
              </div>

              {/* BUTTON */}
              <button
                onClick={() => navigate(`/exam/${exam.id}`)}
                className="mt-5 w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 transition"
              >
                Start Exam
              </button>

            </div>
          ))}

        </div>
      )}

    </DashboardLayout>
  );
};

export default StudentDashboard;