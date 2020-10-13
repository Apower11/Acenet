const express = require("express");
const { check } = require("express-validator");
const usersController = require("../controllers/users-controller");
const router = express.Router();
const fileUpload = require("../middleware/file-upload");

router.post(
    '/signup',
    fileUpload.single('profilePic'),
    [
        check('name')
        .not()
        .isEmpty(),
        check('email')
            .normalizeEmail()
            .isEmail(),
        check('password')
        .isLength({ min: 6 })
        .isAlphanumeric()
    ], usersController.signup)

    router.post('/login', usersController.login);

    module.exports = router;