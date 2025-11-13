import axios from 'axios';
export const getGames = async () => {
    try {
      const response = await axios.get('http://localhost:5000/games', {
    })
      return response;
    } catch (error) {
      throw error.response.data;
    }
  };




