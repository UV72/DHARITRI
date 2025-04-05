
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Shield, Bell, Lock, LogOut } from "lucide-react";

const Profile: React.FC = () => {
  const { logout, user } = useAuth();

  // In a real application, we would fetch the user profile data
  // For now, we'll use some placeholder data
  const userProfile = {
    username: "JohnDoe",
    email: "johndoe@example.com",
    role: "Patient",
    joinDate: "Jan 1, 2023",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-health-dark">User Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto bg-health-primary text-white">
                <AvatarFallback className="text-3xl">
                  {userProfile.username.substring(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{userProfile.username}</CardTitle>
              <CardDescription>{userProfile.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium">{userProfile.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member since:</span>
                  <span className="font-medium">{userProfile.joinDate}</span>
                </div>
              </div>
              <Button
                variant="destructive"
                className="w-full mt-6"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Update your account preferences and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-md bg-muted">
                <div className="flex items-start">
                  <User className="w-5 h-5 mr-3 mt-0.5 text-health-primary" />
                  <div>
                    <h3 className="font-medium">Personal Information</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Update your personal details
                    </p>
                    <Button variant="outline" size="sm" className="text-health-primary">
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-md bg-muted">
                <div className="flex items-start">
                  <Lock className="w-5 h-5 mr-3 mt-0.5 text-health-primary" />
                  <div>
                    <h3 className="font-medium">Password & Security</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Manage your password and security settings
                    </p>
                    <Button variant="outline" size="sm" className="text-health-primary">
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-md bg-muted">
                <div className="flex items-start">
                  <Bell className="w-5 h-5 mr-3 mt-0.5 text-health-primary" />
                  <div>
                    <h3 className="font-medium">Notifications</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Configure how you receive notifications
                    </p>
                    <Button variant="outline" size="sm" className="text-health-primary">
                      Notification Settings
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-md bg-muted">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 mr-3 mt-0.5 text-health-primary" />
                  <div>
                    <h3 className="font-medium">Privacy Settings</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Control your data and privacy preferences
                    </p>
                    <Button variant="outline" size="sm" className="text-health-primary">
                      Privacy Settings
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
