import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	getOccupationStatusBadge,
	getOccupationStatusLabel,
	getRoomTypeLabel,
} from "@/lib/formatters";
import type { Occupation } from "@/lib/types/occupation.types";
import { formatDateTime } from "@/lib/utils";

interface OccupationsCardProps {
	occupation: Occupation;
}
export default function OccupationsCard({ occupation }: OccupationsCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle data-testid="occupation-card-title" className="font-heading">
					{occupation.room?.roomNumber}
				</CardTitle>
				<CardDescription data-testid="occupation-card-room-type">
					{getRoomTypeLabel(occupation.room?.roomType)}
				</CardDescription>
				<CardAction>
					<Badge
						data-testid="occupation-card-status"
						variant={getOccupationStatusBadge(occupation.status)}
					>
						{getOccupationStatusLabel(occupation.status)}
					</Badge>
				</CardAction>
			</CardHeader>
			<CardContent>
				<section>
					<article
						className="flex flex-col mb-3"
						data-testid="occupation-card-guest"
					>
						<h6 className="font-sans text-sm inline-block text-muted-foreground">
							Huésped principal
						</h6>
						<p className="font-sans inline-block">
							{occupation.guests
								?.filter((occupationGuest) => occupationGuest.isPrimary)
								.map((occupationGuest) => (
									<span key={occupationGuest.id}>
										{occupationGuest.guest?.firstName}{" "}
										{occupationGuest.guest?.lastName}
									</span>
								))}
						</p>
					</article>
					<article
						className="flex flex-col mb-1"
						data-testid="occupation-card-check-in"
					>
						<h6 className="font-sans text-sm inline-block text-muted-foreground">
							Check-in
						</h6>
						<p className="font-mono text-sm inline-block">
							{formatDateTime(occupation.checkInDatetime)}
						</p>
					</article>
					<article
						className="flex flex-col"
						data-testid="occupation-card-check-out"
					>
						<h6 className="font-sans text-sm inline-block text-muted-foreground">
							Check-out
						</h6>
						<p className="font-mono text-sm inline-block">
							{formatDateTime(occupation.checkOutDatetime)}
						</p>
					</article>
				</section>
			</CardContent>
			<CardFooter
				className="flex flex-col items-start"
				data-testid="occupation-card-footer"
			>
				<h6 className="font-sans text-sm inline-block text-muted-foreground">
					Precio total
				</h6>
				<span
					className="font-medium text-primary font-mono inline-block"
					data-testid="occupation-card-total-price"
				>
					{occupation.totalPrice.toLocaleString("es-CO", {
						style: "currency",
						currency: "COP",
					})}
				</span>
			</CardFooter>
		</Card>
	);
}
