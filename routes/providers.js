const express = require('express');
const User = require('../models/User');
const router = express.Router();

/* GET users who are providers */
router.get('/:service', (req, res, next) => {
        const service = req.params.service;
        // *********how to use***************
        // User.find({ `service.${req.params.service}`: true })
        //         .then(list => {
        //                 res.status(200).json(list)
        //         })
        //         .catch(err => res.status(400).json(err))

        if (service === "childCare") {
                User.find({$and : [{ "service.childCare": true }, {isProvider:true}]})
                        .then(list => {res.status(200).json(list) })
                        .catch(err => res.status(500).json(err))
                return;
        } else if (service === "childCare") {
                User.find({$and : [{ "service.seniorCare": true }, {isProvider:true}]})
                        .then(list => {res.status(200).json(list)})
                        .catch(err => res.status(500).json(err))
                return;
        }else{
                User.find({$and : [{ "service.petCare": true }, {isProvider:true}]})
                        .then(list => {res.status(200).json(list)})
                        .catch(err => res.status(500).json(err))
                return;
        }
});

//GET a single user
router.get("/one/:idUser",(req, res, next)=>{
        User.findById(req.params.idUser)
        .then(user => {res.status(200).json(user)})
        .catch(err => res.status(500).json(err))
})
module.exports = router;
