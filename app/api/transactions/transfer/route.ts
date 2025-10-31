import { NextResponse } from "next/server";
import { Client, PrivateKey, AccountId, TransferTransaction, Hbar } from "@hashgraph/sdk";

export async function POST(req: Request) {
	try {
		const { to, amountTinybar } = await req.json();
		if (!to || !amountTinybar) return NextResponse.json({ error: "Missing params" }, { status: 400 });
		const accountId = process.env.HEDERA_ACCOUNT_ID as string;
		const privateKey = process.env.HEDERA_PRIVATE_KEY as string;
		if (!accountId || !privateKey) return NextResponse.json({ error: "Missing Hedera env" }, { status: 500 });
		// Handle different private key formats
		let privateKeyObj;
		if (privateKey.startsWith('0x')) {
			privateKeyObj = PrivateKey.fromString(privateKey.slice(2));
		} else {
			privateKeyObj = PrivateKey.fromString(privateKey);
		}
		
		const client = Client.forTestnet().setOperator(AccountId.fromString(accountId), privateKeyObj);
		const tx = await new TransferTransaction()
			.addHbarTransfer(accountId, Hbar.fromTinybars(-parseInt(amountTinybar)))
			.addHbarTransfer(to, Hbar.fromTinybars(parseInt(amountTinybar)))
			.execute(client);
		await tx.getReceipt(client);
		return NextResponse.json({ ok: true, txId: tx.transactionId.toString() });
	} catch (err) {
		console.error("Hedera transfer error", err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
