const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const Person = require("./models/person");

// const password = process.argv[2];

// const Person = mongoose.model("Person", personSchema);

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

morgan.token("body", (req, res) => JSON.stringify(req.body));

// Use Morgan with a custom format that includes the 'body' token
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// app.use(morgan("dev"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
  // const id = Number(request.params.id);
  // const person = persons.find((person) => person.id === id);
  // if (person) {
  //   response.json(person);
  // } else {
  //   response.status(404).end();
  // }
});

app.get("/info", (request, response) => {
  const numPersons = persons.length;
  const now = new Date();
  const html = `<p>Phonebook has info for ${numPersons} people</p><p>${now}</p>`;

  response.send(html);
});

const generateId = () => {
  // Create a random number between 0 and 1, and remove the "0." at the beginning.
  const randomPart = Math.random().toString().slice(2);

  // Combine the current timestamp with the random part.
  const uniqueId = Date.now().toString() + randomPart;

  return uniqueId;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.number || !body.name) {
    return response.status(400).json({
      error: "The name or number missing",
    });
  }

  if (persons.some((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "Name must be unique",
    });
  }

  // const person = {
  //   id: generateId(),
  //   name: body.name,
  //   number: body.number,
  // };

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });

  // persons = persons.concat(person);

  // response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
