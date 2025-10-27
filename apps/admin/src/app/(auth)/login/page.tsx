export default function LoginPage() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-4xl font-bold font-heading">Login</h1>
			<form className="flex flex-col gap-4">
				<input type="email" placeholder="Email" />
				<input type="password" placeholder="Password" />
				<button type="submit" className="font-mono">
					Login
				</button>
			</form>
		</div>
	);
}
