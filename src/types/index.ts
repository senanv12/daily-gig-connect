export type UserRole = 'worker' | 'employer';

export type StreakLevel = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  surname: string;
  age?: number;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
}

export interface WorkerProfile extends User {
  role: 'worker';
  points: number;
  streakDays: number;
  streakLevel: StreakLevel;
  completedJobs: Job[];
}

export interface EmployerProfile extends User {
  role: 'employer';
  companyName?: string;
  postedJobs: Job[];
  previousWorkers: WorkerSummary[];
}

export interface WorkerSummary {
  id: string;
  name: string;
  avatar?: string;
  daysWorked: number;
  rating?: number;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  location: string;
  salary: number;
  salaryType: 'hourly' | 'daily';
  date: Date;
  startTime?: string;
  endTime?: string;
  employerId: string;
  employerName: string;
  status: 'active' | 'filled' | 'completed' | 'cancelled';
  applicants?: string[];
  createdAt: Date;
}

export type JobCategory = 
  | 'event'
  | 'restaurant'
  | 'warehouse'
  | 'retail'
  | 'promotion'
  | 'delivery'
  | 'cleaning'
  | 'other';

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export const JOB_CATEGORIES: { value: JobCategory; label: string; icon: string }[] = [
  { value: 'event', label: 'Tədbirlər', icon: 'Calendar' },
  { value: 'restaurant', label: 'Restoran', icon: 'UtensilsCrossed' },
  { value: 'warehouse', label: 'Anbar', icon: 'Warehouse' },
  { value: 'retail', label: 'Satış', icon: 'ShoppingBag' },
  { value: 'promotion', label: 'Reklam', icon: 'Megaphone' },
  { value: 'delivery', label: 'Çatdırılma', icon: 'Truck' },
  { value: 'cleaning', label: 'Təmizlik', icon: 'Sparkles' },
  { value: 'other', label: 'Digər', icon: 'MoreHorizontal' },
];

export function getStreakLevel(days: number): StreakLevel {
  if (days >= 10) return 'diamond';
  if (days >= 7) return 'gold';
  if (days >= 2) return 'silver';
  return 'bronze';
}

export function getStreakLabel(level: StreakLevel): string {
  switch (level) {
    case 'bronze': return 'Bronz';
    case 'silver': return 'Gümüş';
    case 'gold': return 'Qızıl';
    case 'diamond': return 'Almaz';
  }
}
