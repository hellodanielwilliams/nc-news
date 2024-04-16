const { checkArticleExists } = require("../models/articles.models")
const { selectCommentsByArticleId } = require("../models/comments.models")

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params

    return Promise.all([selectCommentsByArticleId(article_id), checkArticleExists(article_id)])
    .then(([ comments ]) => {
        res.status(200).send({ comments })
    })
    .catch(next)
}