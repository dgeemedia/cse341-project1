// swagger.js
// Run: `node swagger.js` or add "swagger": "node swagger.js" to package.json scripts
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contacts API',
    description: 'Auto-generated docs for contacts endpoints'
  },
  host: process.env.SWAGGER_HOST || 'localhost:3000',
  schemes: ['http'],
  // reusable example object for request bodies
  definitions: {
    Contact: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      favoriteColor: "blue",
      birthday: "1990-01-01"
    }
  },
  // Explicitly add POST/PUT path definitions so Swagger UI shows body editors
  paths: {
    "/contacts/": {
      post: {
        description: "Create a contact",
        consumes: ["application/json"],
        parameters: [
          { name: "body", in: "body", required: true, schema: { $ref: "#/definitions/Contact" } }
        ],
        responses: { 201: { description: "Created" }, 400: { description: "Bad Request" }, 500: { description: "Internal Server Error" } }
      }
    },
    "/contacts/{id}": {
      put: {
        description: "Update a contact by ID",
        consumes: ["application/json"],
        parameters: [
          { name: "id", in: "path", required: true, type: "string", description: "Contact id" },
          { name: "body", in: "body", required: true, schema: { $ref: "#/definitions/Contact" } }
        ],
        responses: { 200: { description: "OK" }, 400: { description: "Bad Request" }, 404: { description: "Not Found" }, 500: { description: "Internal Server Error" } }
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
