const router = require('express').Router();
const Client = require('../server/database');
const authorization = require('../middleware/authorization');


router.get('/', authorization, async(req, res)=> {
    try {
        //the user has the payload
        // res.json(req.user)

        const user = await Client.query('SELECT user_name FROM users WHERE user_id = $1', [req.user]);

        res.json(user.rows[0])
    } catch (error) {
        console.log(error.message)
        res.status(500).json('Server Error')
    }
})

module.exports = router;