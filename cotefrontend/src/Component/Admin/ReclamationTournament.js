import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Admintest.css';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import { TreatReclamation, getReclamationTour } from '../../Services/AdminService';

const token = localStorage.getItem("token");
console.log("token", token);
const columns = [
  { id: 'iduser', label: 'User', minWidth: 170, align: 'center' },
  { id: 'idtournament', label: 'Tournament', minWidth: 120, align: 'center' },
  { id: 'type', label: 'Reclamation Type', minWidth: 120, align: 'center' },
  { id: 'reclamationbody', label: 'Reclamation Body', minWidth: 120, align: 'center' },
  { id: 'status', label: 'Status', minWidth: 120, align: 'center' },
  { id: 'actions', label: 'Actions', minWidth: 120, align: 'center' },
];
function treatReclamation(id) {
  TreatReclamation(id, token)
    .then(response => {
      console.log(response);
      window.location.reload();
    })
    .catch(error => {
      console.log(error);
    });
}
export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100000);
  const [data, setData] = useState([]);
  // const [tour, setTour] = useState([]);
  useEffect(() => {
    getReclamationTour(token)
      .then((response) => {
        setData(response);
         console.log("this is data",response);
      });
  }, []);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <Paper sx={{ bgcolor: '#222222' }}>
      <h1 sx={{ color: 'white !important', }}>List of Tournament Reclamations</h1>
      <TableContainer sx={{
        backgroundColor: '#222222', alignItems: 'center',
        width: "flex", height: "100vh"
      }}  >
        <Table stickyHeader aria-label="sticky table" sx={{ backgroundColor: '#222222', alignItems: 'center', width: '30vw' }} >
          <TableHead sx={{ alignItems: 'center', fontWeight: 'bold' }} >
            <TableRow sx={{ alignItems: 'center' }}>
              {/* the row of titles */}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, backgroundColor: '#222222', color: 'white', alignItems: 'center' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ alignItems: 'center' }}>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, backgroundColor: '#222222', color: 'white', alignItems: 'center' }}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : column.id === 'actions' // add a delete button to the "Actions" column
                              ?
                              <div>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                  {row.status === 'untreated' ? (
                                    <Chip
                                      variant="outlined"
                                      color="danger"
                                      onClick={() => treatReclamation(row._id)}
                                    >
                                      Treat Reclamation
                                    </Chip>
                                  ) : (
                                    <br></br>
                                  )}
                                </Box>
                              </div>
                             : column.id === 'idtournament'
                             ? (
                               <div>
                                 {row.idtournament.title}
                               </div>
                             )
                             : column.id === 'iduser'
                             ? (
                               <div>
                                 {row.iduser.firstname}
                               </div>
                             )
                             : value
                          }
                        </TableCell>
                      );
                    })}

                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
