// import React from "react";
// import { useEffect, useRef } from "react";
// import "../Slider/Slider.css";
// import Carousel from "react-elastic-carousel";
// import styled from "styled-components";

// const StyledDiv = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 250px;
//   width: 100%;
//   background-color: #00008B;
//   color: #fff;
//   margin: 0 15px;
//   font-size: 4em;
// `;

// export default function Slider() {
//   const breakPoints = [
//     { width: 1, itemsToShow: 1 },
//     { width: 550, itemsToShow: 2 },
//     { width: 768, itemsToShow: 3 },
//     { width: 1200, itemsToShow: 4 },
//   ];

//   return (
    
//       <div className="App1">
//         <Carousel breakPoints={breakPoints}>
//           <Item>One</Item>
//           <Item>Two</Item>
//           <Item>Three</Item>
//           <Item>Four</Item>
//           <Item>Five</Item>
//           <Item>Six</Item>
//           <Item>Seven</Item>
//           <Item>Eight</Item>
//         </Carousel>
//       </div>
    
//   );
// }

// function Item({ children }) {
//   return <StyledDiv>{children}</StyledDiv>;
// }
