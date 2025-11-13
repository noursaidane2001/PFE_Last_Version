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
import './Admintest.css';
import Swal from 'sweetalert2';
import './Admintest.css';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import ChipDelete from '@mui/joy/ChipDelete';
import DeleteForever from '@mui/icons-material/DeleteForever';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@mui/styles';
import { blockUserA, deblockUserA, getAllUsersA } from '../../Services/AdminService';

const token = localStorage.getItem("token");
console.log("token", token);
const columns = [
  { id: 'photo', label: 'Photo', minWidth: 170, align: 'center' },
  { id: 'firstname', label: 'LastName', minWidth: 120, align: 'center' },
  { id: 'lastname', label: 'Lastname', minWidth: 120, align: 'center' },
  {
    id: 'email',
    label: 'Email',
    minWidth: 120,
    align: 'center',
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 120,
    align: 'center',
  },
];
function blockUser(id) {
  Swal.fire({
    title: 'Are you sure you want to block this user?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes,block it!'
  }).then((result) => {
    if (result.isConfirmed) {
      blockUserA(id, token)
        .then(response => {
          console.log(response);
          Swal.fire({
            title: 'User blocked successfully',
            icon: 'success',
            showCancelButton: false
          });
          // to refresh page after deleting a user
          window.location.reload();

        })
        .catch(error => {
          console.log(error);
        });
    }
  });
}
function deblockUser(id) {
  Swal.fire({
    title: 'Are you sure you want to unblock this user?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, unblock it!'
  }).then((result) => {
    if (result.isConfirmed) {
      deblockUserA(id, token)
        .then(response => {
          console.log(response);
          Swal.fire({
            title: 'User unblocked successfully',
            icon: 'success',
            showCancelButton: false
          });
          // to refresh page after deleting a user
          window.location.reload();

        })
        .catch(error => {
          console.log(error);
        });
    }
  });
}
export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100000);
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllUsersA(token)
      .then((response) => {
        setData(response);
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
      <h1 sx={{ color: 'white !important', }}>List of users</h1>
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
                  // css={{
                  //   backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F5F5F5',
                  // }}
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
                                  {row.blocked ? (
                                    <Chip
                                      variant="outlined"
                                      color="success"
                                      onClick={() => deblockUser(row._id)}
                                      endDecorator={
                                        <ChipDelete
                                          color="success"
                                          variant="plain"
                                          onClick={() => alert('You clicked the unblock button!')}
                                        >
                                        </ChipDelete>
                                      }
                                    >
                                      Unblock user
                                    </Chip>
                                  ) : (
                                    <Chip
                                      variant="outlined"
                                      color="danger"
                                      onClick={() => blockUser(row._id)}
                                      endDecorator={
                                        <ChipDelete
                                          color="danger"
                                          variant="plain"
                                          onClick={() => alert('You clicked the block button!')}
                                        >
                                        </ChipDelete>
                                      }
                                    >
                                      Block user
                                    </Chip>
                                  )}
                                </Box>

                              </div>
                              : column.id === 'photo' // add a delete button to the "Photo" column
                                ?
                                <div >
                                  <Avatar src={`http://localhost:5000/uploads/user/${value}`} sx={{ alignItems: 'center', marginLeft: '60px' }} />
                                </div>
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
      {/* <TablePagination
      style={{  backgroundColor: '#222222', color: 'white' }}
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </Paper>
  );
}
