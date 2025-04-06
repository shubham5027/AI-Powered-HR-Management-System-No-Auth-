
// import React from 'react';
// import { AppLayout } from '@/components/layout/AppLayout';
// import { RoleGuard } from '@/components/auth/RoleGuard';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { ClipboardCheck, Plus } from 'lucide-react';
// import { OnboardingChatbot } from '@/components/onboarding/OnboardingChatbot';

// const onboardingTasks = [
//   { 
//     id: 1, 
//     employee: 'Alex Morgan', 
//     position: 'Marketing Specialist',
//     startDate: '2023-11-15', 
//     status: 'In Progress',
//     completedTasks: 7,
//     totalTasks: 12
//   },
//   { 
//     id: 2, 
//     employee: 'Jamie Chen', 
//     position: 'Software Developer',
//     startDate: '2023-11-20', 
//     status: 'Pending',
//     completedTasks: 0,
//     totalTasks: 15
//   },
//   { 
//     id: 3, 
//     employee: 'Taylor Swift', 
//     position: 'HR Coordinator',
//     startDate: '2023-11-01', 
//     status: 'Completed',
//     completedTasks: 10,
//     totalTasks: 10 
//   },
//   { 
//     id: 4, 
//     employee: 'Sam Wilson', 
//     position: 'Sales Representative',
//     startDate: '2023-11-12', 
//     status: 'In Progress',
//     completedTasks: 4,
//     totalTasks: 10
//   }
// ];

// const taskTemplates = [
//   { id: 1, name: 'Standard Employee Onboarding', tasks: 12, departments: 'All' },
//   { id: 2, name: 'Engineering Team Onboarding', tasks: 15, departments: 'Engineering' },
//   { id: 3, name: 'Sales Team Onboarding', tasks: 10, departments: 'Sales' },
//   { id: 4, name: 'Executive Onboarding', tasks: 18, departments: 'Management' },
// ];

// function Onboarding() {
//   const [open, setOpen] = React.useState(false);
  
//   return (
//     <AppLayout>
//       <div className="mb-8 flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Employee Onboarding</h1>
//           <p className="text-muted-foreground mt-1">
//             Manage employee onboarding processes and track progress
//           </p>
//         </div>
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="mr-2 h-4 w-4" />
//               New Onboarding
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[625px]">
//             <DialogHeader>
//               <DialogTitle>Create New Onboarding</DialogTitle>
//               <DialogDescription>
//                 Set up onboarding for a new employee using a template or custom steps.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="grid gap-4 py-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="name">Employee Name</Label>
//                 <Input id="name" placeholder="Enter employee name" />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="position">Position</Label>
//                 <Input id="position" placeholder="Enter position title" />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="start-date">Start Date</Label>
//                 <Input id="start-date" type="date" />
//               </div>
//               <div className="grid gap-2">
//                 <Label>Onboarding Template</Label>
//                 <RadioGroup defaultValue="standard">
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="standard" id="standard" />
//                     <Label htmlFor="standard">Standard Employee Onboarding</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="engineering" id="engineering" />
//                     <Label htmlFor="engineering">Engineering Team Onboarding</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="sales" id="sales" />
//                     <Label htmlFor="sales">Sales Team Onboarding</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="executive" id="executive" />
//                     <Label htmlFor="executive">Executive Onboarding</Label>
//                   </div>
//                 </RadioGroup>
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="notes">Additional Notes</Label>
//                 <Textarea id="notes" placeholder="Enter any special requirements or notes" />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
//               <Button onClick={() => setOpen(false)}>Create Onboarding Plan</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="grid gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Active Onboarding</CardTitle>
//             <CardDescription>
//               Currently active employee onboarding processes
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Employee</TableHead>
//                   <TableHead>Position</TableHead>
//                   <TableHead>Start Date</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Progress</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {onboardingTasks.map((task) => (
//                   <TableRow key={task.id}>
//                     <TableCell className="font-medium">{task.employee}</TableCell>
//                     <TableCell>{task.position}</TableCell>
//                     <TableCell>{task.startDate}</TableCell>
//                     <TableCell>
//                       <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
//                         task.status === 'Completed' 
//                           ? 'bg-green-100 text-green-800' 
//                           : task.status === 'In Progress' 
//                           ? 'bg-blue-100 text-blue-800' 
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {task.status}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center">
//                         <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
//                           <div 
//                             className="bg-blue-600 h-2.5 rounded-full" 
//                             style={{ width: `${(task.completedTasks / task.totalTasks) * 100}%` }}
//                           ></div>
//                         </div>
//                         <span className="text-xs whitespace-nowrap">{task.completedTasks}/{task.totalTasks}</span>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Button variant="ghost" size="sm">
//                         <ClipboardCheck className="h-4 w-4 mr-1" />
//                         View Tasks
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Onboarding Templates</CardTitle>
//             <CardDescription>
//               Manage standard onboarding templates for different roles and departments
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Template Name</TableHead>
//                   <TableHead>Number of Tasks</TableHead>
//                   <TableHead>Applicable Departments</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {taskTemplates.map((template) => (
//                   <TableRow key={template.id}>
//                     <TableCell className="font-medium">{template.name}</TableCell>
//                     <TableCell>{template.tasks}</TableCell>
//                     <TableCell>{template.departments}</TableCell>
//                     <TableCell>
//                       <Button variant="ghost" size="sm">Edit Template</Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
      
//       {/* AI Onboarding Chatbot */}
//       <OnboardingChatbot />
//     </AppLayout>
//   );
// }

// export default Onboarding;


import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ClipboardCheck, Plus, Pencil, AlertCircle, CheckCircle } from 'lucide-react';
import { OnboardingChatbot } from '@/components/onboarding/OnboardingChatbot';
import { toast } from '@/components/ui/use-toast';

// Define types for better type safety
type OnboardingTask = {
  id: number;
  employee: string;
  position: string;
  startDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  completedTasks: number;
  totalTasks: number;
  tasks?: Array<{
    id: number;
    title: string;
    description: string;
    completed: boolean;
    dueDate: string;
  }>;
};

type TaskTemplate = {
  id: number;
  name: string;
  tasks: number;
  departments: string;
  tasksList: Array<{
    title: string;
    description: string;
  }>;
};

function Onboarding() {
  // Initialize with sample data
  const initialOnboardingTasks: OnboardingTask[] = [
    { 
      id: 1, 
      employee: 'Alex Morgan', 
      position: 'Marketing Specialist',
      startDate: '2023-11-15', 
      status: 'In Progress',
      completedTasks: 7,
      totalTasks: 12,
      tasks: [
        { id: 1, title: 'Complete HR paperwork', description: 'Submit all required HR documents', completed: true, dueDate: '2023-11-16' },
        { id: 2, title: 'IT setup', description: 'Set up company email and access to systems', completed: true, dueDate: '2023-11-16' },
        { id: 3, title: 'Team introduction', description: 'Meet with team members', completed: true, dueDate: '2023-11-17' },
        { id: 4, title: 'Training session 1', description: 'Introduction to company policies', completed: true, dueDate: '2023-11-17' },
        { id: 5, title: 'Training session 2', description: 'Marketing tools overview', completed: true, dueDate: '2023-11-18' },
        { id: 6, title: 'Meet with manager', description: 'Discuss responsibilities and expectations', completed: true, dueDate: '2023-11-18' },
        { id: 7, title: 'Company tour', description: 'Tour of office facilities', completed: true, dueDate: '2023-11-19' },
        { id: 8, title: 'Project briefing', description: 'Overview of current marketing projects', completed: false, dueDate: '2023-11-22' },
        { id: 9, title: 'Set up workstation', description: 'Configure personal workspace', completed: false, dueDate: '2023-11-23' },
        { id: 10, title: 'Marketing strategy review', description: 'Review and understand current marketing strategies', completed: false, dueDate: '2023-11-24' },
        { id: 11, title: 'Tool training', description: 'Training on marketing analytics tools', completed: false, dueDate: '2023-11-25' },
        { id: 12, title: '30-day goals', description: 'Set goals for first 30 days', completed: false, dueDate: '2023-11-30' },
      ]
    },
    { 
      id: 2, 
      employee: 'Jamie Chen', 
      position: 'Software Developer',
      startDate: '2023-11-20', 
      status: 'Pending',
      completedTasks: 0,
      totalTasks: 15,
      tasks: Array(15).fill(null).map((_, i) => ({
        id: i + 1,
        title: `Engineering task ${i + 1}`,
        description: `Description for engineering task ${i + 1}`,
        completed: false,
        dueDate: new Date(new Date('2023-11-20').getTime() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }))
    },
    { 
      id: 3, 
      employee: 'Taylor Swift', 
      position: 'HR Coordinator',
      startDate: '2023-11-01', 
      status: 'Completed',
      completedTasks: 10,
      totalTasks: 10,
      tasks: Array(10).fill(null).map((_, i) => ({
        id: i + 1,
        title: `HR task ${i + 1}`,
        description: `Description for HR task ${i + 1}`,
        completed: true,
        dueDate: new Date(new Date('2023-11-01').getTime() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }))
    },
    { 
      id: 4, 
      employee: 'Sam Wilson', 
      position: 'Sales Representative',
      startDate: '2023-11-12', 
      status: 'In Progress',
      completedTasks: 4,
      totalTasks: 10,
      tasks: Array(10).fill(null).map((_, i) => ({
        id: i + 1,
        title: `Sales task ${i + 1}`,
        description: `Description for sales task ${i + 1}`,
        completed: i < 4,
        dueDate: new Date(new Date('2023-11-12').getTime() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }))
    }
  ];

  const initialTaskTemplates: TaskTemplate[] = [
    { 
      id: 1, 
      name: 'Standard Employee Onboarding', 
      tasks: 12, 
      departments: 'All',
      tasksList: [
        { title: 'Complete HR paperwork', description: 'Submit all required HR documents' },
        { title: 'IT setup', description: 'Set up company email and access to systems' },
        { title: 'Team introduction', description: 'Meet with team members' },
        { title: 'Training session 1', description: 'Introduction to company policies' },
        { title: 'Training session 2', description: 'Department-specific training' },
        { title: 'Meet with manager', description: 'Discuss responsibilities and expectations' },
        { title: 'Company tour', description: 'Tour of office facilities' },
        { title: 'Project briefing', description: 'Overview of current projects' },
        { title: 'Set up workstation', description: 'Configure personal workspace' },
        { title: 'Department overview', description: 'Overview of department functions' },
        { title: 'Tool training', description: 'Training on relevant tools' },
        { title: '30-day goals', description: 'Set goals for first 30 days' },
      ]
    },
    { 
      id: 2, 
      name: 'Engineering Team Onboarding', 
      tasks: 15, 
      departments: 'Engineering',
      tasksList: Array(15).fill(null).map((_, i) => ({
        title: `Engineering onboarding task ${i + 1}`,
        description: `Detailed description for engineering task ${i + 1}`
      }))
    },
    { 
      id: 3, 
      name: 'Sales Team Onboarding', 
      tasks: 10, 
      departments: 'Sales',
      tasksList: Array(10).fill(null).map((_, i) => ({
        title: `Sales onboarding task ${i + 1}`,
        description: `Detailed description for sales task ${i + 1}`
      }))
    },
    { 
      id: 4, 
      name: 'Executive Onboarding', 
      tasks: 18, 
      departments: 'Management',
      tasksList: Array(18).fill(null).map((_, i) => ({
        title: `Executive onboarding task ${i + 1}`,
        description: `Detailed description for executive task ${i + 1}`
      }))
    },
  ];

  // State variables
  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTask[]>(initialOnboardingTasks);
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>(initialTaskTemplates);
  const [newEmployeeDialog, setNewEmployeeDialog] = useState(false);
  const [editTemplateDialog, setEditTemplateDialog] = useState(false);
  const [tasksViewDialog, setTasksViewDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<OnboardingTask | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    startDate: new Date().toISOString().split('T')[0],
    template: 'standard'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedOnboarding = localStorage.getItem('onboardingTasks');
    const storedTemplates = localStorage.getItem('taskTemplates');
    
    if (storedOnboarding) {
      setOnboardingTasks(JSON.parse(storedOnboarding));
    }
    
    if (storedTemplates) {
      setTaskTemplates(JSON.parse(storedTemplates));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('onboardingTasks', JSON.stringify(onboardingTasks));
  }, [onboardingTasks]);

  useEffect(() => {
    localStorage.setItem('taskTemplates', JSON.stringify(taskTemplates));
  }, [taskTemplates]);

  // Form input handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('employee-', '')]: value
    }));
  };

  const handleTemplateChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      template: value
    }));
  };

  // Create new onboarding plan
  const handleCreateOnboarding = () => {
    // Find the selected template
    const templateId = formData.template === 'standard' ? 1 : 
                      formData.template === 'engineering' ? 2 :
                      formData.template === 'sales' ? 3 : 4;
    
    const selectedTemplate = taskTemplates.find(t => t.id === templateId);
    
    if (!selectedTemplate) {
      toast({
        title: "Error",
        description: "Template not found",
        variant: "destructive"
      });
      return;
    }

    // Create task list from template
    const tasksList = selectedTemplate.tasksList.map((task, index) => ({
      id: index + 1,
      title: task.title,
      description: task.description,
      completed: false,
      dueDate: new Date(new Date(formData.startDate).getTime() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }));

    // Create new onboarding entry
    const newOnboarding: OnboardingTask = {
      id: Math.max(0, ...onboardingTasks.map(t => t.id)) + 1,
      employee: formData.name,
      position: formData.position,
      startDate: formData.startDate,
      status: 'Pending',
      completedTasks: 0,
      totalTasks: selectedTemplate.tasks,
      tasks: tasksList
    };

    // Add to state
    setOnboardingTasks(prev => [...prev, newOnboarding]);
    
    // Reset form and close dialog
    setFormData({
      name: '',
      position: '',
      startDate: new Date().toISOString().split('T')[0],
      template: 'standard'
    });
    
    setNewEmployeeDialog(false);
    
    toast({
      title: "Success",
      description: `Onboarding plan created for ${formData.name}`,
      variant: "default"
    });
  };

  // View tasks for a specific onboarding plan
  const handleViewTasks = (task: OnboardingTask) => {
    setSelectedTask(task);
    setTasksViewDialog(true);
  };

  // Edit template
  const handleEditTemplate = (template: TaskTemplate) => {
    setSelectedTemplate(template);
    setEditTemplateDialog(true);
  };

  // Toggle task completion status
  const handleToggleTaskCompletion = (taskId: number) => {
    if (!selectedTask) return;
    
    const updatedTasks = selectedTask.tasks?.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    const completedCount = updatedTasks?.filter(task => task.completed).length || 0;
    const totalCount = updatedTasks?.length || 0;
    
    // Update status based on completion
    let newStatus: 'Pending' | 'In Progress' | 'Completed' = 'Pending';
    
    if (completedCount === 0) {
      newStatus = 'Pending';
    } else if (completedCount === totalCount) {
      newStatus = 'Completed';
    } else {
      newStatus = 'In Progress';
    }

    const updatedTask = {
      ...selectedTask,
      tasks: updatedTasks,
      completedTasks: completedCount,
      totalTasks: totalCount,
      status: newStatus
    };

    setSelectedTask(updatedTask);
    
    // Update in the main list
    setOnboardingTasks(prev => 
      prev.map(item => item.id === selectedTask.id ? updatedTask : item)
    );

    toast({
      title: "Task updated",
      description: `Task status has been updated`,
      variant: "default"
    });
  };

  // Filter onboarding tasks based on search query
  const filteredTasks = onboardingTasks.filter(task => 
    task.employee.toLowerCase().includes(searchQuery.toLowerCase()) || 
    task.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Onboarding</h1>
          <p className="text-muted-foreground mt-1">
            Manage employee onboarding processes and track progress
          </p>
        </div>
        <Dialog open={newEmployeeDialog} onOpenChange={setNewEmployeeDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Onboarding
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Create New Onboarding</DialogTitle>
              <DialogDescription>
                Set up onboarding for a new employee using a template or custom steps.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="employee-name">Employee Name</Label>
                <Input 
                  id="employee-name" 
                  placeholder="Enter employee name" 
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="employee-position">Position</Label>
                <Input 
                  id="employee-position" 
                  placeholder="Enter position title" 
                  value={formData.position}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="employee-startDate">Start Date</Label>
                <Input 
                  id="employee-startDate" 
                  type="date" 
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label>Onboarding Template</Label>
                <RadioGroup 
                  value={formData.template}
                  onValueChange={handleTemplateChange}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard">Standard Employee Onboarding</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="engineering" id="engineering" />
                    <Label htmlFor="engineering">Engineering Team Onboarding</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sales" id="sales" />
                    <Label htmlFor="sales">Sales Team Onboarding</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="executive" id="executive" />
                    <Label htmlFor="executive">Executive Onboarding</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="employee-notes">Additional Notes</Label>
                <Textarea id="employee-notes" placeholder="Enter any special requirements or notes" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewEmployeeDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateOnboarding} disabled={!formData.name || !formData.position}>
                Create Onboarding Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Active Onboarding</CardTitle>
              <CardDescription>
                Currently active employee onboarding processes
              </CardDescription>
            </div>
            <div className="w-1/3">
              <Input 
                placeholder="Search employees or positions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.employee}</TableCell>
                      <TableCell>{task.position}</TableCell>
                      <TableCell>{task.startDate}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          task.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : task.status === 'In Progress' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {task.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${(task.completedTasks / task.totalTasks) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs whitespace-nowrap">{task.completedTasks}/{task.totalTasks}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleViewTasks(task)}>
                          <ClipboardCheck className="h-4 w-4 mr-1" />
                          View Tasks
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      {searchQuery ? 'No matches found. Try a different search term.' : 'No onboarding tasks available.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Onboarding Templates</CardTitle>
            <CardDescription>
              Manage standard onboarding templates for different roles and departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template Name</TableHead>
                  <TableHead>Number of Tasks</TableHead>
                  <TableHead>Applicable Departments</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taskTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>{template.tasks}</TableCell>
                    <TableCell>{template.departments}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit Template
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* Tasks View Dialog */}
      <Dialog open={tasksViewDialog} onOpenChange={setTasksViewDialog}>
        <DialogContent className="sm:max-w-[750px]">
          <DialogHeader>
            <DialogTitle>Onboarding Tasks - {selectedTask?.employee}</DialogTitle>
            <DialogDescription>
              {selectedTask?.position} - Started on {selectedTask?.startDate}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  selectedTask?.status === 'Completed' 
                    ? 'bg-green-100 text-green-800' 
                    : selectedTask?.status === 'In Progress' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedTask?.status}
                </div>
                <span className="text-sm">
                  {selectedTask?.completedTasks}/{selectedTask?.totalTasks} tasks completed
                </span>
              </div>
              <div className="flex w-36 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600" 
                  style={{ width: `${selectedTask ? (selectedTask.completedTasks / selectedTask.totalTasks) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {selectedTask?.tasks?.map((task) => (
                <div 
                  key={task.id} 
                  className={`p-4 border rounded-lg ${task.completed ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="rounded-full p-0 h-8 w-8"
                        onClick={() => handleToggleTaskCompletion(task.id)}
                      >
                        {task.completed ? 
                          <CheckCircle className="h-6 w-6 text-green-500" /> : 
                          <AlertCircle className="h-6 w-6 text-gray-300" />
                        }
                      </Button>
                      <div>
                        <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </h4>
                        <p className="text-sm text-gray-500">{task.description}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Due: {task.dueDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTasksViewDialog(false)}>Close</Button>
            {selectedTask?.status !== 'Completed' && (
              <Button onClick={() => {
                if (!selectedTask) return;
                
                // Mark all tasks as completed
                const updatedTasks = selectedTask.tasks?.map(task => ({
                  ...task,
                  completed: true
                }));
                
                const updatedTask = {
                  ...selectedTask,
                  tasks: updatedTasks,
                  completedTasks: selectedTask.totalTasks,
                  status: 'Completed' as const
                };
                
                setSelectedTask(updatedTask);
                
                // Update in the main list
                setOnboardingTasks(prev => 
                  prev.map(item => item.id === selectedTask.id ? updatedTask : item)
                );
                
                toast({
                  title: "All tasks completed",
                  description: `Onboarding for ${selectedTask.employee} has been marked as completed`,
                  variant: "default"
                });
              }}>
                Mark All Complete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Template Dialog - Simplified for demo */}
      <Dialog open={editTemplateDialog} onOpenChange={setEditTemplateDialog}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit Template: {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Modify tasks in this template. Changes will apply to future onboarding plans.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-96 overflow-y-auto">
            <p className="text-sm text-muted-foreground mb-4">
              This template has {selectedTemplate?.tasks} tasks for {selectedTemplate?.departments} departments.
            </p>
            <div className="space-y-4">
              {selectedTemplate?.tasksList.map((task, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-gray-500">{task.description}</div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTemplateDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              // In a real app, you'd save changes to the template here
              setEditTemplateDialog(false);
              toast({
                title: "Template saved",
                description: "Your changes to the template have been saved",
                variant: "default"
              });
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* AI Onboarding Chatbot */}
      <OnboardingChatbot />
    </AppLayout>
  );
}

export default Onboarding;