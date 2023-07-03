const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = gql`
type Person {
    id: ID!
    firstName: String!
    lastName: String!
  }

  type Car {
    id: ID!
    year: Int!
    make: String!
    model: String!
    price: Float!
    personId: ID!
  }

  type Query {
    getPeople: [Person]!
    getPerson(id: ID!): Person
    getCarsByPersonId(personId: ID!): [Car]!
  }

  type Mutation {
    addPerson(firstName: String!, lastName: String!): Person!
    updatePerson(id: ID!, firstName: String!, lastName: String!): Person!
    deletePerson(id: ID!): Person!
    addCar(year: Int!, make: String!, model: String!, price: Float!, personId: ID!): [Car]
    updateCar(id: ID!, year: Int!, make: String!, model: String!, price: Float!, personId: ID!): Car!
    deleteCar(id: ID!): Car!
  }
`;


const people = [
  {
    id: '1',
    firstName: 'Bill',
    lastName: 'Gates',
  },
  {
    id: '2',
    firstName: 'Steve',
    lastName: 'Jobs',
  },
  {
    id: '3',
    firstName: 'Linux',
    lastName: 'Torvalds',
  },
];

const cars = [
  {
    id: '1',
    year: 2019,
    make: 'Toyota',
    model: 'Corolla',
    price: 40000,
    personId: '1',
  },
  {
    id: '2',
    year: 2018,
    make: 'Lexus',
    model: 'LX 600',
    price: 13000,
    personId: '1',
  },
  {
    id: '3',
    year: 2017,
    make: 'Honda',
    model: 'Civic',
    price: 20000,
    personId: '1',
  },
  {
    id: '4',
    year: 2019,
    make: 'Acura',
    model: 'MDX',
    price: 60000,
    personId: '2',
  },
  {
    id: '5',
    year: 2018,
    make: 'Ford',
    model: 'Focus',
    price: 35000,
    personId: '2',
  },
  {
    id: '6',
    year: 2017,
    make: 'Honda',
    model: 'Pilot',
    price: 45000,
    personId: '2',
  },
  {
    id: '7',
    year: 2019,
    make: 'Volkswagen',
    model: 'Golf',
    price: 40000,
    personId: '3',
  },
  {
    id: '8',
    year: 2018,
    make: 'Kia',
    model: 'Sorento',
    price: 45000,
    personId: '3',
  },
  {
    id: '9',
    year: 2017,
    make: 'Volvo',
    model: 'XC40',
    price: 55000,
    personId: '3',
  },
];

const resolvers = {
  Query: {
    getPeople: () => people,
    getPerson: (parent, { id }) => {
      const person = people.find((person) => person.id === id);
      if (!person) throw new Error('Person not found');
      return person;
    },
    getCarsByPersonId: (parent, { personId }) => {
      const personCars = cars.filter((car) => car.personId === personId);
      if (!personCars.length) throw new Error('No cars found for this person');
      return personCars;
    },
  },

  Mutation: {
    addPerson: (parent, { firstName, lastName }) => {
      const newPerson = {
        id: String(people.length + 1),
        firstName,
        lastName,
      };
      people.push(newPerson);
      return newPerson;
    },
    updatePerson: (parent, { id, firstName, lastName }) => {
      const person = people.find((p) => p.id === id);
      if (!person) throw new Error('Person not found');
      person.firstName = firstName;
      person.lastName = lastName;
      return person;
    },
    
    deletePerson: (parent, { id }) => {
      const index = people.findIndex((person) => person.id === id);
      if (index === -1) throw new Error('Person not found');
    
      const updatedCars = cars.filter((car) => car.personId !== id);
    
      cars.splice(0, cars.length, ...updatedCars);
    
      const deletedPerson = people.splice(index, 1);
      return deletedPerson[0];
    },
    
    
    addCar: (parent, { year, make, model, price, personId }) => {
      const newCar = {
        id: String(cars.length + 1),
        year,
        make,
        model,
        price,
        personId,
      };
      cars.push(newCar);
      return cars;  // Return the entire list of cars.
    },
    
    updateCar: (parent, { id, year, make, model, price, personId }) => {
      const car = cars.find((c) => c.id === id);
      if (!car) throw new Error('Car not found');
      car.year = year;
      car.make = make;
      car.model = model;
      car.price = price;
      car.personId = personId;
      return car;
    },
    
    
    deleteCar: (parent, { id }) => {
      const index = cars.findIndex((car) => car.id === id);
      if (index === -1) throw new Error('Car not found');
      const deletedCar = cars.splice(index, 1);
      return deletedCar[0];
    },
  },
};

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  const app = express();

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startApolloServer().catch((err) => {
  console.error('Error starting Apollo Server:', err);
});