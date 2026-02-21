import {
	ChevronDownIcon,
	IdCardIcon,
	MailIcon,
	PhoneIcon,
	StarIcon,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Occupation } from "@/lib/types/occupation.types";
import { cn } from "@/lib/utils";

interface OccupationsGuestsCollapsibleProps {
	occupation: Occupation;
}

export function OccupationsGuestsCollapsible({
	occupation,
}: OccupationsGuestsCollapsibleProps) {
	const [openGuestId, setOpenGuestId] = useState<string | null>(null);

	return (
		<>
			{occupation.guests?.map((occupationGuest) => {
				const isOpen = openGuestId === occupationGuest.id;
				return (
					<Card
						data-testid="occupations-guests-collapsible"
						key={occupationGuest.id}
						className={cn(
							"mx-auto w-full max-w-sm p-0 hover:border-primary/50 transition-all duration-100",
							occupationGuest.isPrimary && "border-primary/50 bg-primary/10",
						)}
					>
						<CardContent className="py-2 px-2">
							<Collapsible
								className="w-full"
								open={isOpen}
								onOpenChange={(isOpen) =>
									setOpenGuestId(isOpen ? occupationGuest.id : null)
								}
							>
								<CollapsibleTrigger className="flex items-center gap-2 w-full">
									<section
										className={cn(
											"rounded-full py-1 px-2 font-bold",
											occupationGuest.isPrimary
												? "bg-primary/20 text-primary"
												: "bg-muted text-muted-foreground",
										)}
									>
										{occupationGuest.guest?.firstName.charAt(0)}
										{occupationGuest.guest?.lastName.charAt(0)}
									</section>

									<section className="flex flex-col items-start">
										<div className="flex items-center gap-2">
											<span className="font-semibold text-sm">
												{occupationGuest.guest?.firstName}{" "}
												{occupationGuest.guest?.lastName}
											</span>

											{occupationGuest.isPrimary && (
												<span className="text-xs bg-primary/20 text-primary rounded-sm px-2 py-0.5 flex items-center gap-1">
													<StarIcon className="size-3" /> Titular
												</span>
											)}
										</div>

										<span className="text-muted-foreground text-[10px]">
											{occupationGuest.guest?.documentNumber}
										</span>
									</section>

									<ChevronDownIcon
										className={cn(
											"ml-auto transition-transform duration-200",
											isOpen && "rotate-180",
										)}
									/>
								</CollapsibleTrigger>
								<CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up border-border border-t mt-2">
									<div className="flex flex-col gap-2 py-2">
										<p className="flex items-center gap-3 text-xs text-muted-foreground">
											<MailIcon className="size-4" />{" "}
											{occupationGuest.guest?.email}
										</p>
										<p className="flex items-center gap-3 text-xs text-muted-foreground">
											<PhoneIcon className="size-4" />{" "}
											{occupationGuest.guest?.phone}
										</p>
										<p className="flex items-center gap-3 text-xs text-muted-foreground">
											<IdCardIcon className="size-4" />{" "}
											{occupationGuest.guest?.documentNumber}
										</p>
									</div>
								</CollapsibleContent>
							</Collapsible>
						</CardContent>
					</Card>
				);
			})}
		</>
	);
}
