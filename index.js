const express = require('express');
const cors = require("cors");
require('dotenv').config();
const app = express()
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());

 

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fxm2qso.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const database = client.db("insertDB");
        const haiku = database.collection("haiku");

        const userCollection = client.db("travelDB").collection("travelSport");


        app.get('/all-tourists-sport', async (req, res) => {
            const data = userCollection.find();
            const result = await data.toArray();
            res.send(result);
        })

        app.get('/view-details/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const quary = { _id: new ObjectId(id) };
            const result = await userCollection.findOne(quary);
            res.send(result);
        })

        app.get('/my-list/:email', async (req, res) => {
            // console.log(req);
            // console.log();
            // console.log(params)
            // console.log(req,params)
            // console.log(req.body);
            // const email = req.params.email;
            // const email = "bulbulahammedjibon@gmail.com";
            const email = req.params.email;
            const quary = { AddedUserData : email  };
            
            const data = userCollection.find(quary);
            const result = await data.toArray();

            res.send(result);
        })


        app.post('/add-tourists-sport', async (req, res) => {
            const newSport = req.body;
            console.log(newSport);
            const result = await userCollection.insertOne(newSport);
            res.send(result);
        })

        app.put('/update-card/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateData = req.body;
            
            const updateDoc = {
                $set: {
                    image: updateData.image, touristSpotName: updateData.touristSpotName, countryName: updateData.countryName, location: updateData.location, shortDescription: updateData.shortDescription, averageCost: updateData.averageCost, seasonality: updateData.seasonality, travelTime: updateData.travelTime, totalVisitorsPerYear: updateData.totalVisitorsPerYear, AddedUserData: updateData.AddedUserData,
                }
            }
            const result = await userCollection.updateOne(query, updateDoc, options);
            res.send(result);
        })

        app.delete('/delete-card/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// app.put('/add', async(req,res)=>{
// const data = await req.body;
//    console.log(data);
//    res.send(data);

// })


// app.get('/', (req, res) => {

// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})