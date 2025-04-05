
// import React, { useState } from 'react';
// import { AppLayout } from '@/components/layout/AppLayout';
// import { RoleGuard } from '@/components/auth/RoleGuard';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import { Input } from '@/components/ui/input';
// import { Calendar, ChevronDown, Download, FileText, Filter, MoreHorizontal, Plus, Send } from 'lucide-react';

// // Sample payroll data
// const payrollPeriods = [
//   { id: 1, period: "October 2023", status: "Paid", date: "2023-10-30" },
//   { id: 2, period: "September 2023", status: "Paid", date: "2023-09-30" },
//   { id: 3, period: "August 2023", status: "Paid", date: "2023-08-30" },
// ];

// const payrollDetails = [
//   { 
//     id: 1, 
//     employeeId: "EMP001", 
//     name: "Alex Morgan", 
//     department: "Engineering",
//     position: "Senior Developer",
//     salary: 7500.00,
//     overtime: 450.00,
//     bonus: 1000.00,
//     taxes: 2235.00,
//     deductions: 550.00,
//     netPay: 6165.00
//   },
//   { 
//     id: 2, 
//     employeeId: "EMP002", 
//     name: "Jamie Chen", 
//     department: "Marketing",
//     position: "Marketing Specialist",
//     salary: 5200.00,
//     overtime: 0,
//     bonus: 500.00,
//     taxes: 1410.00,
//     deductions: 450.00,
//     netPay: 3840.00
//   },
//   { 
//     id: 3, 
//     employeeId: "EMP003", 
//     name: "Taylor Swift", 
//     department: "Human Resources",
//     position: "HR Coordinator",
//     salary: 4800.00,
//     overtime: 250.00,
//     bonus: 0,
//     taxes: 1260.00,
//     deductions: 380.00,
//     netPay: 3410.00
//   },
//   { 
//     id: 4, 
//     employeeId: "EMP004", 
//     name: "Sam Wilson", 
//     department: "Sales",
//     position: "Sales Representative",
//     salary: 4500.00,
//     overtime: 750.00,
//     bonus: 2000.00,
//     taxes: 1812.50,
//     deductions: 425.00,
//     netPay: 5012.50
//   },
//   { 
//     id: 5, 
//     employeeId: "EMP005", 
//     name: "Emma Stone", 
//     department: "Engineering",
//     position: "UI Designer",
//     salary: 6200.00,
//     overtime: 180.00,
//     bonus: 0,
//     taxes: 1595.00,
//     deductions: 520.00,
//     netPay: 4265.00
//   },
// ];

// // Calculate totals for payroll summary
// const totalSalaries = payrollDetails.reduce((sum, item) => sum + item.salary, 0);
// const totalOvertime = payrollDetails.reduce((sum, item) => sum + item.overtime, 0);
// const totalBonus = payrollDetails.reduce((sum, item) => sum + item.bonus, 0);
// const totalTaxes = payrollDetails.reduce((sum, item) => sum + item.taxes, 0);
// const totalDeductions = payrollDetails.reduce((sum, item) => sum + item.deductions, 0);
// const totalNetPay = payrollDetails.reduce((sum, item) => sum + item.netPay, 0);

// function Payroll() {
//   const [selectedPeriod, setSelectedPeriod] = useState("1");
//   const [showRunPayroll, setShowRunPayroll] = useState(false);
  
//   function formatCurrency(amount) {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       minimumFractionDigits: 2
//     }).format(amount);
//   }

//   return (
//     <AppLayout>
//       <div className="mb-8 flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
//           <p className="text-muted-foreground mt-1">
//             Process and manage employee payroll
//           </p>
//         </div>
//         <Dialog open={showRunPayroll} onOpenChange={setShowRunPayroll}>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="mr-2 h-4 w-4" />
//               Run Payroll
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[600px]">
//             <DialogHeader>
//               <DialogTitle>Run Payroll</DialogTitle>
//               <DialogDescription>
//                 Set up and process a new payroll run
//               </DialogDescription>
//             </DialogHeader>
//             <div className="grid gap-4 py-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="payroll-period" className="block text-sm font-medium mb-1">
//                     Payroll Period
//                   </label>
//                   <Select defaultValue="current">
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select period" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="current">November 2023</SelectItem>
//                       <SelectItem value="previous">December 2023</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <label htmlFor="payment-date" className="block text-sm font-medium mb-1">
//                     Payment Date
//                   </label>
//                   <Input type="date" id="payment-date" defaultValue="2023-11-30" />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="pay-from" className="block text-sm font-medium mb-1">
//                     Pay From
//                   </label>
//                   <Input type="date" id="pay-from" defaultValue="2023-11-01" />
//                 </div>
//                 <div>
//                   <label htmlFor="pay-to" className="block text-sm font-medium mb-1">
//                     Pay To
//                   </label>
//                   <Input type="date" id="pay-to" defaultValue="2023-11-30" />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="notes" className="block text-sm font-medium mb-1">
//                   Notes
//                 </label>
//                 <Input id="notes" placeholder="Enter any notes for this payroll run" />
//               </div>

//               <Card className="mt-2">
//                 <CardHeader className="py-3">
//                   <CardTitle className="text-sm">Payroll Summary</CardTitle>
//                 </CardHeader>
//                 <CardContent className="py-3">
//                   <div className="grid grid-cols-2 gap-2 text-sm">
//                     <div>Total Employees:</div>
//                     <div className="font-medium text-right">{payrollDetails.length}</div>
//                     <div>Total Base Salary:</div>
//                     <div className="font-medium text-right">{formatCurrency(totalSalaries)}</div>
//                     <div>Estimated Taxes:</div>
//                     <div className="font-medium text-right">{formatCurrency(totalTaxes)}</div>
//                     <div>Estimated Net Pay:</div>
//                     <div className="font-medium text-right">{formatCurrency(totalNetPay)}</div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setShowRunPayroll(false)}>Cancel</Button>
//               <Button onClick={() => setShowRunPayroll(false)}>Process Payroll</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="grid gap-6">
//         <Card>
//           <CardHeader className="pb-3">
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle>Payroll History</CardTitle>
//                 <CardDescription>
//                   View and manage past payroll periods
//                 </CardDescription>
//               </div>
//               <Select 
//                 value={selectedPeriod} 
//                 onValueChange={setSelectedPeriod}
//               >
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Select Period" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {payrollPeriods.map(period => (
//                     <SelectItem key={period.id} value={period.id.toString()}>
//                       {period.period}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="rounded-md border mb-4">
//               <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
//                 <div className="p-4">
//                   <div className="text-sm font-medium text-muted-foreground">Period</div>
//                   <div className="mt-1 flex items-center">
//                     <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
//                     <span className="font-medium">{payrollPeriods[parseInt(selectedPeriod)-1]?.period}</span>
//                   </div>
//                 </div>
//                 <div className="p-4">
//                   <div className="text-sm font-medium text-muted-foreground">Status</div>
//                   <div className="mt-1">
//                     <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-800">
//                       {payrollPeriods[parseInt(selectedPeriod)-1]?.status}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="p-4">
//                   <div className="text-sm font-medium text-muted-foreground">Payment Date</div>
//                   <div className="mt-1 font-medium">{payrollPeriods[parseInt(selectedPeriod)-1]?.date}</div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-between mb-4">
//               <Button variant="outline" size="sm">
//                 <Filter className="mr-2 h-4 w-4" />
//                 Filter
//               </Button>
//               <div className="flex space-x-2">
//                 <Button variant="outline" size="sm">
//                   <Download className="mr-2 h-4 w-4" />
//                   Export
//                 </Button>
//                 <Button variant="outline" size="sm">
//                   <Send className="mr-2 h-4 w-4" />
//                   Send Payslips
//                 </Button>
//               </div>
//             </div>

//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Employee ID</TableHead>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Department</TableHead>
//                   <TableHead className="text-right">Base Salary</TableHead>
//                   <TableHead className="text-right">Overtime</TableHead>
//                   <TableHead className="text-right">Bonus</TableHead>
//                   <TableHead className="text-right">Taxes</TableHead>
//                   <TableHead className="text-right">Deductions</TableHead>
//                   <TableHead className="text-right">Net Pay</TableHead>
//                   <TableHead></TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {payrollDetails.map((employee) => (
//                   <TableRow key={employee.id}>
//                     <TableCell>{employee.employeeId}</TableCell>
//                     <TableCell className="font-medium">{employee.name}</TableCell>
//                     <TableCell>{employee.department}</TableCell>
//                     <TableCell className="text-right">{formatCurrency(employee.salary)}</TableCell>
//                     <TableCell className="text-right">{formatCurrency(employee.overtime)}</TableCell>
//                     <TableCell className="text-right">{formatCurrency(employee.bonus)}</TableCell>
//                     <TableCell className="text-right">{formatCurrency(employee.taxes)}</TableCell>
//                     <TableCell className="text-right">{formatCurrency(employee.deductions)}</TableCell>
//                     <TableCell className="text-right font-medium">{formatCurrency(employee.netPay)}</TableCell>
//                     <TableCell>
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem>
//                             <FileText className="mr-2 h-4 w-4" />
//                             View Payslip
//                           </DropdownMenuItem>
//                           <DropdownMenuItem>Edit Details</DropdownMenuItem>
//                           <DropdownMenuItem>View History</DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>

//             <div className="mt-6 rounded-md border p-4 bg-muted/50">
//               <h3 className="text-sm font-medium mb-2">Payroll Summary</h3>
//               <div className="grid grid-cols-3 gap-4">
//                 <div>
//                   <div className="text-sm text-muted-foreground">Total Base Salary</div>
//                   <div className="mt-1 text-lg font-semibold">{formatCurrency(totalSalaries)}</div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-muted-foreground">Total Overtime + Bonuses</div>
//                   <div className="mt-1 text-lg font-semibold">{formatCurrency(totalOvertime + totalBonus)}</div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-muted-foreground">Total Net Payment</div>
//                   <div className="mt-1 text-lg font-semibold">{formatCurrency(totalNetPay)}</div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </AppLayout>
//   );
// }

// export default Payroll;
