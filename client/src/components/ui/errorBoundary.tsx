import { ArrowUpRight, Car } from "lucide-react";
import {} from "react-router";
import { isRouteErrorResponse, Link, useRouteError } from "react-router";

export function AppErrorBoundary() {
  const error = useRouteError();
  let status = "404";
  let title = "Page Not Found";
  let details = "The page you're looking for doesn't exist or has been moved.";
  const showHome = true;

  if (isRouteErrorResponse(error)) {
    status = String(error.status);
    title =
      error.status === 404 ? "Page Not Found" : error.statusText || "Error";
    details =
      error.status === 404
        ? "The page you're looking for doesn't exist or has been moved."
        : "Something went wrong while processing your request.";
  } else if (error && error instanceof Error) {
    title = error.name;
    details = error.message;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-2 h-2 bg-DeepOrange rounded-full" />
          <span className="text-sm text-SoftBlack uppercase tracking-wider">
            Error {status}
          </span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold text-MainBlack mb-4">
          Oops!
        </h1>
        <p className="text-2xl md:text-3xl font-medium text-MainBlack mb-4">
          {title}
        </p>
        <p className="text-base text-SoftBlack mb-8 max-w-md mx-auto">
          {details}
        </p>

        <div className="my-10 flex justify-center">
          <div className="w-32 h-32 bg-DeepOrange/10 rounded-full flex items-center justify-center">
            <Car className="w-16 h-16 text-DeepOrange" />
          </div>
        </div>

        {showHome && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-DeepOrange text-white px-8 py-4 rounded-full font-semibold hover:bg-DeepOrange/90 transition-all"
            >
              Back to Home
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              to="/cars"
              className="inline-flex items-center justify-center gap-2 bg-white text-MainBlack border border-gray-200 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all"
            >
              Explore Cars
            </Link>
          </div>
        )}

        <p className="mt-10 text-sm text-gray-400">
          Need assistance?{" "}
          <Link
            to={{ pathname: "/contact-us", hash: "#form" }}
            className="text-DeepOrange hover:underline"
          >
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}
