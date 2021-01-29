const dynamo = require('./Libs/dynamodb');
// const express = require('express')
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { origins: '*:*'});
const bodyParser = require('body-parser')
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggeroptions = require('./Libs/swaggeroptions')
const swaggerDocs = swaggerJsDoc(swaggeroptions);

app.use( "/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

const userRoute = require("./Routers/userrouter");
const needRoute = require("./Routers/needrouter");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.get('/',(req,res)=>{
  res.set('Content-Type', 'text/html');
  res.send(Buffer.from(`<p>HELLO NEEDS ${process.env.DENEME}</p><a href="/api-docs/">Api Docs Swagger</a>`));
})
app.use("/users", userRoute);
app.use("/need",needRoute);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
});