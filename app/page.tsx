import { signOut } from "@/auth";
import ProfileIconDropdown from "@/components/auth/profile-icon-dropdown";
import Link from "next/link";

const HomePage = () => {
	return (
		<div>
			<header>
				<nav className="flex justify-between items-center bg-white px-8 h-15 shadow-lg border-2 border-gray-200">
					<Link href="/" className="text-xl font-bold ">
						Logo
					</Link>
					<ProfileIconDropdown />
				</nav>
			</header>
			<main className="h-[70vh] flex items-center justify-center">
				Landing Page
			</main>
		</div>
	);
};

export default HomePage;
