const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const { email, name, password } = req.body;

    let existingUser;
    try {
        existingUser = User.findOne({ email: email })
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again.',
            500
        );
        return next(error);
    }

    if(existingUser) {
        const error = new HttpError(
            'User exists already, please login instead',
            422
        )
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError(
            'Could not create user, please try again.',
            500
        );
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        password: hashedPassword,
        profilePic: req.file.path.replace(/\\/g, "/"),
        posts: []
    });

    try {
        await createdUser.save();
    } catch(err) {
        const error = new HttpError(
            'Signing up failed, please try again.',
            500
        );
        return next(error);
    }

    let token;

    try {
    token = jwt.sign({userId: createdUser.id, email: createdUser.email }, 
        'supersecret_dont_share', 
        {expiresIn: '1h'}
        );
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ user: createdUser, token: token });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch(err) {
        const error = new HttpError(
            'Logging in failed, please try again.',
            500
        );
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError(
        "Could not log you in, please check your credentials and try again.",
        500)
    }

    if (!isValidPassword) {
        const error = new HttpError(
            'Invalid credentials, could not log you in',
            403
        );
        return next(error);
    }

    if(!existingUser) {
        const error = new HttpError(
            'Invalid credentials, unable to log you in.',
            403
        );
        return next(error);
    }

    let token;

    try {
    token = jwt.sign({userId: existingUser.id, email: existingUser.email }, 
        'supersecret_dont_share', 
        {expiresIn: '1h'}
        );
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again.',
            500
        );
        return next(error);
    }

    res.json({
    user: existingUser,
    token: token
});
};

exports.signup = signup;
exports.login = login;