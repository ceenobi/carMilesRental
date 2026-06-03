import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

type Props = {
  totalPages: number;
  hasMore: boolean;
  handlePageChange: (page: string) => void;
  onLimitChange?: (limit: string) => void;
  currentPage: number;
  limit: number;
};

export default function Paginate({
  totalPages,
  hasMore,
  handlePageChange,
  currentPage,
  limit,
}: Props) {
  return (
    <div className="flex justify-between items-center">
      <div className="hidden md:flex items-center">
        <p className="text-SoftBlack text-sm">{limit} entries per page</p>
      </div>
      <p className="text-SoftBlack text-sm">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-4">
        <Button
          onClick={() => handlePageChange("prev")}
          variant="outline"
          size="lg"
          className={`py-4 w-[100px] md:w-[120px] border-SoftBlack/70 ${
            currentPage === 1
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }`}
          disabled={currentPage === 1}
        >
          <ChevronLeft /> Previous
        </Button>
        <Button
          onClick={() => handlePageChange("next")}
          variant="outline"
          size="lg"
          className={`py-4 w-[100px] md:w-[120px] border-SoftBlack/70 ${
            !hasMore ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
          disabled={!hasMore}
        >
          Next <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
