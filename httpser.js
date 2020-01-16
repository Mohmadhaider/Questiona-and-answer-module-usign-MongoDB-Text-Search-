var express = require('express')
var app = express()
var bodyparser = require('body-parser');
var mongoose = require('mongoose');

//app.use(bodyparser.json())
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

mongoose.connect("mongodb+srv://staging:rvZT2DO4eXGwnRmF@bee-7isf3.mongodb.net/staging", {useNewUrlParser:true, useUnifiedTopology: true}, function(){
    console.log("Success")
})


var new_table = mongoose.Schema({
    questions:Array,
    answers:Array,
    isDeleted:Boolean,
    isUpdated:Boolean,
    isFaq:Boolean,
    checkForContent:Boolean,
    tags:Array
})
new_table.index({questions : 'text'})
var table = mongoose.model("Qna", new_table)

app.get('/', function(request, response) {
  console.log('GET /')
  var html = `
    <html>
        <body>
            <form method="post" action="http://localhost:3000/ans">Name: 
                <input type="text" name="name" />
                <input type="submit" value="Submit" />
            </form>
        </body>
    </html>`
  response.writeHead(200, {'Content-Type': 'text/html'})
  response.end(html)
})

app.post('/ans', function(request, response) {
  console.log('POST /')
  
  table.find({$text : {$search : request.body.name}, isDeleted : false}, {$score:{$meta:'textScore'}}).sort( { $score: { $meta: "textScore" } } )
    .limit(1)
    .exec(function(err, docs){
        if(err)
            console.log(err)
        else
            if(docs.length > 0)
            {
                response.send("<html><body>"+docs[0]['answers'][Math.floor(Math.random() * docs[0]['answers'].length)]+"<br><form method = 'get' action = 'http://localhost:3000'><input type='submit' value='Ask another'/></form></body></html>")
            }
            else
            {
                response.send("<html><body>Sorry I have not any answer for that<br><form method = 'get' action = 'http://localhost:3000'><input type='submit' value='Ask another'/></form></body></html>")
            }
        })
})

port = 3000
app.listen(port)
console.log(`Listening at http://localhost:${port}`)