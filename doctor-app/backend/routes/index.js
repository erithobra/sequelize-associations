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
