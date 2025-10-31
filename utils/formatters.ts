export function formatCurrency(amountCents: number, currency = "USD"): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amountCents / 100);
}

export function formatDate(iso: string): string {
	return new Date(iso).toLocaleString();
}
