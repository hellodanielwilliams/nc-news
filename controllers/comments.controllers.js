const { checkArticleExists } = require("../models/articles.models")
const { selectCommentsByArticleId, insertCommentByArticleId } = require("../models/comments.models")
const { checkUserExists } = require("../models/users.models")

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params

    return Promise.all([selectCommentsByArticleId(article_id), checkArticleExists(article_id)])
    .then(([ comments ]) => {
        res.status(200).send({ comments })
    })
    .catch(next)
}

exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const body = req.body
    const { username } = body
    return checkUserExists(username).then(()=> {
        return Promise.all([insertCommentByArticleId(article_id, body), checkArticleExists(article_id)])
        .then(([ comment ]) => {
            res.status(201).send({ comment })
        }) 
    })
    .catch(next)
}