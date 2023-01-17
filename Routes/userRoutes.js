const express = require("express");
const router  = express.Router();
const userController = require("../Controller/userController");
const jwt = require("../Middlewares/jwt");

router
    .route("/")
    .get(userController.getAllUser)
    .post(userController.createUser);

router
    .post('/login/:userId', jwt.encode, (req, res, next) => {
      return res.status(200).json({
          success: true,
          authorization: req.authToken,
        });
    });

router
    .route("/favourite")
    .get(userController.getFavourite)

router
    .route("/:id")
    .get(userController.getUser)
    .patch(userController.updateUser)
router
    .route("/favourite/:id")
    .patch(userController.updateFavourite)


module.exports = router;