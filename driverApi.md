# Driver API Flow & Implementation Guide

This document outlines the Driver API workflows used by the admin dashboard. It covers driver registration, listing/statistics, and assigning drivers to bookings.

## 1. Register Driver (`createDriver`)

**Endpoint**: `POST /api/v1/drivers/register`

**Route Middleware**:
1. `customRateLimiter(5)`
2. `requireAdmin`
3. `validateFormData(driverSchema)`
4. `clearCache("drivers")`
5. `createDriver`

**Purpose**: Allows an admin to create a new driver profile.

**Expected Payload**:

```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "phone": "+2348000000000",
  "license": "DRV12345",
  "licenseExpiryDate": "2027-01-01",
  "language": ["English", "Yoruba"],
  "status": "available",
  "baseCity": "Lagos",
  "yearsOfExperience": "5",
  "isVerified": false
}
```

**Flow**:
1. Checks for an existing driver using `email`, `license`, and `phone`.
2. If a matching driver exists, returns `400` with `Driver already exists`.
3. Creates the driver with the validated request body.
4. Returns `201` with the created driver.
5. Clears the `drivers` cache after successful validation.

**Success Response Shape**:

```json
{
  "success": true,
  "message": "Driver created successfully",
  "body": {
    "_id": "driver_id",
    "fullname": "John Doe",
    "status": "available"
  }
}
```

---

## 2. Retrieve Drivers (`getAllDrivers`)

**Endpoint**: `GET /api/v1/drivers`

**Route Middleware**:
1. `requireAdmin`
2. `cacheMiddleware("drivers")`
3. `getAllDrivers`

**Purpose**: Fetches a paginated, searchable, and filterable list of drivers. Also returns driver statistics.

**Supported Query Params**:

| Param | Type | Description |
| ----- | ---- | ----------- |
| `page` | number | Current page. Defaults to `1`. |
| `limit` | number | Page size. Defaults to `10`. |
| `query` | string | Searches `fullname`, `email`, `phone`, and `license`. |
| `status` | string | Filters by driver status: `active`, `inactive`, `available`, or `off-duty`. |

**Flow**:
1. Reads pagination, search, and status filters from `req.query`.
2. Builds a MongoDB `matchStage`.
3. Escapes the search query before building the regex to avoid unsafe regex patterns.
4. Fetches paginated drivers sorted by newest first.
5. Counts total matching drivers.
6. Aggregates stats using `$facet`:
   - `all`
   - `active`
   - `inactive`
   - `available`
   - `off-duty`
   - `averageRating`
   - `availableToday`
7. Returns drivers, stats, and pagination metadata.

**Response Shape**:

```json
{
  "success": true,
  "message": "Drivers found",
  "body": {
    "drivers": [],
    "stats": {
      "all": 10,
      "active": 2,
      "inactive": 1,
      "available": 6,
      "off-duty": 1,
      "averageRating": 4.5,
      "availableToday": 3
    },
    "meta": {
      "currentPage": 1,
      "limit": 10,
      "total": 10,
      "totalPages": 1,
      "hasMore": false
    }
  }
}
```

**Frontend Query**:

Use `getAllDriversQuery` from:

```ts
client/src/api/queries/drivers.ts
```

Example:

```ts
useQuery(getAllDriversQuery({ page: 1, limit: 10, query: searchValue }));
```

---

## 3. Assign Driver to Booking (`assignDriver`)

**Endpoint**: `POST /api/v1/drivers/assign`

**Route Middleware**:
1. `requireAdmin`
2. `clearCache("drivers")`
3. `clearCache("bookingId")`
4. `assignDriver`

**Purpose**: Assigns a verified, available driver to an existing booking.

**Expected Payload**:

```json
{
  "bookingId": "booking_id",
  "driverId": "driver_id"
}
```

**Flow**:
1. Validates that both `driverId` and `bookingId` are present.
2. Fetches the driver.
3. Rejects if:
   - Driver does not exist.
   - Driver is not verified.
   - Driver is `off-duty`.
   - Driver is already unavailable for assignment.
4. Fetches the booking.
5. Rejects if booking does not exist.
6. Rejects if booking is already `completed` or `cancelled`.
7. Sets `booking.driverId = driverId` and saves the booking.
8. Updates the driver status to `active`.
9. Creates a timeline event:
   - `title`: `Driver Assigned`
   - `description`: `A driver has been assigned to the booking.`
   - `actor`: `System`
10. Returns the updated booking.

**Success Response Shape**:

```json
{
  "success": true,
  "message": "Driver assigned to booking",
  "body": {
    "_id": "booking_id",
    "driverId": "driver_id"
  }
}
```

---

## 4. Frontend: Register Driver Action

**File**:

```ts
client/src/api/actions/driver.ts
```

**Function**:

```ts
registerDriverApi
```

**Implementation Notes**:
- Reads request data using `request.json()`.
- Sends the payload to `/drivers/register` using `axiosClient.post`.
- Returns Axios response directly on success.
- Normalizes errors through `axiosError`.

**Important**:
When submitting array fields like `language`, use JSON encoding from the component:

```ts
fetcher.submit(data, {
  method: "post",
  action: "/dashboard/drivers",
  encType: "application/json",
});
```

Using `FormData` can turn `language` into a string and fail backend validation with:

```txt
Invalid input: expected array, received string
```

---

## 5. Frontend: Assign Driver Action

**File**:

```ts
client/src/api/actions/driver.ts
```

**Function**:

```ts
assignDriverApi
```

**Flow**:
1. Reads JSON payload from the React Router action request.
2. Sends `bookingId` and `driverId` to `/drivers/assign`.
3. Returns Axios response on success.
4. Returns normalized error response on failure.

**Payload Type**:

```ts
{
  bookingId: string;
  driverId: string;
}
```

---

## 6. Frontend: Assign Driver Modal

**File**:

```tsx
client/src/components/features/booking/assignDriver.tsx
```

**Purpose**: Admin UI for searching drivers, selecting one, and assigning the selected driver to a booking.

**Component Props**:

```ts
interface AssignDriverProps {
  plateNum?: string;
  carName?: string;
  pickUpDate?: string;
  returnDate?: string;
  bookingId?: string;
}
```

**Driver Search Flow**:
1. Maintains `searchValue` state.
2. Uses `getAllDriversQuery({ page: 1, limit: 10, query: searchValue })`.
3. Shows a loading spinner while drivers are fetching.
4. Filters returned drivers into:
   - `availableDrivers`
   - `activeDrivers`
5. Clicking an available driver stores its `_id` in `driverId`.
6. The selected driver row is highlighted with `bg-SoftWhite`.

**Assignment Flow**:

```ts
fetcher.submit(
  { bookingId, driverId },
  {
    action: `/dashboard/bookings/${bookingId}`,
    method: "post",
    encType: "application/json",
  },
);
```

**After Successful Assignment**:
1. Removes booking detail cache:

```ts
queryClient.removeQueries({ queryKey: ["booking", bookingId] });
```

2. Removes drivers cache:

```ts
queryClient.removeQueries({ queryKey: ["drivers"] });
```

3. Calls `revalidate()` so React Router reloads the current route data.
4. Shows success toast.
5. Closes the modal.

---

## 7. Recommended Implementation Checklist

### Backend
- [ ] Keep driver creation behind `requireAdmin`.
- [ ] Validate driver payload with `driverSchema`.
- [ ] Clear `drivers` cache after creating or assigning a driver.
- [ ] When assigning, verify the driver exists and is verified.
- [ ] Prevent assignment to `completed` or `cancelled` bookings.
- [ ] Create a timeline event whenever a driver is assigned.
- [ ] Ensure driver statuses stay consistent after booking completion/cancellation jobs.

### Frontend
- [ ] Use `encType: "application/json"` for actions that submit arrays or structured data.
- [ ] Use `request.json()` inside React Router actions when submitting JSON.
- [ ] Disable or guard the assign button if no `driverId` has been selected.
- [ ] Highlight the selected available driver row.
- [ ] Invalidate both `drivers` and specific `booking` queries after assignment.
- [ ] Revalidate the route after assignment so timeline/booking details refresh.
- [ ] Show clear success/error toast feedback.

---

## 8. Edge Cases To Handle

| Scenario | Expected Behaviour |
| -------- | ------------------ |
| Missing `driverId` or `bookingId` | Return `400`. |
| Driver does not exist | Return `404`. |
| Driver is not verified | Return `404` with verification message. |
| Driver is `off-duty` | Return `400`. |
| Booking does not exist | Return `404`. |
| Booking is `completed` or `cancelled` | Return `400`. |
| Driver assignment succeeds | Booking receives `driverId`, driver becomes `active`, timeline is created. |

---

## 9. Notes / Follow-up Improvements

- The backend currently checks `driver.status === "booked"`, but the Driver model status enum is `"active" | "inactive" | "available" | "off-duty"`. Prefer checking `active` or `inactive` depending on the intended business rule.
- Consider making `bookingId` required in `AssignDriverProps` if the modal cannot work without it.
- Consider disabling the `Assign Driver` button until a driver is selected:

```tsx
disabled={!driverId || fetcher.state === "submitting"}
```

- Consider querying only available drivers from the backend using `status: "available"` for the assignment modal to reduce client-side filtering.
