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
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import { Typography } from "@mui/material";
import {
  TreatReclamation,
  getReclamationTour,
} from "../../Services/AdminService";

const token = localStorage.getItem("token");
console.log("token", token);

const columns = [
  { id: "iduser", label: "User", minWidth: 170, align: "center" },
  { id: "idtournament", label: "Tournament", minWidth: 120, align: "center" },
  { id: "type", label: "Reclamation Type", minWidth: 120, align: "center" },
  {
    id: "reclamationbody",
    label: "Reclamation Body",
    minWidth: 120,
    align: "center",
  },
  { id: "status", label: "Status", minWidth: 120, align: "center" },
  { id: "actions", label: "Actions", minWidth: 120, align: "center" },
];

function treatReclamation(id) {
  TreatReclamation(id, token)
    .then((response) => {
      console.log(response);
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
}

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100000);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReclamationTour(token)
      .then((response) => {
        setData(response);
        console.log("this is data", response);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tournament reclamations:", error);
        setLoading(false);
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
        List of Tournament Reclamations
      </Typography>

      <TableContainer
        sx={{
          backgroundColor: "#222222",
          borderRadius: 2,
          border: "1px solid #444",
          maxHeight: "80vh",
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
                    textAlign: "center",
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
                  Loading tournament reclamations...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ color: "white" }}
                >
                  No tournament reclamations found
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
                      key={row._id}
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
                              textAlign: "center",
                            }}
                          >
                            {column.id === "actions" ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                {row.status === "untreated" ? (
                                  <Chip
                                    variant="outlined"
                                    color="danger"
                                    onClick={() => treatReclamation(row._id)}
                                    sx={{ cursor: "pointer" }}
                                  >
                                    Treat Reclamation
                                  </Chip>
                                ) : (
                                  <Chip
                                    variant="outlined"
                                    color="success"
                                    sx={{ cursor: "default" }}
                                  >
                                    Treated
                                  </Chip>
                                )}
                              </Box>
                            ) : column.id === "idtournament" ? (
                              <div>{row.idtournament?.title || "N/A"}</div>
                            ) : column.id === "iduser" ? (
                              <div>
                                {row.iduser?.firstname || "Unknown"}{" "}
                                {row.iduser?.lastname || ""}
                              </div>
                            ) : column.id === "status" ? (
                              <Chip
                                color={
                                  value === "untreated" ? "danger" : "success"
                                }
                                variant="soft"
                              >
                                {value}
                              </Chip>
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
