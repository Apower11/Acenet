const express = require("express");
const { check } = require("express-validator");

const postsController = require("../controllers/posts-controller");

const router = express.Router();

const fileUpload = require("../middleware//file-upload");

const checkAuth = require("../middleware/check-auth");


// Get all posts
router.get('/', postsController.getPosts);

// Get posts by user id
router.get('/user/:uid', postsController.getPostsByUserId);

// Use authentication middleware. Don't execute as it's already a function anyway.
router.use(checkAuth);

// Add post
router.post('/',
    fileUpload.single('picture'),
    [
        check('caption')
            .trim()
            .not()
            .isEmpty()
    ],
    postsController.createPost);

// Edit Post
router.patch('/:pid',
fileUpload.single('picture'),
postsController.updatePost);

// Delete Post
router.delete('/:pid', postsController.deletePost);

module.exports = router;