import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white">
      <Card className="w-full max-w-md mx-4 bg-black border border-gray-800">
        <CardHeader className="text-center border-b border-gray-800">
          <CardTitle className="uppercase tracking-widest font-light text-xl">Error</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-8 pb-8 flex flex-col items-center">
          <svg
            className="h-16 w-16 mb-6"
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
          
          <h1 className="text-xl font-light uppercase tracking-widest mb-6">Page Not Found</h1>

          <div className="bg-gray-900 p-4 rounded w-full my-6">
            <p className="text-sm text-gray-400 text-center">
              Error code 404. This location is not approved for your access level.
            </p>
          </div>
          
          <Link href="/">
            <Button className="mt-4 bg-black hover:bg-gray-900 text-white border border-white hover:border-green-400 uppercase tracking-widest font-light">
              Return to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
