import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="grid grid-cols-1 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-muted-foreground">
              Last updated: January 20, 2024
            </p>
          </CardHeader>
          <CardContent className="prose prose-gray max-w-none">
            <h2 className="mt-8 mb-4 text-2xl font-semibold">
              1. Information We Collect
            </h2>
            <p className="mb-4">
              FajrRing collects information necessary to provide automated
              prayer call services:
            </p>
            <ul className="mb-6 list-disc pl-6">
              <li>Phone number for call delivery</li>
              <li>Location data for accurate prayer time calculations</li>
              <li>Prayer calculation method preferences</li>
              <li>Call timing preferences</li>
              <li>Account authentication information</li>
            </ul>

            <h2 className="mt-8 mb-4 text-2xl font-semibold">
              2. How We Use Your Information
            </h2>
            <p className="mb-4">We use your information solely to:</p>
            <ul className="mb-6 list-disc pl-6">
              <li>Deliver automated Fajr prayer calls</li>
              <li>Calculate accurate prayer times for your location</li>
              <li>Maintain and improve our service</li>
              <li>Communicate important service updates</li>
            </ul>

            <h2 className="mt-8 mb-4 text-2xl font-semibold">
              3. Information Sharing
            </h2>
            <p className="mb-6">
              We do not sell, trade, or share your personal information with
              third parties except:
            </p>
            <ul className="mb-6 list-disc pl-6">
              <li>With Twilio for call delivery services</li>
              <li>When required by law or legal process</li>
              <li>To protect our rights or the safety of our users</li>
            </ul>

            <h2 className="mt-8 mb-4 text-2xl font-semibold">
              4. Data Security
            </h2>
            <p className="mb-6">
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction. Your data is encrypted both in transit
              and at rest.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold">
              5. Data Retention
            </h2>
            <p className="mb-6">
              We retain your personal information only as long as necessary to
              provide our services. When you delete your account, we permanently
              remove your data within 30 days.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold">6. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="mb-6 list-disc pl-6">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Pause or stop call services</li>
              <li>Export your data</li>
            </ul>

            <h2 className="mt-8 mb-4 text-2xl font-semibold">
              7. Cookies and Tracking
            </h2>
            <p className="mb-6">
              We use essential cookies to maintain your session and preferences.
              We do not use tracking cookies or analytics that compromise your
              privacy.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold">
              8. Changes to This Policy
            </h2>
            <p className="mb-6">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the &quot;Last updated&quot; date.
            </p>

            <h2 className="mt-8 mb-4 text-2xl font-semibold">9. Contact Us</h2>
            <p className="mb-6">
              If you have questions about this Privacy Policy, please contact us
              at privacy@fajrring.com
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      {/* <div className="space-y-6">
        <Card>
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
              Have questions about our privacy practices?
            </p>
            <Button asChild className="w-full">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardContent className="p-6">
            <h3 className="text-foreground mb-2 font-semibold">
              Privacy Email
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              For privacy-specific inquiries:
            </p>
            <a
              href="mailto:privacy@fajrring.com"
              className="text-primary text-sm font-medium hover:underline"
            >
              privacy@fajrring.com
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-foreground mb-2 font-semibold">
              Related Documents
            </h3>
            <div className="space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/terms">Terms of Service</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/faq">FAQ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
