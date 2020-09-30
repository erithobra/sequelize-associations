# Sequelize Associations and Validations

## Objectives

- Implement a hasMany/belongsTo association between `User` and `Fruit`
- Return all fruits belonging to a user in the INDEX route
- Create a migration for `userId` in the `Fruits` table
- Add a validation to the `Fruit` model
- Limit the fields that are returned from the database

<br>

## Intro

Last week we built a `fruit-app`. Yesterday, we added Postgres and Sequelize to the app. Today we will use Sequelize associate that a **User *hasMany* instances of a Fruit** and that a **Fruit *belongsTo* a User**. This represents `One-To-Many` or `Many-To-One` relationship in a SQL database.

We'll also use this as an opportunity to review migrations and introduce Sequelize model validations.

Here are the rough steps we'll follow:

- Add an `userId` foreign key column to the `Fruits` table
- Re-seed our database so that our starter fruits have a foreign key.
- Define the Sequelize associations in the `Fruit` and `User` models.
- Update our Express `users/` INDEX route to include all the fruits that belong to an owner.	

## Code Along: hasMany

First things first, now that we have removed use of `fruits` and `users` array from our controllers we can safely delete the file and remove imports from the controllers.

### Add column `userId` to `Fruits` 

Now that `User` model has been created we can go ahead and add `userId` column to `Fruits` table.

1. Create a migration file to add `userId` to the `Users` table.

	```bash
	sequelize migration:generate --name add-userId-to-fruits
	```

2. Inside the file, add code to add the column to the table.

	```bash
	up: async (queryInterface, Sequelize) => {
    	await queryInterface.addColumn('Fruits', 
    	'userId', 
    	{ 
    		type: Sequelize.INTEGER 
    	});
  	},
	``` 

3. Run `sequelize db:migrate` to run the new migration file.

4. In the `models/fruit.js`, make sure to add the new column so that our app knows about it.

	```js
	Fruit.init(
    {
      name: DataTypes.STRING,
      color: DataTypes.STRING,
      readyToEat: DataTypes.BOOLEAN,
      userId: DataTypes.INTEGER,
    },
 	```

1. Let's reseed the `seeders/<TIMESTAMP>-demo-fruits.js` with a some owner ids.


```
	'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Fruits', [
      {
	  name:'apple',
	  color: 'red',
	  readyToEat: true,
	  userId: 1,
      },
      {
	  name:'pear',
	  color: 'green',
	  readyToEat: false,
	  userId: 2,
      },
      {
	  name:'banana',
	  color: 'yellow',
	  readyToEat: true,
	  userId: 3,
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Fruits', null, {});
	}
};
```

6. To make sure our userIds match up, let's drop all the database tables and reseed them. Run `sequelize db:migrate:undo:all` to run the down methods and drop all the tables.
7. Run `sequelize db:migrate` to run the migrations again and re-create the tables.
8. Run `sequelize db:seed:all` to reseed database.
 

#### Bulk Delete exiting Data

If you look at the data in `Fruits` tables, and there is a lot of duplication.

```
fruits_dev=# select * from "Fruits"fruits_dev-# ; id |  name  | color  | readyToEat |         createdAt          |         updatedAt          | userId----+--------+--------+------------+----------------------------+----------------------------+--------  3 | banana | yellow | t          | 2020-06-11 08:56:21.261-07 | 2020-06-11 08:56:21.261-07 |  4 | Grapes | green  | t          | 2020-06-11 11:38:09.263-07 | 2020-06-11 11:38:09.263-07 |  2 | pear12 | green  | f          | 2020-06-11 08:56:21.261-07 | 2020-06-11 12:16:42.964-07 |  5 | apple  | red    | t          | 2020-06-11 08:56:21.261-07 | 2020-06-11 08:56:21.261-07 |      1  6 | pear   | green  | f          | 2020-06-11 08:56:21.261-07 | 2020-06-11 08:56:21.261-07 |      2  7 | banana | yellow | t          | 2020-06-11 08:56:21.261-07 | 2020-06-11 08:56:21.261-07 |      3(6 rows)
```

This means that everytime we are seeding data in the database it is creating new rows without deleting the old ones. Lets make use of `down` method in our seed files to delete previous rows before seeding new data.

We are now going to make use of `down` method in our seeders files to bulk delete all rows before inserting new ones. Go to `xxxxxxxxxxx-demo-fruits.js` and add the following code,

```
...
	down: (queryInterface, Sequelize) => {
    	return queryInterface.bulkDelete('Fruits', null, {});
  	}
...
```

Simillarly we'll make the change in `xxxxxxxxxxx-demo-users.js`,

```
...
	down: (queryInterface, Sequelize) => {
    	return queryInterface.bulkDelete('Users', null, {});
  	}
...
```

Once the above changes our made, we will ask sequelize to delete the data

`sequelize db:seed:undo --seed 20200608030632-demo-fruits.js`

If you want to undo all the seed files, run `sequelize db:seed:undo:all`

After this, run `sequelize db:seed --seed xxxxxxxxx-demo-fruits.js` to reseed the `Fruits` data.


### `hasMany`/`belongsTo` - Sequelize

Now we talked about it briefly, one `User` can have many `Fruits`, that means `User` has a **many-to-one** relationship with `Fruits`. On the flip side a `Fruit` can be created by only one `User` so `Fruit` has a **one-to-many** relationship with `User`. This means that we have a foreign key column `userId` in `Fruits` table in order to have an association between the two tables.

In Sequelize this is represented by `hasMany` and `belongsTo`. 

4. In the `models/user.js` file, add the association for an `User.hasMany(models.Fruit)`.

	```js
	static associate(models) {
		User.hasMany(models.Fruit, { foreignKey: "userId" });
 	}
	``` 
5. In the `models/fruit.js` file, add the association for a `Fruit.belongsTo(models.User)`.

	```js
	static associate(models) {
		Fruit.belongsTo(models.User, { foreignKey: "userId" });
	}
	``` 

In the above case when we do `Fruit.belongsTo(User)`, we are creating a relation that will enable us to call `fruit.getUser()`. `User.hasMany(Fruit)` links the association other way, we can now call `user.getFruits()` to get all fruits added by a user. This is called as bi-directional relationship. 

### Show the User that created the Fruit

#### Update Fruit Controller

Let's update our fruit controller to access a user from fruit. 

```
const User = require('../models').User;
```

Remember `Fruit.belongsTo(User)` lets us get User data from fruit. For that we'll do one small change `show()`.

```
const show = (req, res) => {
    Fruit.findByPk(req.params.index, {
        include : [User]
    })
    .then(fruit => {
        res.render('show.ejs', {
            fruit: fruit
        });
    })
}
```
`include` will also populate `User` data when `Fruit` is retrieved from the database.

#### Update Fruit Show View

We'll add `User` information in `show.ejs`. This is the view where we are displaying details of each fruit.

```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
    </head>
    <body>
        <h1>Fruits show page</h1>
        The <%=fruit.name; %> is  <%=fruit.color; %>.
        <% if(fruit.readyToEat === true){ %>
            It is ready to eat
        <% } else { %>
            It is not ready to eat
        <% } %>
        It is added by <%=fruit.User.name%>
    </body>
</html>  
```

See how we are accessing name of the user `fruit.User.name`. Check the detail view page of any fruit and you should see user's name.


What if we don't need all the extra fields like `id`, `createdAt` or `updatedAt`? We can trim our response object and define only what we want returned with an `attributes` Array. 

You can add the below code in `show()` in `controllers/fruit.js`. In the `attributes` we are only including the fields we want.

```
const show = (req, res) => {    Fruit.findByPk(req.params.index, {        include : [{            model: User,            attributes: ['name']        }],        attributes: ['name', 'color', 'readyToEat']    })    .then(fruit => {        console.log(fruit)        res.render('show.ejs', {            fruit: fruit        });    })}
```

### List all Fruits added by the User

#### Update User Controller

Import Fruit model,

```
const Fruit = require('../models').Fruit;```

On the profile page list all the fruits created by the user.

```
const renderProfile = (req, res) => {    User.findByPk(req.params.index, {        include: [{            model: Fruit,            attributes: ['id','name']        }]     })    .then(userProfile => {        res.render('users/profile.ejs', {            user: userProfile        })    })}
```

#### Update Profile View

```
	<h3>Fruits added by you:</h3>    <% for (let i=0; i< user.Fruits.length; i++){ %>            <li>               <a href="/fruits/<%=user.Fruits[i].id%>"><%=user.Fruits[i].name%></a>            </li>            <br>    <% } %>    <br><br>
```

### Update Create Fruit to pass in User Id

Since we are now attaching user Id with Fruit let's create a field for that in `new.ejs`

```
<form action="/fruits" method="POST">	User Id: <input type="text" name="userId" />    Name: <input type="text" name="name" />    Color: <input type="text" name="color" />    Is Ready to Eat: <input type="checkbox" name="readyToEat" />    <input type="submit" value="Create Fruit" /></form>
```


## Code Along: belongsToMany

So far we have `Fruit` and `User` models where a `Fruit hasMany Users`. Now we are going to create another model `Season` where a fruit can belong to multiple seasons and each season can have multiple fruits. That means that **Fruit has many-to-many relationship with season**. 

Previously we have learned that we need a *Join Table* to save many-to-many relationship between tables. An ORM like Sequelize makes this easier to do by creating the join tables for us. All we need to know is the right syntax.

### You Do

- Just like before create a model `Season` with just one field `name` which will be a `string`. 
	`sequelize model:generate --name Season --attributes name:string`
- Update migration

```
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Seasons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Seasons');
  }
};
```
	
- Migrate it. 
	`sequelize db:migrate`
- Generate seed file
	`sequelize seed:generate --name demo-seasons`
- Add some seed data it in, mainly season names. 
	
```
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Seasons', [
        {
          name:'Summer'
        },
        {
          name:'Winter'
        },
        {
          name:'Spring'
        },
        {
          name: 'Autumn'
        } 
      ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Seasons', null, {});
  }
};
```
	
- Seed the data- 
	`sequelize db:seed --seed <xxxxxxxxxxx-demo-seasons.js>`
- Verify that data is seeded into the database
	
```
fruits_dev=# select * from "Seasons";
 id |  name  |         createdAt          |         updatedAt          
----+--------+----------------------------+----------------------------
  1 | Summer | 2020-09-29 08:41:24.678-07 | 2020-09-29 08:41:24.678-07
  2 | Winter | 2020-09-29 08:41:24.678-07 | 2020-09-29 08:41:24.678-07
  3 | Spring | 2020-09-29 08:41:24.678-07 | 2020-09-29 08:41:24.678-07
  4 | Autumn | 2020-09-29 08:41:24.678-07 | 2020-09-29 08:41:24.678-07
(4 rows)
```

Now that you have your `Season` model setup, we will create the model for our join table.


### Join Table

Generate model,

`sequelize model:create --name SeasonFruit --attributes fruitId:integer,seasonId:integer`


`SeasonFruit` model will look like,

```
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SeasonFruit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  SeasonFruit.init({
    fruitId: DataTypes.INTEGER,
    seasonId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SeasonFruit',
  });
  return SeasonFruit;
};
```

Update the migration file,

```
'use strict';module.exports = {  up: (queryInterface, Sequelize) => {    return queryInterface.createTable('SeasonFruits', {      id: {        allowNull: false,        autoIncrement: true,        primaryKey: true,        type: Sequelize.INTEGER      },      fruitId: {        type: Sequelize.INTEGER,        allowNull: false      },      seasonId: {        type: Sequelize.INTEGER,        allowNull: false      },      createdAt: {        allowNull: false,        defaultValue: new Date(),        type: Sequelize.DATE      },      updatedAt: {        allowNull: false,        defaultValue: new Date(),        type: Sequelize.DATE      }    },    {      uniqueKeys: {          actions_unique: {              fields: ['fruitId', 'seasonId']          }      }    });  },  down: (queryInterface, Sequelize) => {    return queryInterface.dropTable('SeasonFruits');  }};
``` 	

Run the migration file `sequelize db:migrate`

Update `Fruit` model,

```
static associate(models) {
  Fruit.belongsTo(models.User, { foreignKey: 'userId' });
  Fruit.belongsToMany(models.Season, {
    through: "SeasonFruit",
    foreignKey: "fruitId",
    otherKey: "seasonId",
  });
}
```

Update `Season` model,

```
static associate(models) {
  Season.belongsToMany(models.Fruit, {
    through: "SeasonFruit",
    foreignKey: "seasonId",
    otherKey: "fruitId",
  });
}
```

### Update Fruit Controller to display all seasons while editing the fruit,

```
const renderEdit = (req, res) => {    Fruit.findByPk(req.params.index)    .then(foundFruit => {        Season.findAll()        .then(allSeasons => {            res.render('edit.ejs', {                fruit: foundFruit,                seasons: allSeasons            });        })    })}
```

Update the `edit.ejs` view.

```
<select name="season">	<% for ( let i = 0; i < seasons.length; i++ ) {
		let selected = ( i == 0 ) ? "selected" : "";
	%>
		<option value="<%=seasons[i].id%>" <%=selected%>><%=seasons[i].name%>
		</option>   <% } %></select>
```

Now update `editFruit` controller to save the season in join table.

```
const editFruit = (req, res) => {    if(req.body.readyToEat === 'on'){        req.body.readyToEat = true;    } else{        req.body.readyToEat = false;    }    Fruit.update(req.body, {        where: {id: req.params.index},        returning: true    })    .then(updatedFruit => {        Season.findByPk(req.body.season)        .then(foundSeason => {            Fruit.findByPk(req.params.index)            .then(foundFruit => {                foundFruit.addSeason(foundSeason);                res.redirect('/fruits');            })                    })    })}
```

### Show which fruit is eaten in what season

`controllers/fruits.js`

```
const show = (req, res) => {    Fruit.findByPk(req.params.index, {        include : [            {            model: User,            attributes: ['name']            },            {                model: Season            }        ],        attributes: ['name', 'color', 'readyToEat']    })    .then(foundFruit => {        res.render('show.ejs', {            fruit: foundFruit        });    })}
```

`show.ejs`

```
	<h3>It is available in Seasons:</h3>    <% for (let i=0; i< fruit.Seasons.length; i++){ %>        <li>           <%=fruit.Seasons[i].name%>        </li>        <br>    <% } %>
```


<!--
### We Do
	

<summary>Has Many Through</summary>
## hasManyThrough

[Docs](https://sequelize.readthedocs.io/en/latest/docs/associations/#belongs-to-many-associations)

1. `sequelize model:generate --name Walker --attributes name:string,gender:string`
2. `sequelize migration:generate --name add-walker-id-and-pet-id-to-owners`

	```js
	'use strict';

	module.exports = {
	  up: (queryInterface, Sequelize) => {
	    return queryInterface.addColumn('Owners', 'petId', { type: Sequelize.INTEGER })
	      .then(() => {
	        return queryInterface.addColumn('Owners', 'walkerId', { type: Sequelize.INTEGER });
	      })
	  },
	
	  down: (queryInterface, Sequelize) => {
	    /*
	      Add reverting commands here.
	      Return a promise to correctly handle asynchronicity.
	
	      Example:
	      return queryInterface.dropTable('users');
	    */
	  }
	};
	```
	
1. `sequelize db:migrate`

2. Add the new fields to the Owner model.

	```js
	'use strict';
	module.exports = (sequelize, DataTypes) => {
	  const Owner = sequelize.define('Owner', {
	    firstName: DataTypes.STRING,
	    lastName: DataTypes.STRING,
	    petId: DataTypes.INTEGER,
	    walkerId: DataTypes.INTEGER
	  }, {});
	  Owner.associate = function (models) {
	    Owner.hasMany(models.Pet, { foreignKey: 'ownerId' })
	  };
	  return Owner;
	};
	``` 
	
1. Add an association to the Walker file.

1. `sequelize seed:generate --name demo-walkers`

	```js
	'use strict';
	
	module.exports = {
	  up: (queryInterface, Sequelize) => {
	    return queryInterface.bulkInsert('Walkers', [
	      {
	        name: 'Walker 1',
	        createdAt: new Date(),
	        updatedAt: new Date()
	      },
	      {
	        name: 'Walker 2',
	        createdAt: new Date(),
	        updatedAt: new Date()
	      }], {});
	  },
	
	  down: (queryInterface, Sequelize) => {
	    /*
	      Add reverting commands here.
	      Return a promise to correctly handle asynchronicity.
	
	      Example:
	      return queryInterface.bulkDelete('People', null, {});
	    */
	  }
	};	
	```
	
1. `demo-owners`

	```js
	'use strict';

	module.exports = {
	  up: (queryInterface, Sequelize) => {
	    return queryInterface.bulkInsert('Owners', [
	      {
	        firstName: 'Marc',
	        lastName: 'Wright',
	        createdAt: new Date(),
	        updatedAt: new Date(),
	        walkerId: 1,
	        petId: 1
	      },
	      {
	        firstName: 'Schmitty',
	        lastName: 'McGoo',
	        createdAt: new Date(),
	        updatedAt: new Date(),
	        walkerId: 1,
	        petId: 2
	      }], {});
	  },
	
	  down: (queryInterface, Sequelize) => {
	    /*
	      Add reverting commands here.
	      Return a promise to correctly handle asynchronicity.
	
	      Example:
	      return queryInterface.bulkDelete('People', null, {});
	    */
	  }
	};
	```

1. `dropdb pets_app_development`
2. `createdb pets_app_development` 
3. `sequelize db:migrate`
4.  `sequelize db:seed:all`

#### Add index route for walkers

1. `routes/walkers.js`

	```js
	const express = require('express');
	const router = express.Router()
	const Walker = require('../models').Walker
	const Pet = require('../models').Pet
	
	// INDEX FOR ALL OWNERS
	router.get('/', (req, res) => {
	  Walker.findAll({
	    include: [{
	      model: Pet,
	      attributes: ['name', 'breed', 'age']
	    }]
	  })
	    .then(walkers => {
	      res.json({ walkers })
	    })
	})
	
	module.exports = router;
	```

1. `app.js`

	```js
	app.use('/api/walkers', require('./routes/walkers'));
	```
	
1. `localhost:3000/api/walkers`

	![](https://i.imgur.com/yVwTazi.png)
	
#### Return walkers for pet index route

1. `routes/pets.js`

	```js
	const Pet = require('../models').Pet;
	const Walker = require('../models').Walker;
	
	// ALL THE PETS
	router.get('/', (req, res) => {
	  Pet.findAll({
	    include: [{
	      model: Walker,
	      attributes: ['name']
	    }]
	  })
	    .then(pets => {
	      res.json({ pets: pets })
	    })
	})
	```
		
	
1. `localhost:3000/api/pets`

	![](https://i.imgur.com/iSFYcDE.png)


<br>

## Doctor App

1. `mkdir doctor-app`
2. `cd doctor-app`
3. `express backend --no-views --git`
4. `cd backend`
5. `code .`
6. `npm install pg sequelize nodemon`
7. `npm install`
2. `sequelize init`
1. `sequelize model:generate --name Appointment --attributes reason:string,doctorId:integer,patientId:integer`
2. `sequelize model:generate --name Patient --attributes name:string`
3. `sequelize model:generate --name Doctor --attributes name:string,specialty:string`
4. `config/config.json`

	```js
	{
	  "development": {
	    "database": "doctor_app_development",
	    "host": "127.0.0.1",
	    "dialect": "postgres",
	    "operatorsAliases": false
	  },
	  "test": {
	    "database": "doctor_app_test",
	    "host": "127.0.0.1",
	    "dialect": "postgres",
	    "operatorsAliases": false
	  },
	  "production": {
	    "database": "doctor_app_production",
	    "host": "127.0.0.1",
	    "dialect": "postgres",
	    "operatorsAliases": false
	  }
	}
	```
1. `createdb doctor_app_development`
2. `sequelize db:migrate`
3. `sequelize seed:generate --name demo-doctors-patients-appointments`

	```js
	'use strict';

	module.exports = {
	  up: (queryInterface, Sequelize) => {
	    return queryInterface.bulkInsert('Doctors', [
	      {
	        name: 'John Doe',
	        specialty: 'Dentist',
	        createdAt: new Date(),
	        updatedAt: new Date()
	      },
	      {
	        name: 'Schmitty Footman',
	        specialty: 'Podiatrist',
	        createdAt: new Date(),
	        updatedAt: new Date()
	      }
	    ], {})
	      .then(() => {
	        return queryInterface.bulkInsert('Patients', [
	          {
	            name: 'Patient 1',
	            createdAt: new Date(),
	            updatedAt: new Date()
	          }, {
	            name: 'Patient 2',
	            createdAt: new Date(),
	            updatedAt: new Date()
	          }
	        ], {})
	      })
	      .then(() => {
	        return queryInterface.bulkInsert('Appointments', [
	          {
	            reason: 'Teeth stuff',
	            doctorId: 1,
	            patientId: 1,
	            createdAt: new Date(),
	            updatedAt: new Date()
	          },
	          {
	            reason: 'Foot stuff',
	            doctorId: 2,
	            patientId: 2,
	            createdAt: new Date(),
	            updatedAt: new Date()
	          }
	        ], {})
	      })
	  },
	
	  down: (queryInterface, Sequelize) => {
	    /*
	      Add reverting commands here.
	      Return a promise to correctly handle asynchronicity.
	
	      Example:
	      return queryInterface.bulkDelete('People', null, {});
	    */
	  }
	};
	```
	
1. `models/doctor.js`

	```js
	'use strict';
	module.exports = (sequelize, DataTypes) => {
	  const Doctor = sequelize.define('Doctor', {
	    name: DataTypes.STRING,
	    specialty: DataTypes.STRING
	  }, {});
	  Doctor.associate = function (models) {
	    Doctor.belongsToMany(models.Patient, { through: 'Appointments', foreignKey: 'doctorId' })
	  };
	  return Doctor;
	};	
	```

1. `models/patient.js`

	```js
	'use strict';
	module.exports = (sequelize, DataTypes) => {
	  const Patient = sequelize.define('Patient', {
	    id: {
	      type: DataTypes.INTEGER,
	      primaryKey: true
	    },
	    name: DataTypes.STRING
	  }, {});
	  Patient.associate = function (models) {
	    Patient.belongsToMany(models.Doctor, { through: 'Appointments', foreignKey: 'patientId' })
	  };
	  return Patient;
	};
	```

1. `routes/index.js`

	```js
	var express = require('express');
	var router = express.Router();
	
	const Patient = require('../models').Patient
	const Doctor = require('../models').Doctor
	const Appointment = require('../models').Appointment
	
	router.get('/patients', (req, res) => {
	  Patient.findAll({
	    include: [{
	      model: Doctor,
	      attributes: ['name', 'specialty']
	    }]
	  })
	    .then(patients => {
	      res.json({ patients })
	    })
	})
	
	router.get('/doctors', (req, res) => {
	  Doctor.findAll({
	    include: [{
	      model: Patient,
	      attributes: ['name']
	    }]
	  })
	    .then(doctors => {
	      res.json({ doctors })
	    })
	})
	
	router.get('/appointments', (req, res) => {
	  Appointment.findAll()
	    .then(appointments => {
	      res.json({ appointments })
	    })
	})
	module.exports = router;
	```

	![](https://i.imgur.com/h5anR3n.png)

</details>
-->