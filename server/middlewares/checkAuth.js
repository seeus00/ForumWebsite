const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json("ERROR: Token not found; you have to log in!!");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json("ERROR: TOKEN IS INVALID");
        }

        req.user = {
            id: user.id
        };
        
        next();
    });
}

module.exports = { checkAuth };