import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState, useEffect } from "react";
import "./Admintest.css";
import Swal from "sweetalert2";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import ChipDelete from "@mui/joy/ChipDelete";
import Avatar from "@mui/material/Avatar";
import {
  blockUserA,
  deblockUserA,
  getAllUsersA,
} from "../../Services/AdminService";
import { Typography } from "@mui/material";

const token = localStorage.getItem("token");
console.log("token", token);

const columns = [
  { id: "photo", label: "Photo", minWidth: 170, align: "center" },
  { id: "firstname", label: "First Name", minWidth: 120, align: "center" },
  { id: "lastname", label: "Last Name", minWidth: 120, align: "center" },
  {
    id: "email",
    label: "Email",
    minWidth: 120,
    align: "center",
  },
  {
    id: "actions",
    label: "Actions",
    minWidth: 120,
    align: "center",
  },
];

function blockUser(id) {
  Swal.fire({
    title: "Are you sure you want to block this user?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, block it!",
  }).then((result) => {
    if (result.isConfirmed) {
      blockUserA(id, token)
        .then((response) => {
          console.log(response);
          Swal.fire({
            title: "User blocked successfully",
            icon: "success",
            showCancelButton: false,
          });
          // to refresh page after blocking a user
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            title: "Error",
            text: "Failed to block user",
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    }
  });
}

function deblockUser(id) {
  Swal.fire({
    title: "Are you sure you want to unblock this user?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, unblock it!",
  }).then((result) => {
    if (result.isConfirmed) {
      deblockUserA(id, token)
        .then((response) => {
          console.log(response);
          Swal.fire({
            title: "User unblocked successfully",
            icon: "success",
            showCancelButton: false,
          });
          // to refresh page after unblocking a user
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            title: "Error",
            text: "Failed to unblock user",
            icon: "error",
            confirmButtonText: "OK",
          });
        });
    }
  });
}

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100000);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsersA(token)
      .then((response) => {
        setData(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
        Swal.fire({
          title: "Error",
          text: "Failed to load users",
          icon: "error",
          confirmButtonText: "OK",
        });
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
    <Paper
      sx={{
        bgcolor: "#222222",
        padding: 3,
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: "white",
          marginBottom: 3,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        List of Users
      </Typography>

      <TableContainer
        sx={{
          backgroundColor: "#222222",
          borderRadius: 2,
          border: "1px solid #444",
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{
                    minWidth: column.minWidth,
                    backgroundColor: "#333",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ color: "white" }}
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ color: "white" }}
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row._id || row.id}
                      sx={{ "&:hover": { backgroundColor: "#333" } }}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            sx={{
                              minWidth: column.minWidth,
                              backgroundColor: "#222",
                              color: "white",
                              borderBottom: "1px solid #444",
                            }}
                          >
                            {column.id === "actions" ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                {row.blocked ? (
                                  <Chip
                                    variant="outlined"
                                    color="success"
                                    onClick={() => deblockUser(row._id)}
                                    endDecorator={
                                      <ChipDelete
                                        color="success"
                                        variant="plain"
                                        onClick={() => deblockUser(row._id)}
                                      />
                                    }
                                    sx={{ cursor: "pointer" }}
                                  >
                                    Unblock
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
                                        onClick={() => blockUser(row._id)}
                                      />
                                    }
                                    sx={{ cursor: "pointer" }}
                                  >
                                    Block
                                  </Chip>
                                )}
                              </Box>
                            ) : column.id === "photo" ? (
                              <Avatar
                                src={`http://localhost:5000/uploads/user/${value}`}
                                alt={`${row.firstname} ${row.lastname}`}
                                sx={{
                                  width: 56,
                                  height: 56,
                                  margin: "0 auto",
                                }}
                              />
                            ) : (
                              value || "-"
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {data.length > 10 && (
        <TablePagination
          sx={{
            backgroundColor: "#222222",
            color: "white",
            "& .MuiTablePagination-selectIcon": {
              color: "white",
            },
            "& .MuiTablePagination-actions button": {
              color: "white",
            },
          }}
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
}
