import router from express
import sequelize from 'sequelize';
import sqlite3 from 'sqlite3';

const router = Router();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './SQLdatabase.sqlite', // Path to SQLite file
});

const User = sequelize.define('User', {
    name: { type: Sequelize.STRING, allowNull: false },
    age: { type: Sequelize.INTEGER, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false },
});
const Dawg = sequelize.define('Dawg', {
    name: { type: Sequelize.STRING, allowNull: false },
    age: { type: Sequelize.INTEGER, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false },
});
const Brother = sequelize.define('Brother', {
    name: { type: Sequelize.STRING, allowNull: false },
    age: { type: Sequelize.INTEGER, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false },
});
sequelize.sync();

router.get("/getAllData", async (req, res) => {
    try {
        
        const users = await User.findAll();
        const dawgs = await Dawg.findAll();
        const brothers = await Brother.findAll();
        
        res.json({ users: users, dawgs: dawgs, brothers: brothers });

    }catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});





/*
const db = new sqlite3.Database('./SQLdatabase.db', (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, email TEXT)',(err)=>{
        if (err){
            console.error('Error running SQL query ' + err.message);
        } else {
            console.log('SQL query executed successfully.');
        }
    });

    db.run('CREATE TABLE IF NOT EXISTS dawgs (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, email TEXT)',(err)=>{
        if (err){
            console.error('Error running SQL query ' + err.message);
        } else {
            console.log('SQL query executed successfully.');
        }
    });

    db.run('CREATE TABLE IF NOT EXISTS brothers (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, email TEXT)',(err)=>{
        if (err){
            console.error('Error running SQL query ' + err.message);
        } else {
            console.log('SQL query executed successfully.');
        }
    });

});


router.get("/getData", (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {})

});
*/



export default router;