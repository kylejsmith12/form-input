import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Box,
  CircularProgress,
  Typography,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const TableDisplay = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5002/api/getUserData?page=${
          page + 1
        }&rowsPerPage=${rowsPerPage}`
      );
      const { userData, totalRows } = await response.json();

      if (userData) {
        setData(userData);
        setTotalRows(totalRows); // Add this line to set the total count
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch user data", error);
      setIsLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    console.log("New Rows Per Page:", newRowsPerPage);

    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset the current page to 0 when changing the rows per page
  };

  const handleCheckboxChange = (userId) => {
    const isSelected = selectedRows.includes(userId);
    if (isSelected) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((id) => id !== userId)
      );
    } else {
      setSelectedRows((prevSelected) => [...prevSelected, userId]);
    }
  };

  const handleSelectAll = () => {
    const allUserIds = data.map((user) => user.id);
    setSelectedRows(allUserIds);
  };

  const handleDeleteRow = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5002/api/deleteRow/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // If the delete request is successful, refetch data
        fetchData();
      } else {
        console.error(
          `Failed to delete row with ID ${userId}:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error(`Error deleting row with ID ${userId}:`, error);
    }
  };

  // ... rest of the code ...

  return (
    <div>
      <h2>User Data</h2>
      {isLoading ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="150px"
        >
          <CircularProgress variant="determinate" value={progress} />
          <Typography variant="caption" color="textSecondary">{`${Math.round(
            progress
          )}%`}</Typography>
        </Box>
      ) : data.length > 0 ? (
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={
                      selectedRows.length === data.length && data.length > 0
                    }
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < data.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Notification</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Bio</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(user.id)}
                      onChange={() => handleCheckboxChange(user.id)}
                    />
                  </TableCell>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.age}</TableCell>
                  <TableCell>{user.country}</TableCell>
                  <TableCell>{user.notification}</TableCell>
                  <TableCell>{user.dob}</TableCell>
                  <TableCell>{user.bio}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteRow(user.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100px"
          flexDirection="column"
        >
          <p>No user data available.</p>
        </Box>
      )}
      {data.length > 0 && (
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      )}
    </div>
  );
};

export default TableDisplay;
