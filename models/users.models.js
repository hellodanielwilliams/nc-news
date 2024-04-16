const db = require('../db/connection')

exports.checkUserExists = (username) => {
    if(!username){
        return Promise.reject({ status: 400, msg: "Bad request" })
    } else {
        return db.query(`
            SELECT * FROM users
            WHERE username = $1
            ;`, [username])
        .then(({ rows }) => {
            if (rows.length === 0){
                return Promise.reject({ status: 404, msg: "Username not found" })
            }
            return
        })
    }
}