const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const functions = require("firebase-functions");

const app = express();
const port = 8443;

app.use(bodyParser.json());
app.use(cors());

app.get("/download", (req, res) => {
  const options = {
    method: "GET",
    hostname: "youtube-mp36.p.rapidapi.com",
    port: null,
    path: "/dl?id=" + req.query.id,
    headers: {
      "x-rapidapi-key": "2d8fdcfab8msh5ea97ebdd98b83ep17e1edjsn2296c0367282",
      "x-rapidapi-host": "youtube-mp36.p.rapidapi.com",
      "content-type": "application/json",
    },
  };

  const request = https.request(options, function (response) {
    const chunks = [];

    response.on("data", function (chunk) {
      chunks.push(chunk);
    });

    response.on("end", function () {
      const body = Buffer.concat(chunks);
      console.log("RESPONSE: ", JSON.parse(body.toString()));
      const jsonResponse = JSON.parse(body.toString());
      if (jsonResponse.status === "ok") {
        res.status(200).json(jsonResponse);
      } else {
        res.status(500).json(jsonResponse);
      }
    });
  });

  request.end();
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

exports.app = functions.https.onRequest(app);
