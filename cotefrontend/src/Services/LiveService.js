import axios from 'axios';
export const getAllLive = async () => {
    try {
        const response = await axios.get("http://localhost:5000/live/all-live")

        return response.data;

    } catch (error) {
        return error.response.data;
    }
};

export const getLive = async (id) => {
    try {
        const response = await axios.get(`http://localhost:5000/live/${id}`)
        return response.data;

    } catch (error) {
        return error.response.data;
    }
};

export const getuserLive = async (id) => {
    try {
        const response = await axios.get(`http://localhost:5000/live/createdlives/${id}`)

        return response.data;

    } catch (error) {
        return error.response.data;
    }
};

export const FinishLive = async (id) => {
    try {
        const response = await axios.put(`http://localhost:5000/live/finishlive/${id}`)


        return response.data;

    } catch (error) {
        return error.response.data;
    }
};

export const createLive = async (liveForm, token) => {
    try {
        const response = await axios.post("http://127.0.0.1:5000/live/createlive", liveForm, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;

    } catch (error) {
        return error.response.data;
    }
};
