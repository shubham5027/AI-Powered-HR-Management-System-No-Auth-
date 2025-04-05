
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/employees/DataTable';
import { AddEmployeeDialog } from '@/components/employees/AddEmployeeDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Employees = () => {
  const [addEmployeeDialogOpen, setAddEmployeeDialogOpen] = useState(false);
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="h2">Employees</h1>
          <Button onClick={() => setAddEmployeeDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable />
          </CardContent>
        </Card>
      </div>
      
      <AddEmployeeDialog 
        open={addEmployeeDialogOpen} 
        onOpenChange={setAddEmployeeDialogOpen}
      />
    </AppLayout>
  );
};

export default Employees;
