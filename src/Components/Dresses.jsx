import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dresses() {
  const [dresses, setDresses] = useState([]);

  useEffect(() => {
    const fetchDresses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/dress`);
        setDresses(response.data);
      } catch (error) {
        console.log('Error fetching dresses:', error);
      }
    };

    fetchDresses();
  }, []);

  return (
    <div className="dresses-container">
      <h2>Dresses Page</h2>
      <div className="dresses-grid">
        {dresses.map((dress) => (
          <div key={dress.id} className="dress-item">
            <img src={dress.image} alt={dress.name} />
            <h3>{dress.name}</h3>
            <p>{dress.description}</p>
            <p>Price: ${dress.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
