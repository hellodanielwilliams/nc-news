const request = require('supertest')
const db = require('../db/connection')
const app = require('../app')
const data = require('../db/data/test-data')
const seed = require('../db/seeds/seed')

beforeEach(() => seed(data));
afterAll(() => db.end());

describe ('/api/does-not-exist', () => {
    test('GET 404: responds with 404 not found message for a non-existent endpoint', () => {
        return request(app)
        .get('/api/does-not-exist')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Not found')
        })
    })
})

describe('/api', () => {
    test('GET 200: responds with an object describing all the available endpoints on the API', () => {
        const endpoints = require('../endpoints.json')
        return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
            expect(body).toEqual(endpoints)
        })
    })
})

describe ('/api/topics', () => {
    test('GET 200: responds with an array of topic objects, each with slug and description properties', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body: { topics } }) => {
            expect(topics).toHaveLength(3)
            topics.forEach((topic) => {
                expect(typeof topic.description).toBe('string')
                expect(typeof topic.slug).toBe('string')
            })
        })
    })
})

describe('/api/articles', () => {
    test('GET 200: responds with an articles array of article objects with all article properties but no body', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(13)
            articles.forEach((article) => {
                const { author, title, article_id, topic, created_at, votes, article_img_url } = article
                expect(typeof author).toBe('string')
                expect(typeof title).toBe('string')
                expect(typeof article_id).toBe('number')
                expect(typeof created_at).toBe('string')
                expect(typeof votes).toBe('number')
                expect(typeof article_img_url).toBe('string')
                expect(typeof topic).toBe('string')
                expect(article).not.toHaveProperty('body')
            })
        })
    })
    test('GET 200: responds with correct comment_count from comments table via JOIN on article_id, parsed into a number', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles: [ test_article ] } }) => {
            expect(test_article.comment_count).toBe(2)
        })
    })
    test('GET 200: responds with articles sorted in descending date order by default', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy('created_at', {descending: true})
        })
    })
})

describe('/api/articles/:article_id', () => {
    test('GET 200: responds with article object with the requested id with all required properties', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body: { article } }) => {
            const { author,  title, article_id, topic, created_at, votes, article_img_url } = article
            expect(article_id).toBe(1)
            expect(title).toBe('Living in the shadow of a great man')
            expect(author).toBe('butter_bridge')
            expect(topic).toBe('mitch')
            expect(article.body).toBe('I find this existence challenging')
            expect(created_at).toBe('2020-07-09T20:11:00.000Z')
            expect(votes).toBe(100)
            expect(article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
        })
    })
    test('GET 404: responds with a not found error if article_id is valid but does not exist in db', () => {
        return request(app)
        .get('/api/articles/9999')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article not found')
        })
    })
    test('GET 400: responds with a bad request error if article_id is not valid', () => {
        return request(app)
            .get('/api/articles/not-a-number')
            .expect(400)
            .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    })
    test('PATCH 200: responds with correctly updated votes in article object', () => {
        const testPatch = { inc_votes : 1 } 
        return request(app)
        .patch('/api/articles/1')
        .send(testPatch)
        .expect(200)
        .then(({ body: { article }}) => {
            const { author,  title, article_id, topic, created_at, votes, article_img_url } = article
            expect(votes).toBe(101)
            expect(article_id).toBe(1)
            expect(title).toBe('Living in the shadow of a great man')
            expect(author).toBe('butter_bridge')
            expect(topic).toBe('mitch')
            expect(article.body).toBe('I find this existence challenging')
            expect(created_at).toBe('2020-07-09T20:11:00.000Z')
            expect(article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
        })
    })
})

describe('/api/articles/:article_id/comments', () => {
    test('GET 200: responds with array of comments for the given article_id with all correct properties', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body: { comments } }) => {
            expect(comments.length).toBe(11)
            comments.forEach((comment => {
                const {comment_id, votes, created_at, author, body, article_id} = comment
                expect(typeof comment_id).toBe('number')
                expect(typeof votes).toBe('number')
                expect(typeof created_at).toBe('string')
                expect(typeof author).toBe('string')
                expect(typeof body).toBe('string')
                expect(typeof article_id).toBe('number')
            }))
        })
    })
    test('Get 200: responds with comments array ordered in date descending by default', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body: { comments } }) => {
            expect(comments).toBeSortedBy('created_at', { descending: true })
        })
    })
    test('GET 404: responds with a not found error if article_id is valid but does not exist in db', () => {
        return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toBe('Article not found')
        });
    })
    test('GET 400: responds with a bad request error if article_id is not valid', () => {
        return request(app)
            .get('/api/articles/not-a-number/comments')
            .expect(400)
            .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad request')
        })
    })
    test('GET 200: responds with an empty array if the article_id exists but has no comments', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(0)
        })
    })
    test('POST 201: responds with comment object that has been inserted into comments table', () => {
        const testComment = { username: 'lurker', body: 'an example comment body'}
        return request(app)
        .post('/api/articles/2/comments')
        .send(testComment)
        .expect(201)
        .then(({ body : { comment } }) => {
            const { comment_id, author, body, article_id, votes, created_at }  = comment
            expect(comment_id).toBe(19)
            expect(article_id).toBe(2)
            expect(author).toBe('lurker')
            expect(body).toBe('an example comment body')
            expect(votes).toBe(0)
            expect(typeof created_at).toBe('string')        
        })
    })
    test('POST 400: responds with a bad request message if comment object does not have username key', () => {
        const testComment = { non_valid_key : 'lurker' }
        return request(app)
        .post('/api/articles/2/comments')
        .send(testComment)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    })
    test('POST 404: responds with a not found error if article_id is valid but does not exist in db', () => {
        const testComment = { username: 'lurker', body: 'an example comment body'}
        return request(app)
        .post('/api/articles/9999/comments')
        .send(testComment)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article not found')
        })
    })
    test('POST 404: responds with a not found if username in comment object is not in users table', () => {
        const testComment = { username: 'not_real_user', body: 'an example comment body'}
        return request(app)
        .post('/api/articles/2/comments')
        .send(testComment)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Username not found')
        })
    })
    test('POST 400: responds with bad request if username is valid but object is otherwise malformed', () => {
        const testComment = { username: 'lurker', not_valid_key : 'an example comment body'}
        return request(app)
        .post('/api/articles/2/comments')
        .send(testComment)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request')
        })
    })
    test('POST 400: responds with a bad request error if article_id is not valid', () => {
        const testComment = { username: 'lurker', body: 'an example comment body'}
        return request(app)
            .post('/api/articles/not-a-number/comments')
            .send(testComment)
            .expect(400)
            .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad request')
        })
    }) 
})

