const knex = require('knex')
const { DB_URL } = require('../config');
const bcrypt = require('bcryptjs');

const knexInstance = knex({
    client: 'pg',
    connection: DB_URL,
});

function requireAuth(req, res, next) {
    const authToken = req.get('Authorization') || ''

    let basicToken
    if (!authToken.toLowerCase().startsWith('basic ')) {
        return res.status(401).json({ error: 'Missing token' })
    } else {
        basicToken = authToken.slice('basic '.length, authToken.length) 
    } 

    const [tokenUserName, tokenPassword] = Buffer
        .from(basicToken, 'base64')
        .toString()
        .split(':')

    if (!tokenUserName || !tokenPassword) { 
        return res.status(401).json({ error: 'Unauthorized request' })
    }    

    knexInstance('reframe_users') 
        .where({ username: tokenUserName })
        .first()
        .then(user => {

            if (!user || !bcrypt.compareSync(tokenPassword, user.user_password)) {
                return res.status(401).json({ error: 'Unauthorized request' })
            }

            req.user = user
            next()

        })
        .catch(next)
}
  
module.exports = {
    requireAuth,
}