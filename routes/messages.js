const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const Message = require("../models/Message");
const router = express.Router();

//POST create a message
router.post("/", requireAuth, (req, res, next) => {
      // console.log(req.body)
      const { receiver, sender, message, announcement } = req.body;
      let messagesBox = []
      messagesBox.push({
            author: req.session.currentUser,
            message: message
      })

      if(sender === receiver){
            return res.status(400).json({message:"Your are sending a message to yourself!"})
      }
     
      Message.findOne({ $and: [{sender}, {receiver}, {announcement}] })
            .then(response => {
                  console.log(response)
                  if (response) {
                        Message
                              .findByIdAndUpdate(response._id, {
                                    $push: {
                                          messagesBox: {
                                                author: req.session.currentUser,
                                                message: message
                                          }
                                    }
                              }, { new: true }
                              )
                              .populate("sender receiver announcement")
                              .then(response => res.status(200).json(response))
                              .catch(err => res.status(400).json({message:"Failure to add message in your conversation"}))
                  } else {
                        console.log({receiver, sender, announcement, messagesBox})
                        Message.create({receiver, sender, announcement, messagesBox})
                              .then(response => res.status(200).json(response))
                              .catch(err => {res.status(400).json({message:"Failure to send message"})})
                  }
            })
});

//GET messages between 2 users
router.get("/message/:idUser", requireAuth, (req, res, next) => {
      Message.findOne({ $or: [{ sender: idUser }, { receiver: idUs }] })
            .populate("sender receiver announcement")
            .then(response => res.status(200).json(response))
            .catch(err => res.status(400).json("Failure to add message in your conversation"))
})

//UPDATE message box
router.patch("/add/:idMessage", requireAuth, (req, res, next) => {
      console.log(req.body)
      Message.findByIdAndUpdate(req.params.idMessage, {
            $push: {
                  messagesBox: {
                        author: req.session.currentUser,
                        message: req.body.addMessage
                        // message:req.body
                  }
            }
      }, { new: true })
            .populate("sender receiver announcement")
            .then(response => res.status(200).json(response))
            .catch(err => res.status(400).json("Failure to add message in your conversation"))
})


//DELETE a message
router.delete("/:idMessage", requireAuth, (req, res, next) => {
      Message.findByIdAndRemove(req.params.idMessage)
            .then(response => res.status(200).json(response))
            .catch(err => res.status(400).json("Failure to add message in your conversation"))
})

module.exports = router;