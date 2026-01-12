require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "pug");

const PORT = 3000;
const BASE_URL = "https://api.hubapi.com";
const OBJECT_TYPE_ID = process.env.CUSTOM_OBJECT_TYPE_ID;

const HEADERS = {
  Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS_TOKEN}`,
  "Content-Type": "application/json",
};

// GET / -> list records
app.get("/", async (req, res) => {
  try {
    const url = `${BASE_URL}/crm/v3/objects/${OBJECT_TYPE_ID}?properties=name,age,character_details`;
    const response = await axios.get(url, { headers: HEADERS });

    res.render("homepage", {
      title: "Homepage | Integrating With HubSpot I Practicum",
      records: response.data.results,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Error loading records");
  }
});

// GET /update-cobj -> render form
app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

// POST /update-cobj -> create record then redirect
app.post("/update-cobj", async (req, res) => {
  try {
    const url = `${BASE_URL}/crm/v3/objects/${OBJECT_TYPE_ID}`;

    await axios.post(
      url,
      {
        properties: {
          name: req.body.name,
          age: req.body.age,
          character_details: req.body.character_details,
        },
      },
      { headers: HEADERS }
    );

    res.redirect("/");
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Error creating record");
  }
});

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));

