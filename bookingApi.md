# Booking API Flow & Implementation Guide

This document outlines the core workflows for the Booking API in the Administrative Driver & Ride Management System. It serves as a reference for understanding the backend logic and provides an implementation checklist for the frontend integration.

## 1. Retrieve All Bookings (`getAllBookings`)

**Purpose**: Fetches a paginated, filterable, and searchable list of bookings. Also returns aggregated statistics by booking status.

**Flow**:
1. Extracts query parameters: `page`, `limit`, `query` (search), `status`, `pickUpDate`, `dropOffDate`, `pickUpTime`, and `dropOffTime`.
2. Constructs a `$match` stage for MongoDB aggregation and querying.
3. If a search `query` is provided, it first resolves matching `User` and `Car` documents to support cross-model searching (e.g., searching by driver name or car plate number).
4. Queries the `Booking` collection with the match stage, applies pagination (`skip`/`limit`), and populates related `userId` and `carId` references.
5. Runs an aggregation to calculate totals for each booking status (`all`, `completed`, `pending`, `cancelled`, `failed`, `upcoming`, `ongoing`).
6. Returns the bookings, stats, and pagination metadata.

---

## 2. Admin Create Booking (`adminBookRide`)

**Purpose**: Allows an administrator to manually create a booking on behalf of a user.

**Flow**:
1. Validates that the requested `carId` and `email` (user) exist in the database.
2. Checks if the `Car` is available (rejects if `booked` or `unavailable`).
3. Validates that `pickUpDate` and `dropOffDate` are valid (not in the past, and drop-off is after pick-up).
4. Calculates the total duration (in days) and computes financial totals:
   - `rentalTotal`: Car price * days
   - `serviceFee`: Fixed car service fee
   - `driverTotal`: Optional driver fee (₦10,000 * days) if `addDriver` is true
   - `grandTotal`: Sum of the above
5. Creates the `Booking` record with a `pending` status.
6. Updates the `Car` status to `booked`.
7. Creates a pending `Payment` record with a generated reference (e.g., `RF<random>`).
8. Sends a confirmation email to the user with the breakdown of costs and schedule.

---

## 3. Cancel Booking (`cancelBooking`)

**Purpose**: Allows a user or administrator to cancel a booking safely.

**Flow**:
1. Fetches the booking by `bookingId`.
2. **Permission Check**: 
   - Admins can cancel any booking at any time.
   - Customers can only cancel their own bookings, and *only* within 24 hours of creation.
3. **Status Check**: Prevents cancellation if the booking is already `completed`, `cancelled`, or `ongoing`.
4. Updates the `Booking` status to `cancelled`.
5. Creates a `Timeline` event logging the cancellation and the actor (Admin vs Customer) for audit trails.

---

## 4. Mark Booking Completed (`markCompleted`)

**Purpose**: Admin-only endpoint to finalize a booking after the ride concludes.

**Flow**:
1. Fetches the booking by `bookingId`.
2. **Status Check**: Prevents completion if the booking is already `completed` or `cancelled`.
3. **Time Check**: Enforces that the current date/time is *strictly after* the `dropOffDate`. (Prevents accidental early closure).
4. Updates the `Booking` status to `completed`.
5. Reverts the associated `Car` status to `available` so it can be re-booked.
6. Creates a `Timeline` event logging the completion.

---

## Frontend Implementation Checklist

### Listing & Filtering Bookings
- [ ] Implement query state management (e.g., using `useSearchParams` in React Router) for pagination, search, and status filtering.
- [ ] Render the statistics badges dynamically using the `stats` object returned from the API.
- [ ] Ensure the table/list gracefully falls back to a Skeleton loader when fetching data.

### Creating a Booking (Admin)
- [ ] Build the form with proper validation (ensure drop-off is after pick-up).
- [ ] Calculate the totals (rental, service, driver) locally on the frontend to show a preview before submission.
- [ ] Upon successful submission, redirect to the booking details page and invalidate the `bookings` cache to refresh the list.

### Cancelling a Booking
- [ ] For customers, visually disable the "Cancel" button and show a tooltip if 24 hours have passed since creation.
- [ ] Add a confirmation modal before triggering the cancellation API.
- [ ] On success, trigger cache invalidation and revalidate the router state to reflect the `cancelled` status and new Timeline event.

### Completing a Booking
- [ ] Hide or disable the "Mark as Completed" button if the current local date is before the `dropOffDate`.
- [ ] Add a confirmation modal before triggering the API.
- [ ] On success, trigger cache invalidation so that the `Car` immediately shows up as available in the fleet inventory and the booking reflects the `completed` state.
