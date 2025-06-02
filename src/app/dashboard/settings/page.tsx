"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Save, Shield, Trash2, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "../_components/DashboardLayout";

// TODO: Update phone number from here and have the account managment here in tabs

export default function Preferences() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = () => {
    toast.error("Account deletion requested", {
      description: "Please check your email for confirmation steps",
    });
  };

  return (
    <DashboardLayout title="Settings">
      {/* Account Management Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
              <User className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>
                Manage your account settings and data
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Button type="button" variant="outline" disabled={isLoading}>
              <User className="mr-2 h-4 w-4" />
              Manage Profile
            </Button>
            <Button type="button" variant="outline" disabled={isLoading}>
              <Shield className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          </div>
          <div className="border-border border-t pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full md:w-auto"
                  disabled={isLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete My FajrRing Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className={buttonVariants({ variant: "destructive" })}
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" loading={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </DashboardLayout>
  );
}
