import axios from 'axios';

// 실제 기기에서 테스트할 IP 주소로 API URL을 설정합니다.
const API_URL = 'http://192.168.0.45:3000';

export const signUp = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/signup`, userData);
    return response.data;
  } catch (error) {
    return { status: 'error', message: 'Failed to sign up.' };
  }
};

export const signIn = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/users/signin`, credentials);
    return response.data;
  } catch (error) {
    return { status: 'error', message: 'Failed to sign in.' };
  }
};

export const updateUser = async (userData, token) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.put(`${API_URL}/users/update`, userData, config);
    return response.data;
  } catch (error) {
    return { status: 'error', message: 'Failed to update user information.' };
  }
};
