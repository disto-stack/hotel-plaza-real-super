import Header from "@/components/dashboard/layout/Header";
import Sidebar from "@/components/dashboard/layout/Sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen w-screen overflow-hidden">
			<Sidebar />

			<div className="flex flex-col flex-1">
				<Header />
				<main className="flex-1 p-4">{children}</main>
			</div>
		</div>
	);
}
