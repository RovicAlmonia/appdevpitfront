import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const Register = ({ history }) => {
const [form, setForm] = useState({ username: '', email: '', password: '' });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form);
    history.push('/login');
  };

return (
  
    <form onSubmit={handleSubmit}>
     
      <h2>Register</h2> 
       <input
        name="email"
        type="email"
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="username"
        onChange={handleChange}
        placeholder="Username"
        required
      />
     
      <input
        name="password"
        type="password"
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <button type="submit">Register</button>
       <button className="link" onClick={() => navigate('/Login')}>Back to login</button>
    </form>
  );
};
export default Register;
