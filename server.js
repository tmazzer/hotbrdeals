//express
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var nl2br  = require('nl2br');



app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


// mongoose	
var mongoose = require('mongoose');

var uri = process.env.OPENSHIFT_MONGODB_DB_URL || "mongodb://127.0.0.1:27017/horbrdeals";
mongoose.connect(uri);

mongoose.connection.on('connected',function(){
	console.log('mongo connected');
});

mongoose.connection.on('disconnected',function(){
	console.log('mongo disconnected');
});

mongoose.connection.on('error',function(err){
	console.log('mongo error: ' + err);
});

process.on('SIGINT',function(){
	
	mongoose.connection.close(function(){
		console.log('conexao fechada pelo termino da aplicacao.');
		process.exit(0);
	});
	
});
//mongoose-fim


// define schema do banco 
var ItemModel = mongoose.model('posts',mongoose.Schema({
	title: String,
	description: Array,
    date: Date,

},{versionKey:false}));

app.post('/posts',function(req,res){
     
     var post = req.body;
     var promisse = ItemModel.create(post);
     promisse.then(
      function(data){
       res.status(200).json(data);
      },
      function(error){
       res.status(500).json(error);
      }
     );
});

app.get('/posts',function(req,res){
     
     var promisse = ItemModel.find().exec();
     promisse.then(
      function(data){
         res.status(200).json(data);
      },
      function(error){
       res.status(500).json(error);
      }
     );
});

app.get('/posts/:id',function(req,res){
       var id =  req.params.id;

       var promisse = ItemModel.findOne({"_id":id}).exec();
       promisse.then(
       function(data){
       res.status(200).json(data);
      },
      function(error){
       res.status(500).json(error);
      }
     );
})

app.delete('/posts/:id',function(req,res){
       var id =  req.params.id;

       var promisse = ItemModel.remove({"_id":id}).exec();
       promisse.then(
       function(data){
       res.status(200).json(data);
      },
      function(error){
       res.status(500).json(error);
      }
     );
})

app.put('/posts',function(req,res){
     
     var post = req.body;
     var id = post._id;
     delete post._id;
     var promisse = ItemModel.update({"_id":id},post);
     promisse.then(
      function(data){
       res.status(200).json(data);
      },
      function(error){
       res.status(500).json(error);
      }
     );
});

app.use(express.static('./'));

app.listen(9000);
console.log('servidor oline');

