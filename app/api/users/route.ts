import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
	try {
		const users = await db.user.findMany();

		if (!users)
			return NextResponse.json(
				{ message: "Users is not found" },
				{ status: 404 }
			);

		return NextResponse.json(
			{ users, message: "Successfully get users" },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
