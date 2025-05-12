# NestJs - Event Booking System - Backend

This is the backend service for event booking system, It is built using NestJS and supports features such as user authentication, role-based authorization, event management, and review bookings.

# All The Features That I used at the project:
- Registeration and login for two roles (admin & users) with JWT and protected routes by permissions.
- The CRUD operations for enents the admin only can use it.
- Users can book any event and if they booked it already they will can't book it again.
- I userd DTOs to make my code more clean and can use validation.
- I used also Docker for database deployment to make it easy to use the same enviroment from anywhere, I used Postgres database.
- Localization by package <-- i18n --> for validation and error messages, And it's support (English and Arabic) and English is the 
  defualt for the app.