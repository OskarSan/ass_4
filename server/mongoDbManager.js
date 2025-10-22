import mongoose, { connect } from "mongoose";
import { Router, request, response } from "express";
import user from "./models/User.js";
import mom from "./models/Mom.js"
import dad from "./models/Dad.js";
import sister from "./models/Sister.js";
import brother from "./models/Brother.js";
import dawg from "./models/Dawg.js";

const router = Router();


const MONGODB_DIS_1 = process.env.MONGODB_DIS_1;
const MONGODB_DIS_2 = process.env.MONGODB_DIS_2;
const MONGODB_DIS_3 = process.env.MONGODB_DIS_3;


const collections = {
  users: mongoose.model("User"),
  moms: mongoose.model("Mom"),
  dads: mongoose.model("Dad"),
  sisters: mongoose.model("Sister"),
  brothers: mongoose.model("Brother"),
  dawgs: mongoose.model("Dawg"),
};



router.post("/selectDB", (req, res) => {
    mongoose.disconnect();
    const { buttonId } = req.body;
    let mongoURI;
    switch (buttonId) {
        case "database1":
            mongoURI = process.env.MONGODB_DIS_1;
            break;
        case "database2":
            mongoURI = process.env.MONGODB_DIS_2;
            break;
        case "database3":
            mongoURI = process.env.MONGODB_DIS_3;
            break;
        default:
            return res.status(400).json({ error: "Invalid database selection" });
    }

    mongoose
        .connect(mongoURI)
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.error("MongoDB connection error:", err));
    res.json({ connected: mongoURI });

});

router.post("/addRandomData", async (req, res) => {

    let newData;
    let name
    switch (req.body.collection) {
        case "users":
            name = `User${Math.floor(Math.random() * 1000)}`;
            break;
        case "moms":
            name = `Mom${Math.floor(Math.random() * 1000)}`;
            break;
        case "dads":
            name = `Dad${Math.floor(Math.random() * 1000)}`;
            break;
        case "sisters":
            name = `Sister${Math.floor(Math.random() * 1000)}`;
            break;
        case "brothers":
            name = `Brother${Math.floor(Math.random() * 1000)}`;
            break;
        case "dawgs":
            name = `Dawg${Math.floor(Math.random() * 1000)}`;
            break;
        default:
            return res.status(400).json({ error: "Invalid collection name" });
    }
    const age = Math.floor(Math.random() * 100);
    const email = `${name.toLowerCase()}@example.com`;
    const collection = getCollection(req.body.collection);
    newData = new collection({ name, age, email });
    try {
        await newData.save();
        res.status(201).json({ message: "Data added successfully" });
    } catch (error) {
        console.error("Error adding data:", error);
        res.status(500).json({ error: "Failed to add data" });
    }

});

router.post("/addSetData", async (req,res) => {
    const { name, age, email } = req.body;
    const collection = getCollection(req.body.type);
    const newData = new collection({ name, age, email });
    try {
        await newData.save();
        res.status(201).json({ message: "Data added successfully" });
    } catch (error) {
        console.error("Error adding data:", error);
        res.status(500).json({ error: "Failed to add data" });
    }
});

router.get("/getAllData", async (req, res) => {
    try {
        const users = await user.find();
        const moms = await mom.find();
        const dads = await dad.find();
        const sisters = await sister.find();
        const brothers = await brother.find();
        const dawgs = await dawg.find();

        res.json({ users: users, dawgs: dawgs, brothers: brothers, sisters: sisters, dads: dads, moms: moms });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

router.post("/updateData", async (req, res) => {
    const { id, name, age, email } = req.body;
    try {
        const collection = getCollection(req.body.collection);
        const updatedUser = await collection.findByIdAndUpdate(id, { name, age, email }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user" });
    }
});

router.post("/deleteData", async (req, res) => {
    const { id } = req.body;
    console.log("Deleting user with ID:", id, " from collection:", req.body.collection);
    try {
        const collection = getCollection(req.body.collection);
        const deletedUser = await collection.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

function getCollection(collectionName) {
    switch (collectionName) {
        case "users":
            return user;
        case "moms":
            return mom;
        case "dads":
            return dad;
        case "sisters":
            return sister;
        case "brothers":
            return brother;
        case "dawgs":
            return dawg;
        default:
            throw new Error("Invalid collection name");
    }
}

export default router;

export { collections };