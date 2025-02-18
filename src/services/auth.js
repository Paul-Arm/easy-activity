import axios from 'axios';

const apiUrl = process.env.VUE_APP_API_URL;

export function login(username, password) {
  const url = apiUrl + '/token';

  const body = {
      'username': username,
      'password': password
  };
  
  const headers ={
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
  };

  return axios.post(url, body, headers)
    .then(response => {
      localStorage.setItem('token', response.data.access_token);
      return response.data;
    });
}

export function logout() {
  localStorage.removeItem('token');
}

export function getAuthHeader() {
  const token = localStorage.getItem('token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});
