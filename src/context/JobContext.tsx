import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Job, JobCategory } from '@/types';
import { mockJobs as initialMockJobs } from '@/data/mockJobs';

interface JobContextType {
  jobs: Job[];
  addJob: (job: Job) => void;
  getJobById: (id: string) => Job | undefined;
  getJobsByEmployer: (employerId: string) => Job[];
  applyToJob: (jobId: string, workerId: string) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export function JobProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(initialMockJobs);

  const addJob = useCallback((job: Job) => {
    setJobs(prev => [job, ...prev]);
  }, []);

  const getJobById = useCallback((id: string) => {
    return jobs.find(job => job.id === id);
  }, [jobs]);

  const getJobsByEmployer = useCallback((employerId: string) => {
    return jobs.filter(job => job.employerId === employerId);
  }, [jobs]);

  const applyToJob = useCallback((jobId: string, workerId: string) => {
    setJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          applicants: [...(job.applicants || []), workerId]
        };
      }
      return job;
    }));
  }, []);

  return (
    <JobContext.Provider value={{ jobs, addJob, getJobById, getJobsByEmployer, applyToJob }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}
