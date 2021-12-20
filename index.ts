import loginRouter from './routes/login'
import swDocument from './swagger.def'
import {Request, Response} from 'express'

const { sequelize, Phone } = require("./models");

const express = require('express'),
  http = require('http'),
  swaggerUI = require('swagger-ui-express')
const app = express()
const bodyParser = require('body-parser').json()

app.use(bodyParser)
app.use(express.json())
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swDocument))
app.use('/login', loginRouter)
const server = http.createServer(app)

const hostname = '0.0.0.0'
const port = 3001
server.listen(port, hostname, async () => {
  console.log(`Server running at http://${hostname}:${port}`)
  await sequelize.authenticate()
  // await sequelize.sync()
  console.log("Database connected successfully")
})

app.post("/shirts", async (req: Request, res: Response) => {
  const { name, color, brand,size } = req.body;

  try {
    const product = await Shirt.create({ name,color, brand,size });

    return res.json(product);
  } catch (err) {
    return res.json(err);
  }
});

app.get("/shirts", async (_: Request, res: Response) => {
  try {
    const products = await Shirt.findAll();

    return res.json(products);
  } catch (err) {
    return res.json(err);
  }
});

app.get("/shirts/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const product = await Shirt.findOne({
      where: { id },
    });

    return res.json([product]);
  } catch (err) {
    return res.json(err);
  }
});

app.put("/shirts/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name,color, brand, size} = req.body;

  try {
    const product = await Shirt.findOne({
      where: { id },
    });

    product.name = name;
    product.color = color;
    product.brand = brand;
    product.size = size;

    await product.save();

    return res.json(product);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
});

app.delete("/shirts/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const product = await Shirt.findOne({
      where: { id },
    });

    await product.destroy();
    return res.json({ message: "Shirt deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
});