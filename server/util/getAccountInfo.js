const mysql = require('mysql2');

const usersDb = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "Caseyisawizard06",
    database: "login"
});

const getAccountInfo = (userId, callback) => {
    usersDb.query("SELECT id, username FROM users WHERE id = (?)", [userId], (err, result) => {
        if (result.length) {
            callback(result[0]);
        }else {
            callback(null);
        }
    });
}

module.exports = getAccountInfo;