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
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const TableDisplay = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    fetchData();
  }, []); // Run once when the component mounts

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5002/api/getUserData");
      const userData = await response.json();

      console.log("userData:", userData); // Log the data to inspect its structure

      setData(userData);
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
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

  const handleSelectAll = (event) => {
    event.stopPropagation();

    if (selectedRows.length === data.length) {
      // If all rows are selected, deselect all
      setSelectedRows([]);
    } else {
      // If not all rows are selected, select all
      const allUserIds = data.map((user) => user.id);
      setSelectedRows(allUserIds);
    }
  };

  const handleRowClick = (userId, event) => {
    // Check if the click target is not the checkbox
    if (event.target.tagName !== "INPUT" && event.target.type !== "checkbox") {
      if (expandedRows.includes(userId)) {
        setExpandedRows((prevExpanded) =>
          prevExpanded.filter((id) => id !== userId)
        );
      } else {
        setExpandedRows((prevExpanded) => [...prevExpanded, userId]);
      }
    }
  };

  const handleDeleteSelected = () => {
    console.log("Deleting selected rows:", selectedRows);
    // Implement logic to delete selected rows
  };

  return (
    <div>
      <h2>User Data</h2>
      {data.length > 0 ? (
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
                    onChange={(event) => handleSelectAll(event)}
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
                {/* Add more columns as needed */}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((user) => (
                <React.Fragment key={user.id}>
                  <TableRow
                    onClick={(event) => handleRowClick(user.id, event)}
                    className={`accordion-row ${
                      expandedRows.includes(user.id) ? "expanded" : ""
                    }`}
                  >
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
                        onClick={() => console.log("Delete action", user.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                    {/* Add more cells for additional columns */}
                  </TableRow>
                  {expandedRows.includes(user.id) && (
                    <TableRow className="details-row">
                      <TableCell colSpan={12}>
                        {/* Placeholder details content */}
                        <Typography>
                          This is a placeholder for additional details.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No user data available.</p>
      )}
      {selectedRows.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <Typography variant="body2" color="textSecondary">
            {`${selectedRows.length} row${
              selectedRows.length !== 1 ? "s" : ""
            } selected`}
          </Typography>
          <IconButton
            aria-label="delete-selected"
            onClick={handleDeleteSelected}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default TableDisplay;
