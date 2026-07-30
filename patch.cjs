const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const startStr = `  // Fetch real Google Reviews if configured using Google Maps Javascript SDK to bypass CORS`;
const endStr = `  }, [config.googlePlaceId, config.googleApiKey]);`;

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr, startIndex) + endStr.length;

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `  // Fetch real Google Reviews via backend proxy to bypass CORS
  useEffect(() => {
    const fetchReviews = async () => {
      const apiKey = config.googleApiKey;
      const placeId = config.googlePlaceId || "ChIJW0_QVQBXfxURqYqkcSzIp08";
      
      if (!apiKey) {
        setReviews(config.customReviews && config.customReviews.length === 4 ? config.customReviews : GOOGLE_REVIEWS);
        return;
      }

      try {
        const res = await fetch(\`/api/reviews?placeId=\${placeId}&apiKey=\${apiKey}\`);
        const data = await res.json();
        
        if (res.ok && data.reviews) {
          const formatted = data.reviews.map((r: any, idx: number) => ({
            id: idx + 100,
            name: r.author_name,
            text: r.text,
            date: r.relative_time_description || "مؤخراً",
            avatar: r.profile_photo_url || \`https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100\`
          }));
          setReviews(formatted);
        } else {
          setReviews(config.customReviews && config.customReviews.length === 4 ? config.customReviews : GOOGLE_REVIEWS);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews(config.customReviews && config.customReviews.length === 4 ? config.customReviews : GOOGLE_REVIEWS);
      }
    };

    fetchReviews();
  }, [config.googlePlaceId, config.googleApiKey]);`;

  code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Patched successfully");
} else {
  console.log("Could not find bounds");
}
