import express from "express";
import mongoose from "mongoose";
import ViteExpress from "vite-express";
import PhoneBook from "./model/book.cjs";

const app = express();
app.use(express.json());
const port = 8080;

const DB = "mongodb://localhost:27017/phonebook";
mongoose.connect(DB).then(() => {
  console.log("Database connected..");
}).catch((err)=>{
  console.log(err);
})

app.get("/fetchData", async (req, res) => {
  const data = await PhoneBook.find().sort({name : 1}).collation({ locale : 'en', strength : 2 });
  res.status(201).json(data);
});

app.post("/add-phone", async (req, res) => {
  console.log(req.body);
  const phoneNumber = new PhoneBook(req.body);
  try {
    await phoneNumber.save();
    res.status(201).json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
    });
  }
});

app.get("/get-phone", async (req, res) => {
  const phoneNumbers = await PhoneBook.find({});
  try {
    res.status(200).json({
      status: "Success",
      data: {
        phoneNumbers,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err,
    });
  }
});

app.patch("/update-phone/:id", async (req, res) => {
  const updatedPhone = await PhoneBook.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  try {
    res.status(200).json({
      status: "Success",
      data: {
        updatedPhone,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "Error",
      message: "Failed to update phone.",
    });
  }
});

app.delete("/delete-phone/:id", async (req, res) => {
  await PhoneBook.findByIdAndDelete(req.params.id);

  try {
    res.status(204).json({
      status: "Success",
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err,
    });
  }
});

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`> Ready on http://localhost:${port}`);
});

ViteExpress.bind(app, server);
