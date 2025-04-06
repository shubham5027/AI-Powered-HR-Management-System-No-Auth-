import { useState, useEffect } from "react";
import { 
  getOnboardingTasks, 
  getAllActiveOnboarding,
  createOnboardingPlan,
  updateEmployeeOnboardingStatus,
  getOnboardingProgress,
  OnboardingWithEmployee,
  OnboardingTask
} from "@/services/onboardingService";

type OnboardingHookReturn = {
  loading: boolean;
  error: Error | null;
  taskTemplates: OnboardingTask[];
  activeOnboarding: OnboardingWithEmployee[];
  refreshData: () => Promise<void>;
  createNewOnboarding: (employeeId: string, templateName: string) => Promise<boolean>;
  updateTaskStatus: (id: string, status: string, notes?: string) => Promise<boolean>;
  getEmployeeProgress: (employeeId: string) => Promise<{ 
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    overdue: number;
    completionPercentage: number;
  }>;
};

export function useOnboarding(): OnboardingHookReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [taskTemplates, setTaskTemplates] = useState<OnboardingTask[]>([]);
  const [activeOnboarding, setActiveOnboarding] = useState<OnboardingWithEmployee[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [tasksData, activeData] = await Promise.all([
        getOnboardingTasks(),
        getAllActiveOnboarding()
      ]);
      
      setTaskTemplates(tasksData);
      setActiveOnboarding(activeData);
    } catch (err) {
      console.error("Error in useOnboarding hook:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createNewOnboarding = async (employeeId: string, templateName: string): Promise<boolean> => {
    try {
      await createOnboardingPlan(employeeId, templateName);
      await fetchData(); // Refresh data after creation
      return true;
    } catch (err) {
      console.error("Error creating onboarding plan:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    }
  };

  const updateTaskStatus = async (id: string, status: string, notes?: string): Promise<boolean> => {
    try {
      await updateEmployeeOnboardingStatus(
        id, 
        status as "pending" | "in_progress" | "completed" | "overdue", 
        notes
      );
      await fetchData(); // Refresh data after update
      return true;
    } catch (err) {
      console.error("Error updating task status:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    }
  };

  const getEmployeeProgress = async (employeeId: string) => {
    try {
      return await getOnboardingProgress(employeeId);
    } catch (err) {
      console.error("Error getting employee progress:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      // Return default empty progress
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        overdue: 0,
        completionPercentage: 0
      };
    }
  };

  return {
    loading,
    error,
    taskTemplates,
    activeOnboarding,
    refreshData: fetchData,
    createNewOnboarding,
    updateTaskStatus,
    getEmployeeProgress
  };
}