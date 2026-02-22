import { Calendar, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";

import {
	getOccupationStatusBadge,
	getOccupationStatusLabel,
	getStayTypeLabel,
} from "@/lib/formatters";
import { getStayTypeIcon } from "@/lib/icon-utils";
import type { Occupation } from "@/lib/types/occupation.types";
import { formatDateTime } from "@/lib/utils";
import { OccupationsGuestsCollapsible } from "./OccupationsGuestsCollapsible";

interface OccupationsDrawerProps {
	occupation: Occupation;
	open: boolean;
	setOpen: (open: boolean) => void;
}
export function OccupationsDrawer({
	occupation,
	open,
	setOpen,
}: OccupationsDrawerProps) {
	return (
		<Drawer direction="right" open={open} onOpenChange={setOpen}>
			<DrawerContent className="w-[700px] max-w-none">
				<DrawerHeader>
					<div className="flex items-center justify-between">
						<DrawerTitle className="font-heading text-xl">
							Detalles de la ocupación
						</DrawerTitle>
						<DrawerClose className="cursor-pointer">
							<X />
						</DrawerClose>
					</div>
				</DrawerHeader>
				<section className="no-scrollbar overflow-y-auto px-4 py-4">
					<article className="flex items-start justify-between">
						<div>
							<h2 className="font-heading text-2xl font-black">
								Habitación {occupation.room?.roomNumber}
							</h2>
							<p className="text-muted-foreground flex gap-1 items-center pt-2 pb-4">
								<span>{getStayTypeIcon(occupation.stayType, 16)}</span>
								{getStayTypeLabel(occupation.stayType)}
							</p>
						</div>
						<div>
							<Badge variant={getOccupationStatusBadge(occupation.status)}>
								{getOccupationStatusLabel(occupation.status)}
							</Badge>
						</div>
					</article>
					<article className="flex flex-col items-center gap-2 rounded-2xl bg-card p-3">
						<div className="flex items-center gap-2">
							<Calendar className="text-primary" />
							<div>
								<h3 className="font-sans text-xs inline-block text-muted-foreground">
									Check-in
								</h3>
								<p className="font-mono text-sm inline-block">
									{formatDateTime(occupation.checkInDatetime)}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Calendar className="text-primary" />
							<div>
								<h3 className="font-sans text-xs inline-block text-muted-foreground">
									Check-out
								</h3>
								<p className="font-mono text-sm inline-block">
									{formatDateTime(occupation.checkOutDatetime)}
								</p>
							</div>
						</div>
					</article>
					<article className="py-5">
						<h2 className="flex items-center gap-2 font-heading font-bold">
							<Users className="text-primary" /> Huespedes (
							{occupation.guests?.length})
						</h2>
						<div className="py-2">
							<OccupationsGuestsCollapsible occupation={occupation} />
						</div>
					</article>
				</section>
				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline">Cerrar</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
