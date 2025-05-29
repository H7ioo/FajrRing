import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const faqs = [
  {
    id: "faq-1",
    question: "How does FajrRing calculate prayer times?",
    answer:
      "FajrRing uses your location and your chosen calculation method (such as ISNA, Muslim World League, or Diyanet) to determine accurate Fajr prayer times. You can select the method that matches your local mosque or community preferences.",
  },
  {
    id: "faq-2",
    question: "When will I receive my call?",
    answer:
      "You can customize when you receive your call - anywhere from 60 minutes before Fajr to 60 minutes after. The default is 15 minutes before Fajr prayer time. You can adjust this in your settings.",
  },
  {
    id: "faq-3",
    question: "What if I miss a call?",
    answer:
      "If you don't answer the first call, FajrRing will automatically retry up to 3 times with short intervals. You can view your call history to track successful and missed calls.",
  },
  {
    id: "faq-4",
    question: "Can I pause my calls temporarily?",
    answer:
      "Yes! You can easily pause and resume your calls from your dashboard. This is useful when traveling or if you need a break from the service.",
  },
  {
    id: "faq-5",
    question: "Is my phone number safe?",
    answer:
      "Absolutely. We take privacy seriously and only use your phone number for delivering prayer calls. We never share your information with third parties except for essential service providers like Twilio for call delivery.",
  },
  {
    id: "faq-6",
    question: "What calculation methods are available?",
    answer:
      "We support multiple calculation methods including ISNA (Islamic Society of North America), MWL (Muslim World League), Diyanet (Turkey), Egyptian General Authority, Umm Al-Qura (Makkah), and custom parameters.",
  },
  {
    id: "faq-7",
    question: "Does FajrRing work internationally?",
    answer:
      "Yes! FajrRing works worldwide. Our system automatically detects your timezone and calculates prayer times for your specific location, no matter where you are.",
  },
  {
    id: "faq-8",
    question: "How much does FajrRing cost?",
    answer:
      "FajrRing is currently free to use. We believe in making this service accessible to all Muslims who want to maintain a consistent Fajr prayer routine.",
  },
  {
    id: "faq-9",
    question: "Can I change my phone number?",
    answer:
      "Yes, you can update your phone number in your account settings. You'll need to verify the new number before calls can be delivered to it.",
  },
  {
    id: "faq-10",
    question: "What if I'm traveling?",
    answer:
      "When you travel, you can either update your location in settings for accurate local prayer times, or simply pause your calls if you prefer to follow local arrangements.",
  },
];

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Card className="shadow-lg">
        <CardHeader className="text-center sm:text-left">
          <CardTitle className="text-foreground text-2xl font-bold sm:text-3xl">
            Frequently Asked Questions
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            Find answers to common questions about FajrRing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="py-4 text-left text-base font-medium hover:no-underline sm:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-0 pb-4 text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
