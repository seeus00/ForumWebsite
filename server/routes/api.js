const express = require('express');
const { randomUUID } = require('crypto');
const mysql = require('mysql2');

const { checkAuth } = require('../middlewares/checkAuth');
const getAccountInfo = require('../util/getAccountInfo');

const router = express.Router();


const postsDb = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "Caseyisawizard06",
    database: "posts_schema"
});

const threadsDb = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "Caseyisawizard06",
    database: "threads_schema"
});

router.get('/getThreads', (req, res) => {
    threadsDb.query("SELECT threadId, threadTitle, threadContent, date, creatorId, creatorName FROM threads", (err, result) => {
        if (result.length) {
            res.status(200).json({
                threadCount: result.length,
                threads: result.map(thread => {
                    return {
                        id: thread.threadId,
                        title: thread.threadTitle,
                        content: thread.threadContent,
                        dateCreated: thread.date,
                        userId: thread.creatorId,
                        username: thread.creatorName
                    }
                })
            });
        }else {
            return res.status(200).json({ threadCount: 0, threads: [] })
        }
    });
});

router.get('/getPosts', async (req, res) => {
    if (!req.query.thread_id) {
        return res.status(403).json("ERROR: thread id is missing!");
    }

    threadsDb.query("SELECT * FROM threads WHERE threadId = (?)", [req.query.thread_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(404).json(`ERROR: Thread: ${req.query.thread_id} does not exist!`);
        }

        postsDb.query(`SELECT * FROM \`${req.query.thread_id}\``, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json(`ERROR: Posts couldn't be loaded!`);
            }

            //PostId, ParentId, PostUsername, PostContent, Date
            res.status(200).json({
                postsCount: result.length,
                posts: result.map(post => {
                    return {
                        id: post.PostId,
                        parentId: post.ParentId,
                        username: post.PostUsername,
                        content: post.PostContent,
                        dateCreated: post.Date,
                        threadId: req.query.thread_id
                    }
                })
            })
        });
    });


});

router.post('/createPost', checkAuth, async (req, res) => {
    if (!req.body.parentId || !req.body.postContent || !req.body.threadId) {
        return res.status(403).json("ERROR: Invalid post payload!");
    }

    threadsDb.query("SELECT * FROM threads WHERE threadId = (?)", [req.body.threadId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(404).json(`ERROR: Thread: ${threadId} does not exist!`);
        }

        getAccountInfo(req.user.id, (userInfo) => {
            const postId = randomUUID();
            const parentId = req.body.parentId;
            const postUsername = userInfo.username;
            const postContent = req.body.postContent;
            const date = new Date().toLocaleString();

            postsDb.query(`INSERT INTO \`${req.body.threadId}\` (PostId, ParentId, PostUsername, PostContent, Date) VALUES (?,?,?,?,?)`, 
                [postId, parentId, postUsername, postContent, date], (err, result => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json(`ERROR: Post: ${postId} couldn't be added!`);
                    }

                    return res.status(200).json("Post successfully added!");
                }));
        });
    });
});


router.post('/createThread', checkAuth, async (req, res) => {
    const threadTitle = req.body.threadTitle;
    const threadContent = req.body.threadContent;

    if (!threadTitle || !threadContent) {
        return res.status(403).json("ERROR: Thread title and content are missing!");
    }

    if (threadTitle.length > 130) {
        return res.status(403).json("ERROR: Title is greater than 130 characters");
    }

    if (threadContent.length > 10000) {
        return res.status(403).json("ERROR: Title is greater than 10000 characters");
    }

    getAccountInfo(req.user.id, (userInfo) => {
        const threadId = randomUUID();
        const date = new Date().toLocaleString();

        threadsDb.query("INSERT INTO threads (threadId, threadTitle, threadContent, date, creatorId, creatorName) VALUES (?,?,?,?,?,?)", 
            [threadId, threadTitle, threadContent, date, userInfo.id, userInfo.username], (err, result) => {
                if (!err) {
                    //Create a new post
                    const postId = threadId;
                    const parentId = "";
                    const postUsername = userInfo.username;
                    const postContent = threadContent;
                    const date = new Date().toLocaleString();
                    

                    postsDb.query(`CREATE TAB`)

                    postsDb.query(`CREATE TABLE \`${postId}\` (PostId TEXT, ParentId TEXT, PostUsername TEXT, PostContent TEXT, Date TEXT)`, 
                        (err, result) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).json("ERROR: Post couldn't be created!");
                            }

                            postsDb.query(`INSERT INTO \`${postId}\` (PostId, ParentId, PostUsername, PostContent, Date) VALUES (?,?,?,?,?)`, 
                                [postId, parentId, postUsername, postContent, date], (err, result => {
                                    if (err) {
                                        console.log(err);
                                        return res.status(500).json("ERROR: Thread couldn't be created.");
                                    }

                                    return res.status(200).json("Thread: " + threadId + " created!");
                                }));
                        })
                }else {
                    console.log(err);
                    return res.status(500).json("ERROR: Thread couldn't be created.");
                }
            });
    });
})

module.exports = router;


