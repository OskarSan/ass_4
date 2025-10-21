import {Router} from "express";
import mongoose from "mongoose";
import {collections} from "./mongoDbManager.js"
import {tables} from "./SQLManager.js"


const router = Router();




router.post("/checkDataLocation", async (req, res) => {
    const formData = {
        type: req.body.type,
        name: req.body.name,
        age: req.body.age,
        email: req.body.email
    };

    console.log(formData.type);
    const reqDestination = req.header("destAPI");

    let mongoCollectionCheck = false;
    let sqlTableCheck = false;

    console.log("reqDest: " + reqDestination);
    if (!reqDestination) {
        return res.status(400).json({ error: "Destination API not specified in the header." });
    }

    // Log the available MongoDB collections
    //console.log("Available MongoDB collections:", Object.keys(collections));

    if (formData.type && collections.hasOwnProperty(formData.type)) {
        mongoCollectionCheck = true;
        try {
            const apiUrl = `http://localhost:3000/api/mongoDbManager/${reqDestination}`; // Construct the full API URL
            const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData), // Forward the form data
            });

            // Relay the response from the destination API back to the client
            if (!response.ok) {
                const errorText = await response.text(); // Read the response as text
                console.error("Error forwarding request:", errorText);
                return res.status(response.status).json({ error: "Failed to forward request to the destination API." });
            }
            const data = await response.json();
            res.status(response.status).json(data);
        } catch (error) {
            console.error("Error forwarding request:", error);
            res.status(500).json({ error: "Failed to forward request to the destination API." });
        }

    } 
    if (formData.type && tables.hasOwnProperty(formData.type)) {
        sqlTableCheck = true;
        try {
            const apiUrl = `http://localhost:3000/api/SQLManager/${reqDestination}`; // Construct the full API URL
            const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData), // Forward the form data
            });

            // Relay the response from the destination API back to the client
            const data = await response.json();
            res.status(response.status).json(data);
        } catch (error) {
            console.error("Error forwarding request:", error);
            res.status(500).json({ error: "Failed to forward request to the destination API." });
        }  
    }

    if (!mongoCollectionCheck && !sqlTableCheck) {
        return  res.status(400).json({ error: "Invalid type specified." });
    }



});

export default router;