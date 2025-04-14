"use client";

import { useParams } from "next/navigation";
import PublishBatch from "@/components/batch-form/PublishBatch";

const BatchPublishPage = () => {
	const params = useParams();
	const batchId = params.id as string;

	return (
		<div className="">
			<PublishBatch batchId={batchId} />
		</div>
	);
};

export default BatchPublishPage;
