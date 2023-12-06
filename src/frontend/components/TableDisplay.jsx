import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  Button,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const TableDisplay = ({ data }) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((row) => row.id);
      setSelectedRows(newSelecteds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }

    setSelectedRows(newSelected);
  };

  const isSelected = (id) => selectedRows.indexOf(id) !== -1;

  return (
    <div>
      {selectedRows.length > 0 && (
        <Button
          variant="contained"
          color="secondary"
          style={{ margin: "10px" }}
          onClick={() => {
            // Implement your delete logic here using selectedRows
            console.log("Deleting selected rows:", selectedRows);
          }}
        >
          Delete
        </Button>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  indeterminate={
                    selectedRows.length > 0 && selectedRows.length < data.length
                  }
                  checked={selectedRows.length === data.length}
                  onChange={handleSelectAllClick}
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
              {/* Add more columns as needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <Accordion key={row.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected(row.id)}
                      onChange={(event) => {
                        event.stopPropagation();
                        handleClick(event, row.id);
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.first_name}</TableCell>
                  <TableCell>{row.last_name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.gender}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>{row.notification}</TableCell>
                  <TableCell>{row.dob}</TableCell>
                  <TableCell>{row.bio}</TableCell>
                  {/* Add more cells for additional columns */}
                </AccordionSummary>
                <AccordionDetails>
                  {/* Additional information can be added here */}
                </AccordionDetails>
              </Accordion>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TableDisplay;
