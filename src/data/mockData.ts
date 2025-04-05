export type UserRole = 'admin' | 'hr' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  department?: string;
  position?: string;
}

export const currentUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@nexushr.com',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=128&auto=format&fit=crop',
  role: 'hr',
  department: 'Human Resources',
  position: 'HR Manager'
};

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department: string;
  position: string;
  startDate: string;
  status: 'active' | 'onboarding' | 'offboarding' | 'inactive';
  performance?: number;
}

export const employees: Employee[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@nexushr.com',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=128&auto=format&fit=crop',
    department: 'Engineering',
    position: 'Frontend Developer',
    startDate: '2022-01-15',
    status: 'active',
    performance: 85,
  },
  {
    id: '2',
    name: 'Emily Chen',
    email: 'emily.chen@nexushr.com',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=128&auto=format&fit=crop',
    department: 'Marketing',
    position: 'Marketing Manager',
    startDate: '2021-08-10',
    status: 'active',
    performance: 92,
  },
  {
    id: '3',
    name: 'Michael Davis',
    email: 'michael.davis@nexushr.com',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=128&auto=format&fit=crop',
    department: 'Sales',
    position: 'Sales Representative',
    startDate: '2022-03-22',
    status: 'active',
    performance: 78,
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@nexushr.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=128&auto=format&fit=crop',
    department: 'Engineering',
    position: 'Backend Developer',
    startDate: '2022-11-05',
    status: 'onboarding',
    performance: 88,
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david.kim@nexushr.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop',
    department: 'Finance',
    position: 'Financial Analyst',
    startDate: '2023-01-20',
    status: 'active',
    performance: 90,
  },
];

export interface Candidate {
  id: string;
  name: string;
  position: string;
  department?: string;
  email: string;
  phoneNumber?: string;
  status: 'new' | 'screening' | 'interview' | 'offered' | 'hired' | 'rejected';
  appliedDate?: string;
  avatar?: string;
  resume?: string;
  notes?: string;
  matchScore?: number;
  skillList?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  projectUrls?: string[];
  portfolioScore?: number;
  githubScore?: number;
  linkedinScore?: number;
  certScore?: number;
  projectScore?: number;
}

export const candidates: Candidate[] = [
  {
    id: '1',
    name: 'Jane Smith',
    position: 'Frontend Developer',
    email: 'jane@example.com',
    status: 'new',
    avatar: 'https://i.pravatar.cc/150?img=5',
    matchScore: 85,
    appliedDate: '2023-10-01T12:00:00Z',
    phoneNumber: '(555) 123-4567',
    skillList: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML'],
    notes: 'Great candidate with strong front-end skills. Worked at major tech companies.'
  },
  {
    id: '2',
    name: 'John Doe',
    position: 'Backend Developer',
    email: 'john@example.com',
    status: 'screening',
    avatar: 'https://i.pravatar.cc/150?img=8',
    matchScore: 72,
    appliedDate: '2023-09-28T14:30:00Z',
    phoneNumber: '(555) 987-6543',
    skillList: ['Node.js', 'Python', 'SQL', 'MongoDB', 'Express'],
    notes: 'Solid backend experience. Good communication skills but lacks some specific technologies we need.'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    position: 'UX Designer',
    email: 'robert@example.com',
    status: 'interview',
    avatar: 'https://i.pravatar.cc/150?img=12',
    matchScore: 90,
    appliedDate: '2023-09-25T10:15:00Z',
    skillList: ['Figma', 'Adobe XD', 'UI Design', 'User Research', 'Prototyping']
  },
  {
    id: '4',
    name: 'Emily Wilson',
    position: 'Project Manager',
    email: 'emily@example.com',
    status: 'offered',
    avatar: 'https://i.pravatar.cc/150?img=9',
    matchScore: 95,
    appliedDate: '2023-09-20T09:00:00Z',
    phoneNumber: '(555) 555-1212',
    skillList: ['Agile', 'Scrum', 'Jira', 'Team Management', 'Product Development']
  },
  {
    id: '5',
    name: 'Michael Brown',
    position: 'DevOps Engineer',
    email: 'michael@example.com',
    status: 'rejected',
    avatar: 'https://i.pravatar.cc/150?img=11',
    matchScore: 60,
    appliedDate: '2023-09-15T16:45:00Z'
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    position: 'Mobile Developer',
    email: 'lisa@example.com',
    status: 'new',
    avatar: 'https://i.pravatar.cc/150?img=6',
    appliedDate: '2023-10-02T11:30:00Z'
  },
  {
    id: '7',
    name: 'David Martinez',
    position: 'Data Scientist',
    email: 'david@example.com',
    status: 'screening',
    avatar: 'https://i.pravatar.cc/150?img=7',
    matchScore: 82,
    appliedDate: '2023-09-27T13:15:00Z'
  },
  {
    id: '8',
    name: 'Sarah Williams',
    position: 'QA Engineer',
    email: 'sarah@example.com',
    status: 'interview',
    avatar: 'https://i.pravatar.cc/150?img=10',
    appliedDate: '2023-09-22T15:00:00Z'
  }
];

candidates.forEach((candidate, index) => {
  if (index % 3 === 0) {
    // Add GitHub for some candidates
    candidate.githubUrl = `https://github.com/user${index}`;
    candidate.githubScore = Math.floor(Math.random() * 15) + 10; // 10-25 range
  }
  
  if (index % 4 === 0) {
    // Add LinkedIn for some candidates
    candidate.linkedinUrl = `https://linkedin.com/in/user${index}`;
    candidate.linkedinScore = Math.floor(Math.random() * 15) + 10; // 10-25 range
  }
  
  if (index % 5 === 0) {
    // Add project URLs for some candidates
    candidate.projectUrls = [
      `https://github.com/user${index}/project1`,
      `https://github.com/user${index}/project2`
    ];
    candidate.projectScore = Math.floor(Math.random() * 15) + 10; // 10-25 range
  }
  
  if (index % 6 === 0) {
    // Add certification score for some candidates
    candidate.certScore = Math.floor(Math.random() * 15) + 10; // 10-25 range
  }
  
  // Calculate portfolio score for candidates with some data
  if (candidate.githubScore || candidate.linkedinScore || 
      candidate.projectScore || candidate.certScore) {
    // Sum all available scores and normalize to 100
    const scores = [
      candidate.githubScore || 0,
      candidate.linkedinScore || 0,
      candidate.projectScore || 0,
      candidate.certScore || 0
    ];
    const sumOfScores = scores.reduce((acc, score) => acc + score, 0);
    const availableScores = scores.filter(score => score > 0).length;
    
    if (availableScores > 0) {
      // Scale to 100 based on how many scores are available
      candidate.portfolioScore = Math.round((sumOfScores / (availableScores * 25)) * 100);
    }
  }
});

export interface DashboardStat {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
  color?: string;
}

export const dashboardStats: DashboardStat[] = [
  {
    id: '1',
    title: 'Total Employees',
    value: 152,
    change: 12,
    trend: 'up',
    icon: 'users',
    color: 'blue',
  },
  {
    id: '2',
    title: 'Open Positions',
    value: 24,
    change: 3,
    trend: 'up',
    icon: 'briefcase',
    color: 'indigo',
  },
  {
    id: '3',
    title: 'Time to Hire (avg)',
    value: '18 days',
    change: -2,
    trend: 'down',
    icon: 'clock',
    color: 'green',
  },
  {
    id: '4',
    title: 'Employee Satisfaction',
    value: '92%',
    change: 4,
    trend: 'up',
    icon: 'smile',
    color: 'purple',
  },
];

export interface ChartData {
  name: string;
  value: number;
}

export const departmentDistribution: ChartData[] = [
  { name: 'Engineering', value: 45 },
  { name: 'Marketing', value: 30 },
  { name: 'Sales', value: 40 },
  { name: 'Finance', value: 15 },
  { name: 'HR', value: 12 },
  { name: 'Support', value: 20 },
];

export const monthlyHiring: { name: string; hires: number; attrition: number }[] = [
  { name: 'Jan', hires: 8, attrition: 3 },
  { name: 'Feb', hires: 10, attrition: 5 },
  { name: 'Mar', hires: 15, attrition: 4 },
  { name: 'Apr', hires: 12, attrition: 6 },
  { name: 'May', hires: 18, attrition: 7 },
  { name: 'Jun', hires: 14, attrition: 4 },
  { name: 'Jul', hires: 22, attrition: 9 },
];

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  postedDate: string;
  applicants: number;
  status: 'open' | 'closed' | 'draft';
}

export const jobPostings: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    postedDate: '2023-06-15',
    applicants: 45,
    status: 'open',
  },
  {
    id: '2',
    title: 'UX Designer',
    department: 'Design',
    location: 'New York, NY',
    postedDate: '2023-06-20',
    applicants: 32,
    status: 'open',
  },
  {
    id: '3',
    title: 'Product Manager',
    department: 'Product',
    location: 'San Francisco, CA',
    postedDate: '2023-06-10',
    applicants: 28,
    status: 'open',
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    postedDate: '2023-06-25',
    applicants: 18,
    status: 'open',
  },
  {
    id: '5',
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'Chicago, IL',
    postedDate: '2023-06-18',
    applicants: 22,
    status: 'open',
  },
];

export interface Activity {
  id: string;
  type: 'application' | 'hire' | 'review' | 'onboarding' | 'interview';
  user: string;
  description: string;
  timestamp: string;
  avatar?: string;
}

export const recentActivities: Activity[] = [
  {
    id: '1',
    type: 'application',
    user: 'James Wilson',
    description: 'applied for Frontend Developer',
    timestamp: '2023-07-05T10:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=128&auto=format&fit=crop',
  },
  {
    id: '2',
    type: 'hire',
    user: 'Sarah Johnson',
    description: 'was hired as Backend Developer',
    timestamp: '2023-07-04T15:45:00Z',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=128&auto=format&fit=crop',
  },
  {
    id: '3',
    type: 'review',
    user: 'Michael Davis',
    description: 'completed quarterly performance review',
    timestamp: '2023-07-04T09:15:00Z',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=128&auto=format&fit=crop',
  },
  {
    id: '4',
    type: 'interview',
    user: 'Lisa Moore',
    description: 'completed second interview for UX Designer',
    timestamp: '2023-07-03T14:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?q=80&w=128&auto=format&fit=crop',
  },
  {
    id: '5',
    type: 'onboarding',
    user: 'David Kim',
    description: 'completed onboarding process',
    timestamp: '2023-07-02T11:20:00Z',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&auto=format&fit=crop',
  },
];
