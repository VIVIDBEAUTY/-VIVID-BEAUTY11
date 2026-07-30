import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Route to fetch Google Maps Reviews
  app.get("/api/reviews", async (req, res) => {
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
        res.json({ reviews: data.result.reviews });
      } else {
        res.status(400).json({ error: "Failed to fetch reviews", status: data.status });
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
