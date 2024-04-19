const { selectArticleById, selectArticles, updateVotesByArticleId, checkArticleExists, insertArticle } = require("../models/articles.models")
const { checkTopicExists } = require("../models/topics.models")

exports.getArticles = (req, res, next) => {
    const { topic, sort_by, order, limit, p } = req.query
    return Promise.all([selectArticles(topic, sort_by, order, limit, p), checkTopicExists(topic)])
    .then(([[ articles, total_count ]]) => res.status(200).send({articles, total_count}))
    .catch(next)
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    return selectArticleById(article_id).then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.patchVotesByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const body = req.body
    return updateVotesByArticleId(article_id, body)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
}

exports.postArticle = (req, res, next) => {
    const body = req.body
    return insertArticle(body).then(({ article_id }) => {
        return selectArticleById(article_id).then((article) => {
            res.status(201).send({ article })
        })
    })
    .catch(next)
}