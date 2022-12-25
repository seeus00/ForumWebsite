const express = require('express');
const { randomUUID } = require('crypto');
const mysql = require('mysql2');

const { checkAuth } = require('../middlewares/checkAuth');
const getAccountInfo = require('../util/getAccountInfo');

const router = express.Router();


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
                    return res.status(200).json("Thread: " + threadId + " created!");
                }else {
                    console.log(err);
                    return res.status(500).json("ERROR: Thread couldn't be created.");
                }
            });
    });

})

module.exports = router;


