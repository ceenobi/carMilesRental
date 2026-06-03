import ActionButton from "@/components/ui/actionButton";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { queryClient } from "@/lib/utils";
import { CircleCheck, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher, useRevalidator } from "react-router";
import { toast } from "sonner";

interface MarkCompletedProps {
    bookingId: string;
    plateNum: string;
}

export default function MarkCompleted({ bookingId, plateNum }: MarkCompletedProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const fetcher = useFetcher();
    const revalidator = useRevalidator();

    useEffect(() => {
        if (!fetcher.data || fetcher.state !== "idle") return;
        const { status, data, body } = fetcher.data;
        if (status !== 200) {
            toast.error(body?.message || "Failed to mark booking as completed");
            return;
        } else {

            Promise.all([
                queryClient.removeQueries({ queryKey: ["booking", bookingId] }),
                queryClient.removeQueries({ queryKey: ["allBookings"] }),
                queryClient.invalidateQueries({ queryKey: ["myBookings"] }),
            ]).then(() => {
                revalidator.revalidate();
                const message = data?.message || "Booking marked as completed";
                toast.success(message);
                setIsOpen(false);
            });
        }
    }, [bookingId, fetcher.data, fetcher.state, revalidator]);

    return (
        <>
            <Button
                variant="outline"
                onClick={() => setIsOpen(true)}
                className="w-fit bg-white border-MainBlack/30 text-MainBlack rounded-xl">
                <CircleCheck size={16} />  Mark as Completed
            </Button >
            <Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            >
                <div className="px-6 text-left">
                    <h1 className="text-xl font-bold text-MainBlack">
                        Mark {plateNum} as completed ?
                    </h1>
                    <p className="text-sm text-SoftBlack mt-1">
                        This will mark the booking as completed. The customer will be notified.
                    </p>
                </div>
                <div className="p-4 flex justify-end gap-4 ">
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="w-37.5 py-4 bg-white border-MainBlack/20 text-MainBlack rounded-full"
                    >
                        Not yet
                    </Button>
                    <ActionButton
                        text="Mark completed"
                        variant="outline"
                        classname="w-37.5 py-4 bg-DeepOrange border-DeepOrange hover:bg-DeepOrange/80 hover:text-SoftWhite text-SoftWhite transition-colors rounded-full"
                        loading={fetcher.state === "submitting"}
                        children={<Loader className="animate-spin" />}
                        onClick={() => {
                            fetcher.submit(
                                { bookingId },
                                {
                                    method: "patch",
                                    action: `/dashboard/bookings/${bookingId}?status=completed`,
                                },
                            );
                        }}
                    />
                </div>
            </Modal>
        </>

    )
}