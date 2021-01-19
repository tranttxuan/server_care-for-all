const express = require('express');
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");
const Announcement = require('../models/Announcement');


//GET All announcements
router.get("/", (req, res, next) => {
        Announcement.find()
                .then(list => { res.status(200).json(list) })
                .catch(err => res.status(500).json(err))
});

//GET announcements by service
router.get("/:service", (req, res, next) => {
        const service = req.params.service;

        if (service === "childCare") {
                Announcement.find({ "service.childCare": true })
                        .then(list => { res.status(200).json(list) })
                        .catch(err => res.status(500).json(err))
                return;
        } else if (service === "seniorCare") {
                Announcement.find({ "service.seniorCare": true })
                        .then(list => { res.status(200).json(list) })
                        .catch(err => res.status(500).json(err))
                return;
        } else {
                Announcement.find({ "service.petCare": true })
                        .then(list => { res.status(200).json(list) })
                        .catch(err => res.status(500).json(err))
                return;
        }
});

//GET by author
router.get("/author/:id", requireAuth, (req, res, next) => {
        if (req.params.id === req.session.currentUser) {
                Announcement.find({ author: req.params.id }, { createdAt: 1, title: 1, applicants: 1 })
                        .populate({ path: 'applicants', select: 'firstName lastName' })
                        .then(list => {
                                console.log(list)
                                res.status(200).json(list)
                        })
                        .catch(err => res.status(500).json(err))
        } else {
                res.status(200).json({ message: "You are not allowed to get these documents" });
                return;
        }

})

//GET a specific announcement
router.get("/one/:idAnnouncement", (req, res, service) => {
        Announcement.findById(req.params.idAnnouncement)
                .populate('author', 'firstName lastName  formattedAddress location image bookingList')
                .then(announcement => { res.status(200).json(announcement) })
                .catch(err => res.status(500).json(err))
})

//Create an announcement
router.post("/new", requireAuth, (req, res, next) => {
        req.body.author = req.session.currentUser;

        Announcement.create(req.body)
                .then(announcement => res.status(200).json(announcement))
                .catch(err => console.res.status(500).json({ message: 'Failure to create an announcement' }));
});

//Update an announcement
router.patch("/update/:idAnnouncement", requireAuth, (req, res, next) => {

        //user is announcement owner?
        Announcement.findOne({ _id: req.params.idAnnouncement }, { author: 1, _id: 0 })
                .then(announcement => {
                        if (!announcement) {
                                return res.status(200).json({ message: "Announcement not found" });
                        }

                        if (announcement.author.toString() !== req.session.currentUser) {
                                res.status(200).json({ message: "You are not allowed to update this document" });
                                return;
                        };
                        //update
                        Announcement.findByIdAndUpdate(req.params.idAnnouncement, req.body, { new: true })
                                .then(updated => res.status(200).json(updated))
                                .catch(err => res.status(500).json({ message: 'Failure to update this announcement' }));
                })
                .catch(err => res.status(500).json({ message: 'Failure to find documents' }));
});

//Delete an announcement
router.delete("/delete/:idAnnouncement", requireAuth, (req, res, next) => {

        //user is announcement owner?
        Announcement.findOne({ _id: req.params.idAnnouncement }, { author: 1, _id: 0 })
                .then(announcement => {
                        if (!announcement) {
                                return res.status(200).json({ message: "Announcement not found" });
                        }

                        if (announcement.author.toString() !== req.session.currentUser) {
                                res.status(200).json({ message: "You are not allowed to delete this document" });
                                return;
                        };
                        //delete
                        Announcement.findByIdAndDelete(req.params.idAnnouncement)
                                .then(del => res.status(200).json({ message: "Successfully deleted this announcement" }))
                                .catch(err => res.status(500).json({ message: 'Failure to delete this announcement' }));
                })
                .catch(err => res.status(500).json({ message: "Failure to find documents" }));

});

//POST APPLY FOR A JOB
router.post("/apply/:idAnnouncement", requireAuth, (req, res, next) => {
        Announcement
                .findByIdAndUpdate(req.params.idAnnouncement, { $addToSet: { applicants: req.session.currentUser } }, { new: true })
                .then(response => {
                        console.log(response)
                        res.status(200).json(response)
                })
                .catch(err => res.status(500).json(err))
})

//POST CANCEL FOR A JOB
router.post("/no-apply/:idAnnouncement", requireAuth, (req, res, next) => {
        Announcement
                .findByIdAndUpdate(req.params.idAnnouncement, { $pull: { applicants: req.session.currentUser } }, { new: true })
                .then(response => {
                        console.log(response)
                        res.status(200).json(response)
                })
                .catch(err => res.status(500).json(err))
})

module.exports = router;