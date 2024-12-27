const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const port = process.env.PORT || 3004;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

mongoose
  .connect(process.env.MONGO_URI) 
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));

const foodSchema = new mongoose.Schema({
  food_name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
});

const Food = mongoose.model("add_foods", foodSchema);

// Serve the homepage with food items
app.get("/", async (req, res) => {
  try {
    const foodItems = await Food.find();
    res.sendFile(__dirname + "/index.html"); 
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

// Admin form submission
app.post("/admin", async (req, res) => {
  try {
    const { food_name, category, price, description } = req.body;

    const newFood = new Food({
      food_name,
      category,
      price,
      description,
    });

    await newFood.save();
    res.send("Food item added successfully! <a href='/'>Go back</a>");
  } catch (err) {
    console.error("Error saving food item:", err);
    res.status(500).send("Error saving food item. Please try again later.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});