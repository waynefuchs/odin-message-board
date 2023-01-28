var express = require("express");
var router = express.Router();

const d = new Date();

const messages = [
  {
    text: "Hi there!",
    user: "Amando",
    added: new Date(),
  },
  {
    text: "Hello World!",
    user: "Charles",
    added: new Date(),
  },
];

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "The Odin Project Message Board", messages });
});

/* GET new message page */
router.get("/new", function (req, res, next) {
  res.render("new", { title: "New Message" });
});

/* POST new message page */
router.post("/new", function (req, res, next) {
  messages.push({
    text: req.body.message,
    user: req.body.user,
    added: new Date(),
  });
  res.redirect("/");
});

module.exports = router;
