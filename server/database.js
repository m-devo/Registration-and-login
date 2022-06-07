const dotenv = require('dotenv');
const Pool =  require('pg').Pool;

dotenv.config();

const {
  ENV,
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_DB_TEST,
  POSTGRES_USER,
  POSTGRES_PASSWORD
} = process.env;

const Client = new Pool({
  host: POSTGRES_HOST,
  database: ENV === 'dev' ? POSTGRES_DB : POSTGRES_DB_TEST,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD
});

module.exports = Client; 
