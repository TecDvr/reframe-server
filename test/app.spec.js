const app = require('../src/app');
const knex = require('knex');

describe('App', () => {
  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app).get('/').expect(200)
  })
})

describe('MAIN', () => {
  let db

  const user = {
    "username": "testUser",
    "user_password": "testPassword",
    "email": "test@gmail.com"
  }

  const comment = {
    commment: 'Testing'
  }

  const userPatch = {
    plan_one_check: false,
    plan_two_check: true,
    plan_three_check: true,
    plan_four_check: true,
    plan_five_check: false
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
    "plan_five": "test",
    "how_bad": "4"
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
    app.set('db', db)
  })

  before(() => {
      return db
        .into('reframe_users')
        .insert(user)
  })

  after(() => db.destroy())

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

  describe('USER:ID', () => {
    it('GET /api/user/:id responds with 200', () => {
      return supertest(app).get('/api/user/4').set('Authorization', makeAuthHeader(user)).expect(200).expect('Content-Type', /json/)
    })
  })

  describe('MISTAKE', () => {
    it('GET /api/mistake responds with 200', () => {
      return supertest(app).get('/api/mistake').expect(200).expect('Content-Type', /json/)
    });

    it('POST /api/mistake responds with 201', () => {
      return supertest(app).post('/api/mistake').set('Authorization', makeAuthHeader(user)).send(mistake).expect(201)
    });
  })

  describe('DELETE', () => {
    it('DELETE /api/delete/:mistake_id responds with 204', () => {
      return supertest(app).delete('/api/delete/1').set('Authorization', makeAuthHeader(user)).expect(204)
    })
  })

  describe('PLANCHECK', () => {
    it('PLANCHECK /api/plancheck/:id responds with 204', () => {
      return supertest(app).patch('/api/plancheck/15').set('Authorization', makeAuthHeader(user)).send(userPatch).expect(204)
    })
  })

  describe('MISTAKE ID', () => {
    it('GET /api/mistake/:id responds with 200', () => {
      return supertest(app).get('/api/mistake/4').set('Authorization', makeAuthHeader(user)).expect(200).expect('Content-Type', /json/)
    });
  })

  describe('CHECK BOX', () => {
    it('GET /api/checkbox/:mistake_id responds with 200', () => {
      return supertest(app).get('/api/checkbox/4').set('Authorization', makeAuthHeader(user)).expect(200).expect('Content-Type', /json/)
    });
  })

  describe('COMMENT', () => {
    it('GET /api/comment/:mistake_id with 200', () => {
      return supertest(app).get('/api/comment/1').expect(200).expect('Content-Type', /json/)
    });

    it('POST /api/comment/:mistake_id responds with 201', () => {
      return supertest(app).post('/api/comment/55').set('Authorization', makeAuthHeader(user)).send(comment).expect(201)
    });
  })
})