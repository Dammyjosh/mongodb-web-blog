
//jshint esversion:6
 
//requiring the modules : 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
 
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
 
const app = express();
 
app.set('view engine', 'ejs');
 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
 
 
//Connecting to the database using mongoose.
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/blogDB');
}
 
//Creating an empty array but we are not using it in this version of the app.
// const posts = [];
 
 
//Creating Schema for the posts 
const postSchema = new mongoose.Schema({
  title : String,
  content: String,
  id: {
    type: String,
    unique: true,
  },
});
 
 
//Creating a mongoose model based on this Schema :
 
const Post = mongoose.model("Post",postSchema);
 
app.get("/", function(req, res) {
 
  // Find all items in the Posts collection and render it into our home page.
 Post.find().then(posts =>{
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
        });
    });
});
 
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});
 
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});
 
app.get("/compose", function(req, res){
  res.render("compose");
 
 });
 
 //Saved the title and the post into our blogDB database.
app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  })
 
  //We are saving the post through our compose route and redirecting back into the home route. A message will be displayed in our console when a post is being saved.
 
  post.save().then(() => {
 
    console.log('Post added to DB.');
 
    res.redirect('/');
 
  })
 
  .catch(err => {
 
    res.status(400).send("Unable to save post to database.");
 
  });
 
 
});
 
app.get("/posts/:postId", function(req, res){
  //We are storing the _id of our created post in a variable named requestedPostId
  const requestedPostId = req.params.postId;
 
  //Using the find() method and promises (.then and .catch), we have rendered the post into the designated page.
 
  Post.findOne({_id:requestedPostId})
  .then(function (post) {
    res.render("post", {
            title: post.title,
            content: post.content
          });
    })
    .catch(function(err){
      console.log(err);
    })
  })

  	
 
app.listen(3000, function() {
  console.log("Server started on port 3000");
});