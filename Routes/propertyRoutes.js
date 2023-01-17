const express = require("express");
const router = express.Router();
const multer = require("multer");
const propertyController = require("../Controller/propertyController");
const userController = require("../Controller/userController");
const AppError = require("../utils/AppError")

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload only images', 400), false);
    }
  };

const multerStorage = multer.memoryStorage();
const upload = multer({
    storage:multerStorage,
    fileFilter:multerFilter
})

const cpUpload = upload.fields([{name:'imageCover',maxCount:1},{name:'images',maxCount:8}]);

router
    .route("/")
    .get(propertyController.getAllProperties)
    .post(cpUpload,propertyController.createProperty,userController.addPostCreatedId);

router
    .route("/images/:id").get(propertyController.getPropertyImages);

router
    .route("/:id")
    .get(propertyController.getProperty)
    .patch(cpUpload,propertyController.updateProperty)
    .delete(userController.removePostCreatedId,propertyController.deleteProperty);
router
    .route("/nearest")
    .post(propertyController.getNearest)

module.exports = router;