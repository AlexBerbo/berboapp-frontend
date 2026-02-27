Project Overview

Angular frontend application integrated with a Spring Boot backend. Implements user authentication, role-based UI behavior, and service-layer API communication using JWT tokens.
Designed as the client-side interface for the berboapp backend system.

Tech Stack:
- Angular
- TypeScript
- RxJS
- Angular Router
- HTTP Interceptors
- JWT Token Storage

Architecture Overview:
- The application follows standard Angular modular structure:
  - Component-based UI.
  - Service layer for API communication.
  - HTTP Interceptor for automatic JWT token injection.
  - Role-based route protection.
  - Conditional UI rendering based on user permissions.
  - JWT tokens received during login are stored and attached to outgoing API requests via interceptor logic.

Authentication & Authorization Flow:
- User logs in via backend endpoint.
- JWT token is returned.
- Token stored in client.
- Interceptor attaches token to protected requests.

Role determines:
- Visible UI components.
- Accessible routes.
- Allowed actions.
- Role-Based UI Behavior.

Different roles have different capabilities: USER, MANAGER, ADMIN, SUPER_ADMIN.

UI elements are conditionally rendered based on role permissions.

How to Run Locally
npm install
ng serve

Backend must be running for full functionality.
Email confirmation and 2FA require backend SMTP configuration.

Design Decisions:
- Clear separation between UI and service logic.
- Interceptor-based token handling for clean authentication flow.
- Reactive programming model using RxJS.
- Modular component structure for maintainability.

Thanks for reading, alexberbo :)
