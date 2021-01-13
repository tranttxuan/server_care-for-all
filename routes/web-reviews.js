const express = require('express');
const WebReview = require('../models/WebReview');
const router = express.Router();

//GET all reviews
router.get("/", (req, res, next) => {
      WebReview.find()
            .then(list => res.status(200).json(list))
            .catch(err => res.status(500).json(err))
});

router.post("/", requireAuth, (req, res, next) => {
      req.body.sender = req.session.currentUser;

      WebReview.create(req.body)
            .then(review => res.status(200).json(review))
            .catch(err => res.status(500).json(err))
})
module.exports = router;