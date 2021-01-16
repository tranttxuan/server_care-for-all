const express = require('express');
const requireAuth = require('../middlewares/requireAuth');
const router = express.Router();
const User = require('../models/User');

// GET ALL PROVIDERS 
router.get('/', (req, res, next) => {
        User.find({ isProvider: true })
                .then(list => { res.status(200).json(list) })
                .catch(err => res.status(500).json(err))
})

// GET providers by service 
router.get('/:service', (req, res, next) => {
        const service = req.params.service;
        // *********how to use***************
        // User.find({ `service.${req.params.service}`: true })
        //         .then(list => {
        //                 res.status(200).json(list)
        //         })
        //         .catch(err => res.status(400).json(err))

        if (service === "childCare") {
                User.find({ $and: [{ "service.childCare": true }, { isProvider: true }] })
                        .then(list => { res.status(200).json(list) })
                        .catch(err => res.status(500).json(err))
                return;
        } else if (service === "childCare") {
                User.find({ $and: [{ "service.seniorCare": true }, { isProvider: true }] })
                        .then(list => {
                                console.log(list)
                                res.status(200).json(list)
                        })
                        .catch(err => res.status(500).json(err))
                return;
        } else {
                User.find({ $and: [{ "service.petCare": true }, { isProvider: true }] })
                        .then(list => { res.status(200).json(list) })
                        .catch(err => res.status(500).json(err))
                return;
        }
});


//GET a single user
router.get("/one/:idUser", (req, res, next) => {
        User.find({ $and: [{ _id: req.params.idUser }, { isProvider: true }] })
                .then(user => {
                        if (user.length === 0) res.status(200).json("User does not share his profile")
                        else res.status(200).json(user)
                })
                .catch(err => res.status(500).json(err))
});

//POST add a provider to favorite list of the user
router.post("/favorite/:idProvider", requireAuth, (req, res, next) => {
        if (req.params.idProvider === req.session.currentUser) {
                return res.status(200).json({ message: "Of course you are in your favorite list!" })
        };
      
        User.findByIdAndUpdate(req.session.currentUser, { $addToSet: { favoriteProviders: req.params.idProvider } }, { new: true })
                .then(response => {
                        console.log("here", response.favoriteProviders)
                        res.status(200).json({ message: "Successfully added this provider to your favorite list" })
                })
                .catch(err => res.status(500).json(err));
});

//DELETE a provider in the user's favorite list
router.post("/no-favorite/:idProvider", requireAuth, (req, res, next) => {
        User.findByIdAndUpdate(req.session.currentUser, { $pull: { favoriteProviders: req.params.isProvider } })
                .then(response => res.status(200).json({ message: "Successfully deleted this provider to your favorite list" }))
                .catch(err => res.status(500).json(err));
})

module.exports = router;
