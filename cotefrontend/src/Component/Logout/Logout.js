import * as React from 'react';
import { NavLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import withScrollToTop from '../withScrollToTop';
import '../Logout/Logout.css'
function Logout() {
    const navigate = useNavigate();

    const handleLogout=()=>{
        localStorage.clear();
        navigate(`/home`, { replace: true });
        window.location.reload();
        


    }
    return (
        <NavLink to="/home" style={{ textDecoration: "none" }} >
            <Button className='logou-btn' 
            onClick={handleLogout}>
                Logout
            </Button>
        </NavLink>

    )

}
export default withScrollToTop(Logout);
