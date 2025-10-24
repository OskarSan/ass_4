import {Router} from "express";
import mongoose from "mongoose";
import {collections} from "./mongoDbManager.js"
import {tables} from "./SQLManager.js"


const router = Router();

router.get("/getAllData", async (req, res) => {
    const reqDestination = req.header("destAPI");
    let returnData = {};
    if (!reqDestination) {
        return res.status(400).json({ error: "Destination API not specified in the header." });
    }
    //mongo fetch
    try{
        const apiUrl = `http://localhost:3000/api/mongoDbManager/${reqDestination}`; // Construct the full API URL
        const mongoResponse = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!mongoResponse.ok) {
            const errorText = await mongoResponse.text();
            console.error("Error fetching MongoDB data:", errorText);
            return res.status(mongoResponse.status).json({ error: "Failed to fetch data from MongoDB." });
        }

        const mongoData = await mongoResponse.json();
        returnData = { ...returnData, ...mongoData };

    } catch (error) {
        console.error("Error fetching MongoDB data:", error);
        return res.status(500).json({ error: "Failed to fetch data from MongoDB." });
    }


    //sql fetch
    try{
        const apiUrl = `http://localhost:3000/api/SQLManager/${reqDestination}`;
        const sqlResponse = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!sqlResponse.ok) {
            const errorText = await sqlResponse.text();
            console.error("Error fetching SQL data:", errorText);
            return res.status(sqlResponse.status).json({ error: "Failed to fetch data from SQL." });
        }

        const sqlData = await sqlResponse.json();

        for (const key in sqlData) {
            if (returnData[key]) {
                const mongoNames = new Set(returnData[key].map(item => item.name));
                const filteredSQLData = sqlData[key].filter(item => !mongoNames.has(item.name));
                returnData[key] = [...returnData[key], ...filteredSQLData]; // Combine arrays
            } else {
                returnData[key] = sqlData[key];
            }
        }

    } catch (error) {
        console.error("Error fetching SQL data:", error);
        return res.status(500).json({ error: "Failed to fetch data from SQL." });
    }

    res.json(returnData);
});


router.post("/checkDataLocation", async (req, res) => {
    const formData = {
        type: req.body.type,
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        mongoId: req.body._id || null, // Send mongoId if it exists
        id: req.body.id || null    
    };

    console.log(formData.type);
    console.log(tables);
    const reqDestination = req.header("destAPI");

    console.log("reqDest: " + reqDestination);
    if (!reqDestination) {
        return res.status(400).json({ error: "Destination API not specified in the header." });
    }
    
    let mongoResponseData = null;
    let sqlResponseData = null;


    // Log the available MongoDB collections
    //console.log("Available MongoDB collections:", Object.keys(collections));

    if (formData.type && collections.hasOwnProperty(formData.type)) {
        console.log("mongofetch started")

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
            } else {
                mongoResponseData = await response.json();
                console.log("MongoDB response received:", mongoResponseData);
            }
            
        } catch (error) {
            console.error("Error forwarding request:", error);
        }

    } 
    if (formData.type && tables.hasOwnProperty(formData.type)) {
        const mongoId = mongoResponseData ? mongoResponseData._id : null; // Use MongoDB ID if available
        const sqlData = {
            ...formData,
            mongoId: mongoId || null, // Add MongoDB ID if it exists, otherwise null
        };

        try {
            const apiUrl = `http://localhost:3000/api/SQLManager/${reqDestination}`;
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sqlData),
            });

            if (response.ok) {
                sqlResponseData = await response.json();
                console.log("SQL response received:", sqlResponseData);
            }
        } catch (error) {
            console.error("Error creating SQL item:", error);
        }
    }

    if (!mongoResponseData && !sqlResponseData) {
        return res.status(400).json({ error: "Invalid type specified or no data found in either database." });
    }

    const combinedResponse = {
        mongoData: mongoResponseData,
        sqlData: sqlResponseData,
    };

    res.json(combinedResponse);
});

export default router;