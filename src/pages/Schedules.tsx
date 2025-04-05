
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  CalendarIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  MoreHorizontal, 
  Plus, 
  RotateCcw, 
  UserPlus, 
  X,
  Copy,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { AddShiftDialog } from '@/components/schedules/AddShiftDialog';
import { EditShiftDialog } from '@/components/schedules/EditShiftDialog';

const departments = [
  "All Departments", 
  "Engineering", 
  "Marketing", 
  "Sales", 
  "Human Resources", 
  "Finance"
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const employees = [
  { id: 1, name: "Alex Morgan", department: "Engineering", position: "Senior Developer" },
  { id: 2, name: "Jamie Chen", department: "Marketing", position: "Marketing Specialist" },
  { id: 3, name: "Taylor Swift", department: "Human Resources", position: "HR Coordinator" },
  { id: 4, name: "Sam Wilson", department: "Sales", position: "Sales Representative" },
  { id: 5, name: "Emma Stone", department: "Engineering", position: "UI Designer" },
  { id: 6, name: "Michael Jordan", department: "Finance", position: "Financial Analyst" },
  { id: 7, name: "Diana Prince", department: "Human Resources", position: "Recruiting Manager" }
];

// Sample shifts for employees
const initialShifts = {
  1: [
    { id: 101, day: 0, start: "9:00", end: "17:00", type: "regular" },
    { id: 102, day: 1, start: "9:00", end: "17:00", type: "regular" },
    { id: 103, day: 2, start: "9:00", end: "17:00", type: "regular" },
    { id: 104, day: 3, start: "9:00", end: "17:00", type: "regular" },
    { id: 105, day: 4, start: "9:00", end: "17:00", type: "regular" },
  ],
  2: [
    { id: 201, day: 0, start: "10:00", end: "18:00", type: "regular" },
    { id: 202, day: 1, start: "10:00", end: "18:00", type: "regular" },
    { id: 203, day: 2, start: "10:00", end: "18:00", type: "regular" },
    { id: 204, day: 3, start: "10:00", end: "18:00", type: "regular" },
    { id: 205, day: 4, start: "10:00", end: "18:00", type: "regular" },
  ],
  3: [
    { id: 301, day: 0, start: "8:00", end: "16:00", type: "regular" },
    { id: 302, day: 1, start: "8:00", end: "16:00", type: "regular" },
    { id: 303, day: 2, start: "8:00", end: "16:00", type: "regular" },
    { id: 304, day: 3, start: "8:00", end: "16:00", type: "regular" },
    { id: 305, day: 4, start: "8:00", end: "16:00", type: "regular" },
  ],
  4: [
    { id: 401, day: 0, start: "9:00", end: "17:00", type: "regular" },
    { id: 402, day: 1, start: "9:00", end: "17:00", type: "regular" },
    { id: 403, day: 2, start: "9:00", end: "17:00", type: "regular" },
    { id: 404, day: 3, start: "9:00", end: "17:00", type: "regular" },
    { id: 405, day: 4, start: "9:00", end: "17:00", type: "regular" },
    { id: 406, day: 5, start: "10:00", end: "15:00", type: "overtime" },
  ],
  5: [
    { id: 501, day: 0, start: "9:00", end: "17:00", type: "regular" },
    { id: 502, day: 1, start: "9:00", end: "17:00", type: "regular" },
    { id: 503, day: 2, start: "9:00", end: "17:00", type: "regular" },
    { id: 504, day: 3, start: "9:00", end: "17:00", type: "regular" },
    { id: 505, day: 4, start: "9:00", end: "17:00", type: "regular" },
  ],
  6: [
    { id: 601, day: 0, start: "8:30", end: "16:30", type: "regular" },
    { id: 602, day: 1, start: "8:30", end: "16:30", type: "regular" },
    { id: 603, day: 2, start: "8:30", end: "16:30", type: "regular" },
    { id: 604, day: 3, start: "8:30", end: "16:30", type: "regular" },
    { id: 605, day: 4, start: "8:30", end: "16:30", type: "regular" },
  ],
  7: [
    { id: 701, day: 0, start: "9:30", end: "17:30", type: "regular" },
    { id: 702, day: 1, start: "9:30", end: "17:30", type: "regular" },
    { id: 703, day: 2, start: "9:30", end: "17:30", type: "regular" },
    { id: 704, day: 3, start: "9:30", end: "17:30", type: "regular" },
    { id: 705, day: 4, start: "9:30", end: "17:30", type: "regular" },
  ]
};

function Schedules() {
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [currentWeek, setCurrentWeek] = useState(getWeekDates());
  const [shifts, setShifts] = useState(initialShifts);
  
  // Dialogs
  const [addShiftDialogOpen, setAddShiftDialogOpen] = useState(false);
  const [editShiftDialogOpen, setEditShiftDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedShift, setSelectedShift] = useState<any | null>(null);
  
  // Get the dates for the current week
  function getWeekDates(offset = 0) {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday, 1 is Monday
    const diff = today.getDate() - day + (day === 0 ? -6 : 1) + (offset * 7); // Adjust to start week on Monday
    
    const monday = new Date(today.setDate(diff));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  }

  function formatDate(date: Date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function getPreviousWeek() {
    setCurrentWeek(getWeekDates(-1));
  }

  function getNextWeek() {
    setCurrentWeek(getWeekDates(1));
  }

  function getCurrentWeek() {
    setCurrentWeek(getWeekDates());
  }

  function getShiftCell(employeeId: number, dayIndex: number) {
    const employeeShifts = shifts[employeeId] || [];
    const shift = employeeShifts.find(s => s.day === dayIndex);
    
    if (!shift) {
      return (
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full h-8 justify-center items-center border border-dashed border-gray-300 hover:border-gray-400"
          onClick={() => handleAddShift(employeeId, dayIndex)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      );
    }
    
    return (
      <div 
        className={`py-1 px-2 rounded text-xs cursor-pointer ${
          shift.type === 'overtime' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
        }`}
        onClick={() => handleEditShift(employeeId, shift)}
      >
        {shift.start} - {shift.end}
      </div>
    );
  }

  function handleAddShift(employeeId: number, day: number) {
    setSelectedEmployeeId(employeeId);
    setSelectedDay(day);
    setAddShiftDialogOpen(true);
  }

  function handleEditShift(employeeId: number, shift: any) {
    setSelectedEmployeeId(employeeId);
    setSelectedShift(shift);
    setEditShiftDialogOpen(true);
  }

  function saveNewShift(shiftData: { start: string, end: string, type: string }) {
    if (selectedEmployeeId === null || selectedDay === null) return;

    const newShift = {
      id: Date.now(), // Simple way to generate a unique ID
      day: selectedDay,
      ...shiftData
    };

    setShifts(prevShifts => {
      const employeeShifts = [...(prevShifts[selectedEmployeeId] || [])];
      employeeShifts.push(newShift);
      
      return {
        ...prevShifts,
        [selectedEmployeeId]: employeeShifts
      };
    });

    toast.success("Shift added successfully");
    setAddShiftDialogOpen(false);
  }

  function updateShift(shiftData: { start: string, end: string, type: string }) {
    if (selectedEmployeeId === null || selectedShift === null) return;

    setShifts(prevShifts => {
      const employeeShifts = [...(prevShifts[selectedEmployeeId] || [])];
      const shiftIndex = employeeShifts.findIndex(s => s.id === selectedShift.id);
      
      if (shiftIndex >= 0) {
        employeeShifts[shiftIndex] = {
          ...selectedShift,
          ...shiftData
        };
      }
      
      return {
        ...prevShifts,
        [selectedEmployeeId]: employeeShifts
      };
    });

    toast.success("Shift updated successfully");
    setEditShiftDialogOpen(false);
  }

  function deleteShift() {
    if (selectedEmployeeId === null || selectedShift === null) return;

    setShifts(prevShifts => {
      const employeeShifts = (prevShifts[selectedEmployeeId] || [])
        .filter(s => s.id !== selectedShift.id);
      
      return {
        ...prevShifts,
        [selectedEmployeeId]: employeeShifts
      };
    });

    toast.success("Shift deleted successfully");
    setEditShiftDialogOpen(false);
  }

  function clearEmployeeSchedule(employeeId: number) {
    setShifts(prevShifts => ({
      ...prevShifts,
      [employeeId]: []
    }));
    toast.success("Schedule cleared successfully");
  }

  function copyLastWeekSchedule(employeeId: number) {
    // In a real app, this would copy from the previous week's data
    // Here we'll simulate by making a copy of the current schedule
    toast.success("Last week's schedule copied successfully");
  }

  // Filter employees based on selected department
  const filteredEmployees = selectedDepartment === "All Departments" 
    ? employees 
    : employees.filter(emp => emp.department === selectedDepartment);

  return (
    <AppLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employee Schedules</h1>
            <p className="text-muted-foreground mt-1">
              Manage work schedules and shifts
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={getCurrentWeek} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-1" />
              Current Week
            </Button>
            <Button onClick={getPreviousWeek} variant="outline" size="icon">
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button onClick={getNextWeek} variant="outline" size="icon">
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button onClick={() => setAddShiftDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Shift
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Select 
            value={selectedDepartment} 
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {formatDate(currentWeek[0])} - {formatDate(currentWeek[6])}
            </span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Schedule</CardTitle>
          <CardDescription>
            Weekly schedule for {selectedDepartment === "All Departments" ? "all employees" : selectedDepartment} department
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Employee</TableHead>
                {weekDays.map((day, i) => (
                  <TableHead key={day} className="text-center">
                    <div>{day}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(currentWeek[i])}</div>
                  </TableHead>
                ))}
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    <div>{employee.name}</div>
                    <div className="text-xs text-muted-foreground">{employee.position}</div>
                  </TableCell>
                  {weekDays.map((_, i) => (
                    <TableCell key={i} className="text-center">
                      {getShiftCell(employee.id, i)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => copyLastWeekSchedule(employee.id)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Last Week
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => clearEmployeeSchedule(employee.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear Schedule
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  <Button variant="outline" size="sm" className="mt-2">
                    <UserPlus className="mr-1 h-4 w-4" />
                    Add Employee
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddShiftDialog 
        open={addShiftDialogOpen} 
        onOpenChange={setAddShiftDialogOpen}
        onSave={saveNewShift}
        employeeName={selectedEmployeeId ? employees.find(e => e.id === selectedEmployeeId)?.name : ''}
        dayName={selectedDay !== null ? weekDays[selectedDay] : ''}
      />

      <EditShiftDialog 
        open={editShiftDialogOpen}
        onOpenChange={setEditShiftDialogOpen}
        shift={selectedShift}
        onUpdate={updateShift}
        onDelete={deleteShift}
        employeeName={selectedEmployeeId ? employees.find(e => e.id === selectedEmployeeId)?.name : ''}
        dayName={selectedShift ? weekDays[selectedShift.day] : ''}
      />
    </AppLayout>
  );
}

export default Schedules;
