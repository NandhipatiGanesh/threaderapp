const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors());

async function fetchMedia(threadUrl) {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(threadUrl, { waitUntil: "networkidle2" });

        // Wait for media elements to load
        await page.waitForSelector("img, video", { timeout: 5000 });

        // Extract the correct media URLs
        const mediaUrls = await page.evaluate(() => {
            let media = [];
            document.querySelectorAll("article img, article video").forEach(el => {
                if (el.tagName === "VIDEO") {
                    media.push(el.querySelector("source") ? el.querySelector("source").src : el.src);
                } else {
                    media.push(el.src);
                }
            });
            return media;
        });

        return mediaUrls.length ? mediaUrls : [];
    } catch (error) {
        console.error("Error fetching media:", error.message);
        return [];
    } finally {
        if (browser) await browser.close();
    }
}

app.get("/download", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "URL is required!" });

    const mediaUrls = await fetchMedia(url);
    if (mediaUrls.length === 0) {
        return res.status(404).json({ error: "No media found!" });
    }

    res.json({ mediaUrls });
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
