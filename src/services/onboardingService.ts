import { supabase } from "@/integrations/supabase/client";
import type { 
  Tables, 
  TablesInsert,
  TablesUpdate 
} from "@/integrations/supabase/types";

export type OnboardingTask = Tables<"onboarding_tasks">;
export type EmployeeOnboarding = Tables<"employee_onboarding">;
export type OnboardingTaskInsert = TablesInsert<"onboarding_tasks">;
export type EmployeeOnboardingInsert = TablesInsert<"employee_onboarding">;
export type OnboardingTaskUpdate = TablesUpdate<"onboarding_tasks">;
export type EmployeeOnboardingUpdate = TablesUpdate<"employee_onboarding">;

export type OnboardingStatus = "pending" | "in_progress" | "completed" | "overdue";

export type OnboardingWithEmployee = EmployeeOnboarding & {
  employees: {
    first_name: string;
    last_name: string;
    email: string;
    position_id: string | null;
    positions?: {
      title: string;
    };
  };
  onboarding_tasks: {
    title: string;
    description: string | null;
    is_required: boolean | null;
  };
};

// Get all onboarding tasks templates
export async function getOnboardingTasks() {
  const { data, error } = await supabase
    .from("onboarding_tasks")
    .select("*")
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching onboarding tasks:", error);
    throw error;
  }

  return data;
}

// Get onboarding tasks for a specific employee
export async function getEmployeeOnboarding(employeeId: string) {
  const { data, error } = await supabase
    .from("employee_onboarding")
    .select(`
      *,
      employees (
        first_name,
        last_name,
        email,
        position_id,
        positions (
          title
        )
      ),
      onboarding_tasks (
        title,
        description,
        is_required
      )
    `)
    .eq("employee_id", employeeId);

  if (error) {
    console.error("Error fetching employee onboarding:", error);
    throw error;
  }

  return data as OnboardingWithEmployee[];
}

// Get all employees with active onboarding processes
export async function getAllActiveOnboarding() {
  const { data, error } = await supabase
    .from("employee_onboarding")
    .select(`
      *,
      employees (
        id,
        first_name,
        last_name,
        email,
        position_id,
        positions (
          title
        )
      ),
      onboarding_tasks (
        title,
        description,
        is_required
      )
    `)
    .is("completed_at", null)
    .order("due_date", { ascending: true });

  if (error) {
    console.error("Error fetching active onboarding processes:", error);
    throw error;
  }

  return data as OnboardingWithEmployee[];
}

// Create a new onboarding task template
export async function createOnboardingTask(task: OnboardingTaskInsert) {
  const { data, error } = await supabase
    .from("onboarding_tasks")
    .insert(task)
    .select();

  if (error) {
    console.error("Error creating onboarding task:", error);
    throw error;
  }

  return data[0];
}

// Update an onboarding task template
export async function updateOnboardingTask(id: string, updates: OnboardingTaskUpdate) {
  const { data, error } = await supabase
    .from("onboarding_tasks")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating onboarding task:", error);
    throw error;
  }

  return data[0];
}

// Delete an onboarding task template
export async function deleteOnboardingTask(id: string) {
  const { error } = await supabase
    .from("onboarding_tasks")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting onboarding task:", error);
    throw error;
  }

  return true;
}

// Assign onboarding tasks to an employee
export async function assignOnboardingToEmployee(
  employeeId: string, 
  taskIds: string[]
) {
  // Get the tasks to determine default due dates
  const { data: tasks } = await supabase
    .from("onboarding_tasks")
    .select("id, default_due_days")
    .in("id", taskIds);
  
  if (!tasks) {
    throw new Error("Could not find specified onboarding tasks");
  }

  // Create employee onboarding entries
  const onboardingEntries = tasks.map(task => {
    // Calculate due date based on default_due_days (or use 14 days as default)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (task.default_due_days || 14));
    
    return {
      employee_id: employeeId,
      task_id: task.id,
      status: "pending" as const,
      due_date: dueDate.toISOString().split('T')[0],
    };
  });

  const { data, error } = await supabase
    .from("employee_onboarding")
    .insert(onboardingEntries)
    .select();

  if (error) {
    console.error("Error assigning onboarding tasks:", error);
    throw error;
  }

  return data;
}

// Update onboarding task status for an employee
export async function updateEmployeeOnboardingStatus(
  id: string,
  status: OnboardingStatus,
  notes?: string
) {
  const updates: EmployeeOnboardingUpdate = {
    status,
    notes,
    updated_at: new Date().toISOString()
  };
  
  // If marked as completed, set the completed_at timestamp
  if (status === "completed") {
    updates.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("employee_onboarding")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating employee onboarding status:", error);
    throw error;
  }

  return data[0];
}

// Get onboarding progress statistics for an employee
export async function getOnboardingProgress(employeeId: string) {
  const { data, error } = await supabase
    .from("employee_onboarding")
    .select("status")
    .eq("employee_id", employeeId);

  if (error) {
    console.error("Error fetching onboarding progress:", error);
    throw error;
  }

  const total = data.length;
  const completed = data.filter(item => item.status === "completed").length;
  const inProgress = data.filter(item => item.status === "in_progress").length;
  const pending = data.filter(item => item.status === "pending").length;
  const overdue = data.filter(item => item.status === "overdue").length;

  return {
    total,
    completed,
    inProgress,
    pending,
    overdue,
    completionPercentage: total > 0 ? (completed / total) * 100 : 0
  };
}

// Create a complete onboarding plan for a new employee using a template
export async function createOnboardingPlan(
  employeeId: string,
  templateName: string
) {
  // First, get the appropriate tasks based on the template name
  let query = supabase
    .from("onboarding_tasks")
    .select("id");
  
  // Apply different filters based on template
  switch (templateName) {
    case "engineering":
      query = query.ilike("title", "%engineering%");
      break;
    case "sales":
      query = query.ilike("title", "%sales%");
      break;
    case "executive":
      query = query.ilike("title", "%executive%");
      break;
    // Standard template includes all required tasks
    default:
      query = query.eq("is_required", true);
  }
  
  const { data: taskData, error: taskError } = await query;
  
  if (taskError) {
    console.error("Error fetching template tasks:", taskError);
    throw taskError;
  }
  
  if (!taskData || taskData.length === 0) {
    throw new Error("No tasks found for the selected template");
  }
  
  // Assign all the template tasks to the employee
  const taskIds = taskData.map(task => task.id);
  return assignOnboardingToEmployee(employeeId, taskIds);
}

// Track onboarding activity for analytics
export async function logOnboardingActivity(
  employeeId: string,
  action: string,
  entityId: string,
  details?: any
) {
  const { error } = await supabase
    .from("activity_logs")
    .insert({
      user_id: employeeId,
      action,
      entity_id: entityId,
      entity_type: "onboarding",
      details
    });

  if (error) {
    console.error("Error logging onboarding activity:", error);
    // Don't throw, just log the error since this is a non-critical operation
  }

  return true;
}