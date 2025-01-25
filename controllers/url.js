const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });
  const shortID = shortid();

  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
    createdBy: req.user._id,
    clicks: 0,
    shortUrl: `http://localhost:8001/url/${shortID}`,
  });

  return res.render("home", {
    id: shortID,
  });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

const handleRedirectShortURL = async (req, res) => {
  const shortId = req.params.shortId;
  try {
    const entry = await URL.findOne({ shortId });
    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }
    entry.visitedHistory.push({ timestamp: Date.now() });
    entry.clicks = entry.visitedHistory.length;
    await entry.save();
  } catch (err) {
    console.error("Error in GET /:shortId:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleRedirectShortURL,
};
