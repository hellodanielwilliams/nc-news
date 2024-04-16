const { selectArticleById, selectArticles, updateVotesByArticleId, checkArticleExists } = require("../models/articles.models")

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
    return Promise.all([updateVotesByArticleId(article_id, body), checkArticleExists(article_id)])
    .then(([ article ]) => {
        res.status(200).send({ article })
    })
    .catch(next)
}