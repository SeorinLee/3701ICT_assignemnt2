// src/api/api.js
export const signIn = async (email, password) => {
  try {
    const response = await fetch('http://192.168.0.45:3000/users/signin', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    const jsonResponse = await response.json();
    console.log('SignIn Response:', jsonResponse); // 디버깅용 로그
    return jsonResponse;
  } catch (error) {
    console.error('SignIn Error:', error);
  }
};

export const signUp = async (name, email, password) => {
  try {
    const response = await fetch('http://192.168.0.45:3000/users/signup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password })
    });
    const jsonResponse = await response.json();
    console.log('SignUp Response:', jsonResponse); // 디버깅용 로그
    return jsonResponse;
  } catch (error) {
    console.error('SignUp Error:', error);
  }
};

export const updateUser = async (name, password, token) => {
  try {
    const response = await fetch('http://192.168.0.45:3000/users/update', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, password })
    });
    const jsonResponse = await response.json();
    console.log('UpdateUser Response:', jsonResponse); // 디버깅용 로그
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return jsonResponse;
  } catch (error) {
    console.error('Update User Error:', error);
    throw error;
  }
};

export const getCartItems = async (token) => {
  try {
    const response = await fetch('http://192.168.0.45:3000/cart', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const jsonResponse = await response.json();
    console.log('GetCartItems Response:', jsonResponse); // 디버깅용 로그
    return jsonResponse;
  } catch (error) {
    console.error('GetCartItems Error:', error);
  }
};

export const saveCartItems = async (token, items) => {
  try {
    const response = await fetch('http://192.168.0.45:3000/cart', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ items }),
    });
    const jsonResponse = await response.json();
    console.log('SaveCartItems Response:', jsonResponse); // 디버깅용 로그
    return jsonResponse;
  } catch (error) {
    console.error('SaveCartItems Error:', error);
  }
};

export const getOrders = async (token) => {
  try {
    const response = await fetch('http://192.168.0.45:3000/orders/all', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    const jsonResponse = await response.json();
    console.log('GetOrders Response:', jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.error('GetOrders Error:', error);
  }
};

export const createOrderAPI = async (token, items) => {
  try {
    const response = await fetch('http://192.168.0.45:3000/orders/neworder', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items })
    });
    const jsonResponse = await response.json();
    console.log('CreateOrder Response:', jsonResponse); // 디버깅용 로그
    return jsonResponse;
  } catch (error) {
    console.error('CreateOrder Error:', error);
  }
};

export const updateOrder = async (token, orderId, status) => {
  try {
    const response = await fetch('http://192.168.0.45:3000/orders/updateorder', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ orderID: orderId, ...status }),
    });
    const jsonResponse = await response.json();
    console.log('UpdateOrder Response:', jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.error('UpdateOrder Error:', error);
  }
};