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
            let msg
            switch(err.constraint){
                case 'articles_author_fkey':
                    msg = 'Author not found'
                    break
                case 'articles_topic_fkey':
                    msg = 'Topic not found'
                    break
                case 'comments_article_id_fkey':
                    msg = 'Article not found'
                    break
                default: 
                    msg = 'Invalid foreign key'
                    break
            }
            res.status(404).send({ msg })
        }
    }
    next(err)
}
exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error'})
}
