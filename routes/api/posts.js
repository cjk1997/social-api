const express = require('express');
const ObjectID = require('mongodb').ObjectID;
const Router = express.Router();
const {
    getPosts,
    createPost,
    editPost,
    likePost,
    unlikePost,
    postComment,
    editComment,
    likeComment,
    unlikeComment,
    deleteComment,
    deletePost,
} = require('../../data/posts');

Router.get('/', async function(req, res) {
    try {
        const data = await getPosts();
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.post('/create', async function(req, res) {
    try {
        const body = req.body;
        const data = await createPost(body.author, body);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.patch('/edit/:id', async function(req, res) {
    try {
        const data = await editPost(req.params.id, req.body);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.patch('/like/:id', async function(req, res) {
    try {
        const data = await likePost(req.params.id, req.body);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.patch('/unlike/:id', async function(req, res) {
    try {
        const data = await unlikePost(req.params.id, req.body);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.patch('/comment/:id', async function(req, res) {
    try {
        const body = req.body;
        body[0]._id = ObjectID();
        const data = await postComment(req.params.id, body);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.patch('/comment/edit/:id', async function(req, res) {
    try {
        const body = req.body;
        const commentID = body.commentID;
        const comment = body.comment;
        const data = await editComment(req.params.id, commentID, comment);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.patch('/comment/like/:id', async function(req, res) {
    try {
        const body = req.body;
        const data = await likeComment(req.params.id, body.commentID, body.user);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.patch('/comment/unlike/:id', async function(req, res) {
    try {
        const body = req.body;
        const data = await unlikeComment(req.params.id, body.commentID, body.user);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.patch('/comment/delete/:postID/:commentID', async function(req, res) {
    try {
        const data = await deleteComment(req.params.postID, req.params.commentID);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

Router.delete('/delete/:authorID/:postID', async function(req, res) {
    try {
        const data = await deletePost(req.params.authorID, req.params.postID);
        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal server issues, check logs.");
    };
});

module.exports = Router;