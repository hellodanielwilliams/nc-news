const { selectArticleById, selectArticles, updateVotesByArticleId } = require("../models/articles.models")

exports.getArticles = (req, res, next) => {
    return selectArticles().then((articles) => {
        res.status(200).send({ articles })
    })
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
}