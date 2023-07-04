import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PEOPLE } from '../graphql/queries';
import { ADD_CAR } from '../graphql/mutations';
import { GET_CARS_BY_PERSON_ID } from '../graphql/queries';

const CarForm = () => {
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [personId, setPersonId] = useState('');
  const [id, setCarID] = useState(9);

  const { loading, error, data, refetch } = useQuery(GET_PEOPLE);

  const [addCar] = useMutation(ADD_CAR, {
    refetchQueries: [{
      query: GET_CARS_BY_PERSON_ID,
      variables: { personId: personId },
    }],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('button clicked')
    console.log(year,make,model,price,personId)
    try {
      const { data: { addCar: cars } } = await addCar({
        variables: {
          year: parseInt(year),
          make,
          model,
          price: parseFloat(price),
          personId,
        },
      });

      setCarID(id + 1);

      //console.log('Added car, full list of cars:', cars);
      setYear('');
      setMake('');
      setModel('');
      setPrice('');
      setPersonId('');
      refetch();
    } catch (error) {
      console.log('Mutation error:', error); 
      console.error('Full error message:', error.message); 
      console.error('Error details:', error.networkError.result.errors); 
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { getPeople } = data;


  // Check if getPeople array is empty
if (!getPeople.length) return <p></p>; 


  // CSS styles
  const inputStyle = {
    borderRadius: '12px',
    padding: '6px',
    margin: '6px',
    width: '160px',
  };

  const buttonStyle = {
    borderRadius: '12px',
    padding: '12px',
    backgroundColor: '#19397d',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    margin: '6px'
  };

  const formContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '17vh'
  };

  const titleStyle = {
    padding: '12px 0', 
    textAlign: 'center'
  }

  return (
    <div style={formContainerStyle}>
            <h2 style={titleStyle}>Add a car:</h2>

      <form onSubmit={handleSubmit} className="horizontal-form">
        <label>
          Year:
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label>
          Make:
          <input
            type="text"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label>
          Model:
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label>
          Person:
          <select value={personId} onChange={(e) => setPersonId(e.target.value)} style={inputStyle}>
            <option value="">Select a person</option>
            {getPeople.map((person) => (
              <option key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" style={buttonStyle}>Add Car</button>
      </form>
    </div>
  );
};

export default CarForm;
