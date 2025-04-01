import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Work() {
  const [, navigate] = useLocation();
  const [loginInfo, setLoginInfo] = useState<{ name: string; code: string } | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    const login = sessionStorage.getItem("severanceLogin");
    if (!login) {
      navigate("/");
      return;
    }
    
    setLoginInfo(JSON.parse(login));
  }, [navigate]);
  
  if (!loginInfo) {
    return null; // Loading or redirecting
  }
  
  const handleSignOut = () => {
    sessionStorage.removeItem("severanceLogin");
    navigate("/");
  };
  
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
              <span className="text-xl">{loginInfo.name}</span>
            </div>
            
            <div className="flex flex-col items-center space-y-1">
              <span className="text-sm uppercase tracking-widest text-gray-400">ID</span>
              <span className="text-xl">{loginInfo.code}</span>
            </div>
            
            <div className="h-px w-16 bg-gray-800 my-2"></div>
            
            <div className="text-center">
              <h3 className="text-green-400 text-lg font-light tracking-widest mb-2">STATUS</h3>
              <p className="text-2xl font-light">Your job has yet to be assigned.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded w-full mt-6">
              <p className="text-sm text-gray-400 leading-relaxed">
                Please await further instructions from your department supervisor. Your macrodata
                refinement assignment will be allocated based on departmental needs. Remember that
                all work conducted is confidential and subject to the severance protocol.
              </p>
            </div>
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