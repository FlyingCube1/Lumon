import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface EmployeeInfo {
  id: number;
  name: string;
  department: string;
  job: string;
  isAdmin: boolean;
}

export default function Work() {
  const [, navigate] = useLocation();
  const [employee, setEmployee] = useState<EmployeeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is authenticated
    const employeeData = sessionStorage.getItem("severanceEmployee");
    if (!employeeData) {
      navigate("/");
      return;
    }
    
    setEmployee(JSON.parse(employeeData));
    setLoading(false);
    
    // Validate session with the server
    fetchEmployeeInfo();
  }, [navigate]);
  
  const fetchEmployeeInfo = async () => {
    try {
      const response = await fetch('/api/employee-info');
      
      if (!response.ok) {
        // Session expired or invalid
        handleSignOut();
        return;
      }
      
      // Session is valid, could update employee data here if needed
    } catch (error) {
      // Network error, but we'll let the user continue with cached data
      console.error("Failed to validate session:", error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <svg
            className="h-12 w-12 mx-auto animate-spin"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2" />
          </svg>
          <p className="mt-4 text-gray-400">Verifying credentials...</p>
        </div>
      </div>
    );
  }
  
  if (!employee) {
    return null; // Redirecting
  }
  
  const handleSignOut = () => {
    sessionStorage.removeItem("severanceEmployee");
    
    // Call logout API
    fetch('/api/auth/logout', { method: 'POST' }).catch(console.error);
    
    navigate("/");
  };
  
  // Get department-specific message
  const getDepartmentMessage = () => {
    switch (employee.department) {
      case "MACRODATA_REFINEMENT":
        return "Please prepare for your macrodata refinement tasks. Remember to sort your data carefully according to Lumon protocol.";
      case "OPTICS_AND_DESIGN":
        return "Your design work awaits. The department head will assign your creative tasks for today.";
      case "MIND_SECURITY":
        return "Security protocols are your priority. Monitor for any breaches in mental conditioning.";
      case "DATA_CONTROL":
        return "Data access and control operations will be assigned according to today's priority list.";
      default:
        return "Please await further instructions from your department supervisor. Your assignment will be allocated based on departmental needs.";
    }
  };
  
  const departmentStatusMessage = employee.job 
    ? `Your assigned role: ${employee.job}`
    : "Your specific job assignment is pending.";
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <svg
              className="h-8 w-8 mr-3"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2" />
              <path
                d="M30 50H70"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-light tracking-widest text-lg">LUMON INDUSTRIES</span>
          </div>
          
          <Button
            variant="ghost"
            className="text-white border border-gray-800 hover:bg-gray-900 text-xs uppercase"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto py-12 px-4">
        <Card className="bg-black border border-gray-800 max-w-3xl mx-auto">
          <CardHeader className="text-center border-b border-gray-800">
            <CardTitle className="uppercase tracking-widest font-light text-xl">Employee Status</CardTitle>
          </CardHeader>
          
          <CardContent className="p-12 flex flex-col items-center space-y-8">
            <div className="flex flex-col items-center space-y-1">
              <span className="text-sm uppercase tracking-widest text-gray-400">Employee</span>
              <span className="text-xl">{employee.name}</span>
            </div>
            
            <div className="flex flex-col items-center space-y-1">
              <span className="text-sm uppercase tracking-widest text-gray-400">Department</span>
              <span className="text-xl text-green-400">{employee.department.replace(/_/g, " ")}</span>
            </div>
            
            <div className="h-px w-16 bg-gray-800 my-2"></div>
            
            <div className="text-center">
              <h3 className="text-green-400 text-lg font-light tracking-widest mb-2">STATUS</h3>
              <p className="text-2xl font-light">{departmentStatusMessage}</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded w-full mt-6">
              <p className="text-sm text-gray-400 leading-relaxed">
                {getDepartmentMessage()} Remember that all work conducted is confidential and subject to the severance protocol.
              </p>
            </div>
            
            {employee.isAdmin && (
              <div className="w-full mt-4">
                <Button 
                  className="w-full bg-green-900 hover:bg-green-800 text-white" 
                  onClick={() => navigate("/admin")}
                >
                  Access Admin Panel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 py-4 px-6">
        <div className="container mx-auto text-center text-xs text-gray-500">
          <p>© Lumon Industries. All communications are monitored.</p>
        </div>
      </footer>
    </div>
  );
}