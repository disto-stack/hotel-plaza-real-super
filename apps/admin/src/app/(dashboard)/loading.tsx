import { Skeleton } from "@/components/ui/skeleton";

export default function GuestsLoading() {
	return (
		<div className="flex flex-col gap-6 p-4">
			<div className="flex items-center justify-between">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-10 w-32" />
			</div>

			<div>
				<div className="space-y-4 p-4">
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
					<Skeleton className="h-12 w-full" />
				</div>
			</div>
		</div>
	);
}
