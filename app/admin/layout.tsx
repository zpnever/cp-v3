import ProfileIconDropdown from "@/components/auth/profile-icon-dropdown";
import Link from "next/link";
import { auth } from "@/auth";

const listNav = [
	{ name: "Batches", href: "/admin/batch" },
	{ name: "Users", href: "/admin/users" },
	{ name: "Teams", href: "/admin/teams" },
	{ name: "Submissions", href: "/admin/submissions" },
];

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	return (
		<div className="min-h-screen">
			<header className="">
				<nav className="z-10 flex justify-between items-center bg-white px-8 h-15 shadow-lg border-2 border-gray-200">
					<ul className="flex gap-4 items-center">
						<li className="border-r-2 border-gray-200 pr-6 mr-2">
							<Link href="/" className="text-xl font-bold ">
								Logo
							</Link>
						</li>
						{listNav.map((l) => (
							<li key={l.name}>
								<Link
									href={l.href}
									className="text-blue-600 hover:text-black h-full font-medium rounded-md transition-colors"
								>
									{l.name}
								</Link>
							</li>
						))}
					</ul>
					<ProfileIconDropdown session={session} />
				</nav>
			</header>
			<main>{children}</main>
		</div>
	);
}
