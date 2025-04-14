"use client";

import { useParams } from "next/navigation";
import DetailBatchById from "@/components/batch-form/DetailBatchById";

const BatchByIdPage = () => {
	const params = useParams();
	const batchId = params.id as string;

	return (
		<div>
			<DetailBatchById batchId={batchId} />
		</div>
	);
};

export default BatchByIdPage;
