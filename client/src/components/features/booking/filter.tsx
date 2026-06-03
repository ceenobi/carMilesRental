import { useSearchParams } from "react-router";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eraser, Filter as FilterIcon, Calendar, Clock, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function Filter() {
    const [searchParams, setSearchParams] = useSearchParams();
    // Local state for deferred application
    const [localFilters, setLocalFilters] = useState({
        pickUpDate: searchParams.get("pickUpDate") || "",
        dropOffDate: searchParams.get("dropOffDate") || "",
        pickUpTime: searchParams.get("pickUpTime") || "",
        dropOffTime: searchParams.get("dropOffTime") || "",
    });

    const handleLocalChange = (field: string, value: string) => {
        setLocalFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams);

        Object.entries(localFilters).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        // params.set("page", "1");
        setSearchParams(params);
    };

    const handleClearFilters = () => {
        const params = new URLSearchParams(searchParams);
        const cleared = {
            pickUpDate: "",
            dropOffDate: "",
            pickUpTime: "",
            dropOffTime: "",
        };
        setLocalFilters(cleared);

        Object.keys(cleared).forEach(key => params.delete(key));
        // params.set("page", "1");
        setSearchParams(params);
    };

    const activeFilterCount = [
        searchParams.get("pickUpDate"),
        searchParams.get("dropOffDate"),
        searchParams.get("pickUpTime"),
        searchParams.get("dropOffTime")
    ].filter(Boolean).length;

    const hasLocalChanges =
        localFilters.pickUpDate !== (searchParams.get("pickUpDate") || "") ||
        localFilters.dropOffDate !== (searchParams.get("dropOffDate") || "") ||
        localFilters.pickUpTime !== (searchParams.get("pickUpTime") || "") ||
        localFilters.dropOffTime !== (searchParams.get("dropOffTime") || "");

    const hasFilters = activeFilterCount > 0;

    return (
        <DropdownMenu onOpenChange={(open) => {
            if (open) {
                setLocalFilters({
                    pickUpDate: searchParams.get("pickUpDate") || "",
                    dropOffDate: searchParams.get("dropOffDate") || "",
                    pickUpTime: searchParams.get("pickUpTime") || "",
                    dropOffTime: searchParams.get("dropOffTime") || "",
                });
            }
        }}>
            <DropdownMenuTrigger render={<button className={cn(
                "group flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white hover:border-DeepOrange transition-all duration-300 outline-none",
                hasFilters && "border-DeepOrange ring-1 ring-DeepOrange/20"
            )}>
                <FilterIcon className={cn("text-SoftBlack group-hover:text-DeepOrange transition-colors", hasFilters && "text-DeepOrange")} size={16} />
                <span className={cn("text-sm font-medium text-SoftBlack group-hover:text-MainBlack", hasFilters && "text-MainBlack")}>Filters</span>
                {hasFilters && (
                    <span className="flex items-center justify-center min-w-4.5 h-4.5 px-1 text-[10px] font-bold text-white bg-DeepOrange rounded-full ml-1">
                        {activeFilterCount}
                    </span>
                )}
            </button>} />
            <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden border-border shadow-xl rounded-2xl">
                <div className="p-4 bg-gray-50/50 border-b border-border">
                    <div className="text-sm text-MainBlack font-semibold">Filter Bookings</div>
                    <p className="text-[11px] text-SoftBlack mt-0.5">Narrow down fleet bookings by date and time.</p>
                </div>

                <div className="p-5 space-y-6">
                    {/* Pickup Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-DeepOrange">
                            <Calendar size={14} />
                            <h4 className="text-[10px] font-bold uppercase tracking-widest">Pick-up Details</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium text-SoftBlack ml-1">Date</Label>
                                <Input
                                    type="date"
                                    value={localFilters.pickUpDate}
                                    onChange={(e) => handleLocalChange("pickUpDate", e.target.value)}
                                    className="h-9 text-xs bg-white border-gray-100 rounded-lg focus:ring-DeepOrange/10"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium text-SoftBlack ml-1">Time</Label>
                                <Input
                                    type="time"
                                    value={localFilters.pickUpTime}
                                    onChange={(e) => handleLocalChange("pickUpTime", e.target.value)}
                                    className="h-9 text-xs bg-white border-gray-100 rounded-lg focus:ring-DeepOrange/10"
                                />
                            </div>
                        </div>
                    </div>

                    <DropdownMenuSeparator className="bg-gray-100" />

                    {/* Drop-off Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-MainBlack">
                            <Clock size={14} />
                            <h4 className="text-[10px] font-bold uppercase tracking-widest">Drop-off Details</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium text-SoftBlack ml-1">Date</Label>
                                <Input
                                    type="date"
                                    value={localFilters.dropOffDate}
                                    onChange={(e) => handleLocalChange("dropOffDate", e.target.value)}
                                    className="h-9 text-xs bg-white border-gray-100 rounded-lg focus:ring-DeepOrange/10"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium text-SoftBlack ml-1">Time</Label>
                                <Input
                                    type="time"
                                    value={localFilters.dropOffTime}
                                    onChange={(e) => handleLocalChange("dropOffTime", e.target.value)}
                                    className="h-9 text-xs bg-white border-gray-100 rounded-lg focus:ring-DeepOrange/10"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-gray-50 border-t border-border flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleClearFilters}
                        disabled={!hasFilters && !hasLocalChanges}
                        className="flex-1 h-9 text-xs text-SoftBlack hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 rounded-xl transition-all font-medium"
                    >
                        <Eraser size={14} className="mr-2" />
                        Clear
                    </Button>
                    <Button
                        onClick={handleApplyFilters}
                        disabled={!hasLocalChanges}
                        className="flex-[1.5] h-9 text-xs bg-MainBlack hover:bg-MainBlack/90 text-white rounded-xl transition-all font-semibold shadow-sm"
                    >
                        <Check size={14} className="mr-2" />
                        Apply Filters
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
