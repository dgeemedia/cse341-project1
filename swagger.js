// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contacts API',
    description: 'Auto-generated docs for contacts endpoints'
  },
  host: process.env.SWAGGER_HOST || 'localhost:3000',
  schemes: ['http'],
  // add reusable definitions (examples) to reference from paths
  definitions: {
    Contact: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      favoriteColor: "blue",
      birthday: "1990-01-01"
    }
  },
  // add/override explicit path info for PUT /contacts/{id}
  paths: {
    "/contacts/{id}": {
      put: {
        description: "Update a contact by ID",
        consumes: ["application/json"],
        parameters: [
          { name: "id", in: "path", required: true, type: "string", description: "Contact id" },
          { name: "body", in: "body", required: true, schema: { $ref: "#/definitions/Contact" } }
        ],
        responses: {
          200: { description: "OK" },
          400: { description: "Bad Request" },
          404: { description: "Not Found" },
          500: { description: "Internal Server Error" }
        }
      }
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = [
  './server.js',
  './routes/contacts.js',
  './routes/*.js'
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('swagger.json generated at', outputFile);
});
