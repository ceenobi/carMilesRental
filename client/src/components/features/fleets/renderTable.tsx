import Paginate from '@/components/ui/paginate'
import TableView from '@/components/ui/tableView'
import type { UsePaginateProps } from '@/hooks/usePaginate'
import usePaginate from '@/hooks/usePaginate'
import { carStatusColors, type CarProduct } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import { useCallback } from 'react'
import NotFound from '../notFound'

export default function RenderTable({ resolvedCars, meta }: { resolvedCars: CarProduct[]; meta: UsePaginateProps }) {
  const {
    handlePageChange,
    totalPages,
    hasMore,
    currentPage,
    limit: pageLimit,
  } = usePaginate({
    totalPages: meta?.totalPages || 1,
    hasMore: meta?.hasMore || false,
    currentPage: meta?.currentPage || 1,
  })

  const renderCell = useCallback((item: CarProduct, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof CarProduct]
    switch (columnKey) {
      case 'name':
        return <p className="text-sm font-normal truncate max-w-44">{item?.name}</p>
      case 'plateNum':
        return <p className="text-sm text-gray-600 font-normal truncate max-w-44">{item?.plateNum}</p>
      case 'category':
        return <p className="text-sm text-gray-600 font-normal truncate max-w-44 capitalize">{item?.category}</p>
      case 'price':
        return <p className="text-sm truncate max-w-44 font-semibold">{formatPrice(item?.price)}</p>
      case 'trips':
        return <p className="text-sm font-normal text-gray-600 truncate max-w-44">{item?.trips}</p>
      case 'status':
        return (
          <div className="text-sm font-normal">
            <span
              className={`px-3 py-1 rounded-full text-xs capitalize ${
                carStatusColors[item?.status as keyof typeof carStatusColors]
              }`}
            >
              {item?.status}
            </span>
          </div>
        )
      default:
        return cellValue as React.ReactNode
    }
  }, [])

  return (
    <>
      {resolvedCars?.length > 0 ? (
        <>
          <TableView
            tableColumns={[
              { name: 'VEHICLE', uid: 'name' },
              { name: 'PLATE', uid: 'plateNum' },
              { name: 'CATEGORY', uid: 'category' },
              { name: 'DAILY RATE', uid: 'price' },
              { name: 'TRIPS', uid: 'trips' },
              { name: 'STATUS', uid: 'status' },
            ]}
            tableData={resolvedCars}
            renderCell={renderCell}
          />
          <Paginate
            totalPages={totalPages}
            hasMore={hasMore}
            handlePageChange={handlePageChange}
            currentPage={currentPage}
            limit={pageLimit}
          />
        </>
      ) : (
        <NotFound image="/fileSearch.svg" title="No bookings found" description="You have no bookings yet." />
      )}
    </>
  )
}
