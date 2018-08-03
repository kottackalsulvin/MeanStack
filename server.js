var express=require('express');
var app=express();
var port=process.env.PORT || 8080;
var morgan=require('morgan');
var mongoose =require('mongoose');
var bodyParser=require('body-parser');
var router =express.Router();
var appRoutes = require('./app/routes/api')(router);
var path =require('path');

app.use(morgan('dev'));
app.use(bodyParser.json());//for parsing application /json
app.use(bodyParser.urlencoded({extended:true}));//for parsing application /x-www-form-urlencoded
app.use(express.static(__dirname + '/public'));
app.use('/api',appRoutes);


mongoose.connect('mongodb://kottackal:kottackal123@ds111562.mlab.com:11562/newdb',function(err){
    //mongodb://localhost:27017/newdb
    //mongodb://kottackal:kottackal123@ds111562.mlab.com:11562/newdb
    if(err){
        console.log('Not connected to the database:' +err);
    }else{
        console.log('Successfully connected to MongoDB');
    }
});

/*app.get('/home',function(req,res){
    res.send('Hello from home');
});

app.get('/',function(req,res){
    res.send('Hello World');
});*/

app.get('*', function(req,res){
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port,function(){
    console.log('Running the server on port' + port);
});