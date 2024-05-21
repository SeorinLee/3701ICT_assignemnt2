// src/api/api.js
const API_URL = 'http://192.168.0.45:3000';

export const signIn = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/users/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  } catch (error) {
    console.error('SignIn Error:', error);
  }
};

export const signUp = async (name, email, password) => {
  try {
    const response = await fetch(`${API_URL}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password })
    });
    return response.json();
  } catch (error) {
    console.error('SignUp Error:', error);
  }
};

export const updateUser = async (name, password, token) => {
  try {
    const response = await fetch(`${API_URL}/users/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, password })
    });
    return response.json();
  } catch (error) {
    console.error('Update User Error:', error);
  }
};
