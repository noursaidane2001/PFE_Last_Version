import axios from 'axios';
export const getAllLive = async () => {
    try {
        const response = await axios.get("http://localhost:5000/live/all-live")

        return response.data;

    } catch (error) {
        return error.response.data;
    }
};

export const deleteLiveA = async (id, token) => {
    try {
        const response = await axios.delete(`http://localhost:5000/live/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data;

    } catch (error) {
        return error.response.data;
    }
};

export const deleteTour = async (id, token) => {
    try {
        const response = await axios.delete(`http://localhost:5000/tournament/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data;

    } catch (error) {
        return error.response.data;
    }
};

export const getAllTour = async () => {
    try {
        const response = await axios.get("http://localhost:5000/tournament/all-tournament");
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
export const blockUserA = async (id ,token) => {
    try {
        const response = await axios.put(`http://127.0.0.1:5000/user/blockuser/${id}` , {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const deblockUserA = async (id ,token) => {
    try {
        const response = await axios.put(`http://127.0.0.1:5000/user/deblockuser/${id}` , {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getAllUsersA = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/user/", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  export const getReclamationLive = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/reclamation/reclamationLive', {

        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  export const TreatReclamation = async (id, token) => {
    try {
      const response = await axios.put(`http://127.0.0.1:5000/reclamation/treatreclamation/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  export const getReclamationTour = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/reclamation/reclamationTournament', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
