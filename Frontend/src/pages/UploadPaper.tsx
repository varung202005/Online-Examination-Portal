import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, X } from 'lucide-react';

const UploadPaper = () => {

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFile = (f: File) => {
    if (f.type !== 'application/pdf') {
      toast({ title: 'Only PDF files are accepted', variant: 'destructive' });
      return;
    }
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {

    if (!file || !title || !subject || !duration) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {

      const formData = new FormData();
      formData.append('paper', file);
      formData.append('title', title);
      formData.append('subject', subject);
      formData.append('duration', duration.toString());

      const token = localStorage.getItem("token");

      // ✅ Upload PDF
      const res = await api.post('/upload/paper', formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data'
        },
      });

      console.log("Upload Response:", res.data);

      toast({ title: 'Paper uploaded successfully' });

      // ✅ Redirect to SetAnswers page
      navigate("/set-answers", {
        state: {
          questions: res.data.questions,
          examId: res.data.examId
        }
      });

      // Reset form
      setFile(null);
      setTitle("");
      setSubject("");
      setDuration(30);

    } catch (err: any) {

      console.error(err);

      toast({
        title: 'Upload failed',
        description: err.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Upload Paper">
      <div className="max-w-lg">
        <div className="surface-card p-6">

          <h2 className="text-lg font-semibold mb-1">
            Upload Exam Paper
          </h2>
          <p className="text-sm mb-6">
            Create an exam by uploading a PDF
          </p>

          {/* 🔹 Inputs */}
          <div className="space-y-3 mb-4">

            <input
              type="text"
              placeholder="Exam Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <input
              type="number"
              placeholder="Duration (minutes)"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />

          </div>

          {/* 🔹 Upload Box */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed p-8 text-center cursor-pointer ${
              dragActive ? 'border-blue-500 bg-gray-100' : 'border-gray-300'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            <Upload className="mx-auto mb-3" />

            <p>
              Drag & drop your PDF here, or <b>browse</b>
            </p>
          </div>

          {/* 🔹 File Preview */}
          {file && (
            <div className="mt-4 flex items-center gap-3 p-3 border rounded">
              <FileText />
              <span className="flex-1 truncate">{file.name}</span>
              <button onClick={() => setFile(null)}>
                <X />
              </button>
            </div>
          )}

          {/* 🔹 Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!file || loading}
            className="mt-4 w-full"
          >
            {loading ? 'Uploading...' : 'Upload Paper'}
          </Button>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadPaper;