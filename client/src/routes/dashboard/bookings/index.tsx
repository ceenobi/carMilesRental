import DataError from '@/components/error/dataError'
import type { BookingCardRCProps } from '@/components/features/booking/bookingCard'
import Filter from '@/components/features/booking/filter'
import Search from '@/components/nav/search'
import { SkeletonTable } from '@/components/ui/skeletonLoader'
import type { UsePaginateProps } from '@/hooks/usePaginate'
import type { bookingDataProps } from '@/types'
import { Suspense } from 'react'
import { Await, useLoaderData } from 'react-router'
import NewBooking from '../../../components/features/booking/newBooking'
import RenderTable from '../../../components/features/booking/renderTable'

export default function DasboardBookings() {
  const { bookings } = useLoaderData<{
    bookings: Promise<{
      data: {
        body: { bookings: BookingCardRCProps['booking'][]; meta: UsePaginateProps; stats: Record<string, number> }
      }
    }>
  }>()
  return (
    <div className="container mx-auto space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-medium text-MainBlack tracking-tighter">Bookings</h1>
          <p className="text-sm md:text-base text-SoftBlack">Manage all reservations across your fleet</p>
        </div>
        <NewBooking />
      </div>
      <div className="flex items-center gap-4 justify-end">
        <Search id="search bookings" placeholder="Search by ref, customer, location" />
        <Filter />
      </div>
      <Suspense fallback={<SkeletonTable />}>
        <Await
          resolve={bookings}
          errorElement={<DataError />}
          children={resolvedBookings => (
            <RenderTable
              resolvedBookings={{
                bookings: (resolvedBookings?.data?.body?.bookings || [])?.map(
                  b => ({ ...b, driverId: b.driverId || { fullname: 'N/A' } }) as bookingDataProps
                ),
                stats: resolvedBookings?.data?.body?.stats || {},
                meta: resolvedBookings?.data?.body?.meta || { totalPages: 1, hasMore: false, currentPage: 1 },
              }}
            />
          )}
        />
      </Suspense>
    </div>
  )
}
