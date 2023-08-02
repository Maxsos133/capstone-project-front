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
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvc, setCvc] = useState('');

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

  const checkout = () => {
    const buyerEmail = localStorage.getItem('userEmail');
    fetch(`${import.meta.env.VITE_BASE_URL}/create-checkout-session`, {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      mode:"cors",
      body: JSON.stringify({
        buyerEmail,
          dress,
          size: customSize ? 'custom' : size,
          color,
          description,
          
        items: [
          {id:1, quantity: 1, price: 1, name: dress}
        ]
      })
    })
    .then(res => {
      if (res.ok) return res.json()
      return res.json().then(json => Promise.reject(json))
    })
    .then(({url})=>{
      window.location = url
    })
    .catch(e => {
      console.log(e.error)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    await checkout()
      
        const buyerEmail = localStorage.getItem('userEmail');
  
        const responseOrder = await axios.post(`${import.meta.env.VITE_BASE_URL}/orders/create`, {
          buyerEmail,
          dress,
          size: customSize ? 'custom' : size,
          color,
          description,
          customSizeValues,
        });
  
        // Handle the order response
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
      
    
  };
  

  return (
    <div>
      <h2 className='startOrderTitle'>Start Order</h2>
      {/* <button onClick={checkout}>CHECKOUT</button> */}
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
      {/* <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
      <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Card Number" />
      <input type="text" value={expMonth} onChange={(e) => setExpMonth(e.target.value)} placeholder="Expiration Month" />
      <input type="text" value={expYear} onChange={(e) => setExpYear(e.target.value)} placeholder="Expiration Year" />
      <input type="text" value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="CVC" /> */}
          <button className='submitOrderBtn' type="submit">Pay Now</button>
          
        </form>
      ) : (
        <h2>Please log in to start an order.</h2>
      )}
    </div>
  );
}
