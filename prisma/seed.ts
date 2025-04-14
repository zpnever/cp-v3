import { hash } from "bcrypt-ts";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	const existingAdmin = await prisma.user.findFirst({
		where: { role: "ADMIN" },
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
		console.log("⚠️ Admin user already exists, skipping...");
	}
}

main()
	.catch((e) => console.error(e))
	.finally(async () => await prisma.$disconnect());
