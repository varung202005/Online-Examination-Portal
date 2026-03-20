import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import TeacherDashboard from "./pages/TeacherDashboard";
import CreateExam from "./pages/CreateExam";
import UploadPaper from "./pages/UploadPaper";
import StudentDashboard from "./pages/StudentDashboard";
import ExamAttempt from "./pages/ExamAttempt";
import SetAnswers from "./pages/SetAnswers";
import NotFound from "./pages/NotFound";
import ResultPage from "./pages/ResultPage";


const queryClient = new QueryClient();

const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "teacher" ? "/teacher" : "/student"} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>

            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/teacher" element={
              <ProtectedRoute allowedRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            } />

            <Route path="/teacher/create" element={
              <ProtectedRoute allowedRole="teacher">
                <CreateExam />
              </ProtectedRoute>
            } />

            <Route path="/teacher/upload" element={
              <ProtectedRoute allowedRole="teacher">
                <UploadPaper />
              </ProtectedRoute>
            } />

            <Route path="/student" element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            } />

            {/* ✅ ONLY ONE CORRECT EXAM ROUTE */}
            <Route path="/exam/:id" element={
              <ProtectedRoute allowedRole="student">
                <ExamAttempt />
              </ProtectedRoute>
            } />

            <Route path="/set-answers" element={<SetAnswers />} />

            <Route path="*" element={<NotFound />} />
            <Route path="/result" element={<ResultPage />} />


          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;