const request = require('supertest')
const db = require('../db/connection')
const app = require('../app')
const data = require('../db/data/test-data')
const seed = require('../db/seeds/seed')

beforeEach(() => seed(data));
afterAll(() => db.end());

describe ('/api/does-not-exist', () => {
    describe('GET TESTS:', () => {
        test('GET 404: responds with 404 not found message for a non-existent endpoint', () => {
            return request(app)
            .get('/api/does-not-exist')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Not found')
            })
        })
    })
})

describe('/api', () => {
    describe('GET TESTS:', () => {
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
})

describe ('/api/topics', () => {
    describe('GET TESTS:', () => {
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
})

describe('/api/articles', () => {
    describe('GET TESTS:', () => {
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
        test('GET 200: responds with correct comment_count from comments table via JOIN on article_id, cast as INT in psql', () => {
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
        test('GET 200: responds with array of articles filtered to only include those with the topic specified in query', () => {
            return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toHaveLength(1)
                articles.forEach((article) => {
                    expect(article.topic).toBe('cats')
                })
            })
        })
        test('GET 404: responds with a not found error if topic does not exist in db', () => {
            return request(app)
            .get('/api/articles?topic=nonexistent_topic')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Topic not found')
            })
        })
        test('GET 200: responds with an empty array if topic exists but has no associated articles', () => {
            return request(app)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toHaveLength(0)
            })
        })
        test('GET 200: responds with articles sorted in ascending date order if specified in order query', () => {
            return request(app)
            .get('/api/articles?order=asc')
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy('created_at', {ascending: true})
            })
        })
        test('GET 200: responds with articles sorted by a column from articles table specified in sort_by query', () => {
            return request(app)
            .get('/api/articles?sort_by=author&order=asc')
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy('author', {ascending: true})
            })
        })
        test('GET 200: responds with articles sorted by comment_count column from the JOIN if specified', () => {
            return request(app)
            .get('/api/articles?sort_by=comment_count')
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy('comment_count', {descending: true})
            })
        })
       test('GET 400: responds with a bad request error if sort query is neither asc nor desc', () => {
            return request(app)
            .get('/api/articles?order=invalid_order')
            .expect(400)
            .then(({ body: { msg } }) => {
                expect(msg).toBe('Bad request')
            })
       })
       test('GET 404: responds with a not found error if specified sort_by column is invalid', () => {
            return request(app)
            .get('/api/articles?sort_by=invalid_column')
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe('Column not found')
            })
        })
    })
    describe('POST TESTS:', () => {
        test('POST 201: responds with posted article with all properties coming back from a GET plus the body property, with article_img_url included in request body', () => {
            const testArticle = {
                author: 'lurker',
                title: 'Article Title',
                body: 'Article body text...',
                topic: 'cats',
                article_img_url: 'https://picsum.photos/seed/picsum/1280/720'
            }
           return request(app)
           .post('/api/articles')
           .send(testArticle)
           .expect(201)
           .then(({ body: { article }}) => {
                expect(article).toEqual(expect.objectContaining({
                    author: 'lurker',
                    title: 'Article Title',
                    body: 'Article body text...',
                    topic: 'cats',
                    article_img_url: 'https://picsum.photos/seed/picsum/1280/720',
                    article_id: 14,
                    votes: 0,
                    comment_count: 0,
                    created_at: expect.any(String)
                }))
           })
        })
        test('POST 201: responds with article with default article_img_url if not sent in request body', () => {
            const testArticle = {
                author: 'lurker',
                title: 'Article Title',
                body: 'Article body text...',
                topic: 'cats',
            }
           return request(app)
           .post('/api/articles')
           .send(testArticle)
           .expect(201)
           .then(({ body: { article: { article_img_url } }}) => {
                expect(article_img_url).toBe('https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700')
           })
        })
        test('POST 400: responds with a bad request error if req body is missing properties', () => {
            const testArticle = { author: 'lurker' }
            return request(app)
           .post('/api/articles')
           .send(testArticle)
           .expect(400)
           .then(({ body: { msg }}) => {
                expect(msg).toBe('Bad request')
           })
        })
        test('POST 404: responds with a not found error if author from req body does not exist in db', () => {
            const testArticle = {
                author: 'not_real_username',
                title: 'Article Title',
                body: 'Article body text...',
                topic: 'cats',
            }
           return request(app)
           .post('/api/articles')
           .send(testArticle)
           .expect(404)
           .then(({ body: { msg }}) => {
                expect(msg).toBe('Author not found')
           })

        })
    })
})

describe('/api/articles/:article_id', () => {
    describe('GET TESTS:', () => {
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
        test('GET 200: responds with article including accurate comment_count from comments table via JOIN on article_id', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body : { article: { comment_count } } })=> {
                expect(comment_count).toBe(11)
           }) 
        })
    })
    describe('PATCH TESTS', () => {
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
        test('PATCH 400: responds with a bad request error if sent a votes object without inc_votes property', () => {
            const testPatch = { not_valid : 1 } 
            return request(app)
            .patch('/api/articles/1')
            .send(testPatch)
            .expect(400)
            .then(({ body}) => {
                expect(body.msg).toBe('Bad request')
            })
        })
        test('PATCH 400: responds with a bad request if inc_votes value is not a number', () => {
            const testPatch = { inc_votes : 'not a number' } 
            return request(app)
            .patch('/api/articles/1')
            .send(testPatch)
            .expect(400)
            .then(({ body })  => {
                expect(body.msg).toBe('Bad request')
            })
        })
        test('PATCH 404: responds with not found error if article_id is valid but nonexistent in db', () => {
            const testPatch = { inc_votes : 1 } 
            return request(app)
            .patch('/api/articles/9999')
            .send(testPatch)
            .expect(404)
            .then(({ body })  => {
                expect(body.msg).toBe('Article not found')
            })
        })
        test('PATCH 400: responds with bad request error if article_id is invalid', () => {
            const testPatch = { inc_votes : 1 } 
            return request(app)
            .patch('/api/articles/not_a_number')
            .send(testPatch)
            .expect(400)
            .then(({ body })  => {
                expect(body.msg).toBe('Bad request')
            })
        })
    })
})

describe('/api/articles/:article_id/comments', () => {
    describe('GET TESTS:', () => {
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
        test('GET 200: responds with comments array ordered in date descending by default', () => {
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
    })
    describe('POST TESTS:', () => {
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
})

describe('/api/comments/:comment_id', () => {
    describe('DELETE TESTS:', () => {
        test('DELETE 204: deletes the specified comment and sends no body back', () => {
            return request(app)
            .delete('/api/comments/1')
            .expect(204)
        })
        test('DELETE 404: responds with a not found error if comment_id valid but not found in db', () => {
            return request(app)
            .delete('/api/comments/9999')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Comment not found')
            })
        })
        test('DELETE 400: responds with a bad request error if the comment_id is invalid', () => {
            return request(app)
            .delete('/api/comments/not_a_number')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request')
            })
        })
    })
    describe('PATCH TESTS', () => {
        test('PATCH 200: responds with correctly updated votes in comment object', () => {
            const testPatch = { inc_votes : 1 } 
            return request(app)
            .patch('/api/comments/1')
            .send(testPatch)
            .expect(200)
            .then(({ body: { comment }}) => {
                const expected = { 
                    comment_id: 1, 
                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!", 
                    votes: 17, 
                    author: 'butter_bridge',
                    article_id: 9, 
                }
                expect(comment).toMatchObject(expected)
            })
        })
        test('PATCH 400: responds with a bad request error if inc_votes value is not a number', () => {
            const testPatch = { inc_votes : 'not a number' } 
            return request(app)
            .patch('/api/comments/1')
            .send(testPatch)
            .expect(400)
            .then(({ body: { msg } })  => {
                expect(msg).toBe('Bad request')
            })
        })
        test('PATCH 400: responds with a bad request error if inc_votes property not present', () => {
            const testPatch = { invalid_key : 1 } 
            return request(app)
            .patch('/api/comments/1')
            .send(testPatch)
            .expect(400)
            .then(({ body: { msg } })  => {
                expect(msg).toBe('Bad request')
            })
        })
        test('PATCH 404: responds with a not found error if comment_id does not exist in db', () => {
            const testPatch = { inc_votes : 1 } 
            return request(app)
            .patch('/api/comments/9999')
            .send(testPatch)
            .expect(404)
            .then(({ body: { msg } })  => {
                expect(msg).toBe('Comment not found')
            })
        })
    })
})

describe('/api/users', () => {
    describe('GET TESTS', () => {
        test('GET 200: responds with a users array of objects, each with username, name and avatar_url properties', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body: { users } }) => {
                expect(users).toHaveLength(4)
                users.forEach((user) => {
                    expect(user).toEqual(expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    }))
                })
            })
        })
    })
})

describe('/api/users/:username', () => {
    describe('GET TESTS', () => {
        test('GET 200: responds with a user object with username, name and avatar_url properties when username exists in db', () => {
            return request(app)
            .get('/api/users/lurker')
            .expect(200)
            .then(({ body: { user }}) => {
                const testUser = { 
                    username: 'lurker', 
                    name: 'do_nothing', 
                    avatar_url:
                      'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
                }
                expect(user).toMatchObject(testUser)
            })
        })
        test('GET 404: responds with a not found error if the username does not exist in db', () => {
            return request(app)
            .get('/api/users/not-a-real-username')
            .expect(404)
            .then(({ body: { msg }}) => {
                expect(msg).toBe('Username not found')
            })
        } )
    })
})