//imported express library
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();//returns an object
const routes = require('./routes');

//middleware- every request goes through it
//using body parser to parse request data
app.use(bodyParser.urlencoded({extended:false}));
app.use(methodOverride('_method'));

app.use(express.static(__dirname + '/public'));

//adding router object to middleware
app.use('/fruits', routes.fruits);
app.use('/users', routes.users);

//app will run on port 3000
app.listen(3000, () => {
    console.log('I am listening');
})
