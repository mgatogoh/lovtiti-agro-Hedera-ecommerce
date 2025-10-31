import express from "express";
import bodyParser from "body-parser";
import { handleUssd } from "./services/ussdService";

const app = express();
const port = process.env.USSD_PORT || 4001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/health", (_req, res) => {
	res.json({ ok: true });
});

app.post("/ussd", async (req, res) => {
	const { sessionId, serviceCode, phoneNumber, text } = req.body || {};
	const reply = await handleUssd({ sessionId, serviceCode, phoneNumber, text: String(text || "") });
	// Simulate Africa's Talking USSD response format
	res.set("Content-Type", "text/plain");
	res.send(reply);
});

app.listen(port, () => {
	console.log(`USSD server running on http://localhost:${port}`);
});
