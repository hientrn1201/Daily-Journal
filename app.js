//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to our daily journal! Here, you can find daily updates and musings about a variety of topics, ranging from personal reflections to current events.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//connect to mongoDB
const url = "mongodb://127.0.0.1:27017/blogDB"
mongoose.set("strictQuery", false);
mongoose.connect(url,  {useNewUrlParser: true});

//create posts schema and collection in mongoDB
const postsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  time : String,
});
const Post = mongoose.model("Post", postsSchema);

app.get("/", (req, res) => {
  Post.find({}, (err, foundedPosts) => {
    const options = {
      homeStartingContent: homeStartingContent,
      posts: foundedPosts,
    };
    res.render("home", options);
  });
})

app.get("/compose", (req, res) => {
  res.render("compose");
})

app.post("/compose", (req, res) => {
  let today = new Date();
  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };
  let day = today.toLocaleDateString("en-US", options);

  const post = new Post({
    title: req.body.title,
    content: req.body.postContent,
    time: day
  });
  post.save((err) => {
    if (!err) {
      res.redirect("/");
    }
  }); 
})

app.get("/posts/:id", (req, res) => {
  Post.findById(req.params.id, (err, foundedPost) => {
    if (!err) {
      console.log(foundedPost);
      res.render("post", {foundedPost: foundedPost});
    }
  });
})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
