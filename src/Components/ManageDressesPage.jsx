import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManageDressesPage() {
  const [dresses, setDresses] = useState([]);
  const [newDress, setNewDress] = useState({
    name: '',
    image: '',
    description: '',
    price: '',
  });

  useEffect(() => {
    fetchDresses();
  }, []);

  const fetchDresses = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/dress`);
      setDresses(response.data);
    } catch (error) {
      console.log('Error fetching dresses:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/dress/create`, newDress);
      setNewDress({
        name: '',
        image: '',
        description: '',
        price: '',
      });
      fetchDresses();
    } catch (error) {
      console.log('Error creating dress:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/dress/${id}`);
      fetchDresses();
    } catch (error) {
      console.log('Error deleting dress:', error);
    }
  };

  return (
    <div className='manageDress' >
      <h3>Add a New Dress</h3>
      <form className='CreateDressForm' onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={newDress.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Image URL:</label>
          <input type="text" name="image" value={newDress.image} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={newDress.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" name="price" value={newDress.price} onChange={handleChange} required />
        </div>
        <button className='createDressBtn' type="submit">Create Dress</button>
      </form>

      <h3>Existing Dresses</h3>
      <ul>
        {dresses.map((dress) => (
          <li key={dress._id}>
            <strong>{dress.name}</strong> - {dress.description} (Price: ${dress.price})
            <button className='deleteDressBtn' onClick={() => handleDelete(dress._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
