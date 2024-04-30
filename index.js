const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000 ;


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ronnby7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



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
    // await client.connect();

    const itemCollection = client.db('addItemDB').collection('addItem')
    

    app.get('/addItem', async(req, res) =>{
      const cursor = itemCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/allItem', async(req, res) =>{
      const cursor = itemCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/addItem/:id', async(req, res) => {
      const id = req.params.id ;
      const query = {_id: new ObjectId(id)}
      const result = await itemCollection.findOne(query) ;
      res.send(result);
    })

    app.get('/allItem/:id', async(req, res) => {
      const id = req.params.id ;
      const query = {_id: new ObjectId(id)}
      const result = await itemCollection.findOne(query) ;
      res.send(result);
    })


    app.post('/addItem', async(req, res) =>{
      const newAddItem = req.body;
      console.log(newAddItem)

      const result = await itemCollection.insertOne(newAddItem)
      res.send(result);
    })


    

   app.get('/myList/:email', async(req, res) =>{
    console.log(req.params.email)
    const result = await itemCollection.find({userEmail: req.params.email}).toArray()
    res.send(result)
   })

  


   app.get('/myList/details/:id', async(req, res)=>{
    const id = req.params.id 
    const query = {_id: new ObjectId(id)}
    
    const result = await itemCollection.findOne(query)
    res.send(result)
   })

   app.delete('/myList/:id', async(req, res) =>{
    const id = req.params.id 
    const query = {_id: new ObjectId(id)}
    const result = await itemCollection.deleteOne(query)
    res.send(result)
   })


   app.put('/myList/:id' , async(req, res) =>{
    const id = req.params.id
    const filter = {_id: new ObjectId(id)}
    const options = {upsert: true} 
    const updatedItem = req.body
    const newItem = {
      $set: {
           name: updatedItem.name,
           imageUrl: updatedItem.imageUrl,
           price: updatedItem.price,
           rating: updatedItem.rating,
           stockStatus: updatedItem.stockStatus,
           subcategory:updatedItem.subcategory,
           description: updatedItem.description,
           time: updatedItem.time,
           customization: updatedItem.customization,
      }
    }

    const result = await itemCollection.updateOne(filter, newItem, options)
    res.send(result)
   } )





    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) =>{
    res.send('woody snitch server is running')
});

app.listen(port, ()=>{
    console.log(`woody snitch server is running on port : ${port}`)
})