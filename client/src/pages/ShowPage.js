// src/pages/ShowPage.js
import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams, useHistory } from 'react-router-dom';  
import { GET_PERSON, GET_CARS_BY_PERSON_ID } from '../graphql/queries';
import PersonCard from '../components/PersonCard';
import CarCard from '../components/CarCard';

const ShowPage = () => {
  const { id } = useParams();
  const history = useHistory();  
  const { loading: personLoading, error: personError, data: personData } = useQuery(GET_PERSON, {
    variables: { id },
  });
  
  const { loading: carsLoading, error: carsError, data: carsData } = useQuery(GET_CARS_BY_PERSON_ID, {
    variables: { personId: id },
  });

  if (personLoading || carsLoading) return <p>Loading...</p>;
  if (personError) return <p>Error: {personError.message}</p>;
  if (carsError) return <p>Error: {carsError.message}</p>;

  return (
    <div>
      <PersonCard person={personData.getPerson} />

      <button onClick={() => history.push('/')}>Go back home</button> 
    </div>
  );
};

export default ShowPage;
