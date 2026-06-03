import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faq() {
  const faqs = [
    {
      id: 1,
      title: "How do I book a ride?",
      answer:
        "You can book a ride by downloading our app or visiting our website. Simply enter your pickup and drop-off locations, select your preferred vehicle type, and confirm your ride.",
    },
    {
      id: 2,
      title: "Can I book a ride with a driver?",
      answer:
        "Yes, you can book a ride with a driver by selecting the 'With Driver' option when booking your ride.",
    },
    {
      id: 3,
      title: "What payment options are available?",
      answer:
        "We accept various payment methods including credit cards, debit cards, and mobile payments.",
    },
    {
      id: 4,
      title: "What happens if I have to cancel my booking?",
      answer:
        "We accept various payment methods including credit cards, debit cards, and mobile payments.",
    },
    {
      id: 5,
      title: "Are the rides verified and in good condition?",
      answer: "Yes, all our rides are verified and in good condition.",
    },
  ];
  return (
    <Accordion className="w-full rounded-lg border">
      {faqs.map((faq) => (
        <AccordionItem
          key={faq.id}
          value={`item-${faq.id}`}
          className="border-b px-4 last:border-b-0"
        >
          <AccordionTrigger>{faq.title}</AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
