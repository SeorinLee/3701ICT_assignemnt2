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
    return response.json();
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
    return response.json();
  } catch (error) {
    console.error('SignUp Error:', error);
  }
};

export const updateUser = async (name, password, token) => {
  try {
    console.log('Updating user with:', { name, password, token }); // 디버그 로그 추가
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
    console.log('Update response:', jsonResponse); // 응답 로그 추가
    if (!response.ok) {
      console.error('Network response was not ok:', response.statusText); // 네트워크 응답 확인
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return jsonResponse;
  } catch (error) {
    console.error('Update User Error:', error); // 에러 로그 추가
    throw error;
  }
};
