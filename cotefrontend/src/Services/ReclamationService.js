import axios from 'axios';

export const CreateReclamationTour = async (id, token, ReclamForm) => {
    try {
        const response = await axios.post(`http://127.0.0.1:5000/reclamation/createreclamationTournament/${id}`, ReclamForm, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;

    } catch (error) {
        return error.response.data;
    }
};