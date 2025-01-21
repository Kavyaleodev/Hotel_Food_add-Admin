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

// Food Schema
const foodSchema = new mongoose.Schema({
  food_name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },  // Store the image URL or file path
});
const Food = mongoose.model("add_foods", foodSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
  issue: { type: String, required: true },
  full_name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  message: { type: String },
});
const Contact = mongoose.model("contacts", contactSchema);

// Serve the homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Serve the contact page
app.get("/contact", (req, res) => {
  res.sendFile(__dirname + "/contact.html");
});

// Serve the about page
app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/about.html");
});

// API to get all food items
app.get("/api/foods", async (req, res) => {
  try {
    const foodItems = await Food.find();
    res.json(foodItems);
  } catch (err) {
    console.error("Error fetching food items:", err);
    res.status(500).send("Error fetching food items.");
  }
});

// Admin form submission
app.post("/admin", upload.single("image"), async (req, res) => {
  try {
    const { food_name, category, price, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newFood = new Food({
      food_name,
      category,
      price,
      description,
      image: imageUrl,
    });

    await newFood.save();
    res.send("Food item added successfully! <a href='/'>Go back</a>");
  } catch (err) {
    console.error("Error saving food item:", err);
    res.status(500).send("Error saving food item. Please try again later.");
  }
});

// Contact form submission
app.post("/contact", async (req, res) => {
  try {
    const { issue, full_name, email, mobile, message } = req.body;

    const newContact = new Contact({
      issue,
      full_name,
      email,
      mobile,
      message,
    });

    await newContact.save();
    res.send("Thank you for your feedback! <a href='/'>Go back</a>");
  } catch (err) {
    console.error("Error saving contact form:", err);
    res.status(500).send("Error saving contact form. Please try again later.");
  }
});

// Order Schema
const orderSchema = new mongoose.Schema({
  food_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  customer_name: { type: String, required: true },
  address: { type: String, required: true },
  landmark: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  phone: { type: String, required: true },
});
const Order = mongoose.model("orders", orderSchema);

// Serve the order page
app.get("/order", (req, res) => {
  res.sendFile(__dirname + "/order.html");
});

// Handle order form submissions
app.post("/order", async (req, res) => {
  try {
    const { food_name, quantity, customer_name, address, landmark, city, state, phone } = req.body;

    const newOrder = new Order({
      food_name,
      quantity,
      customer_name,
      address,
      landmark,
      city,
      state,
      phone,
    });

    await newOrder.save();
    res.send("Thank you for your order! <a href='/'>Go back</a>");
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).send("Error processing your order. Please try again later.");
  }
});

// Serve static files for images
app.use("/uploads", express.static("uploads"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
