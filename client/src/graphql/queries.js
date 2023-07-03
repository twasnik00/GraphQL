import { gql } from '@apollo/client';

export const GET_PEOPLE = gql`
  query GetPeople {
    getPeople {
      id
      firstName
      lastName
    }
  }
`;

export const GET_PERSON = gql`
  query GetPerson($id: ID!) {
    getPerson(id: $id) {
      id
      firstName
      lastName
    }
  }
`;

export const GET_PERSON_WITH_CARS = gql`
  query GetPersonWithCars($id: ID!) {
    personWithCars(id: $id) {
      id
      firstName
      lastName
    }
  }
`;

export const ADD_PERSON = gql`
  mutation AddPerson($firstName: String!, $lastName: String!) {
    addPerson(firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;

export const GET_ALL_CARS = gql`
  query GetAllCars {
    getAllCars {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

export const UPDATE_PERSON = gql`
  mutation UpdatePerson($id: ID!, $firstName: String!, $lastName: String!) {
    updatePerson(id: $id, firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;


export const DELETE_PERSON = gql`
  mutation DeletePerson($id: ID!) {
    deletePerson(id: $id)
  }
`;

export const GET_CARS_BY_PERSON_ID = gql`
  query GetCarsByPersonId($personId: ID!) {
    getCarsByPersonId(personId: $personId) {
      id
      year
      make
      model
      price
    }
  }
`;