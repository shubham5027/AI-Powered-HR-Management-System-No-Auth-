
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ClipboardCheck, Plus } from 'lucide-react';
import { OnboardingChatbot } from '@/components/onboarding/OnboardingChatbot';

const onboardingTasks = [
  { 
    id: 1, 
    employee: 'Alex Morgan', 
    position: 'Marketing Specialist',
    startDate: '2023-11-15', 
    status: 'In Progress',
    completedTasks: 7,
    totalTasks: 12
  },
  { 
    id: 2, 
    employee: 'Jamie Chen', 
    position: 'Software Developer',
    startDate: '2023-11-20', 
    status: 'Pending',
    completedTasks: 0,
    totalTasks: 15
  },
  { 
    id: 3, 
    employee: 'Taylor Swift', 
    position: 'HR Coordinator',
    startDate: '2023-11-01', 
    status: 'Completed',
    completedTasks: 10,
    totalTasks: 10 
  },
  { 
    id: 4, 
    employee: 'Sam Wilson', 
    position: 'Sales Representative',
    startDate: '2023-11-12', 
    status: 'In Progress',
    completedTasks: 4,
    totalTasks: 10
  }
];

const taskTemplates = [
  { id: 1, name: 'Standard Employee Onboarding', tasks: 12, departments: 'All' },
  { id: 2, name: 'Engineering Team Onboarding', tasks: 15, departments: 'Engineering' },
  { id: 3, name: 'Sales Team Onboarding', tasks: 10, departments: 'Sales' },
  { id: 4, name: 'Executive Onboarding', tasks: 18, departments: 'Management' },
];

function Onboarding() {
  const [open, setOpen] = React.useState(false);
  
  return (
    <AppLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Onboarding</h1>
          <p className="text-muted-foreground mt-1">
            Manage employee onboarding processes and track progress
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
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
                <Label htmlFor="name">Employee Name</Label>
                <Input id="name" placeholder="Enter employee name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input id="position" placeholder="Enter position title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" />
              </div>
              <div className="grid gap-2">
                <Label>Onboarding Template</Label>
                <RadioGroup defaultValue="standard">
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
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea id="notes" placeholder="Enter any special requirements or notes" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setOpen(false)}>Create Onboarding Plan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Onboarding</CardTitle>
            <CardDescription>
              Currently active employee onboarding processes
            </CardDescription>
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
                {onboardingTasks.map((task) => (
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
                      <Button variant="ghost" size="sm">
                        <ClipboardCheck className="h-4 w-4 mr-1" />
                        View Tasks
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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
                      <Button variant="ghost" size="sm">Edit Template</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* AI Onboarding Chatbot */}
      <OnboardingChatbot />
    </AppLayout>
  );
}

export default Onboarding;
