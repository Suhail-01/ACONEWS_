require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

// CORS configuration
app.use(cors({
  origin: '*', // Be cautious with this in production
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Helper function for API requests
async function makeApiRequest(url) {
  try {
    const response = await axios.get(url);
    return {
      status: 200,
      success: true,
      message: "Successfully fetched the data",
      data: response.data,
    };
  } catch (error) {
    console.error("API request error:", error.response ? error.response.data : error);
    return {
      status: 500,
      success: false,
      message: "Failed to fetch data from the API",
      error: error.response ? error.response.data : error.message,
    };
  }
}

// Endpoint to get all news based on a search query
app.get("/all-news", async (req, res) => {
  let pageSize = parseInt(req.query.pageSize) || 10; // GNews max is 100
  let q = req.query.q || 'world'; // Default search query if none provided

  // GNews API search endpoint
  let url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&max=${pageSize}&lang=en&apikey=${process.env.GNEWS_API_KEY}`;
  
  const result = await makeApiRequest(url);
  res.status(result.status).json(result);
});

// Endpoint to get top headlines in a specific category
app.get("/top-headlines", async (req, res) => {
  let pageSize = parseInt(req.query.pageSize) || 10; // GNews max is 100
  let category = req.query.category || "general"; // Default category if none provided

  // GNews API top-headlines endpoint
  let url = `https://gnews.io/api/v4/top-headlines?category=${category}&max=${pageSize}&lang=en&apikey=${process.env.GNEWS_API_KEY}`;
  
  const result = await makeApiRequest(url);
  res.status(result.status).json(result);
});

// Endpoint to get top headlines by country ISO code
app.get("/country/:iso", async (req, res) => {
  let pageSize = parseInt(req.query.pageSize) || 10; // GNews max is 100
  const country = req.params.iso;

  // GNews API top-headlines endpoint filtered by country
  let url = `https://gnews.io/api/v4/top-headlines?country=${country}&max=${pageSize}&apikey=${process.env.GNEWS_API_KEY}`;
  
  const result = await makeApiRequest(url);
  res.status(result.status).json(result);
});

// Server listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Server is running at port ${PORT}`);
});
