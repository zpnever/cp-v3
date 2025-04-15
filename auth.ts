import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "./actions/user";
import { Role } from "@prisma/client";

declare module "next-auth" {
	interface Session {
		user: {
			role: Role;
			photo: string;
			teamId: string;
		} & DefaultSession["user"];
	}
}

export const { auth, handlers, signIn, signOut } = NextAuth({
	callbacks: {
		async signIn({ user }) {
			const existingUser = await getUserById(user.id!);

			if (!existingUser || !existingUser.password || !existingUser.isVerified) {
				return false;
			}

			return true;
		},
		async session({ token, session }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			if (token.role && session.user) {
				session.user.role = token.role as Role;
			}

			if (token.photo && session.user) {
				session.user.photo = token.photo as string;
			}

			if (token.teamId && session.user) {
				session.user.teamId = token.teamId as string;
			}

			return session;
		},
		async jwt({ token }) {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);

			if (!existingUser) return token;

			token.photo = existingUser.photo;
			token.role = existingUser.role;
			token.teamId = existingUser.teamId;

			return token;
		},
	},
	adapter: PrismaAdapter(db),
	session: { strategy: "jwt" },
	pages: {
		signOut: "/login", // redirect tujuan setelah logout
	},
	...authConfig,
});
