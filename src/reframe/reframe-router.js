const express = require('express');
const knex = require('knex');
const { DB_URL } = require('../config');
const bcrypt = require('bcryptjs');
const { requireAuth } = require('../middleware/basic-auth');

const reframeRouter = express.Router();
const jsonParser = express.json()
const jsonBodyParser = express.json()

const knexInstance = knex({
    client: 'pg',
    connection: DB_URL,
});

reframeRouter
    .route('/api/user')
    .get((req, res, next) => {
        const allUsers = ['id', 'username', 'email']

        knexInstance
            .select(allUsers)
            .from('reframe_users')
            .then(results => {
                res.status(200).json(results)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {username, email} = req.body
        const user_password = bcrypt.hashSync(req.body.user_password, 8);
        const newUser = {username, user_password, email}

        knexInstance
            .insert(newUser)
            .into('reframe_users')
            .then(results => {
                res.status(201).json(results)
            })
    })

reframeRouter
    .route('/api/login')
    .post(jsonBodyParser, (req, res, next) => {
        const {username, user_password} = req.body
        const loginUser = {username, user_password}

        for (const [key, value] of Object.entries(loginUser))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })

        knexInstance
            .from('reframe_users')
            .where({ username })
            .first() //do I need this?
            .then(user => {
                if (!user || !bcrypt.compareSync(user_password, user.user_password)) 
                return res.status(400).json({
                    error: 'Incorrect username or password' 
                })
            })
            .then(userLog => 
               res.status(201).json(userLog)
            ) 
            .catch(next)
    })

reframeRouter
    .route('/api/user/:id')
    .get((req, res, next) => {
        const {id} = req.params

        knexInstance
            .from('reframe_users')
            .select('*')
            .where('id', id)
            .then(user => {
                res.json(user)
            })
            .catch(next)
    })

reframeRouter
    .route('/api/mistake')
    .all(requireAuth)
    .get((req, res, next) => {
        knexInstance
            .select('*')
            .from('reframe_mistakes')
            .then(mistakes => {
                res.status(200).json(mistakes)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { 
            posting_date, 
            mistake_nickname,
            mistake,
            box_checked,
            went_wrong,
            why_wrong,
            what_doing,
            what_learn,
            plan_one,
            plan_two,
            plan_three,
            plan_four,
            plan_five
        } = req.body;
        const newMistake = { 
            posting_date, 
            mistake_nickname,
            mistake,
            box_checked,
            went_wrong,
            why_wrong,
            what_doing,
            what_learn,
            plan_one,
            plan_two,
            plan_three,
            plan_four,
            plan_five
        };

        for (const [key, value] of Object.entries(newMistake))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
        })

        newMistake.user_id = req.user.id

        knexInstance
            .insert(newMistake)
            .into('reframe_mistakes')
            .then(results => {
                res.status(201).json(results)
            })
            .catch(next)
    })

reframeRouter
    .route('/api/mistake/:user_id')
    .all(requireAuth)
    .get((req, res, next) => {
        const {user_id} = req.params

        knexInstance
            .from('reframe_mistakes')
            .select('*')
            .where('user_id', user_id)
            .then(mistake => {
                res.status(200).json(mistake)
            })
            .catch(next)
    })

module.exports = reframeRouter;