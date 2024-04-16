const db = require('../db/connection')

exports.selectArticles = () => {
    return db.query(`
    SELECT  a.author,
            a.title,
            a.article_id,
            a.created_at,
            a.votes,
            a.article_img_url,
            a.topic,
            COUNT(c.comment_id) AS comment_count
    FROM articles a 
    LEFT JOIN comments c
    ON a.article_id = c.article_id
    GROUP BY a.author,
            a.title,
            a.article_id,
            a.created_at,
            a.votes,
            a.article_img_url,
            a.topic
    ORDER BY a.created_at DESC
    ;`)
    .then(({ rows }) => {
        rows.forEach((article) => article.comment_count = parseInt(article.comment_count))
        return rows
    })
}

exports.selectArticleById = (article_id) => {
    return db.query(`
        SELECT * FROM articles
        WHERE article_id = $1
    ;`, [article_id])
    .then(({ rows }) => {
        if (rows.length === 0){
            return Promise.reject({ status: 404, msg: "Article not found" })
          }
        return rows[0]
    })
}

exports.checkArticleExists = (article_id) => {
    return db.query(`
        SELECT * FROM articles
        WHERE article_id = $1
        ;`, [article_id])
    .then(({ rows }) => {
        if (rows.length === 0){
            return Promise.reject({ status: 404, msg: "Article not found" })
        }
        return
    })
}