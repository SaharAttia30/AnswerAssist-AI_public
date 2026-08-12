import twilio from "twilio";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { number } = req.query;
  if (!number) {
    return res.status(400).json({ error: "Missing ?number=" });
  }

  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Last 3 incoming calls TO this number (newest first)
    const lastIncoming = await client.calls.list({
      to: number,
      limit: 3,
    });

    return res.status(200).json(lastIncoming);
  } catch (err) {
    console.error("Twilio error:", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch last incoming calls" });
  }
}
