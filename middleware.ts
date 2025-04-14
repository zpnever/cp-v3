import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import { publicRoutes, apiAuthPrefix, authRoutes } from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;

	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
	const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);
	const isAdminRoute = nextUrl.pathname.startsWith("/admin");
	const isAdmin =
		req.auth?.user.email === "zpnever7@gmail.com" ||
		req.auth?.user.email === "sakurajimamai@gmail.com";

	if (isApiAuthRoute) return;

	// Redirect logged-in user away from login/register pages or "/" ke halaman sesuai isAdmin
	if (isAuthRoute || nextUrl.pathname === "/") {
		if (isLoggedIn) {
			if (isAdmin) {
				return Response.redirect(new URL("/admin/batch", nextUrl));
			} else {
				return Response.redirect(new URL("/batch", nextUrl));
			}
		}
		return;
	}

	// Block access to /admin for non-admins
	if (isAdminRoute && !isAdmin) {
		return Response.redirect(new URL("/batch", nextUrl)); // atau "/login"
	}

	// If not logged in and trying to access protected routes
	if (!isLoggedIn && !isPublicRoute) {
		return Response.redirect(new URL("/login", nextUrl));
	}

	return;
});

export const config = {
	matcher: [
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		"/(api|trpc)(.*)",
	],
};
