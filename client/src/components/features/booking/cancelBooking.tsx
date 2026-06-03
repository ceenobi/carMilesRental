import ActionButton from "@/components/ui/actionButton";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { queryClient } from "@/lib/utils";
import { CircleX, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher, useLocation, useRevalidator } from "react-router";
import { toast } from "sonner";

interface CancelBookingProps {
    bookingId: string;
    plateNum: string;
}

export default function CancelBooking({ bookingId, plateNum }: CancelBookingProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const fetcher = useFetcher();
    const revalidator = useRevalidator();
    const location = useLocation()
    const isAccount = location.pathname.includes("/account/bookings")

    useEffect(() => {
        if (!fetcher.data || fetcher.state !== "idle") return;
        const { status, data, body } = fetcher.data;
        if (status !== 200) {
            toast.error(body?.message || "Failed to cancel booking");
            return;
        } else {

            Promise.all([
                queryClient.removeQueries({ queryKey: ["booking", bookingId] }),
                queryClient.removeQueries({ queryKey: ["allBookings"] }),
                queryClient.invalidateQueries({ queryKey: ["myBookings"] }),
            ]).then(() => {
                revalidator.revalidate();
                const message = data?.message || "Booking cancelled successfully";
                toast.success(message);
                setIsOpen(false);
            });
        }
    }, [bookingId, fetcher.data, fetcher.state, revalidator]);

    return (
        <>
            {isAccount ?
                <Button
                    onClick={() => setIsOpen(true)}
                    className="mt-8 w-full flex items-center justify-center gap-2 bg-transparent border-none hover:bg-transparent"
                    type="button">
                    <CircleX size={20} className="text-red-600" />
                    <p className="text-red-600 text-sm md:text-base">
                        Cancel booking
                    </p>
                </Button>
                :
                <Button
                    variant="outline"
                    onClick={() => setIsOpen(true)}
                    className="w-fit bg-red-600 border-red-200 text-SoftWhite rounded-xl">
                    <CircleX size={16} /> Cancel Booking
                </Button>
            }
            <Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            >
                <div className="px-6 text-left">
                    <h1 className="text-xl font-bold text-MainBlack">
                        Cancel booking {plateNum} ?
                    </h1>
                    <p className="text-sm text-SoftBlack mt-1">
                        This will mark the booking as cancelled. {!isAccount ? "The customer will be notified." : "You will be notified."}
                    </p>
                </div>
                <div className="p-4 flex justify-end gap-4 ">
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="w-37.5 py-4 bg-white border-MainBlack/20 text-MainBlack rounded-full"
                    >
                        Keep Booking
                    </Button>
                    <ActionButton
                        text="Cancel booking"
                        variant="outline"
                        classname="w-37.5 py-4 bg-red-600 border-red-200 hover:bg-red-600/80 hover:text-SoftWhite text-SoftWhite transition-colors rounded-full"
                        loading={fetcher.state === "submitting"}
                        children={<Loader className="animate-spin" />}
                        onClick={() => {
                            fetcher.submit(
                                { bookingId },
                                {
                                    method: "patch",
                                    action: `/dashboard/bookings/${bookingId}?status=cancelled`,
                                },
                            );
                        }}
                    />
                </div>
            </Modal>
        </>
    )
}