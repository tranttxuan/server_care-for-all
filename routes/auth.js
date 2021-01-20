const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const requireAuth = require("../middlewares/requireAuth");
const upload = require("../config/cloundinary-setup");

const salt = 10;

//LOGIN
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: "Invalid email. Try again" });
      }

      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid password. Try again" });
      }

      req.session.currentUser = user._id;
      res.redirect("/api/auth/isLoggedIn");
    })
    .catch(next);
});

//SIGNUP
router.post("/signup", (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  console.log(req.body)

  if (!email || !password) {
    res.status(400).json({ message: 'Provide username and password' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test((password))) {
    res.status(200).json({ message: 'Please make your password at least 6 characters, that contains at least one uppercase, one lowercase and one number digit in it, for security purposes.' });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ message: "Email already taken" });
      }

      const hashedPassword = bcrypt.hashSync(password, salt);
      const newUser = { email, lastName, firstName, password: hashedPassword };

      User.create(newUser)
        .then((newUser) => {
          /* Login on signup */
          req.session.currentUser = newUser._id;
          res.redirect("/api/auth/isLoggedIn");
        })
        .catch(next);
    })
    .catch(next);
});


// //GET PROFILE
router.get("/profile", requireAuth, (req, res, next) => {
  User.findById(req.session.currentUser)
    .populate("favoriteProviders", "lastName firstName image")
    .populate("bookingList", "lastName firstName image")
    .then(list => {
      console.log(list)
      res.status(200).json(list)
    })
    .catch(err => res.status(500).json(err))
})


//UPDATE PROFILE
router.patch("/update", requireAuth, upload.single("image"), (req, res, next) => {
  if (req.file) {
    req.body.user.image = req.file.path;
    // console.log("image is here",req.file.path,   req.body.image)
  }
  //check if new email is unique
  User.findById(req.session.currentUser).select("email")
    .then(user => {
      if (req.body.user.email !== user.email) {
        return res.status(200).json({ message: "Email already taken" })
      }
    })
    .catch(next);

  // encrypt password
  if (req.body.user.password) {
    //check password
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test((req.body.user.password))) {
      res.status(200).json({ message: 'Please make your password at least 6 characters, that contains at least one uppercase, one lowercase and one number digit in it, for security purposes.' });
      return;
    }

    const hashedPassword = bcrypt.hashSync(req.body.user.password, salt);
    req.body.user.password = hashedPassword
  }

  console.log("send to database", req.body.user)
  User.findByIdAndUpdate(req.session.currentUser, req.body.user, { new: true })
    .select("-password")
    .then(updatedUser => {
      res.status(200).json(updatedUser)
    })
    .catch(err => res.status(500).json(err))
})

//CHECK is Logged in
router.get("/isLoggedIn", (req, res, next) => {
  console.log(req.session.currentUser, "iam here")
  if (!req.session.currentUser)
    return res.status(401).json({ message: "Unauthorized" });

  User.findById(req.session.currentUser)
    .select("-password")
    .then((userDocument) => {
      res.status(200).json(userDocument);
    })
    .catch(next);
});

//LOGOUT
router.delete("/logout", (req, res, next) => {
  if (req.session.currentUser) {
    req.session.destroy((err) => {
      if (err) res.status(500).json(err);
      res.status(200).json({ message: "Successfully disconnected." });
    });
  } else {
    res.status(200).json({ message: "no session" });
  }
});

module.exports = router;
