const swaggerOptions = {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: "Needs API",
        description: "Needs API Information",
        contact: {
          name: "Needs Developer"
        },
        servers: ["http://localhost:3000"]
      },
      securityDefinitions: {
        auth: {
          type: 'apiKey',
          name: 'token'
        }
      },
      security: [
        { auth: [] }
      ]
    },
    apis: ["Routers/userrouter.js","Routers/needrouter.js"]
};
//deneme
module.exports = swaggerOptions;