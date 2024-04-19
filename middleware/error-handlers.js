exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    }
    next(err)
}
exports.handlePsqlErrors = (err, req, res, next) => {
    if(err.code) {
        if(err.code === '22P02' || err.code === '23502') {
            res.status(400).send({ msg: 'Bad request'})
        }
        if(err.code === '23503') {
            if(err.constraint === 'articles_author_fkey'){
                res.status(404).send({ msg: 'Author not found'})
            }
            if(err.constraint === 'articles_topic_fkey'){
                res.status(404).send({ msg: 'Topic not found'})
            }
            if(err.constraint === 'comments_article_id_fkey')
                res.status(404).send({ msg: 'Article not found'})
        }
    }
    next(err)
}
exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error'})
}
