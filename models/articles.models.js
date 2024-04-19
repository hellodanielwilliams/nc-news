const db = require('../db/connection')
const { commentData } = require('../db/data/test-data')

exports.selectArticles = (topic, sort_by = 'created_at', order = 'desc') => {
    const validOrders = ['asc', 'desc']
    const validSortBys = ['author', 'title', 'article_id', 'created_at', 'article_img_url', 'topic', 'comment_count']
    if(!validOrders.includes(order)){
        return Promise.reject({ status: 400, msg: 'Bad request'})
    }
    if(!validSortBys.includes(sort_by)){
        return Promise.reject({ status: 404, msg: 'Column not found'})
    }
    if(sort_by !== 'comment_count'){
        sort_by = `a.${sort_by}`
    }

    let sqlQueryString = `
        SELECT  a.author,
        a.title,
        a.article_id,
        a.created_at,
        a.votes,
        a.article_img_url,
        a.topic,
        COUNT(c.comment_id) :: INT AS comment_count
        FROM articles a 
        LEFT JOIN comments c
        ON a.article_id = c.article_id 
    `
    const queryValues = []

    if (topic){
        sqlQueryString += `WHERE a.topic = $1 `
        queryValues.push(topic)
    }

    sqlQueryString += `
        GROUP BY a.author,
        a.title,
        a.article_id,
        a.created_at,
        a.votes,
        a.article_img_url,
        a.topic
        ORDER BY ${sort_by} ${order}
    ;`

    return db.query(sqlQueryString, queryValues)
    .then(({ rows }) => {
        return rows
    })
}

exports.selectArticleById = (article_id) => {
    return db.query(`
        SELECT  
            a.author,
            a.title,
            a.article_id,
            a.created_at,
            a.body,
            a.votes,
            a.article_img_url,
            a.topic,
            COUNT(c.comment_id) :: INT AS comment_count 
        FROM articles a 
        LEFT JOIN comments c
        ON a.article_id = c.article_id
        WHERE a.article_id = $1
        GROUP BY
            a.author,
            a.title,
            a.article_id,
            a.created_at,
            a.body,
            a.votes,
            a.article_img_url,
            a.topic
        ;`, [article_id])
    .then(({ rows }) => {
        if (rows.length === 0){
            return Promise.reject({ status: 404, msg: "Article not found" })
        }
        return rows[0]
    })
}

exports.updateVotesByArticleId = (article_id, { inc_votes } ) => {
    return db.query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *
    ;`, [inc_votes, article_id])
    .then(({ rows }) => {
        if (rows.length === 0){
            return Promise.reject({ status: 404, msg: "Article not found" })
        }
        return rows[0]
    })
}

exports.insertArticle = ({ author, title, body, topic, article_img_url }) => {
    const columns = ['author', 'title', 'body', 'topic']
    const values = [author, title, body, topic]
    let placeholders = '$1, $2, $3, $4'

    if (article_img_url !== undefined) {
        columns.push('article_img_url')
        values.push(article_img_url)
        placeholders += ', $5'
    }
    return db.query(`
        INSERT INTO articles
        (${columns.join(', ')})
        VALUES (${placeholders})
        RETURNING article_id, body
    ;`, values)
    .then(({ rows }) => {
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