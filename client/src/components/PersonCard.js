import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { UPDATE_PERSON, DELETE_PERSON } from '../graphql/mutations';
import { GET_CARS_BY_PERSON_ID } from '../graphql/queries';
import CarCard from './CarCard';

const PersonCard = ({ person }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(person.firstName);
  const [lastName, setLastName] = useState(person.lastName);

  const [updatePerson] = useMutation(UPDATE_PERSON, {
    onCompleted: (data) => {
      setFirstName(data.updatePerson.firstName);
      setLastName(data.updatePerson.lastName);
    },
  });

  const [deletePerson] = useMutation(DELETE_PERSON, {
    update(cache, { data: { deletePerson } }) {
      cache.evict({ id: cache.identify(deletePerson) });
      cache.gc();
    },
  });



  console.log(person.id);

  const { loading: carsLoading, error: carsError, data: carsData } = useQuery(GET_CARS_BY_PERSON_ID, {
    variables: { personId: String(person.id) },
    fetchPolicy: 'cache-and-network',  
  });

  if (carsError) console.log(carsError);

  const cars = carsData ? carsData.getCarsByPersonId : [];


  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updatePerson({
      variables: {
        id: person.id,
        firstName,
        lastName,
      },
    });
    setIsEditing(false);
  };

  const handleDeletePerson = () => {
    deletePerson({
      variables: {
        id: person.id,
      },
    });
  };

  // CSS styles
  const cardStyle = {
    border: '1px solid #5D6D7E',
    borderRadius: '6px',
    margin: '14px',
    backgroundColor: '#ffffff' 
  };

  const contentStyle = {
    padding: '14px',
  };

  const titleContainerStyle = {
    borderBottom: '1px solid #5D6D7E',
    padding: '14px',
    backgroundColor: '#f9f9f9', 
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '8px'
  };

  const editButtonStyle = {
    borderRadius: '6px',
    backgroundColor: '#2874A6',
    color: 'white',
    border: 'none',
    padding: '4px 8px',
    cursor: 'pointer',

  };

  const deleteButtonStyle = {
    borderRadius: '6px',
    backgroundColor: '#BA4A00',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',

  };

  const moreDetailButtonStyle = {
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',

  };

  const learnMoreStyle = {
    fontSize: '1rem',
    borderTop: '1px solid #5D6D7E',
    marginTop: '12px',
    paddingTop: '12px',
  };

  return (
    <div style={cardStyle}>
      {isEditing ? (
        <form>
          <label>
            First Name:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <br />
          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <br />
          <button type="button" onClick={handleSave}>
            Save
          </button>
        </form>
      ) : (
        <div style={titleContainerStyle}>
          <h3>{person.firstName} {person.lastName}</h3>
          <div style={buttonContainerStyle}>
            <button type="button" style={editButtonStyle} onClick={handleEdit}>
              Edit
            </button>
            <button type="button" style={deleteButtonStyle} onClick={handleDeletePerson}>
              Delete
            </button>
          </div>
        </div>
      )}
      <div style={contentStyle}>
        <h4>Cars:</h4>
        {carsLoading ? <p>Loading cars...</p> : (
          carsError ? <p>Error loading cars: {carsError.message}</p> : (
            cars.map((car) => (
              <CarCard key={car.id} car={car} personID={person.id} />
            ))
          )
        )}
        <div style={learnMoreStyle}>
          <Link to={`/people/${person.id}`}>
            <button style={editButtonStyle}>LEARN MORE</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PersonCard;
