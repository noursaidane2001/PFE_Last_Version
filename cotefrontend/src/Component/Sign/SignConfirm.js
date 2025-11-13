
import React , {useEffect}from 'react';
import { useState } from 'react';
import axios from 'axios';
import {  useParams } from 'react-router-dom';
import { useNavigate, NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import withScrollToTop from '../withScrollToTop';
import { getUser, postConfirm } from '../../Services/UserService';
function SignConfirm() {
    const { id } = useParams();
    const [email, setUserEmail] = useState("");
     const navigate = useNavigate();
     useEffect(() => {
      getUser(id)
        .then((response) => {
          console.log(response)
          setUserEmail(response.email);
          postConfirm(id)
            .then((response) => {
              console.log(response);
              Swal.fire({
                title: "User verified with success",
                icon: "success",
                confirmButtonText: "Go login",
                showCancelButton: false
              });
              navigate("/user/login", { replace: true });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }, []);
}
export default withScrollToTop(SignConfirm);