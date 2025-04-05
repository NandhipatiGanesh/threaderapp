const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const path = require('path');
const app = express();
const cors = require("cors");
app.use(cors());


puppeteer.use(StealthPlugin());

const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/fetch-video', async (req, res) => {
    try {
        console.log("Fetching video for URL:", req.query.url);
        const browser = await puppeteer.launch({
            executablePath: "/usr/bin/google-chrome-stable",
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        );

        console.log("Navigating to:", req.query.url);
        await page.goto(req.query.url, { waitUntil: "networkidle2" });

        console.log("Checking for video element...");
        await page.waitForSelector("video", { timeout: 10000 });

        const videoUrl = await page.evaluate(() => {
            const video = document.querySelector("video source") || document.querySelector("video");
            return video ? video.src : null;
        });

        console.log("Extracted Video URL:", videoUrl);
        await browser.close();

        if (!videoUrl) {
            console.error("❌ No video found on page.");
            return res.status(404).json({ error: "No video found" });
        }

        res.json({ videoUrl });

    } catch (error) {
        console.error("🔥 Server Error:", error); // Log Full Error Stack
        res.status(500).json({ error: error.message });
    }
});





/* (async () => {
    try {
        const browser = await puppeteer.launch();
        const version = await browser.version();
        console.log("Installed Chrome Version:", version);
        await browser.close();
    } catch (error) {
        console.error("Error checking installed Chrome versions:", error);
    }
})(); */




app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));




// const express = require("express");
// const puppeteer = require("puppeteer");
// const axios = require("axios");
// const fs = require("fs");
// const path = require("path");

// const app = express();
// const PORT = 3000;

// app.use(express.static(path.join(__dirname, "public")));

// // Function to extract video URL
// const extractVideoUrl = async (url) => {
//     const browser = await puppeteer.launch({ headless: "new" }); // Use headless mode
//     const page = await browser.newPage();

//     // Set user agent to mimic a real browser
//     await page.setUserAgent(
//         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
//     );

//     await page.goto(url, { waitUntil: "networkidle2" });

//     // Scroll to ensure all content loads
//     await page.evaluate(() => {
//         window.scrollBy(0, window.innerHeight * 2);
//     });

//     // Wait for the video element to appear
//     await page.waitForSelector("video", { timeout: 15000 }).catch(() => null);

//     // Extract the video source URL
//     const videoUrl = await page.evaluate(() => {
//         let videoElement = document.querySelector("video source") || document.querySelector("video");
//         return videoElement ? videoElement.src : null;
//     });

//     await browser.close();

//     return videoUrl;
// };

// // API route to fetch video URL
// app.get("/fetch-video", async (req, res) => {
//     const { url } = req.query;
//     if (!url) return res.status(400).json({ error: "No URL provided" });

//     try {
//         const videoUrl = await extractVideoUrl(url);
//         if (!videoUrl) return res.status(404).json({ error: "No video found" });

//         res.json({ videoUrl });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: "Failed to fetch video" });
//     }
// });

// // API route to download video
// app.get("/download", async (req, res) => {
//     const { url } = req.query;
//     if (!url) return res.status(400).json({ error: "No URL provided" });

//     try {
//         const videoUrl = await extractVideoUrl(url);
//         if (!videoUrl) return res.status(404).json({ error: "No video found" });

//         const response = await axios.get(videoUrl, { responseType: "stream" });

//         const fileName = "threads-video.mp4";
//         const filePath = path.join(__dirname, "public", fileName);

//         const writer = fs.createWriteStream(filePath);
//         response.data.pipe(writer);

//         writer.on("finish", () => res.download(filePath, fileName));
//         writer.on("error", (err) => res.status(500).json({ error: "Download failed", details: err }));
//     } catch (error) {
//         console.error("Error downloading video:", error);
//         res.status(500).json({ error: "Download failed" });
//     }
// });

// // Start server
// app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
// app.get('/fetch-video', async (req, res) => {
//     const { url } = req.query;
//     if (!url) return res.status(400).json({ error: 'No URL provided' });

//     try {
//         const browser = await puppeteer.launch({ headless: true,
//             args: ["--no-sandbox", "--disable-setuid-sandbox"],
//          });
//         const page = await browser.newPage();
//         await page.setUserAgent(
//             'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
//         );

//         console.log("Navigating to:", url);
//         await page.goto(url, { waitUntil: 'networkidle2' });

//         // Wait and check for a video element
//         await page.waitForSelector('video', { timeout: 10000 });

//         const videoUrl = await page.evaluate(() => {
//             const video = document.querySelector('video source') || document.querySelector('video');
//             return video ? video.src : null;
//         });

//         console.log("Extracted Video URL:", videoUrl);
//         await browser.close();

//         if (!videoUrl) return res.status(404).json({ error: 'No video found' });

//         res.json({ videoUrl });

//     } catch (error) {
//         console.error('Error fetching video:', error);
//         res.status(500).json({ error: 'Error fetching video' });
//     }
// });