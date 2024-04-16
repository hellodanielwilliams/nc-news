const db = require('../db/connection')

exports.selectCommentsByArticleId = (article_id) => {
    return db.query(`
        SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC
    ;`, [article_id])
    .then(({ rows }) => {
        return rows
    })
}

exports.insertCommentByArticleId = (article_id, { username, body }) => {
    return db.query(`
        INSERT INTO comments
        (article_id, author, body)
        VALUES ($1, $2, $3)
        RETURNING *
    ;`, [article_id, username, body])
    .then(({ rows }) => {
        return rows[0]
    })
}

exports.removeCommentByCommentId = (comment_id) => {
    return db.query(`
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *
    ;`, [comment_id]).then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Comment not found'})
        }
    })
}