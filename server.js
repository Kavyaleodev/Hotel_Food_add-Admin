const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const port = process.env.PORT || 3004;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));  // Serve static files, including assets and uploads

// Setup multer storage for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");  // Specify upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Use a timestamp for file name
  },
});
const upload = multer({ storage: storage });

// MongoDB connection setup
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

const foodSchema = new mongoose.Schema({
  food_name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },  // Store the image URL or file path
});

const Food = mongoose.model("add_foods", foodSchema);

// Serve the homepage with food items
app.get("/", async (req, res) => {
  try {
    const foodItems = await Food.find();
    res.sendFile(__dirname + "/index.html"); // Serve the index.html
  } catch (err) {
    console.error("Error fetching food items:", err);
    res.status(500).send("Error fetching food items. Please try again later.");
  }
});

// API to get all food items
app.get("/api/foods", async (req, res) => {
  try {
    const foodItems = await Food.find();
    res.json(foodItems); // Send food items as JSON
  } catch (err) {
    console.error("Error fetching food items:", err);
    res.status(500).send("Error fetching food items.");
  }
});

// Admin form submission with image upload
app.post("/admin", upload.single('image'), async (req, res) => {
  try {
    const { food_name, category, price, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;  // Store image URL

    const newFood = new Food({
      food_name,
      category,
      price,
      description,
      image: imageUrl,  // Save the image URL
    });

    await newFood.save();
    res.send("Food item added successfully! <a href='/'>Go back</a>");
  } catch (err) {
    console.error("Error saving food item:", err);
    res.status(500).send("Error saving food item. Please try again later.");
  }
});

// Serve static files for images
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
