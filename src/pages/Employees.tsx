
// import React, { useState } from 'react';
// import { AppLayout } from '@/components/layout/AppLayout';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { DataTable } from '@/components/employees/DataTable';
// import { AddEmployeeDialog } from '@/components/employees/AddEmployeeDialog';
// import { Button } from '@/components/ui/button';
// import { Plus } from 'lucide-react';

// const Employees = () => {
//   const [addEmployeeDialogOpen, setAddEmployeeDialogOpen] = useState(false);
  
//   return (
//     <AppLayout>
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h1 className="h2">Employees</h1>
//           <Button onClick={() => setAddEmployeeDialogOpen(true)}>
//             <Plus className="w-4 h-4 mr-2" />
//             Add Employee
//           </Button>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Employee Directory</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <DataTable />
//           </CardContent>
//         </Card>
//       </div>
      
//       <AddEmployeeDialog 
//         open={addEmployeeDialogOpen} 
//         onOpenChange={setAddEmployeeDialogOpen}
//       />
//     </AppLayout>
//   );
// };

// export default Employees;

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type EmployeeStatus = 'active' | 'on_leave' | 'terminated';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  status: EmployeeStatus;
  hireDate: string;
  phone?: string;
  address?: string;
}

const defaultDepartments = [
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations'
];

const EmployeeManagement = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<string[]>(defaultDepartments);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id' | 'status'>>({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: '',
    hireDate: '',
    phone: '',
    address: ''
  });

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      try {
        const parsedEmployees: Employee[] = JSON.parse(savedEmployees);
        setEmployees(parsedEmployees);
        
        // Extract unique departments from employees with proper typing
        const uniqueDepts = Array.from(
          new Set(parsedEmployees.map((emp: Employee) => emp.department))
        ) as string[];
        
        setDepartments(uniqueDepts.length ? uniqueDepts : defaultDepartments);
      } catch (error) {
        console.error('Failed to parse employee data', error);
        setDepartments(defaultDepartments);
      }
    } else {
      setDepartments(defaultDepartments);
    }
  }, []);

  // Save to localStorage whenever employees change
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  const filteredEmployees = filterDepartment === 'all' 
    ? employees 
    : employees.filter(emp => emp.department === filterDepartment);

  const handleAddEmployee = () => {
    const employee: Employee = {
      ...newEmployee,
      id: Date.now().toString(),
      status: 'active'
    };
    
    setEmployees([...employees, employee]);
    
    // Add new department if it doesn't exist
    if (!departments.includes(newEmployee.department)) {
      setDepartments([...departments, newEmployee.department]);
    }
    
    toast({
      title: 'Employee added',
      description: `${employee.firstName} ${employee.lastName} has been added.`
    });
    
    setNewEmployee({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      position: '',
      hireDate: '',
      phone: '',
      address: ''
    });
    setAddDialogOpen(false);
  };

  const handleEditEmployee = () => {
    if (!selectedEmployee) return;
    
    setEmployees(employees.map(emp => 
      emp.id === selectedEmployee.id ? selectedEmployee : emp
    ));
    
    toast({
      title: 'Employee updated',
      description: `${selectedEmployee.firstName} ${selectedEmployee.lastName} has been updated.`
    });
    
    setEditDialogOpen(false);
  };

  const handleDeleteEmployee = (id: string) => {
    const employee = employees.find(e => e.id === id);
    setEmployees(employees.filter(emp => emp.id !== id));
    
    if (employee) {
      toast({
        title: 'Employee deleted',
        description: `${employee.firstName} ${employee.lastName} has been removed.`,
        variant: 'destructive'
      });
    }
  };

  const handleStatusChange = (id: string, status: EmployeeStatus) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, status } : emp
    ));
    
    const employee = employees.find(e => e.id === id);
    if (employee) {
      toast({
        title: 'Status updated',
        description: `${employee.firstName} ${employee.lastName} is now ${status.replace('_', ' ')}.`
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Employee Management</h1>
          <div className="flex gap-4">
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map(employee => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.firstName} {employee.lastName}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>
                        <Badge variant={
                          employee.status === 'active' ? 'default' :
                          employee.status === 'on_leave' ? 'secondary' : 'destructive'
                        }>
                          {employee.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setViewDialogOpen(true);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setEditDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(
                            employee.id,
                            employee.status === 'active' ? 'on_leave' : 'active'
                          )}
                        >
                          {employee.status === 'active' ? 'Set Leave' : 'Activate'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteEmployee(employee.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No employees found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Employee Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input
                  value={newEmployee.firstName}
                  onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={newEmployee.lastName}
                  onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Department</Label>
                <Select
                  value={newEmployee.department}
                  onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Position</Label>
                <Input
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <Label>Hire Date</Label>
              <Input
                type="date"
                value={newEmployee.hireDate}
                onChange={(e) => setNewEmployee({...newEmployee, hireDate: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Phone (Optional)</Label>
              <Input
                type="tel"
                value={newEmployee.phone || ''}
                onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
              />
            </div>
            <div>
              <Label>Address (Optional)</Label>
              <Input
                value={newEmployee.address || ''}
                onChange={(e) => setNewEmployee({...newEmployee, address: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEmployee}>
                Add Employee
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      {selectedEmployee && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input
                    value={selectedEmployee.firstName}
                    onChange={(e) => setSelectedEmployee({...selectedEmployee, firstName: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    value={selectedEmployee.lastName}
                    onChange={(e) => setSelectedEmployee({...selectedEmployee, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={selectedEmployee.email}
                  onChange={(e) => setSelectedEmployee({...selectedEmployee, email: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Department</Label>
                  <Select
                    value={selectedEmployee.department}
                    onValueChange={(value) => setSelectedEmployee({...selectedEmployee, department: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Position</Label>
                  <Input
                    value={selectedEmployee.position}
                    onChange={(e) => setSelectedEmployee({...selectedEmployee, position: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Hire Date</Label>
                  <Input
                    type="date"
                    value={selectedEmployee.hireDate}
                    onChange={(e) => setSelectedEmployee({...selectedEmployee, hireDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={selectedEmployee.status}
                    onValueChange={(value: EmployeeStatus) => setSelectedEmployee({...selectedEmployee, status: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on_leave">On Leave</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={selectedEmployee.phone || ''}
                  onChange={(e) => setSelectedEmployee({...selectedEmployee, phone: e.target.value})}
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  value={selectedEmployee.address || ''}
                  onChange={(e) => setSelectedEmployee({...selectedEmployee, address: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditEmployee}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* View Employee Dialog */}
      {selectedEmployee && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Employee Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </h3>
                <Badge variant={
                  selectedEmployee.status === 'active' ? 'default' :
                  selectedEmployee.status === 'on_leave' ? 'secondary' : 'destructive'
                }>
                  {selectedEmployee.status.replace('_', ' ')}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{selectedEmployee.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{selectedEmployee.phone || 'N/A'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p>{selectedEmployee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p>{selectedEmployee.position}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Hire Date</p>
                <p>{new Date(selectedEmployee.hireDate).toLocaleDateString()}</p>
              </div>
              
              {selectedEmployee.address && (
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p>{selectedEmployee.address}</p>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AppLayout>
  );
};

export default EmployeeManagement;