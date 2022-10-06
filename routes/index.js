var express = require('express');
var router = express.Router();
const fc = require("funcaptcha");

/* GET home page. */
router.get('/', async function(req, res, next) {
    let { dxBlob, userAgent, pkey, surl } = req.query;
    userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36";
    console.log(req.query, req.body);
    console.log(userAgent);

    if (!dxBlob || !userAgent || !pkey || !surl)
        return res.send(JSON.stringify({
            success: false,
            error: "One of dxBlob, userAgent, pkey, surl missing from body"
        }));

    let token;
    try {
        token = await fc.getToken({
            surl,
            pkey,
            data: {
                blob: dxBlob
            },
            headers: {
                "user-agent": userAgent,
            },
            site: "https://www.roblox.com"
        });
    } catch (e) {
        return res.send(JSON.stringify({
            success: false,
            error: "Error occurred " + e.toString()
        }))
    }

    console.log(token)
    const session = new fc.Session(token);
    return res.send(JSON.stringify({
        success: true,
        captchaToken: token.token,
        captchaUrl: session.getEmbedUrl()
    }));
});

module.exports = router;
