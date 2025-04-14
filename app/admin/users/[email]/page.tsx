"use client";

import DetailUserByEmail from "@/components/users/DetailUserByEmail";
import { useParams } from "next/navigation";

const UserDetailPage = () => {
	const params = useParams();
	const userEmail = params.email as string;

	return (
		<div>
			<DetailUserByEmail userEmail={userEmail} />
			{/* <Button onClick={() => console.log(pureEmail)}>Klik</Button> */}
		</div>
	);
};

export default UserDetailPage;
