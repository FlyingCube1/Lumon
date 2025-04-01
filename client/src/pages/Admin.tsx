import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: number;
  name: string;
  department: string;
  job: string;
  code: string;
  isAdmin: boolean;
}

export default function Admin() {
  const [, navigate] = useLocation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const { toast } = useToast();

  // Admin credentials form
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    department: "MACRODATA_REFINEMENT",
    job: "",
    code: generateRandomCode()
  });

  function generateRandomCode() {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }

  useEffect(() => {
    // Check if user is possibly authenticated from previous page
    const employeeData = sessionStorage.getItem("severanceEmployee");
    if (employeeData) {
      const employee = JSON.parse(employeeData);
      if (employee.isAdmin) {
        setIsAdminAuthenticated(true);
        fetchEmployees();
      }
    }
  }, []);

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    
    try {
      const response = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: adminName, code: adminCode })
      });

      if (!response.ok) {
        toast({
          title: "Authentication Failed",
          description: "Invalid admin credentials.",
          variant: "destructive"
        });
        setIsAuthenticating(false);
        return;
      }

      setIsAdminAuthenticated(true);
      fetchEmployees();
    } catch (error) {
      toast({
        title: "System Error",
        description: "An error occurred during authentication. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load employee data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async () => {
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee)
      });

      if (!response.ok) {
        throw new Error('Failed to create employee');
      }

      toast({
        title: "Success",
        description: `Employee ${newEmployee.name} has been created.`
      });
      
      // Reset form and refresh list
      setNewEmployee({
        name: "",
        department: "MACRODATA_REFINEMENT",
        job: "",
        code: generateRandomCode()
      });
      setModalOpen(false);
      fetchEmployees();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create employee.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateEmployee = async () => {
    if (!editingEmployee) return;
    
    try {
      const response = await fetch(`/api/employees/${editingEmployee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingEmployee.name,
          department: editingEmployee.department,
          job: editingEmployee.job,
          code: editingEmployee.code,
          isAdmin: editingEmployee.isAdmin
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update employee');
      }

      toast({
        title: "Success",
        description: `Employee ${editingEmployee.name} has been updated.`
      });
      
      setEditingEmployee(null);
      fetchEmployees();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update employee.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      toast({
        title: "Success",
        description: "Employee has been deleted."
      });
      
      fetchEmployees();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee.",
        variant: "destructive"
      });
    }
  };

  const handleReturn = () => {
    navigate("/work");
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card className="w-full max-w-md p-8 border-0 bg-black text-white">
          <CardHeader className="text-center space-y-6 pb-2">
            <svg
              className="h-16 w-16 mx-auto"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2" />
              <path d="M30 50H70" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <CardTitle className="text-2xl font-light tracking-widest">ADMIN VERIFICATION</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8 pt-8">
            <form onSubmit={handleAdminAuth} className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminName" className="text-white font-light uppercase tracking-widest">Admin Name</Label>
                  <Input
                    id="adminName"
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="bg-black text-white border-white focus:border-green-400 h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adminCode" className="text-white font-light uppercase tracking-widest">Admin Code</Label>
                  <Input
                    id="adminCode"
                    type="text"
                    maxLength={5}
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value.replace(/[^0-9]/g, ''))}
                    className="bg-black text-white border-white focus:border-green-400 h-12"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button
                  type="button"
                  className="flex-1 h-12 bg-black hover:bg-gray-900 text-white border border-white hover:border-red-400 uppercase tracking-widest font-light"
                  onClick={handleReturn}
                >
                  Return
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-black hover:bg-gray-900 text-white border border-white hover:border-green-400 uppercase tracking-widest font-light"
                  disabled={isAuthenticating}
                >
                  {isAuthenticating ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <path d="M30 50H70" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="font-light tracking-widest text-lg">LUMON INDUSTRIES</span>
          </div>
          
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              className="text-white border border-gray-800 hover:bg-gray-900 text-xs uppercase"
              onClick={handleReturn}
            >
              Return to Work
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto py-12 px-4">
        <Card className="bg-black border border-gray-800 mb-8">
          <CardHeader className="border-b border-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="uppercase tracking-widest font-light text-xl">Employee Management</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage all severed and unsevered employees
                </CardDescription>
              </div>
              
              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-900 hover:bg-green-800 text-white">
                    Add Employee
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black border border-gray-800 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-light tracking-widest">Add New Employee</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Create a new employee record in the Lumon database.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Name</Label>
                      <Input
                        id="name"
                        className="bg-black text-white border-gray-800"
                        placeholder="Employee Name"
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-white">Department</Label>
                      <Select
                        value={newEmployee.department}
                        onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}
                      >
                        <SelectTrigger className="bg-black text-white border-gray-800">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent className="bg-black text-white border-gray-800">
                          <SelectItem value="MACRODATA_REFINEMENT">Macrodata Refinement</SelectItem>
                          <SelectItem value="OPTICS_AND_DESIGN">Optics and Design</SelectItem>
                          <SelectItem value="MIND_SECURITY">Mind Security</SelectItem>
                          <SelectItem value="DATA_CONTROL">Data Control</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="job" className="text-white">Job Title</Label>
                      <Input
                        id="job"
                        className="bg-black text-white border-gray-800"
                        placeholder="Job Title (optional)"
                        value={newEmployee.job}
                        onChange={(e) => setNewEmployee({...newEmployee, job: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="code" className="text-white">5-Digit Code</Label>
                      <Input
                        id="code"
                        className="bg-black text-white border-gray-800"
                        placeholder="5-Digit Code"
                        value={newEmployee.code}
                        maxLength={5}
                        onChange={(e) => setNewEmployee({...newEmployee, code: e.target.value.replace(/[^0-9]/g, '').slice(0, 5)})}
                      />
                      <p className="text-xs text-gray-500">Auto-generated, can be modified</p>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setModalOpen(false)}
                      className="border-gray-800 text-white"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleCreateEmployee}
                      className="bg-green-900 hover:bg-green-800 text-white"
                    >
                      Create Employee
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <svg
                  className="h-12 w-12 animate-spin"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="2" />
                </svg>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-gray-900">
                      <TableHead className="text-gray-400">Name</TableHead>
                      <TableHead className="text-gray-400">Department</TableHead>
                      <TableHead className="text-gray-400">Job</TableHead>
                      <TableHead className="text-gray-400">Code</TableHead>
                      <TableHead className="text-gray-400">Admin</TableHead>
                      <TableHead className="text-gray-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id} className="border-gray-800 hover:bg-gray-900">
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.department.replace(/_/g, " ")}</TableCell>
                        <TableCell>{employee.job || "-"}</TableCell>
                        <TableCell>{employee.code}</TableCell>
                        <TableCell>{employee.isAdmin ? "Yes" : "No"}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="mr-2 border-gray-800 text-white hover:bg-gray-800"
                                onClick={() => setEditingEmployee(employee)}
                              >
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-black border border-gray-800 text-white">
                              {editingEmployee && (
                                <>
                                  <DialogHeader>
                                    <DialogTitle className="text-lg font-light tracking-widest">Edit Employee</DialogTitle>
                                    <DialogDescription className="text-gray-400">
                                      Update employee information in the Lumon database.
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-name" className="text-white">Name</Label>
                                      <Input
                                        id="edit-name"
                                        className="bg-black text-white border-gray-800"
                                        value={editingEmployee.name}
                                        onChange={(e) => setEditingEmployee({...editingEmployee, name: e.target.value})}
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-department" className="text-white">Department</Label>
                                      <Select
                                        value={editingEmployee.department}
                                        onValueChange={(value) => setEditingEmployee({...editingEmployee, department: value})}
                                      >
                                        <SelectTrigger className="bg-black text-white border-gray-800">
                                          <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-black text-white border-gray-800">
                                          <SelectItem value="MACRODATA_REFINEMENT">Macrodata Refinement</SelectItem>
                                          <SelectItem value="OPTICS_AND_DESIGN">Optics and Design</SelectItem>
                                          <SelectItem value="MIND_SECURITY">Mind Security</SelectItem>
                                          <SelectItem value="DATA_CONTROL">Data Control</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-job" className="text-white">Job Title</Label>
                                      <Input
                                        id="edit-job"
                                        className="bg-black text-white border-gray-800"
                                        value={editingEmployee.job}
                                        onChange={(e) => setEditingEmployee({...editingEmployee, job: e.target.value})}
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-code" className="text-white">5-Digit Code</Label>
                                      <Input
                                        id="edit-code"
                                        className="bg-black text-white border-gray-800"
                                        value={editingEmployee.code}
                                        maxLength={5}
                                        onChange={(e) => setEditingEmployee({...editingEmployee, code: e.target.value.replace(/[^0-9]/g, '').slice(0, 5)})}
                                      />
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        id="edit-admin"
                                        className="rounded bg-black border-gray-800"
                                        checked={editingEmployee.isAdmin}
                                        onChange={() => setEditingEmployee({...editingEmployee, isAdmin: !editingEmployee.isAdmin})}
                                      />
                                      <Label htmlFor="edit-admin" className="text-white">Administrator Access</Label>
                                    </div>
                                  </div>
                                  
                                  <DialogFooter>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      onClick={() => setEditingEmployee(null)}
                                      className="border-gray-800 text-white"
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      type="button" 
                                      onClick={handleUpdateEmployee}
                                      className="bg-green-900 hover:bg-green-800 text-white"
                                    >
                                      Update Employee
                                    </Button>
                                  </DialogFooter>
                                </>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-gray-800 text-white hover:bg-red-900"
                            onClick={() => handleDeleteEmployee(employee.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {employees.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                          No employees found. Add an employee to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 py-4 px-6">
        <div className="container mx-auto text-center text-xs text-gray-500">
          <p>© Lumon Industries. Administrator Access. Confidential.</p>
        </div>
      </footer>
    </div>
  );
}