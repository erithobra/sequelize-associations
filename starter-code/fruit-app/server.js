//imported express library
const express = require('express');
const methodOverride = require('method-override');

const app = express();//returns an object
const routes = require('./routes');

//middleware- every request goes through it
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

//adding router object to middleware
app.use('/fruits', routes.fruits);
app.use('/users', routes.users);

//app will run on port 3000
app.listen(3000, () => {
    console.log('I am listening on port 3000');
})
