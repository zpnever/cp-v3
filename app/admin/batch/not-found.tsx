import Link from "next/link";

export default function NotFound() {
	return (
		<div className="h-screen flex justify-center items-center font-poppins flex-col gap-3">
			<h1 className="font-poppins">Batch is Not Found</h1>
			<p>Could not find requested resource</p>
			<Link className="px-4 py-2 bg-black text-white" href="/admin/batch">
				Back to Batch
			</Link>
		</div>
	);
}
