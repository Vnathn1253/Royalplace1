const mongoose = require("mongoose");

const dbConnect=mongoose.connect(
  "mongodb+srv://Vnathn1253:Vnathn080901%40@cluster0.cy38d.mongodb.net/royal",
  { useNewUrlParser: true },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("Error in DB connection : " + err);
    }
  }
);
module.exports = dbConnect