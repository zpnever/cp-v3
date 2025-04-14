// Public routes no need to auth
export const publicRoutes = ["/", "/new-password"];

// Routes for auth
export const authRoutes = ["/login", "/register", "/forgot-password"];

// Api routes for user login/logout
export const apiAuthPrefix = "/api/auth";

// Routes for redirect after login
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
