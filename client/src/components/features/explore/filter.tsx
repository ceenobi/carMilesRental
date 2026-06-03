import { useSearchParams } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Eraser, SlidersHorizontal } from "lucide-react";
import { carCategories } from "@/lib/constants";

export default function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";

  const handleFilterChange = (field: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(field, value);
    } else {
      params.delete(field);
    }
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("status");
    setSearchParams(params);
  };

  const hasFilters = category || status;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors cursor-pointer">
        <SlidersHorizontal size={16} />
        More filters
        {hasFilters && (
          <span className="flex size-2 rounded-full bg-DeepOrange" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Category</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={category}
            onValueChange={(value) => handleFilterChange("category", value)}
          >
            {carCategories?.map((item) => (
              <DropdownMenuRadioItem
                key={item.id}
                value={item.name}
                className="capitalize"
              >
                {item.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        {/* <DropdownMenuSeparator /> */}
        {/* <DropdownMenuGroup>
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            {carStatus?.map((item) => (
              <DropdownMenuRadioItem
                key={item.id}
                value={item.name}
                className="capitalize"
              >
                {item.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup> */}

        {hasFilters && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClearFilters();
                }}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Eraser size={14} />
                Clear all filters
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
