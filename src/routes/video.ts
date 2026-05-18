import { Router } from "express";
import axios from "axios";

const router = Router();

router.get("/video", async (req, res) => {
    const url = req.query.url as string;

    if (!url) {
        return res.status(400).send("No URL");
    }

    try {
        res.setHeader("Access-Control-Allow-Origin", "*");

        let contentType = "video/mp4";

        if (url.includes(".m3u8")) {
            contentType = "application/vnd.apple.mpegurl";
        }

        res.setHeader("Content-Type", contentType);

        const response = await axios.get(url, {
            responseType: "stream",
            maxRedirects: 5,
        });

        response.data.pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching video");
    }
});

export default router;
