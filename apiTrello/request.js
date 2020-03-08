const axios = require('axios');
const baseURL = 'https://api.trello.com/1'

module.exports = () => {
  return axios.create({
    baseURL: baseURL,
  });
}