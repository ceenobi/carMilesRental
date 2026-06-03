import { LayoutGrid, Calendar, CarFront, Users, User } from "lucide-react";
import type { bookingSchemaType } from "./schemaTypes";

export type NavLinkProps = {
  id: number;
  path: string;
  label: string;
};

export const links = [
  {
    id: 1,
    path: "/",
    label: "Home",
  },
  {
    id: 2,
    path: "/cars",
    label: "Cars",
  },
  {
    id: 3,
    path: "/about-us",
    label: "About Us",
  },
  {
    id: 4,
    path: "/contact-us",
    label: "Contact Us",
  },
] as const;

export const carTypes = [
  {
    id: 1,
    name: "Lexus",
  },
  {
    id: 2,
    name: "Toyota",
  },
  {
    id: 3,
    name: "Honda",
  },
];

export const carStatus = [
  {
    id: 1,
    name: "booked",
  },
  {
    id: 2,
    name: "unavailable",
  },
  {
    id: 3,
    name: "open",
  },
];

export const carCategories = [
  {
    id: 1,
    name: "executive",
  },
  {
    id: 2,
    name: "premium",
  },
  {
    id: 3,
    name: "logistics",
  },
  {
    id: 4,
    name: "city",
  },
  {
    id: 5,
    name: "family",
  },
  {
    id: 6,
    name: "economy",
  },
];

export const heroSubTexts = [
  {
    id: 1,
    title: "Easy Booking Process",
    text: "Book your vehicle under 2 minutes with our simple flow",
    img: "/easy.svg",
  },
  {
    id: 2,
    title: "Transparent Pricing",
    text: "What you see is what you pay. No hidden fees, ever.",
    img: "/pricing.svg",
  },
  {
    id: 3,
    title: "Wide Range of Cars",
    text: "Book yor vehicle under 2 minutes with our simple flow.",
    img: "/verified.svg",
  },
  {
    id: 4,
    title: "Verified and Reliable",
    text: "Every vehicle inspected and every partner background-checked.",
    img: "/ride.svg",
  },
];
export const heroSubTexts2 = [
  {
    id: 1,
    title: "Easy Booking",
    text: "Reserve your ride in 2 minutes.",
  },
  {
    id: 2,
    title: "Professional Drivers",
    text: "Vetted, reliable, always on time.",
  },
  {
    id: 3,
    title: "Big Fleet of Cars",
    text: "From everyday rides to heavy-duty trucks.",
  },
  {
    id: 4,
    title: "Seemless Experience",
    text: "Fast, smooth, and stress-free.",
  },
];

export type TestimonialType = {
  id: number;
  img: string;
  text: string;
  avatar: string;
  name: string;
  location: string;
};

export const testimonials: TestimonialType[] = [
  {
    id: 1,
    img: "/quote.svg",
    text: "Didn’t expect booking a car to be this stress-free tbh. No calls, no back and forth. Just picked, paid, and it was sorted.",
    avatar: "/avatar1.svg",
    name: "Dizzy Gilepsy",
    location: "Lagos",
  },
  {
    id: 2,
    img: "/quote.svg",
    text: "The car was exactly as described. The booking process was straightforward, and customer support was very responsive.",
    avatar: "/avatar2.svg",
    name: "Paul Danton",
    location: "Lagos",
  },
  {
    id: 3,
    img: "/quote.svg",
    text: "The booking experience was magical. No paperwork drama, car arrived spotless. Miles car rental is now my default.",
    avatar: "/avatar3.svg",
    name: "Kizzo Hizzo",
    location: "Lagos",
  },
];

export interface CarProduct {
  _id: string;
  name: string;
  brand: string;
  type: "sedan" | "suv" | "truck";
  rating: number;
  trips: number;
  summary: string;
  media: {
    mediaUrl: string;
    publicId: string;
  }[];
  slug: string;
  price: number;
  info: {
    seats: number;
    transmission: "manual" | "automatic" | "hybrid";
    fuel: "petrol" | "diesel" | "electric";
    year: string;
  };
  specs: {
    engine: string;
    mileage: string;
    topSpeed: string;
    boot: string;
  };
  status: "booked" | "unavailable" | "open";
  category:
    | "executive"
    | "premium"
    | "logistics"
    | "city"
    | "family"
    | "economy";
  serviceFee?: number;
  plateNum: string;
}

export type MetricsType = {
  id: string;
  value: string;
  info: string;
};

export const metrics = [
  {
    id: 1,
    value: "500+",
    info: "Verified Cars Available",
  },
  {
    id: 2,
    value: "34k+",
    info: "Happy Customers",
  },
  {
    id: 3,
    value: "50+",
    info: "Trusted Partners",
  },
  {
    id: 4,
    value: "90%",
    info: "Satisfaction Rate",
  },
];

export const whatsIncluded = [
  {
    id: 1,
    icon: "/checkFill.svg",
    text: "Comprehensive insurance",
  },
  {
    id: 2,
    icon: "/checkFill.svg",
    text: "24/7 road support",
  },
  {
    id: 3,
    icon: "/checkFill.svg",
    text: "Free Cancellation",
  },
  {
    id: 4,
    icon: "/checkFill.svg",
    text: "Unlimited mileage in-city",
  },
  {
    id: 5,
    icon: "/checkFill.svg",
    text: "Sanitize between trips",
  },
  {
    id: 6,
    icon: "/checkFill.svg",
    text: "Full tank at pickup",
  },
];

export const contactSubTexts = [
  {
    id: 1,
    title: "Email Support",
    text: "Send us an email anytime",
    subText: "support@milescarrental.com",
    img: "/mailmsg.svg",
  },
  {
    id: 2,
    title: "Phone Number",
    text: "Mon–Sat from 8am to 8pm",
    subText: "+234 812 3333 3333",
    img: "/phone.svg",
  },
  {
    id: 3,
    title: "Live Chat",
    text: "Chat with our agents now",
    subText: "Start chat",
    img: "/chat.svg",
  },
  {
    id: 4,
    title: "Our Location",
    text: "Come say hello at our office",
    subText: "Lagos, Nigeria",
    img: "/location.svg",
  },
];

export const bookingSteps = [
  {
    id: 1,
    label: "Date",
    path: "/book-ride",
  },
  {
    id: 2,
    label: "Payment",
    path: "/book-ride",
  },
  {
    id: 3,
    label: "Confirm",
    path: "/book-ride",
  },
];

export const payOptions = [
  {
    id: 1,
    label: "Pay with Bank",
    icon: "/card.svg",
    text: "Pay to our account",
    value: "pay_with_bank",
  },
  {
    id: 2,
    label: "Paystack",
    icon: "/bolt.svg",
    text: "Pay with bank, USSD or transfer",
    value: "paystack",
  },
];

export const bookingStatusColors = {
  upcoming: "bg-amber-50 text-amber-700 border border-amber-200/50",
  ongoing: "bg-blue-50 text-blue-700 border border-blue-200/50",
  completed: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
  cancelled: "bg-rose-50 text-rose-700 border border-rose-200/50",
  failed: "bg-rose-50 text-rose-700 border border-rose-200/50",
  pending: "bg-slate-50 text-slate-600 border border-slate-200/50",
};
export const driverStatusColors = {
  active: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
  inactive: "bg-yellow-50 text-yellow-700 border border-yellow-200/50",
  available: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
  "off-duty": "bg-rose-50 text-blue-700 border border-rose-200/50",
  booked: "bg-blue-50 text-blue-700 border border-blue-200/50",
};

export const carStatusColors = {
  booked: "bg-blue-50 text-blue-700 border border-blue-200/50",
  unavailable: "bg-red-50 text-red-700 border border-red-200/50",
  open: "bg-green-50 text-green-700 border border-green-200/50",
  reserved: "bg-yellow-50 text-yellow-700 border border-yellow-200/50",
};

export type BookingCardProps = bookingSchemaType & {
  carId: CarProduct;
  status: string;
  _id: string;
};

export const dashboardLinks = [
  {
    id: 1,
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutGrid,
  },
  {
    id: 2,
    label: "Bookings",
    path: "/dashboard/bookings",
    icon: Calendar,
  },
  {
    id: 3,
    label: "Fleet",
    path: "/dashboard/fleets",
    icon: CarFront,
  },
  {
    id: 4,
    label: "Customers",
    path: "/dashboard/customers",
    icon: Users,
  },
  {
    id: 5,
    label: "Drivers",
    path: "/dashboard/drivers",
    icon: User,
  },
];
