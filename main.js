var express = require("express");
require("dotenv").config();
var app = express();
var cors = require("cors");
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.listen(process.env.PORT || 3000, function () {
  console.log("CORS-enabled web server listening on port 3000");
});

app.post("/", function (req, res, next) {
  try {
    const js = req.body;
    const prompt = `write a ${
      js.type ? "Linkedin introduction" : "cover letter"
    } for a ${js.designation} with following skills ${js.skills.join(", ")}`;
    var axios = require("axios");
    var data = JSON.stringify({
      prompt,
      max_tokens: 564,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      best_of: 1,
      echo: true,
      logprobs: 0,
    });

    var config = {
      method: "post",
      url: "https://api.openai.com/v1/engines/text-davinci-001/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_TOKEN}`,
      },
      data: data,
    };
    axios(config).then(function (response) {
      let result = "";
      if (response.data.choices && response.data.choices[0]) {
        result = response.data.choices[0].text.split(prompt)[1].trim();
      }
      res.json({ result });
    });
  } catch (error) {
    console.log(error);
    throw new Error("request failed");
  }
});
