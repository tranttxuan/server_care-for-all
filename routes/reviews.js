const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const requireAuth = require("../middlewares/requireAuth");

//Get all reviews for a user
router.get("/:idReceiver", (req, res, next) => {
      User.findOne({ _id: req.params.idReceiver }, { reviews: 1, _id: 0 })
            .populate({
                  path:'reviews',
                  populate:{
                        path:'sender',
                        model:'User',
                        select:'firstName'
                  }
            })
            .then(list => { res.status(200).json(list) })
            .catch(err => res.status(500).json(err))

});

//Post a review of a provider
router.post("/create/:idReceiver", requireAuth, (req, res, next) => {
      req.body.sender = req.session.currentUser;

      if (req.params.idReceiver !== req.session.currentUser) {
            Review.create(req.body)
                  .then(review => {
                        console.log(review._id)
                        User.findByIdAndUpdate(req.params.idReceiver, { $push: { reviews: review._id } })
                              .then(response => res.status(200).json({ message: "Successfully added a review" }))
                              .catch(err => res.status(500).json(err))
                  })
                  .catch(err => res.status(500).json(err))
      } else {
            res.status(200).json({ message: "Should not post a self-review " })
      }


})

module.exports = router;