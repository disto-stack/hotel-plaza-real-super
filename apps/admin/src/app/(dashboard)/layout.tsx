import Sidebar from "@/components/dashboard/layout/Sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen w-screen overflow-hidden">
			<Sidebar />
			{children}
		</div>
	);
}
