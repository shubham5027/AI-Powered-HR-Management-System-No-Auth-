import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider } from "@/context/AuthContext";
// import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

// Pages
import Index from "./pages/Index";
import Recruitment from "./pages/Recruitment";
import CandidateEvaluation from "./pages/CandidateEvaluation";
import Onboarding from "./pages/Onboarding";
import Schedules from "./pages/Schedules";
import Payroll from "./pages/Payroll";
import EmployeeRelations from "./pages/EmployeeRelations";
import HRAnalytics from "./pages/HRAnalytics";
import Employees from "./pages/Employees";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="system" storageKey="nexushr-theme">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* <AuthProvider> */}
            <Routes>
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Previously protected routes */}
              <Route path="/" element={<Index />} />
              <Route path="/recruitment" element={<Recruitment />} />
              <Route path="/candidate-evaluation" element={<CandidateEvaluation />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/schedules" element={<Schedules />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/employee-relations" element={<EmployeeRelations />} />
              <Route path="/hr-analytics" element={<HRAnalytics />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/support" element={<Support />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          {/* </AuthProvider> */}
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
