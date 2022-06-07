const router = require('express').Router();
const Client = require('../server/database')
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();
const jwtGenerator = require('../utils/jwtGenerator');
const validation = require('../middleware/validation');
const authorization = require('../middleware/authorization');

//register route
router.post('/register',validation, async(req, res)=> {
    try {
        // 1.destructure the req.body 
        const {name, email, password} = req.body

        // 2. check if user exist (if user exist then throw error)

        const user = await Client.query('SELECT * FROM users WHERE user_email = $1', [email
        ]);

       // res.json(user.rows)
        if(user.rows.length !== 0) {
        return  res.status(401).send('Email already exist')
        }

       //3. bcrypt the user password
        const SALT_ROUNDS = process.env.SALT_ROUNDS;

        const salt = await bcrypt.genSalt(parseInt(SALT_ROUNDS));

        const hash =await bcrypt.hash(password, salt)
        
       //4. enter newUser inside database
        const newUser = await Client.query('INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *', 
        [name, email, hash])

        //res.json(newUser.rows[0])

        //5. generating our jwt token
        const TOKEN = jwtGenerator(newUser.rows[0].user_id);

        res.json({ TOKEN })

    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
});

//Login route
router.post('/login',validation, async(req, res)=> {
    try {
        // 1.destructure the req.body 
        const {name, email, password} = req.body

        // 2. check if user exist (if user exist then throw error)

        const user = await Client.query('SELECT * FROM users WHERE user_email = $1' , 
        [email
        ]);

       // res.json(user.rows)
        if(user.rows.length == 0) {
        return  res.status(401).send('Password or email is not correct ')
        }

        // 3. check if the incoming password is the same the database password

        const validPassword =await bcrypt.compare(password, user.rows[0].user_password)

        //console.log(validPassword)
        if(!validPassword) {
            return res.status(401).send('Password or email is not correct')
        }

        // 4. give the users jwt token
        const TOKEN = jwtGenerator(user.rows[0].user_id);
        res.json( {TOKEN} );
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error')
    }
});

router.get('/verfiy', authorization, async(req, res)=> {
    try {
        res.json(true)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});


module.exports = router;