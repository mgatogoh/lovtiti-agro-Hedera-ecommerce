'use client';
import { useState } from "react";

export default function HederaTestPage() {
	const [to, setTo] = useState("");
	const [amount, setAmount] = useState("1000");
	const [res, setRes] = useState<string | null>(null);

	async function send() {
		setRes(null);
		const r = await fetch("/api/transactions/transfer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to, amountTinybar: amount }) });
		const j = await r.json();
		setRes(r.ok ? `Sent. txId=${j.txId}` : `Error: ${j.error}`);
	}

	return (
		<main className="p-8 max-w-xl mx-auto">
			<h1 className="text-2xl font-semibold">Hedera Test Transfer</h1>
			<div className="grid gap-3 mt-4">
				<label className="grid gap-1">
					<span className="text-sm">Recipient Account ID (e.g. 0.0.3)</span>
					<input className="border rounded px-2 py-1" value={to} onChange={(e) => setTo(e.target.value)} />
				</label>
				<label className="grid gap-1">
					<span className="text-sm">Amount (tinybar)</span>
					<input className="border rounded px-2 py-1" value={amount} onChange={(e) => setAmount(e.target.value)} />
				</label>
				<button onClick={send} className="px-4 py-2 bg-black text-white rounded">Send</button>
				{res && <p className="mt-2">{res}</p>}
			</div>
		</main>
	);
}
