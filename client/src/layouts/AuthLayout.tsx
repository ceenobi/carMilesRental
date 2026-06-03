import { ProgressBar } from "@/components/features/progressBar";
import Logo from "@/components/nav/logo";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <>
      <ProgressBar />
      <main className="lg:grid lg:grid-cols-2">
        <section className="w-full max-w-md mx-auto flex flex-col gap-10 py-10 px-4">
          <Logo />
          <Outlet />
        </section>
        <div className="hidden lg:block w-full h-screen sticky top-0">
          <img
            src={
              "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt="Porsche Car"
            className="w-full h-full object-cover"
          />
        </div>
      </main>
    </>
  );
}
