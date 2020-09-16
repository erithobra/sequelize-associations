const Fruit = require('../models').Fruit;//imported fruits array

//handle index request
const index = (req, res) => {
    Fruit.findAll()
    .then(fruits => {
        res.render('index.ejs', {
            fruits : fruits
        });
    })
}

const show = (req, res) => {
    Fruit.findByPk(req.params.index)
    .then(fruit => {
        res.render('show.ejs', {
            fruit: fruit
        });
    })
}

const renderNew = (req, res) => {
    res.render('new.ejs');
}

const postFruit = (req, res) => {
    if(req.body.readyToEat === 'on'){ 
        req.body.readyToEat = true; 
    } else { 
        req.body.readyToEat = false;
    }

    Fruit.create(req.body)
    .then(newFruit => {
        res.redirect('/fruits');
    })
}

const removeFruit = (req, res) => {
    Fruit.destroy({ where: { id: req.params.index } })
    .then(() => {
        res.redirect('/fruits');
    })	
}

const renderEdit = (req, res) => {
    Fruit.findByPk(req.params.index)
    .then(fruit => {
        res.render('edit.ejs', { 
            fruit: fruit
        });
    })
}

const editFruit = (req, res) => {
    if(req.body.readyToEat === 'on'){ 
        req.body.readyToEat = true;
    } else { 
        req.body.readyToEat = false;
    }
    Fruit.update(req.body, {
          where: { id: req.params.index },
          returning: true,
        }
    )
    .then(fruit => {
        res.redirect('/fruits');
    })
}

module.exports = {
    index,
    show,
    renderNew,
    postFruit,
    removeFruit,
    renderEdit,
    editFruit
}