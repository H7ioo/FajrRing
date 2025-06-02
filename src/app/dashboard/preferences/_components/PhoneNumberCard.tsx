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
import { Phone, Shield } from "lucide-react";
import { useFormData } from "../page";

export function PhoneNumberCard() {
  const { form, isLoading } = useFormData();

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
              {form.watch("phoneNumber")}
            </p>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <p className="text-sm text-green-600">Verified</p>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" loading={isLoading}>
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
                  defaultPhoneNumber={form.watch("phoneNumber")}
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
