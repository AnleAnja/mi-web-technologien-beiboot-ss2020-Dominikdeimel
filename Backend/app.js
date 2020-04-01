var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.raw({
    type: 'image/png',
    limit: '10mb'
}));


app.post("/images", function (req,res) {
    console.log(req);
});



app.listen(3000, function(){
    console.log("Example app listening on port: 3000");
});