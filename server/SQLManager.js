import { Router } from 'express';
import sq from 'sequelize';


const router = Router();

const sequelize = new sq.Sequelize({
    dialect: 'sqlite',
    storage: "./SQLdatabase.sqlite"
});
const users = sequelize.define('User', {
    name: { type: sq.STRING, allowNull: false },
    age: { type: sq.INTEGER, allowNull: false },
    email: { type: sq.STRING, allowNull: false },
    mongoId: { type: sq.STRING, allowNull: true },
});
const dawgs = sequelize.define('Dawg', {
    name: { type: sq.STRING, allowNull: false },
    age: { type: sq.INTEGER, allowNull: false },
    email: { type: sq.STRING, allowNull: false },
    mongoId: { type: sq.STRING, allowNull: true },
});
const brothers = sequelize.define('Brother', {
    name: { type: sq.STRING, allowNull: false },
    age: { type: sq.INTEGER, allowNull: false },
    email: { type: sq.STRING, allowNull: false },
    mongoId: { type: sq.STRING, allowNull: true },
});
const uncs = sequelize.define('Uncs', {
    name:  { type: sq.STRING, allowNull: false },
    age: { type: sq.INTEGER, allowNull: false },
    email: { type: sq.STRING, allowNull: false },
    mongoId: { type: sq.STRING, allowNull: true },
});
const aunts = sequelize.define('Aunts', {
    name: { type: sq.STRING, allowNull: false },
    age: { type: sq.INTEGER, allowNull: false },
    email: { type: sq.STRING, allowNull: false },
    mongoId: { type: sq.STRING, allowNull: true },
});

sequelize.sync();

const tables = { users, dawgs, brothers, uncs, aunts };


router.get("/getAllData", async (req, res) => {
    try {

        const usersJSON = await users.findAll();
        const dawgsJSON = await dawgs.findAll();
        const brothersJSON = await brothers.findAll();
        const uncsJSON = await uncs.findAll();
        const auntsJSON = await aunts.findAll();

        res.json({ users: usersJSON, dawgs: dawgsJSON, brothers: brothersJSON, uncs: uncsJSON, aunts: auntsJSON });

    }catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

router.post("/addData", async (req, res) => {
    const {name, age, email} = req.body;
    let id = null;
    if(req.body.mongoId){
        id = req.body.mongoId;
    }
    console.log("Adding data to SQL with mongoId:", id);
    const table = tables[req.body.type];
    if (!table) {
        return res.status(400).json({ error: "Invalid table type" });
    }
    try {
        const newData = await table.create({ id, name, age, email });
        res.status(201).json(newData);
    } catch (error) {
        console.error("Error adding data:", error);
        res.status(500).json({ error: "Failed to add data" });
    }
});


router.post("/deleteData", async (req, res) => {
    
    let id = null;

    if(req.body.mongoId){
        id = req.body.mongoId;
    }

    const table = tables[req.body.collection];
    if (!table) {
        return res.status(400).json({ error: "Invalid table type" });
    }
    try {
        const deletedCount = await table.destroy({ where: { id } });
        if (deletedCount === 0) {
            return res.status(404).json({ error: "Data not found" });
        }
        res.json({ message: "Data deleted successfully" });
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({ error: "Failed to delete data" });
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



export default router ;

export { tables, sequelize };