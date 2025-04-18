import axios from 'axios';

const BASE_URL = 'http://20.244.56.144/evaluation-service';

// Registration details
const registrationData = {
  email: "nikhil.gupta_cs22@gla.ac.in",
  name: "Nikhil Gupta",
  rollNo: "2215001155",
  githubUsername: "nikhilgupta2533",
  mobileNo: "8171055129",
  collegeName: "GLA University",
  accessCode: "CNneGT"
};

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Register with the server
export const register = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, registrationData);
    const { clientId, clientSecret } = response.data;
    localStorage.setItem('clientId', clientId);
    localStorage.setItem('clientSecret', clientSecret);
    return { clientId, clientSecret };
  } catch (error) {
    if (error.response && error.response.status === 409) {
      // Already registered, use stored credentials
      const credentials = {
        clientId: "d9cbb699-6a27-44a5-8d59-8b1befa816da",
        clientSecret: "tVJaaaRBSeXcRXeM"
      };
      localStorage.setItem('clientId', credentials.clientId);
      localStorage.setItem('clientSecret', credentials.clientSecret);
      return credentials;
    }
    console.error('Registration failed:', error.message);
    throw error;
  }
};

// Get authorization token
export const getAuthToken = async () => {
  try {
    const clientId = localStorage.getItem('clientId');
    const clientSecret = localStorage.getItem('clientSecret');
    
    if (!clientId || !clientSecret) {
      const credentials = await register();
      return await getAuthToken(); // Retry with new credentials
    }

    const response = await axios.post(`${BASE_URL}/auth`, {
      ...registrationData,
      clientId,
      clientSecret
    });

    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    return access_token;
  } catch (error) {
    console.error('Auth token retrieval failed:', error.message);
    throw error;
  }
};

// Ensure auth token is set in headers
const ensureAuth = async () => {
  let token = localStorage.getItem('access_token');
  if (!token) {
    token = await getAuthToken();
  }
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getUsers = async () => {
  await ensureAuth();
  const response = await api.get('/users');
  return response.data.users;
};

export const getUserPosts = async (userId) => {
  await ensureAuth();
  const response = await api.get(`/users/${userId}/posts`);
  return response.data.posts;
};

export const getPostComments = async (postId) => {
  await ensureAuth();
  const response = await api.get(`/posts/${postId}/comments`);
  return response.data.comments;
};

export default api; 