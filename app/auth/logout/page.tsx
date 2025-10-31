'use client';
// import { SignOutButton, SignedIn } from "@clerk/nextjs";
import Link from "next/link";

export default function LogoutPage() {
	// Check if Clerk keys are properly configured
	const hasValidClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
		process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== 'pk_test_placeholder_key_for_development_only';

	return (
		<main className="p-8 flex flex-col items-center gap-4">
			<h1 className="text-2xl font-semibold">Logout</h1>
			{hasValidClerkKeys ? (
				<div className="text-center">
					<p className="text-gray-600 mb-4">Authentication is configured. Sign out functionality would be available here.</p>
					<button className="px-4 py-2 bg-gray-500 text-white rounded cursor-not-allowed" disabled>
						Sign out (Clerk configured)
					</button>
				</div>
			) : (
				<div className="text-center">
					<p className="text-gray-600 mb-4">Authentication is not configured.</p>
					<div className="bg-yellow-50 border border-yellow-200 rounded p-4">
						<p className="text-sm text-yellow-800">
							<strong>Setup Required:</strong> Add your Clerk API keys to enable logout functionality.
						</p>
					</div>
				</div>
			)}
			<Link className="text-blue-600 hover:underline" href="/">Go home</Link>
		</main>
	);
}
