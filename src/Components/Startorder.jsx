import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Startorder() {
  const [dress, setDress] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [availableDresses, setAvailableDresses] = useState([]);
  const [customSize, setCustomSize] = useState(false);
  const [customSizeValues, setCustomSizeValues] = useState({
    bust: '',
    waist: '',
    hips: '',
    hollowToFloor: '',
    height: '',
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(!!isLoggedIn);
    fetchAvailableDresses();
  }, []);

  const fetchAvailableDresses = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/dress`);
      setAvailableDresses(response.data);
    } catch (error) {
      console.log('Error fetching available dresses:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const buyerEmail = localStorage.getItem('userEmail');
  
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/orders/create`, {
        buyerEmail,
        dress,
        size: customSize ? 'custom' : size,
        color,
        description,
        customSizeValues,
      });
  
      setMessage('Order created successfully.');
      setDress('');
      setSize('');
      setColor('');
      setDescription('');
      setCustomSize(false);
      setCustomSizeValues({
        bust: '',
        waist: '',
        hips: '',
        hollowToFloor: '',
        height: '',
      });
    } catch (error) {
      setMessage('Failed to create the order.');
    }
  };

  return (
    <div>
      <h2 className='startOrderTitle'>Start Order</h2>
      {message && <p>{message}</p>}
      {isLoggedIn ? (
        <form className='startOrderForm' onSubmit={handleSubmit}>
          <div>
            <label>Dress:</label>
            <select value={dress} onChange={(e) => setDress(e.target.value)} required>
              <option value="">Select a dress</option>
              {availableDresses.map((dress) => (
                <option key={dress._id} value={dress.name}>
                  {dress.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Size:</label>
            <select value={size} onChange={(e) => setSize(e.target.value)} required>
              <option value="">Select a size</option>
              <option value="US 2">US 2</option>
              <option value="US 4">US 4</option>
              <option value="US 6">US 6</option>
              <option value="US 8">US 8</option>
              <option value="US 10">US 10</option>
              <option value="US 12">US 12</option>
              <option value="US 14">US 14</option>
              <option value="US 16">US 16</option>
              <option value="custom">Custom Size</option>
            </select>
          </div>
          {size === 'custom' && (
            <div>
              <label>Bust cm:</label>
              <input
                type="text"
                value={customSizeValues.bust}
                onChange={(e) =>
                  setCustomSizeValues({ ...customSizeValues, bust: e.target.value })
                }
                required
              />
              <label>Waist cm:</label>
              <input
                type="text"
                value={customSizeValues.waist}
                onChange={(e) =>
                  setCustomSizeValues({ ...customSizeValues, waist: e.target.value })
                }
                required
              />
              <label>Hips cm:</label>
              <input
                type="text"
                value={customSizeValues.hips}
                onChange={(e) =>
                  setCustomSizeValues({ ...customSizeValues, hips: e.target.value })
                }
                required
              />
              <label>Hollow to Floor cm:</label>
              <input
                type="text"
                value={customSizeValues.hollowToFloor}
                onChange={(e) =>
                  setCustomSizeValues({ ...customSizeValues, hollowToFloor: e.target.value })
                }
                required
              />
              <label>Height cm:</label>
              <input
                type="text"
                value={customSizeValues.height}
                onChange={(e) =>
                  setCustomSizeValues({ ...customSizeValues, height: e.target.value })
                }
                required
              />
            </div>
          )}
          <div>
            <label>Color:</label>
            <input type="text" value={color} onChange={(e) => setColor(e.target.value)} required />
          </div>
          <div>
            <label>Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <button className='submitOrderBtn' type="submit">Submit Order</button>
        </form>
      ) : (
        <h2>Please log in to start an order.</h2>
      )}
    </div>
  );
}
