import { hash } from "bcrypt-ts";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	const existingAdmin = await prisma.user.findMany({
		where: { role: "ADMIN", email: "zpnever7@gmail.com" },
	});

	if (!existingAdmin) {
		const hashedPassword = await hash("10203040", 10);

		await prisma.user.create({
			data: {
				name: "Super Admin",
				email: "zpnever7@gmail.com",
				password: hashedPassword,
				isVerified: true,
				role: "ADMIN",
			},
		});

		console.log("✅ Admin user created!");
	} else {
		console.log("⚠️ Admin zpnever7 already exists, skipping...");
	}

	const existingAdmin2 = await prisma.user.findMany({
		where: { role: "ADMIN", email: "sakurajimamai@gmail.com" },
	});

	if (!existingAdmin2) {
		const hashedPassword = await hash("40302010", 10);

		await prisma.user.create({
			data: {
				name: "Weak Admin",
				email: "sakurajimamai@gmail.com",
				password: hashedPassword,
				isVerified: true,
				role: "ADMIN",
			},
		});

		console.log("✅ Admin sakurajimamai created!");
	} else {
		console.log("⚠️ Admin sakurajimamai already exists, skipping...");
	}
}

main()
	.catch((e) => console.error(e))
	.finally(async () => await prisma.$disconnect());
