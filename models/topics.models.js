const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query(`
        SELECT * FROM topics;
    `)
    .then(({ rows }) => {
        return rows
    })
}

exports.checkTopicExists = (topic) => {
    if(topic){
        return db.query(`
            SELECT * FROM topics
            WHERE slug = $1
            ;`, [topic])
        .then(({ rows }) => {
            if (rows.length === 0){
                return Promise.reject({ status: 404, msg: "Topic not found" })
            }
            return
        })
    }
    return
}