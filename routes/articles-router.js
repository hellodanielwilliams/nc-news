const articlesRouter = require('express').Router()

const { getArticleById, getArticles, patchVotesByArticleId } = require('../controllers/articles.controllers')
const { getCommentsByArticleId, postCommentByArticleId } = require('../controllers/comments.controllers')

articlesRouter
    .route('/')
    .get(getArticles)

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchVotesByArticleId)

articlesRouter
    .route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId)

module.exports = articlesRouter