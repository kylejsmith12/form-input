// Importing necessary components and functions from React and Material-UI
import React, { useState, useEffect, useRef, useCallback } from "react";
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
  InputBase,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import debounce from "lodash.debounce";

// Functional component for displaying user data in a table
const TableDisplay = () => {
  // State variables for managing user data, selected rows, loading state, pagination, search, and autocomplete
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalRows, setTotalRows] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);

  // Function to fetch data from the server and update state
  const fetchDataAndUpdateState = async (endpoint) => {
    try {
      const response = await fetch(endpoint);
      const { userData, totalRows } = await response.json();

      if (userData) {
        setData(userData);
        setTotalRows(totalRows);
        setIsLoading(false);
        setFilteredData(userData);
      }
    } catch (error) {
      console.error("Failed to fetch user data", error);
      setIsLoading(false);
    }
  };

  // Function to fetch data based on the current search term
  const fetchData = useCallback(async () => {
    try {
      const endpoint = `http://localhost:5002/api/searchUserData?searchTerm=${searchTerm}&page=${
        page + 1
      }&rowsPerPage=${rowsPerPage}`;
      fetchDataAndUpdateState(endpoint);
    } catch (error) {
      console.error("Failed to fetch user data", error);
      setIsLoading(false);
    }
  }, [searchTerm, page, rowsPerPage, fetchDataAndUpdateState]);

  // Debounced search handler using useRef
  const handleSearchRef = useRef(
    debounce(async (searchTerm) => {
      setSearchTerm(searchTerm);
      setPage(0); // Reset page when searching
      setHasMore(true); // Reset hasMore when searching
      fetchData(); // Fetch data for the first page
    }, 300)
  );

  // Callback for handling search term changes
  const handleSearch = useCallback(
    async (searchTerm) => {
      setSearchTerm(searchTerm);
      setPage(0); // Reset page when searching
      setHasMore(true); // Reset hasMore when searching

      if (searchTerm.trim() !== "") {
        handleSearchRef.current(searchTerm);
      } else {
        fetchData(); // Fetch data for the first page
      }
    },
    [setSearchTerm, setPage, setHasMore, fetchData, handleSearchRef]
  );

  // Delayed search using useRef for autocomplete and regular search
  const delayedSearch = useRef(
    debounce(async (searchTerm) => {
      // Fetch autocomplete options
      const autocompleteEndpoint = `http://localhost:5002/api/autocomplete?searchTerm=${searchTerm}`;
      const autocompleteResponse = await fetch(autocompleteEndpoint);
      const autocompleteData = await autocompleteResponse.json();
      setAutocompleteOptions(autocompleteData.values); // Assuming values is the correct property name

      // Fetch search data
      const endpoint = `http://localhost:5002/api/searchUserData?searchTerm=${searchTerm}&page=${
        page + 1
      }&rowsPerPage=${rowsPerPage}`;
      fetchDataAndUpdateState(endpoint);
    }, 500)
  );

  // Function to handle fetching data based on the search term
  const fetchSearchData = useCallback(
    async (searchTerm) => {
      if (searchTerm.trim() !== "") {
        delayedSearch.current(searchTerm);
      } else {
        fetchData(); // Fetch data for the first page
      }
    },
    [fetchData, delayedSearch]
  );

  // Event handler for scrolling to implement infinite scrolling
  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

    if (scrollHeight - scrollTop === clientHeight && hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1);
      setHasMore(totalRows > (page + 1) * rowsPerPage);
    }
  };

  // Effect to fetch search data when search term, page, or rowsPerPage changes
  useEffect(() => {
    fetchSearchData(searchTerm);
  }, [page, rowsPerPage, searchTerm, fetchSearchData]);

  // Event handler for changing the current page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Event handler for changing the number of rows per page
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // Event handler for changing the selection of checkboxes
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

  // Event handler for selecting all checkboxes
  const handleSelectAll = () => {
    const allUserIds = data.map((user) => user.id);
    setSelectedRows(allUserIds);
  };

  // Event handler for deleting a row
  const handleDeleteRow = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5002/api/deleteRow/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
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

  // Rendering the component with Material-UI components
  return (
    <div onScroll={handleScroll}>
      <h2>User Data</h2>
      {/* Autocomplete component for search */}
      <Autocomplete
        options={autocompleteOptions}
        freeSolo
        onChange={(event, value) => handleSearch(value)}
        renderInput={(params) => (
          <InputBase
            placeholder="Search…"
            {...params}
            onChange={(event) => handleSearch(event.target.value)}
            value={searchTerm}
          />
        )}
      />
      {/* Loading spinner during data loading */}
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
      ) : filteredData.length > 0 ? (
        // Table displaying user data
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              {/* Table header with checkboxes for selection */}
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={
                      selectedRows.length === filteredData.length &&
                      filteredData.length > 0
                    }
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < filteredData.length
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
            {/* Table body with user data */}
            <TableBody>
              {filteredData.map((user) => (
                <TableRow key={user.id}>
                  {/* Checkbox for row selection */}
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(user.id)}
                      onChange={() => handleCheckboxChange(user.id)}
                    />
                  </TableCell>
                  {/* User data cells */}
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
                  {/* Action cell with delete button */}
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
        // Message when no user data is available
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
      {/* Pagination component for navigating through pages */}
      {filteredData.length > 0 && (
        <TablePagination
          component="div"
          count={parseInt(totalRows, 10)}
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

// Exporting the TableDisplay component
export default TableDisplay;
