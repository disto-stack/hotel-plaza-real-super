import Image from "next/image";
import SidebarNav from "./SidebarNav";

export default function Sidebar() {
	return (
		<aside
			className="flex flex-col items-center gap-5 bg-card border-r border-border shadow-sm w-64 p-2"
			data-testid="sidebar"
		>
			<section className="flex items-center justify-center border-b border-border gap-2 py-2">
				<div className="w-25 h-20 relative">
					<Image
						src="/images/logo.png"
						alt="Hotel Plaza Real Logo"
						fill
						sizes="100px"
						style={{ objectFit: "contain" }}
					/>
				</div>

				<div>
					<h1 className="text-base font-heading font-semibold text-foreground">
						Plaza Real
					</h1>
					<h2 className="text-xs font-sans text-muted-foreground">
						Panel de administración
					</h2>
				</div>
			</section>

			<SidebarNav />
		</aside>
	);
}
