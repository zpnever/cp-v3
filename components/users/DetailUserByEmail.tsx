// import { useEffect } from "react";
// import toast from "react-hot-toast";

// const DetailUserByEmail = ({ userEmail }: { userEmail: string }) => {
// 	useEffect(() => {
//     const getUserData = async () => {
// 			try {
// 				const res = await fetch(`/api/user/${userEmail}`);
// 				const json = await res.json();

// 				if (!res.ok) {
// 					toast.error(json.message);
// 					throw new Error("Invalid get batch data");
// 				}

// 				setIsLoading(false);
// 			} catch (error) {
// 				toast.error("Something went wrong!");
// 				setIsLoading(false);
// 			}
//   }, []);

// 	return <div>DetailUserByEmail</div>;
// };

// export default DetailUserByEmail;
