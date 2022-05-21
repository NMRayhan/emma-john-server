const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hsjbu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("emmaJohn").collection("Products");

    app.get("/product", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log(page, size);
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.skip(page*size).limit(size).toArray();
      res.send(products);
    });

    app.get("/productCount", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const countProduct = await productCollection.estimatedDocumentCount();
      res.send({ countProduct });
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("john is running waiting for emma");
});

app.listen(port, () => {
  console.log("emma john running in ", port);
});
