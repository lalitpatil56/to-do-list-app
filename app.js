//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.utzhp.mongodb.net/todolistDB`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const itemSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your ToDoList!",
});

const defaultItems = [item1];

app.get("/", function (req, res) {
  Item.find({}, function (err, items) {
    if (items.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (!err) {
          console.log("Default item added successfully");
        } else {
          console.log("Can not add item. Error !");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listItems: items });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  if (itemName.length !== 0) {
    const item = new Item({
      name: itemName,
    });
    item.save();
  }

  res.redirect("/");
});
app.post("/delete", function (req, res) {
  const deleteItemId = req.body.checkbox;
  Item.findByIdAndRemove(deleteItemId, function (err) {
    if (!err) {
      console.log("Successfully deleted the Item.");
    }
  });

  res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log("Server running on Heroku Port");
});
