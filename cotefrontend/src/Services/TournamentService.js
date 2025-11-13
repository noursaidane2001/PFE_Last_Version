import axios from 'axios';

export const getParticipateduserTour = async (id) => {
    try {
        const response = await axios.get(`http://localhost:5000/tournament/participating/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getAlluserTour = async (id) => {
    try {
        const response = await axios.get(`http://localhost:5000/tournament/all-user-tournaments/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getCreateduserTour = async (id) => {
    try {
        const response = await axios.get(`http://localhost:5000/tournament/createdtournaments/${id}`)

        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const CreateTour = async (TourForm, token) => {
    try {
        const response = await axios.post("http://127.0.0.1:5000/tournament/create-tournament", TourForm, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const editTour = async (putForm, id, token) => {
    try {
        const response = await axios.put(`http://127.0.0.1:5000/tournament/${id}`, putForm, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getTour = async (id, token) => {
    try {
        const response = await axios.get(`http://localhost:5000/tournament/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        throw error.response.data;
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

export const Participate = async (id, token) => {
    try {
        const response = await axios.post(`http://localhost:5000/tournament/participate/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
export const unParticipate = async (id, token) => {
    try {
        const response = await axios.post(`http://localhost:5000/tournament/unparticipate/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

