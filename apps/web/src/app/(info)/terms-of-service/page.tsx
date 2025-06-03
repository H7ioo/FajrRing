import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="grid grid-cols-1 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-muted-foreground">
              Last updated: January 20, 2024
            </p>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <h2 className="mt-8 mb-4 text-2xl font-semibold">
              1. Acceptance of Terms
            </h2>
            <p className="mb-6">
              By accessing and using FajrRing, you accept and agree to be bound
              by the terms and provision of this agreement. If you do not agree
              to abide by the above, please do not use this service.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold">
              2. Service Description
            </h2>
            <p className="mb-4">
              FajrRing provides automated phone call services to remind users of
              Fajr prayer times. Our service includes:
            </p>
            <ul className="mb-6 list-disc pl-6">
              <li>Automated prayer time calculations</li>
              <li>Customizable call timing preferences</li>
              <li>Multiple calculation method options</li>
              <li>Call history and management features</li>
            </ul>

            <h2 className="mt-8 mb-4 text-2xl font-semibold">
              3. User Responsibilities
            </h2>
            <p className="mb-4">As a user of FajrRing, you agree to:</p>
            <ul className="mb-6 list-disc pl-6">
              <li>Provide accurate and current information</li>
              <li>Maintain the security of your account</li>
              <li>Use the service only for its intended purpose</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not abuse or misuse the service</li>
            </ul>

            <h2 className="mt-8 mb-4 text-2xl font-semibold">
              4. Service Availability
            </h2>
            <p className="mb-6">
              While we strive to provide reliable service, FajrRing is provided
              &quot;as is&quot; without warranty of any kind. We do not
              guarantee uninterrupted service and may experience downtime for
              maintenance or technical issues.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold">
              5. Privacy and Data Protection
            </h2>
            <p className="mb-6">
              Your privacy is important to us. Please review our Privacy Policy,
              which also governs your use of the service, to understand our
              practices regarding your personal information.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold">
              6. Limitation of Liability
            </h2>
            <p className="mb-6">
              FajrRing shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other
              intangible losses resulting from your use of the service.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold">
              7. Account Termination
            </h2>
            <p className="mb-4">
              You may terminate your account at any time by:
            </p>
            <ul className="mb-6 list-disc pl-6">
              <li>Deleting your account through the dashboard</li>
              <li>Contacting our support team</li>
            </ul>
            <p className="mb-6">
              We reserve the right to terminate accounts that violate these
              terms or engage in abusive behavior.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold">
              8. Intellectual Property
            </h2>
            <p className="mb-6">
              The FajrRing service and its original content, features, and
              functionality are and will remain the exclusive property of
              FajrRing and its licensors.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold">
              9. Changes to Terms
            </h2>
            <p className="mb-6">
              We reserve the right to modify or replace these Terms at any time.
              If a revision is material, we will try to provide at least 30 days
              notice prior to any new terms taking effect.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold">
              10. Governing Law
            </h2>
            <p className="mb-6">
              These Terms shall be interpreted and governed by the laws of the
              jurisdiction in which FajrRing operates, without regard to its
              conflict of law provisions.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold">
              11. Contact Information
            </h2>
            <p className="mb-6">
              If you have any questions about these Terms of Service, please
              contact us at legal@fajrring.com
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <Mail className="text-primary h-5 w-5" />
              </div>
              <span>Questions?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Need clarification on our terms?
            </p>
            <Button asChild className="w-full">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </CardContent>
        </Card> */}

        {/* <Card className="bg-primary/5">
          <CardContent className="p-6">
            <h3 className="text-foreground mb-2 font-semibold">Legal Email</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              For legal and terms inquiries:
            </p>
            <a
              href="mailto:legal@fajrring.com"
              className="text-primary text-sm font-medium hover:underline"
            >
              legal@fajrring.com
            </a>
          </CardContent>
        </Card> */}

        {/* <Card>
          <CardContent className="p-6">
            <h3 className="text-foreground mb-2 font-semibold">
              Related Documents
            </h3>
            <div className="space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/privacy">Privacy Policy</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/faq">FAQ</Link>
              </Button>
            </div>
          </CardContent>
        </Card> */}

        <Card className="bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="p-6">
            <h3 className="text-foreground mb-2 font-semibold">
              Important Notice
            </h3>
            <p className="text-muted-foreground text-sm">
              By using FajrRing, you agree to these terms. Please read them
              carefully and contact us if you have any questions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
