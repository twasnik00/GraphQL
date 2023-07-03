import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_PERSON, GET_PEOPLE } from '../graphql/queries';


const PersonForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [addPerson] = useMutation(ADD_PERSON);

  const { loading, error, data, refetch } = useQuery(GET_PEOPLE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPerson({
        variables: {
          firstName,
          lastName,
        },
      });
      setFirstName('');
      setLastName('');
      refetch(); 
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { getPeople } = data;

  // CSS styles
  const inputStyle = {
    borderRadius: '12px',
    padding: '6px',
    margin: '6px'
  };

  const buttonStyle = {
    borderRadius: '12px',
    padding: '12px',
    backgroundColor: '#009688',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    margin: '6px',
  };

  const parentDivStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '12vh' 
  };

  return (
    <div style={parentDivStyle}>
      <h2>Add Person</h2>
      <form onSubmit={handleSubmit} className="horizontal-form">
        <label>
          First Name:
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={inputStyle}
          />
        </label>
        <button type="submit" style={buttonStyle}>Add Person</button>
      </form>
    </div>
  );
};

export default PersonForm;
