//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to our daily journal! Here, you can find daily updates and musings about a variety of topics, ranging from personal reflections to current events.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

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
  }
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

app.get("/about", (req, res) => {
  const options = {
    aboutContent: aboutContent,
  }

  res.render("about", options);
})

app.get("/contact", (req, res) => {
  const options = {
    contactContent: contactContent,
  }

  res.render("contact", options);
})

app.get("/compose", (req, res) => {
  res.render("compose");
})

app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.postContent,
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
