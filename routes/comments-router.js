const commentsRouter = require('express').Router()

const { deleteCommentByCommentId, patchVotesByCommentId } = require('../controllers/comments.controllers')

commentsRouter
    .route('/:comment_id')
    .delete(deleteCommentByCommentId)
    .patch(patchVotesByCommentId)

module.exports = commentsRouter