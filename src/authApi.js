import axios from 'axios'

// Base URL configuration (optional, if your API URL is different from your frontend)
const API_BASE_URL = 'http://localhost:5000'
//process.env.REACT_APP_API_BASE_URL || '' // Use .env file to manage base URLs

// Function to handle login API request
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      username,
      password,
    })

    // Return the response data (e.g., token, user info)
    return response.data
  } catch (error) {
    // Forward error to the calling function (can be used for handling errors)
    throw error.response ? error.response.data : { message: 'An error occurred' }
  }
}

// Function to handle login API request
export const postAPI = async (requestData, path) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${path}`, requestData)
    // Return the response data (e.g., token, user info)
    return response.data
  } catch (error) {
    // Forward error to the calling function (can be used for handling errors)
    throw error.response ? error.response.data : { message: 'An error occurred' }
  }
}
