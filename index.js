
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express()
const port=process.env.PORT ||5000;


//middleware
app.use(cors())
app.use(express.json());


console.log(process.env.DB_USER);

console.log(process.env.DB_PASS);

// const uri = "mongodb+srv://<username>:<password>@cluster0.lpby0zb.mongodb.net/?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lpby0zb.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const BrandData = client.db('brand-show').collection('dataforall');
const useCollection=client.db('brand-show').collection('user')


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    app.post('/dataforall',async(req,res)=>{
      const newbrand=req.body;
      console.log(newbrand);
      const result=await BrandData.insertOne(newbrand)
      res.send(result)
    })
    

    app.get('/dataforall/:name',async(req,res)=>{
      const name=req.params.name;
      const query={BrandName:{$eq :name}}
      const result=await BrandData.find(query).toArray()
      res.send(result)
    
    })
    app.get('/dataforall/:id',async(req,res)=>{
      const id=req.params.id;
      const query={ID:new ObjectId(id)}
      const result=await BrandData.findOne(query)
      res.send(result);
    
    })

    app.get('/dataforshow/:id',async(req,res)=>{
      const id=req.params.id;
      const query={ID:id}
      const result=await BrandData.findOne(query)
      res.send(result)
    
    })

   

    
    // user related

    app.post('/user',async(req,res)=>{
      const user=req.body;
      console.log(user);
      const result=await useCollection.insertOne(user)
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



app.get('/',(req,res)=>{
    res.send('brand server is running')
})



app.listen(port,()=>{
    console.log(`brands server is running ${port}`);
})

// https://catnip-eyelash-300.notion.site/Connecting-to-MongoDB-c56566f4ae55489b9a59f90180bcef8b