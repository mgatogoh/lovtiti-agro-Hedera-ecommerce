'use client';

// import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

interface DashboardGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  dashboardName: string;
  dashboardDescription: string;
}

export default function DashboardGuard({ 
  children, 
  allowedRoles, 
  dashboardName, 
  dashboardDescription 
}: DashboardGuardProps) {
  // const { user, isLoaded } = useUser();
  const user = null; // Allow access for now during development
  const isLoaded = true;
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setIsChecking(false);
    }
  }, [isLoaded]);

  // Show loading state while checking authentication
  if (!isLoaded || isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Allow access for now during development
  // if (!user) {
  //   router.push('/auth/login');
  //   return null;
  // }

  // Get user role from metadata
  // const userRole = user.publicMetadata?.role as string || 'FARMER';
  
  // Check if user has permission to access this dashboard
  // const hasPermission = allowedRoles.includes(userRole);

  // Allow access for now during development
  const hasPermission = true;

  if (false) { // Disable permission check for now
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">Access Denied</CardTitle>
            <CardDescription className="text-gray-600">
              You don't have permission to access the {dashboardName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Insufficient Permissions</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your current role doesn't have access to this dashboard.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Available Dashboards:</h4>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">• Buyer Dashboard</p>
                <p className="text-sm text-gray-600">• Farmer Dashboard</p>
                <p className="text-sm text-gray-600">• Distributor Dashboard</p>
                <p className="text-sm text-gray-600">• Transporter Dashboard</p>
                <p className="text-sm text-gray-600">• Agro Expert Dashboard</p>
                <p className="text-sm text-gray-600">• Admin Dashboard</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </Link>
              <Link href="/auth/login" className="flex-1">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Shield className="w-4 h-4 mr-2" />
                  Switch Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has permission, render the dashboard
  return <>{children}</>;
}
