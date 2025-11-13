import { useState, useEffect } from "react";
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, Link } from 'react-router-dom';
import { getAllUsers } from "../../Services/UserService";


const token = localStorage.getItem("token");
console.log("token", token);
//barre de recherche 
const Search1 = styled('div')(({ theme }) => ({
    position: 'fixed',
    left: "70%",
    top: '2.2%',
    zIndex: "1",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#444",
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 0,
    width: '15rem',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
    },
    [theme.breakpoints.down('md')]: {
        display: 'none',
    },
}));


//liste de recherche 
const Listserch = styled('div')(({ theme }) => ({
    position: 'fixed',
    listStyle: "none",
    left: "70%",
    top: '8%',
    zIndex: "1",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#444",
    color: "White",
    marginLeft: 0,
    width: '15rem',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
    },
}));

//icon de recherche 
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: "gray"
}));
//input de recherche 
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('m')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

function Search() {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [names, setNames] = useState([]);
    const [value, setValue] = useState("");

    useEffect(() => {
     getAllUsers(token)
        .then((response) => {
          setData(response);
          console.log(data);
          console.log("data rendred");
        })
        .catch((error) => {
          console.log(error);
          console.log("data not found");
        });
    }, []);

    const handleChangeInput = (e) => {
      console.log(e.target.value);
      console.log(names);
      if (e.target.value.length === 0) {
        setNames([]);
      } else {
        setNames(
          data
            .filter((user) =>
              `${user.firstname} ${user.lastname}`.toLowerCase().includes(
                e.target.value.toLowerCase()
              )
            )
            .map((user) => `${user.firstname} ${user.lastname}`)
        );
      }
    };

    let id = "";
    const handleUserClick = (element) => {
      const user = data.find((user) => `${user.firstname} ${user.lastname}` === element);
      if (user) {
        const id = user._id;
        setNames([])
        navigate(`/search?user=${id}`);
      }
    };
  
    return (
      <>
        <Search1 className="ss">
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            value={names.length === 0 ? value : undefined}
            placeholder="Search....."
            style={{ color: '#FFFFFF' }}
            onChange={handleChangeInput}
          />
        </Search1>
  
        <Listserch>
          {names.map((element, index) => (
            <li onClick={() => handleUserClick(element)} key={index}>
              <Link style={{ textDecoration: 'none', color: 'white' }} to={`/search?user=${id}`}>{element}</Link>
            </li>
          ))}
        </Listserch>
      </>
    );
  }
  
  export default Search;