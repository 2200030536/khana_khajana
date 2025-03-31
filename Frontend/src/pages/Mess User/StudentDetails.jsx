import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
} from "@mui/material";
import axiosInstance from "../../axiosConfig";

const StudentDetails = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("Failed to fetch students.");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (e) => {
    setSortField(e.target.value);
    const sortedStudents = [...students].sort((a, b) => {
      if (e.target.value === "name") {
        return a.name.localeCompare(b.name);
      } else if (e.target.value === "id") {
        return a.id - b.id;
      }
      return 0;
    });
    setStudents(sortedStudents);
  };

  const handleFilter = (e) => {
    setFilterDepartment(e.target.value);
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toString().includes(searchQuery);
    const matchesFilter =
      filterDepartment === "" || student.department === filterDepartment;
    return matchesSearch && matchesFilter;
  });

  return (
    <Container maxWidth="lg" style={{ marginTop: "50px" }}>
      <h2 style={{ textAlign: "center", color: "#3f51b5" }}>Student Details</h2>

      {/* Search, Sort, and Filter Controls */}
      <Box display="flex" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <TextField
          label="Search by Name or ID"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          style={{ flex: "1" }}
        />
        <FormControl variant="outlined" style={{ minWidth: "150px" }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortField} onChange={handleSort} label="Sort By">
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="id">ID</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" style={{ minWidth: "150px" }}>
          <InputLabel>Filter by Department</InputLabel>
          <Select
            value={filterDepartment}
            onChange={handleFilter}
            label="Filter by Department"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="CSE">CSE</MenuItem>
            <MenuItem value="ECE">ECE</MenuItem>
            <MenuItem value="ME">ME</MenuItem>
            <MenuItem value="CE">CE</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Student Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Department</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.department}</TableCell>
                <TableCell>{student.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* No Results Message */}
      {filteredStudents.length === 0 && (
        <Box mt={3} textAlign="center">
          <p>No students found.</p>
        </Box>
      )}
    </Container>
  );
};

export default StudentDetails;