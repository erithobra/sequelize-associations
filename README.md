# Sequelize Associations and Validations

## Objectives

- Implement a hasMany/belongsTo association between `Owner` and `Pet`
- Return all pets belonging to an owner in the INDEX route
- Create a migration for `ownerId` in the `Pets` table
- Add a validation to `Pet`
- Limit the fields that are returned from the database.

<br>

## Intro

Last week we built a `pets-app`. Eventually, we added Postgres and Sequelize to the app. Today we will use Sequelize associate that an `Owner` `hasMany` instances of a `Pet` and that a `Pet` `belongsTo` an `Owner`.

We'll also use this as an opportunity to review migrations and introduce Sequelize model validations.

Here are the rough steps we'll follow:

- Add an `ownerId` foreign key column to the `Pets` table
- Re-seed our database so that our starter pets have a foreign key.
- Define the Sequelize associations in the `Pet` and `Owner` models.
- Update our Express `api/owners` INDEX route to include all the pets that belong to an owner.	

<br>


## `hasMany`/`belongsTo` - Sequelize Stuff


1. Create a migration file to add `ownerId` to the `Pets` table.

	```bash
	sequelize migration:generate --name add-ownerId-to-pets
	```

2. Inside the file, add come code to add the column to the table.

	```bash
	  up: (queryInterface, Sequelize) => {
	    return queryInterface.addColumn('Pets', 'ownerId', { type: Sequelize.INTEGER });
	  },
	``` 

3. Run `db:migrate` to run the new migration file.

4. In the `models/pet.js`, make sure to add the new column so that our app knows about it.

	```js
	 const Pet = sequelize.define('Pet', {
	    name: DataTypes.STRING,
	    breed: DataTypes.STRING,
	    age: DataTypes.INTEGER,
	    ownerId: DataTypes.INTEGER
	  }, {});
  	```

1. Let's reseed the `seeders/<TIMESTAMP>-demo-pets.js` with a some owner ids.

	```js
	'use strict';

	module.exports = {
	  up: (queryInterface, Sequelize) => {
	    return queryInterface.bulkDelete('Pets', null, {})
	      .then(() => {
	        return queryInterface.bulkInsert('Pets', [
	          {
	            name: 'Diesel',
	            breed: 'Terrier',
	            age: 2,
	            ownerId: 1,
	            createdAt: new Date(),
	            updatedAt: new Date()
	          }, {
	            name: 'Timmy',
	            breed: 'cat',
	            age: 2,
	            ownerId: 1,
	            createdAt: new Date(),
	            updatedAt: new Date()
	          }, {
	            name: 'Crowley',
	            breed: 'black',
	            age: 2,
	            ownerId: 2,
	            createdAt: new Date(),
	            updatedAt: new Date()
	          }
	        ], {});
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
1. Run `sequelize db:seed:all`
4. In the `models/owner.js` file, add the association for an `Owner.hasMany(models.Pet)`.

	```js
	  Owner.associate = function (models) {
	 	 Owner.hasMany(models.Pet, { foreignKey: 'ownerId' })
	  };
	``` 
5. In the `models/pet.js` file, add the association for a `Pet.belongsTo(models.Owner)`.

```js
  Pet.associate = function (models) {
    Pet.belongsTo(models.Owner, { foreignKey: 'ownerId' })
  };
``` 

<br>

## `hasMany`/`belongsTo` - Express Route Stuff

1. In `routes/owner.js`, let's update the owner INDEX route to also return the owner's pets:

	```js
	const express = require('express');
	const router = express.Router()
	const Owner = require('../models').Owner
	const Pet = require('../models').Pet
	
	// INDEX FOR ALL OWNERS
	router.get('/', (req, res) => {
	  Owner.findAll({
	    include: [{ model: Pet }]
	  })
	    .then(owners => {
	      res.json({ owners })
	    })
	})
	
	module.exports = router;
	```

	![](https://i.imgur.com/xyj84tM.png)

1. What if we don't need all the extra fields like `id`, `createdAt` or `updatedAt`? We can trim our response object and define only what we want returned with an `attributes` Array.

	```js
	  router.get('/', (req, res) => {
		  Owner.findAll({
		    include: [{
		      model: Pet,
		      attributes: ['name', 'breed', 'age'] //PET FIELDS
		    }],
		    attributes: ['firstName', 'lastName'] // OWNER FIELDS
		  })
		    .then(owners => {
		      res.json({ owners })
		    })
		})
	```
	
	![](https://i.imgur.com/MqIAB7E.png)
	
<br>

## Validations

[Sequelize Validations](https://sequelize.readthedocs.io/en/latest/docs/models-definition/#validations)

<br>


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
