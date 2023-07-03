import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_CAR, DELETE_CAR } from '../graphql/mutations';

const CarCard = ({ car, personID }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [year, setYear] = useState(car.year);
  const [make, setMake] = useState(car.make);
  const [model, setModel] = useState(car.model);
  const [price, setPrice] = useState(car.price);

  const [updateCar] = useMutation(UPDATE_CAR, {
    onError: (error) => {
      console.error("Error updating car", error);
    },
  });
  
  const handleSave = (e) => {
    e.preventDefault();
    console.log(personID,car.id)
    updateCar({
      variables: {
        id: car.id,
        year: year,
        make: make,
        model: model,
        price: price,
        personId: personID
      },
    }).catch((error) => {   
      console.log(error.message);
    });

    setIsEditing(false);
  };
  
    
  const [deleteCar] = useMutation(DELETE_CAR, {
    update(cache, { data: { deleteCar } }) {
      cache.evict({ id: cache.identify(deleteCar) });
      cache.gc();
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };


  const handleDelete = () => {
    deleteCar({
      variables: {
        id: car.id,
      },
    });
  };


  // CSS styles
  const cardStyle = {
    border: '1px solid #5D6D7E ',
    borderRadius: '6px',
    margin: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px',
    backgroundColor: '#ffffff'
  };

  const detailStyle = {
    display: 'flex',
    gap: '8px'
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
    padding: '4px 8px',
    cursor: 'pointer',

  };

  return (
    <div style={cardStyle}>
      {isEditing ? (
        <form>
          <label>
            Year:
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            />
          </label>
          <label>
            Make:
            <input
              type="text"
              value={make}
              onChange={(e) => setMake(e.target.value)}
            />
          </label>
          <label>
            Model:
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </label>
          <label>
            Price:
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
            />
          </label>
          <button style={editButtonStyle} onClick={(e) => handleSave(e)}>Save</button>
        </form>
      ) : (
        <>
          <div style={detailStyle}>
            <p>Year: {car.year}</p>
            <p>Make: {car.make}</p>
            <p>Model: {car.model}</p>
            <p>Price: ${car.price}</p>
          </div>
          <div style={buttonContainerStyle}>
            <button style={editButtonStyle} onClick={handleEdit}>Edit</button>
            <button style={deleteButtonStyle} onClick={handleDelete}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CarCard;
