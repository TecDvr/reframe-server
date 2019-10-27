const app = require('../src/app');
const knex = require('knex');

/*describe('App', () => {
  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app).get('/').expect(200)
  })
})*/

describe('MAIN', () => {
  let db

  const user = {
    "username": "testUser",
    "user_password": "testPassword",
    "email": "test@gmail.com"
  }

  const mistake = { 
    "posting_date": "now()", 
    "mistake_nickname": "testNickname",
    "mistake": "testMistake",
    "box_checked": "true",
    "went_wrong": "test",
    "why_wrong": "test",
    "what_doing": "test",
    "what_learn": "test",
    "plan_one": "test",
    "plan_two": "test",
    "plan_three": "test",
    "plan_four": "test",
    "plan_five": "test"
}

  function makeAuthHeader(user) {
    const token = Buffer.from(`${user.username}:${user.user_password}`).toString('base64')
    return `Basic ${token}`
  }

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    console.log(process.env.TEST_DATABASE_URL, 'test')
    app.set('db', db)
  })

  before(() => {
      /*return db
        .into('reframe_users')
        .insert(user)*/
  })

  after(() => db.destroy())

  // before(() => db('reframe_users').truncate())

  describe('USER', () => {
    it('GET /api/user responds with 200', () => {
      return supertest(app).get('/api/user').expect(200).expect('Content-Type', /json/)
    });

    it('POST /api/user responds with 201', () => {
      return supertest(app).post('/api/user').send(user).expect(201)
    })
  })

  describe('LOGIN', () => {
    it('POST /api/login responds with 201', () => {
      return supertest(app).post('/api/login').send(user).expect(201)
    })
  })

  describe('USER:ID', () => { //Change to test error
    it('GET /api/user/:id responds with 200', () => {
      // this will always work because there is no user 4
      return supertest(app).get('/api/user/4').set('Authorization', makeAuthHeader(user)).expect(200).expect('Content-Type', /json/)
    })
  })

  describe('MISTAKE', () => {
    it('GET /api/mistake responds with 200', () => {
      return supertest(app).get('/api/mistake').expect(200).expect('Content-Type', /json/)
    });

    it('POST /api/mistake responds with 201', () => {
      // need a way to send a specific user id
      //return supertest(app).post('/api/mistake').set('Authorization', makeAuthHeader(user)).send(mistake).expect(201)
    })
  })

})