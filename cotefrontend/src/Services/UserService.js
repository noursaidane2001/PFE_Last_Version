import axios from 'axios';

export const SignPost = async (SignForm) => {
  try {
    const response = await axios.post("http://localhost:5000/user/sign", SignForm);
    return response.data;

  } catch (error) {
    return error.response.data;
  }
};

export const LoginPost = async (LoginForm) => {
  try {
    const response = await axios.post("http://localhost:5000/user/login", LoginForm);
    return response.data;

  } catch (error) {
    return error.response.data;
  }
};
export const getUser = async (id) => {
  try {
    const response = await axios.get(`http://localhost:5000/user/${id}`);
    return response.data;

  } catch (error) {
    return error.response.data;
  }
};
export const postConfirm = async (id) => {
  try {
    const response = await axios.post(`http://localhost:5000/user/signupconfirm/${id}`)

    return response.data;

  } catch (error) {
    return error.response.data;
  }
};

export const ForgotPass = async (email, token) => {
  try {
    const response = await axios.post("http://127.0.0.1:5000/user/forgot-password", email, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const ResetPass = async (ResetForm, id, token) => {
  try {
    const response = await axios.post(`http://localhost:5000/user/reset-password/${id}/${token}`, ResetForm, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserFollowing = async (id) => {
  try {
    const response = await axios.get(`http://localhost:5000/user/following/${id}`);
    return response.data;

  } catch (error) {
    return error.response.data;
  }
};

export const getUserFollowers = async (id) => {
  try {
    const response = await axios.get(`http://localhost:5000/user/followers/${id}`);
    return response.data;

  } catch (error) {
    return error.response.data;
  }
};

export const Follow = async (id, token) => {
  try {
    const response = await axios.patch(`http://localhost:5000/user/follow/${id}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const unFollow = async (id, token) => {
  try {
    const response = await axios.patch(`http://localhost:5000/user/unfollow/${id}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const editUser = async (id, putForm, token) => {
  try {
    const response = await axios.put(`http://localhost:5000/user/${id}`, putForm, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getAllUsers = async (token) => {
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












