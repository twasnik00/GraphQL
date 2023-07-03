import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import PersonCard from './PersonCard';

const GET_PEOPLE = gql`
  query GetPeople {
    people {
      id
      firstName
      lastName
    }
  }
`;

function Home() {
  const { loading, error, data } = useQuery(GET_PEOPLE);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      {data.people.map((person) => (
        <div key={person.id}>
          <PersonCard person={person} />
          <Link to={`/people/${person.id}`}>Learn More</Link>
        </div>
      ))}
    </div>
  );
}

export default Home;
