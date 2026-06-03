import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { bookingStatusColors } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface RecentBookingsProps {
  bookings: {
    id: string;
    customer: string;
    car: string;
    amount: number;
    status: string;
    date: string;
  }[];
}

export default function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <Card className="rounded-xl border-none shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-MainBlack">Recent Bookings</CardTitle>
        <p className="text-sm text-SoftBlack">Monitor latest activities across your fleet</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-gray-100">
              <TableHead className="text-SoftBlack font-medium">Customer</TableHead>
              <TableHead className="text-SoftBlack font-medium">Vehicle</TableHead>
              <TableHead className="text-SoftBlack font-medium">Amount</TableHead>
              <TableHead className="text-SoftBlack font-medium">Date</TableHead>
              <TableHead className="text-SoftBlack font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings?.map((booking) => (
              <TableRow key={booking.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-medium text-MainBlack">{booking.customer}</TableCell>
                <TableCell className="text-SoftBlack">{booking.car}</TableCell>
                <TableCell className="text-MainBlack font-semibold">₦{booking.amount?.toLocaleString()}</TableCell>
                <TableCell className="text-SoftBlack">
                  {new Date(booking.date).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    bookingStatusColors[booking.status as keyof typeof bookingStatusColors] || "bg-gray-100 text-gray-600"
                  )}>
                    {booking.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
