import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";

const TeacherDashboard = () => {

  const [exams, setExams] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchExams = async () => {

      try {

        console.log("Fetching teacher exams...");

        const res = fetch("https://online-examination-portal-1-52p1.onrender.com/api/exams",  {
          headers: {
            Authorization: localStorage.getItem("token") || ""
          }
        });

        const data = await res.json();

        console.log("Teacher Exams Data:", data);

        setExams(data);

      } catch (err) {
        console.error("Error fetching exams:", err);
      }

    };

    fetchExams();

  }, []);

  return (
    <DashboardLayout title="Teacher Dashboard">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Your Exams
          </h1>
          <p className="text-muted-foreground">
            Manage your uploaded exam papers
          </p>
        </div>

      </div>

      {/* EMPTY STATE */}
      {exams.length === 0 ? (
        <div className="text-center mt-20">

          <h2 className="text-lg font-semibold mb-2">
            No exams yet
          </h2>

          <p className="text-muted-foreground mb-4">
            Upload your first exam paper to get started
          </p>

          <button
            onClick={() => navigate("/teacher/upload")}
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            Create your first exam
          </button>

        </div>
      ) : (

        /* EXAM CARDS */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {exams.map((exam) => (
            <div
              key={exam.id}
              className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition"
            >

              {/* SUBJECT */}
              <span className="text-xs px-3 py-1 bg-secondary rounded-full">
                {exam.subject}
              </span>

              {/* TITLE */}
              <h2 className="text-lg font-semibold mt-3">
                {exam.title}
              </h2>

              {/* DURATION */}
              <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                <span>⏱ {exam.duration} MIN</span>
              </div>

            </div>
          ))}

        </div>
      )}

    </DashboardLayout>
  );
};

export default TeacherDashboard;