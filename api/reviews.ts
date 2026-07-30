import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const placeId = req.query.placeId as string;
    const apiKey = req.query.apiKey as string;

    if (!placeId || !apiKey) {
      return res.status(400).json({ error: "Missing placeId or apiKey" });
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}&language=ar`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.result && data.result.reviews) {
      res.status(200).json({ reviews: data.result.reviews });
    } else {
      res.status(400).json({ error: "Failed to fetch reviews", status: data.status });
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
