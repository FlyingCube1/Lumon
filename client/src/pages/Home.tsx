import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError("");
    
    // Validate the form
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    
    if (!code.trim() || code.length !== 5 || !/^\d+$/.test(code)) {
      setError("Please enter a valid 5-digit code.");
      return;
    }
    
    // Check for the specific credentials you want to allow
    if (name.toLowerCase() === "felix" && code === "00000") {
      // Store the login in session
      sessionStorage.setItem("severanceLogin", JSON.stringify({ name, code }));
      
      // Navigate to the work page
      navigate("/work");
    } else {
      toast({
        title: "Access Denied",
        description: "The information you provided is not recognized.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="w-full border-0 bg-black text-white">
          <CardHeader className="text-center space-y-6 pb-2">
            <svg
              className="h-16 w-16 mx-auto"
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
            <CardTitle className="text-2xl font-light tracking-widest">LUMON INDUSTRIES</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8 pt-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white font-light uppercase tracking-widest">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-black text-white border-white focus:border-green-400 h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-white font-light uppercase tracking-widest">5-Digit Code</Label>
                  <Input
                    id="code"
                    type="text"
                    maxLength={5}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                    className="bg-black text-white border-white focus:border-green-400 h-12"
                  />
                </div>
              </div>
              
              {error && (
                <div className="text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full h-12 bg-black hover:bg-gray-900 text-white border border-white hover:border-green-400 uppercase tracking-widest font-light"
              >
                Sign In
              </Button>
            </form>
            
            <div className="text-xs text-center text-gray-400 mt-8">
              <p>Authorized Personnel Only</p>
              <p className="mt-2">© Lumon Industries, Inc.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
