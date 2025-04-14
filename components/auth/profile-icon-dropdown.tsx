import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { logout } from "@/actions/logout";

const ProfileIconDropdown = ({ session }: any) => {
	return (
		<div>
			{session?.user ? (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<div className="flex gap-2 items-center cursor-pointer">
							<Avatar className="h-10 w-10">
								<AvatarImage src={session?.user.photo} alt="@shadcn" />
							</Avatar>
							<span>{session?.user.email}</span>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild className="text-destructive">
							<form action={logout}>
								<button type="submit" className="flex items-center w-full">
									<LogOut className="mr-2 h-4 w-4" />
									Logout
								</button>
							</form>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<Button>
					<Link href="/login">Login</Link>
				</Button>
			)}
		</div>
	);
};

export default ProfileIconDropdown;
