// import { useState, useEffect } from "react";
// import * as React from 'react';
// import { styled, alpha } from '@mui/material/styles';
// import InputBase from '@mui/material/InputBase';
// import axios from "axios";
// import SearchIcon from "@mui/icons-material/Search";




// function Filter(e) {
//     const [data, setData] = useState([]);
  

//     useEffect(() => {
//         axios.get("http://localhost:5000/user/")
//             .then((response) => {
//                 setData(response.data);
//                 console.log(data);
//                 //pour chercher dans la liste des users 
//                 // data.forEach((user) => {
//                 //     setName(user.name, user.lastname);
//                 // });
//                 console.log("data rendred");

//             })
//             .catch((error) => {
//                 console.log(error);
//                 console.log("data  not found")
//             });
//     }, []);
//     // useEffect(() => {
//     //     const names = data.map((user) => `${user.name} ${user.lastname}`);
//     //     setName(names);
//     // }, []);
//     //      const handleSearch = (e) => {
//     //       //  setSearch(e.target.value)
//     //         console.log('im here',e.target.value)
//     //      }
//     console.log(data);
//     const [filtredData, setfiltredData] = useState([]);
   

//     console.log(filtredData.length);
//     const filter = data.filter((user) =>
//         `${user.firstname} ${user.lastname}`.toLowerCase().includes((e.target.value).toLowerCase())
//     );
//     setfiltredData(filter);
//     return (
//         <Search className="search">
//             <SearchIconWrapper>
//                 <SearchIcon />
//             </SearchIconWrapper>
//             <StyledInputBase
//                 value={e.target.value}
//                 placeholder="Search....."
//                 style={{ color: '#FFFFFF' }}
//                 onChange={Filter}
//             />

//         </Search>
//     )
// }


// function Search() {
//     //barre recherche style
//     const Search = styled('div')(({ theme }) => ({
//         position: 'relative',
//         borderRadius: theme.shape.borderRadius,
//         backgroundColor: alpha(theme.palette.common.white, 0.15),
//         '&:hover': {
//             backgroundColor: alpha(theme.palette.common.white, 0.25),
//         },
//         marginLeft: 0,
//         width: '15%',
//         [theme.breakpoints.up('sm')]: {
//             marginLeft: theme.spacing(1),
//             width: 'auto',
//         },
//     }));


//     const SearchIconWrapper = styled('div')(({ theme }) => ({
//         padding: theme.spacing(0, 2),
//         height: '100%',
//         position: 'absolute',
//         pointerEvents: 'none',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//     }));

//     const StyledInputBase = styled(InputBase)(({ theme }) => ({
//         color: 'inherit',
//         '& .MuiInputBase-input': {
//             padding: theme.spacing(1, 1, 1, 0),
//             // vertical padding + font size from searchIcon
//             paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//             transition: theme.transitions.create('width'),
//             width: '100%',
//             [theme.breakpoints.up('m')]: {
//                 width: '12ch',
//                 '&:focus': {
//                     width: '20ch',
//                 },
//             },
//         },
//     }));
   

//     return (

//         <>
//         <Filter/>
//             <ul>
//                 {/* {search && name.filter((element) =>
//                     element.toLowerCase().includes(search.toLowerCase())
//                 )
//                     .map((element, index) => (
//                         <li onClick={() => setSearch(element)} key={index} >
//                             {element}
//                         </li>
//                     ))} */}
//             </ul>
//         </>

//     )
// }

// export default Search;

//  // <div

//         //     style={{

//         //         backgroundColor: "white",

//         //         borderRadius: "50px",

//         //         width: "70vh",

//         //         height: "40px",

//         //     }}

//         // >

//         //     <SearchIcon

//         //         sx={{ color: "gray", marginLeft: "11px", margin: "11px" }}

//         //     />

//         //     <InputBase

//         //         placeholder="Search…"

//         //         inputProps={{ "aria-label": "search" }}
//         //         value={search}
//         //         // autoComplete={true}
//         //         style={{ backgroundColor: "red", marginBottom: "1000px" }}
//         //         onChange={(e) => setSearch(e.target.value)}

//         //     />

//         //     <ul>
//         //         {search && name.filter((element) =>
//         //             element.toLowerCase().includes(search.toLowerCase())
//         //         )
//         //             .map((element, index) => (
//         //                 <li onClick={() => setSearch(element)} key={index} >
//         //                     {element}
//         //                 </li>
//         //             ))}
//         //     </ul>

//         // </div>



