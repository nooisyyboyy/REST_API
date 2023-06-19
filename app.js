//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser:true , useUnifiedTopology:true})
    .then( ()=> console.log("success") )
    .catch((err) => console.log(err));

const articleSchema = {
    title: String,
    content: String
};
//model name
const Article = mongoose.model("Article", articleSchema);
//TODO

app.route("/")
.get(function(req,res){
    Article.find({},function(err, foundArticles){
        if (!err){
            res.send(foundArticles);
        }else{
            res.send(err);
        }
        
    });
})

.post(function(req, res){
    
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if (!err){
            res.send("successfully sent the data");
        }else{
            res.send(err);
        }
    });
})

.delete(function(req,res){
    Article.deleteMany(function(err){
        if (!err){
            res.send("Successfully deleted all articles");
        } else{
            res.send(err);
        }
    });
});

app.route("/article/:articleTitle")
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle}, function(err,foundArticles){
        if (foundArticles){
            res.send(foundArticles);
        }else{
            res.send("no matching article was found");
        }
    });
})

.put(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title : req.body.title, content : req.body.content},
        // {overwrite: true},                 //--> Update method has now been deprecated from mongo db & overwrite is not used with update one and many.
        function(err){
            if (!err){
                res.send("Sucessfully Updated Article");
            }else{
                res.send(err);
                
            }
        }
    );
})

.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set : req.body},
        function(err){
            if (!err){
                res.send("sucessfully updated article");
            }
        }
    );
})

.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if (!err){
                res.send("Article deletion sucessfull");
            }
        }
    );
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});