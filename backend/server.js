require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log("DB ERROR:", err));

// Model
const Item = mongoose.model("Item", {
  name: String,
  description: String,
  category: String,
  serialNumber: String
});

// ADD
app.post("/add", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const item = new Item(req.body);
    await item.save();

    res.json({ message: "Item added" });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).send(err);
  }
});

// DELETE
app.delete("/delete/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.send("Deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));