import { ProgressBar } from "@/components/features/progressBar";
import Footer from "@/components/nav/footer";
import Header from "@/components/nav/header";
import type { UserSession } from "@/lib/schemaTypes";
import { Outlet, useLoaderData, ScrollRestoration } from "react-router";

export default function RootLayout() {
  const { user } = useLoaderData() as { user: UserSession | null };
  return (
    <>
      <ProgressBar />
      <ScrollRestoration />
      <Header user={user} />
      <Outlet context={{ user }} />
      <Footer />
    </>
  );
}
