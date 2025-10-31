export async function createPaymentIntent(amountCents: number, currency = "usd"): Promise<{ id: string }> {
	// TODO: integrate with Stripe SDK
	return { id: `pi_${amountCents}_${currency}` };
}

export async function refundPayment(paymentId: string, amountCents?: number): Promise<{ id: string }> {
	// TODO: integrate with Stripe SDK
	return { id: `re_${paymentId}_${amountCents ?? "full"}` };
}
