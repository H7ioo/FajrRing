import PhoneOtpFlowForm from "@/app/(auth)/_components/PhoneOtpFlowForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useSession } from "@/server/auth/auth-client";
import { Phone, Shield } from "lucide-react";

export function PhoneNumberCard() {
  const { data, isPending } = useSession();
  const user = data?.user;
  const userPhoneNumber = user?.phoneNumber ?? "+901234567890";
  const isPhoneNumberVerified = user?.phoneNumberVerified ?? false;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <Phone className="text-primary h-5 w-5" />
          </div>
          <div>
            <CardTitle>Phone Number</CardTitle>
            <CardDescription>
              The number we&apos;ll call for your Fajr reminder
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-foreground font-medium">
              {/* The phone number should always exist but just in case */}
              {isPending ? <Skeleton className="h-4 w-34" /> : userPhoneNumber}
            </p>
            <div className="flex items-center space-x-2">
              {isPending ? (
                <Skeleton className="h-4 w-22" />
              ) : (
                <>
                  <Shield
                    className={cn(
                      "h-4 w-4",
                      { "text-green-600": isPhoneNumberVerified },
                      { "text-red-500": !isPhoneNumberVerified },
                    )}
                  />
                  <p
                    className={cn(
                      "text-sm",
                      { "text-green-600": isPhoneNumberVerified },
                      { "text-red-500": !isPhoneNumberVerified },
                    )}
                  >
                    {isPhoneNumberVerified ? "Verified" : "Not Verified"}
                  </p>
                </>
              )}
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="outline">
                <Phone className="mr-2 h-4 w-4" />
                Update Phone Number
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Update Phone Number</DialogTitle>
                <DialogDescription>
                  Enter your new phone number. We&apos;ll send you a
                  verification code to confirm the change.
                </DialogDescription>
              </DialogHeader>

              <div>
                <PhoneOtpFlowForm
                  flowType="dialog"
                  defaultPhoneNumber={user?.phoneNumber ?? ""}
                  showPrivacyPolicy={false}
                />

                <DialogFooter className="mt-2">
                  <DialogClose asChild className="flex-1">
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
