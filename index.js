require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");
let bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const shortUrls = [{ original_url: "https://freeCodeCamp.org", short_url: 0 }];

app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;
  let urlRegex = new RegExp(
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
  );

  if (!url.match(urlRegex)) {
    res.json({ error: "Invalid URL" });
    return;
  }
  let obj = { original_url: url, short_url: shortUrls.length };
  shortUrls.push(obj);
  res.json(obj);
});

app.get("/api/shorturl/:short_url?", function (req, res) {
  const short_url = req.params?.short_url;
  if (short_url != undefined) {
    let originalUrl =
      shortUrls.find((item) => item.short_url == short_url).original_url ||
      undefined;

    if (originalUrl != undefined) {
      res.redirect(originalUrl);
      return;
    } else {
      res.json({ error: "invalid url" });
      return;
    }
  } else {
    res.json({ error: "invalid url" });
    return;
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
