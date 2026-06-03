import { CircleAlert } from "lucide-react";
import { useAsyncError } from "react-router";

export default function DataError() {
  const error = useAsyncError();
  const Error = error as Error;
  return (
    <div className="mt-20 flex flex-col gap-4 items-center justify-center h-60 max-w-lg mx-auto border bg-gray-50">
      <CircleAlert size={36} className="text-red-600" />
      <h1 className="text-xl font-medium text-MainBlack mb-2 text-center">
        Error loading data: <br/> <span className="text-red-600 text-lg">{Error?.message || "Unknown error"}</span>
      </h1>
    </div>
  );
}
