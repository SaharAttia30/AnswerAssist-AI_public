import twilio from "twilio";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ?country=US or ?country=IL
  // ?type=local|mobile|tollFree|all
  const { country = "US", limit = "10", type = "all" } = req.query;

  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // helper to safely query one type
    const fetchByType = async (kind, perTypeLimit) => {
      try {
        const listFn = client.availablePhoneNumbers(country)[kind];
        const nums = await listFn.list({
          voiceEnabled: true,
          // you can uncomment smsEnabled if you want to require SMS too
          // smsEnabled: true,
          limit: perTypeLimit,
        });
        return nums.map((n) => ({
          friendlyName: n.friendlyName,
          phoneNumber: n.phoneNumber,
          locality: n.locality,
          region: n.region,
          isoCountry: country,
          type: kind, // "local" | "mobile" | "tollFree"
        }));
      } catch (e) {
        console.error(`Twilio fetch error for type=${kind}`, e);
        return [];
      }
    };

    let numbers = [];

    if (type === "all") {
      // you can tweak how you split the limit per type
      const perTypeLimit = Number(limit);
      const [local, mobile, tollFree] = await Promise.all([
        fetchByType("local", perTypeLimit),
        fetchByType("mobile", perTypeLimit),
        fetchByType("tollFree", perTypeLimit),
      ]);
      numbers = [...local, ...mobile, ...tollFree];
    } else if (["local", "mobile", "tollFree"].includes(type)) {
      numbers = await fetchByType(type, Number(limit));
    } else {
      return res.status(400).json({ error: "Invalid type parameter" });
    }

    return res.status(200).json({ numbers });
  } catch (err) {
    console.error("Twilio error:", err);
    return res.status(500).json({ error: "Failed to fetch available numbers" });
  }
}
