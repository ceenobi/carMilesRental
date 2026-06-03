import { Link, useRouteError } from "react-router";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  const error = useRouteError();
  const message =
    error instanceof Response
      ? error.statusText
      : "Please log in to access this page";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Access Denied
        </h1>

        <p className="text-gray-600 mb-8">{message}</p>

        <Link
          to="/login"
          className="inline-flex items-center justify-center w-full py-3 px-6 bg-DeepOrange text-white font-semibold rounded-lg hover:bg-DeepOrange/90 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
