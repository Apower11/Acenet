const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const fs = require("fs");

const Post = require("../models/post");
const User = require("../models/user");
const HttpError = require("../models/http-error");

const getPosts = async (req, res, next) => {
    let posts;
    try {
        posts = await Post.find();
    } catch (err) {
        const error = new HttpError(
            'Fetching posts failed, please try again.',
            500
        );
        return next(error);
    }
    res.json({posts: posts.map(post => post.toObject({ getters: true }))});
}

const getPostsByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    // let posts
    let userWithPosts;
    try {
        userWithPosts = await User.findById(userId).populate('posts');
    } catch (err) {
        const error = new HttpError(
            'Fetching posts failed, please try again.',
            500
        );
        return next(error);
    }

    if(!userWithPosts) {
        return next(
            new HttpError('Could not find posts for this user.', 404)
        );
    } else if(userWithPosts && userWithPosts.length === 0) {
        return next(
            new HttpError('You have not made any posts yet, why not make one now?', 404)
        );
    }

    res.json({
        posts: userWithPosts.posts.map(post => 
            post.toObject({ getters: true })
        )
    });
};

const createPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next (
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { caption, author, profilePic, authorName } = req.body;

    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    let date = new Date();

    let uploadTime = date.getDate().toString() + ' ' + months[date.getUTCMonth()];

    const createdPost = new Post({
        caption,
        picture: req.file.path.replace(/\\/g, "/"),
        uploadTime,
        author,
        profilePic,
        authorName
    });

    let user;
    try {
        user = await User.findById(author);
    } catch (err) {
        const error = new HttpError('Creating a post failed, please try again', 500);
        return next(error);
    }

    if(!user) {
        const error = new HttpError('Could not find user for the provided id', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPost.save({ session: sess });
        user.posts.push(createdPost);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Creating post failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ post: createdPost});
}

const updatePost = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data', 422)
        )
    }

    const { caption, oldPicture } = req.body;
    const postId = req.params.pid;

    let post;
    try {
        post = await Post.findById(postId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find post to update.',
            500
        );
        return next(error);
    }

    if(post.author.toString() !== req.userData.userId) {
        const error = new HttpError(
            'You are not allowed to edit this post',
            401
        );
        return next(error);
    }

    post.caption = caption;
    post.picture = req.file ? req.file.path.replace(/\\/g, "/") : oldPicture;


    try {
        await post.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not save updated post',
            500
        );
        console.log(err);
        return next(error);
    }

    res.status(200).json({ post: post.toObject({ getters: true })})
};

const deletePost = async (req, res, next) => {
    const postId = req.params.pid;

    let post;
    try {
        post = await Post.findById(postId).populate('author');
    } catch(err) {
        const error = new HttpError(
            'Something went wrong, could not delete this post.',
            500
        );
        return next(error);
    }

    if(post.author.id !== req.userData.userId) {
        const error = new HttpError(
            'You are not allowed to delete this post',
            401
        );
        return next(error);
    }

    let imagePath = post.picture;

    if(!post) {
        const error = new HttpError('Could not find a post with this id', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await post.remove({ session: sess });
        post.author.posts.pull(post);
        await post.author.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete post',
            500
        );
        return next(error);
    }

    fs.unlink(imagePath, err => {
        console.log(err);
    })

    res.status(200).json({ message: 'Deleted Post' });
}

exports.getPosts = getPosts;
exports.getPostsByUserId = getPostsByUserId;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;