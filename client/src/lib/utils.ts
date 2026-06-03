import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { isAxiosError } from "axios";
import { QueryClient } from "@tanstack/react-query";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
});

export const axiosError = (error: unknown) => {
  if (isAxiosError(error) && error.response) {
    return {
      status: error.response.status,
      body: error.response.data,
    };
  }
  return null;
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;
};

export const getTimeOfDay = (name: string): string => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return `Good morning, ${name} ☀️ `;
  } else if (currentHour >= 12 && currentHour < 18) {
    return `Good afternoon, ${name} 🌤️ `;
  } else {
    return `Good evening, ${name} 🌙 `;
  }
};
