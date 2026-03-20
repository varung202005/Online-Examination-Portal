import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const CreateExam = () => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/exams/create', {
        title,
        subject,
        duration: parseInt(duration),
      });
      toast({ title: 'Exam created successfully' });
      navigate('/teacher');
    } catch (err: any) {
      toast({
        title: 'Failed to create exam',
        description: err.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Create Exam">
      <div className="max-w-lg">
        <div className="surface-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">New Examination</h2>
          <p className="text-sm text-muted-foreground mb-6">Fill in the exam details below</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Exam Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Midterm Examination" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Mathematics" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input id="duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="60" min={1} required />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => navigate('/teacher')} className="rounded-lg">
                Cancel
              </Button>
              <Button type="submit" className="rounded-lg" disabled={loading}>
                {loading ? 'Creating...' : 'Create Exam'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateExam;
