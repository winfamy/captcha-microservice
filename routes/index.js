var express = require("express");
var router = express.Router();
const fc = require("funcaptcha");

/* GET home page. */
router.all("/", async function (req, res, next) {
    let { dxBlob, userAgent, pkey, surl } = req.body;
    userAgent =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36";
    console.log(req.query, req.body);
    console.log(userAgent);

    if (!dxBlob || !userAgent || !pkey || !surl)
        return res.json({
            success: false,
            error: "One of dxBlob, userAgent, pkey, surl missing from body",
        });

    let token;
    try {
        token = await fc.getToken({
            surl,
            pkey,
            data: {
                blob: dxBlob,
            },
            headers: {
                "user-agent": userAgent,
            },
            site: "https://www.roblox.com",
        });

        const session = new fc.Session(token);
        return res.json({
            success: true,
            captchaToken: token.token,
            captchaUrl: session.getEmbedUrl(),
        });
    } catch (e) {
        return res.json({
            success: false,
            error: "Error occurred " + e.toString(),
        });
    }
});

module.exports = router;
