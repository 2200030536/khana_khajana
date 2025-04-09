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
  Typography,
  IconButton,
  Chip,
  Tooltip,
  LinearProgress,
  TablePagination,
  Avatar,
  Card,
  CardContent,
  Divider,
  Badge,
  Collapse,
  Alert,
  Fade,
  useTheme,
  alpha,
  Zoom,
  Grid,
  useMediaQuery,
  Stack,
} from "@mui/material";
import {
  Search as SearchIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  MoreVert as MoreVertIcon,
  FilterAlt as FilterAltIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import axiosInstance from "../../axiosConfig";

// Define animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(63, 81, 181, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(63, 81, 181, 0); }
  100% { box-shadow: 0 0 0 0 rgba(63, 81, 181, 0); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
`;

// Styled components
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.1)}`,
  },
  animation: `${fadeIn} 0.5s ease-out forwards`,
  opacity: 0,
  '&:nth-child(1)': { animationDelay: '0.1s' },
  '&:nth-child(2)': { animationDelay: '0.15s' },
  '&:nth-child(3)': { animationDelay: '0.2s' },
  '&:nth-child(4)': { animationDelay: '0.25s' },
  '&:nth-child(5)': { animationDelay: '0.3s' },
  '&:nth-child(n+6)': { animationDelay: '0.35s' },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: '16px',
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  fontSize: '0.95rem',
  padding: '16px',
  transition: 'all 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const AnimatedBox = styled(Box)(({ theme, delay = 0 }) => ({
  animation: `${fadeIn} 0.5s ease-out forwards`,
  animationDelay: `${delay}s`,
  opacity: 0,
}));

const AnimatedCard = styled(Card)(({ theme }) => ({
  animation: `${fadeIn} 0.5s ease-out forwards`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
  overflow: 'hidden',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  borderRadius: '25px',
  color: 'white',
  padding: '10px 20px',
  boxShadow: '0 3px 5px 2px rgba(63, 81, 181, 0.3)',
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 10px 2px rgba(63, 81, 181, 0.3)',
  },
}));

const PulseIconButton = styled(IconButton)(({ theme }) => ({
  animation: `${pulse} 2s infinite`,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '1px solid currentColor',
      content: '""',
    },
  },
}));

const StudentDetails = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  // States
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalStudents, setTotalStudents] = useState(0);
  const [refreshAnimation, setRefreshAnimation] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Color mapping for departments
  const departmentColors = {
    "CSE": theme.palette.primary.main,
    "ECE": theme.palette.secondary.main,
    "ME": theme.palette.success.main,
    "CE": theme.palette.warning.main,
    "EEE": theme.palette.info.main,
    "IT": theme.palette.error.main,
  };

  // Department icons mapping
  const getDepartmentIcon = (dept) => {
    switch(dept) {
      case "CSE": return "💻"; // Computer
      case "ECE": return "🔌"; // Electronics
      case "ME": return "⚙️";  // Mechanical
      case "CE": return "🏗️";  // Civil
      case "EEE": return "⚡"; // Electrical
      case "IT": return "🌐"; // Information Tech
      default: return "📚";    // Default
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/students");
      setStudents(response.data);
      setTotalStudents(response.data.length);
      
      // Start refresh animation
      setRefreshAnimation(true);
      setTimeout(() => setRefreshAnimation(false), 1000);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to fetch students. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(0); // Reset to first page on search
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
    
    const sortedStudents = [...students].sort((a, b) => {
      if (field === "name") {
        return sortDirection === "asc" 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (field === "id") {
        return sortDirection === "asc" 
          ? a.id - b.id
          : b.id - a.id;
      } else if (field === "department") {
        return sortDirection === "asc"
          ? a.department.localeCompare(b.department)
          : b.department.localeCompare(a.department);
      }
      return 0;
    });
    
    setStudents(sortedStudents);
  };

  const handleFilter = (e) => {
    setFilterDepartment(e.target.value);
    setPage(0); // Reset to first page on filter change
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSortField("");
    setFilterDepartment("");
    fetchStudents();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter and paginate students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id?.toString().includes(searchQuery);
    const matchesFilter =
      filterDepartment === "" || student.department === filterDepartment;
    return matchesSearch && matchesFilter;
  });

  // Get current page of students
  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Generate a random avatar color based on student ID
  const getAvatarColor = (id) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.error.main,
    ];
    
    const index = parseInt(id.toString().slice(-1)) % colors.length;
    return colors[index];
  };

  // Get student initials for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <AnimatedBox delay={0.1}>
        <Box 
          display="flex" 
          alignItems="center" 
          mb={4}
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
            borderRadius: 2,
            p: 3,
            color: 'white',
            boxShadow: 4
          }}
        >
          <SchoolIcon sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Student Directory
          </Typography>
          <Box flexGrow={1} />
          <Chip 
            icon={<PersonIcon />} 
            label={`Total: ${totalStudents}`}
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              fontWeight: 'bold',
              '& .MuiChip-icon': {
                color: 'white',
              }
            }}
          />
        </Box>
      </AnimatedBox>

      {/* Error Alert */}
      {error && (
        <Fade in={!!error}>
          <Alert 
            severity="error" 
            sx={{ mb: 3 }} 
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </Fade>
      )}

      {/* Search Box */}
      <AnimatedBox delay={0.2}>
        <Card sx={{ mb: 3, borderRadius: 2, overflow: 'visible' }}>
          <CardContent>
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  flexGrow: 1,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  borderRadius: 2,
                  px: 2,
                  py: 0.5
                }}
              >
                <SearchIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                <TextField
                  label="Search by Name or ID"
                  variant="standard"
                  fullWidth
                  value={searchQuery}
                  onChange={handleSearch}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      py: 1.5,
                    }
                  }}
                />
                {searchQuery && (
                  <IconButton size="small" onClick={() => setSearchQuery("")}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

              <Tooltip title="Toggle Filters">
                <IconButton 
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{
                    bgcolor: showFilters 
                      ? alpha(theme.palette.primary.main, 0.15) 
                      : alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    }
                  }}
                >
                  <FilterAltIcon 
                    color={showFilters ? "primary" : "action"} 
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title="Refresh Data">
                <IconButton 
                  onClick={fetchStudents}
                  sx={{
                    transition: 'all 0.3s',
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    }
                  }}
                >
                  <RefreshIcon 
                    color="action" 
                    sx={{
                      animation: refreshAnimation ? `${bounce} 1s ease` : 'none',
                    }}
                  />
                </IconButton>
              </Tooltip>

              {(searchQuery || sortField || filterDepartment) && (
                <Tooltip title="Clear Filters">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ClearIcon />}
                    onClick={handleClearFilters}
                    sx={{ ml: 'auto' }}
                  >
                    Clear
                  </Button>
                </Tooltip>
              )}
            </Box>

            <Collapse in={showFilters}>
              <Box mt={3} display="flex" gap={2} flexWrap="wrap">
                <FormControl 
                  variant="outlined" 
                  size="small" 
                  sx={{ minWidth: isSmallScreen ? '100%' : '180px' }}
                >
                  <InputLabel>Sort By</InputLabel>
                  <Select 
                    value={sortField} 
                    onChange={(e) => handleSort(e.target.value)} 
                    label="Sort By"
                    startAdornment={<SortIcon fontSize="small" sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="id">ID</MenuItem>
                    <MenuItem value="department">Department</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl 
                  variant="outlined" 
                  size="small" 
                  sx={{ minWidth: isSmallScreen ? '100%' : '180px' }}
                >
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={filterDepartment}
                    onChange={handleFilter}
                    label="Department"
                    startAdornment={<FilterIcon fontSize="small" sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="">All Departments</MenuItem>
                    <MenuItem value="CSE">
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" fontFamily="emoji" mr={1}>💻</Typography>
                        Computer Science (CSE)
                      </Box>
                    </MenuItem>
                    <MenuItem value="ECE">
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" fontFamily="emoji" mr={1}>🔌</Typography>
                        Electronics (ECE)
                      </Box>
                    </MenuItem>
                    <MenuItem value="ME">
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" fontFamily="emoji" mr={1}>⚙️</Typography>
                        Mechanical (ME)
                      </Box>
                    </MenuItem>
                    <MenuItem value="CE">
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" fontFamily="emoji" mr={1}>🏗️</Typography>
                        Civil (CE)
                      </Box>
                    </MenuItem>
                    <MenuItem value="EEE">
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" fontFamily="emoji" mr={1}>⚡</Typography>
                        Electrical (EEE)
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      </AnimatedBox>

      {/* Loading Progress */}
      {loading && (
        <Fade in={loading}>
          <LinearProgress sx={{ mb: 3, borderRadius: 1 }} />
        </Fade>
      )}

      {/* Student Table / Card View */}
      <AnimatedBox delay={0.3}>
        {isSmallScreen ? (
          // Card view for mobile
          <Box>
            {paginatedStudents.length > 0 ? (
              <Grid container spacing={2}>
                {paginatedStudents.map((student, index) => (
                  <Grid item xs={12} key={student.id}>
                    <AnimatedCard sx={{ borderRadius: 2 }}>
                      <Box 
                        sx={{ 
                          height: 8, 
                          bgcolor: departmentColors[student.department] || theme.palette.grey[500] 
                        }}
                      />
                      <CardContent sx={{ pb: "16px !important" }}>
                        <Box display="flex" alignItems="center">
                          <Avatar 
                            sx={{ 
                              bgcolor: getAvatarColor(student.id),
                              width: 56,
                              height: 56,
                              boxShadow: 2
                            }}
                          >
                            {getInitials(student.name)}
                          </Avatar>
                          <Box ml={2}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {student.name}
                            </Typography>
                            <Chip 
                              size="small" 
                              label={student.id} 
                              sx={{ 
                                fontSize: '0.75rem', 
                                height: 24, 
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                fontWeight: 'medium'
                              }} 
                            />
                          </Box>
                        </Box>
                        
                        <Box mt={2}>
                          <Stack direction="column" spacing={1}>
                            <Box display="flex" alignItems="center">
                              <Chip
                                size="small"
                                icon={<SchoolIcon fontSize="small" />}
                                label={`${getDepartmentIcon(student.department)} ${student.department}`}
                                sx={{
                                  backgroundColor: alpha(departmentColors[student.department] || theme.palette.grey[500], 0.1),
                                  color: departmentColors[student.department] || theme.palette.grey[700],
                                  fontWeight: 500,
                                  borderRadius: 1,
                                  '& .MuiChip-icon': {
                                    color: 'inherit'
                                  }
                                }}
                              />
                            </Box>
                            
                            <Box display="flex" alignItems="center">
                              <EmailIcon fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                              <Typography variant="body2" color="text.secondary">
                                {student.email || `${student.id}@example.com`}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </CardContent>
                    </AnimatedCard>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Fade in={!loading}>
                <Box 
                  textAlign="center" 
                  py={5} 
                  sx={{
                    backgroundColor: alpha(theme.palette.background.paper, 0.7),
                    borderRadius: 2,
                    border: `1px dashed ${theme.palette.divider}`
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No students found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search or filters
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={handleClearFilters}
                    startIcon={<RefreshIcon />}
                    sx={{ mt: 2 }}
                  >
                    Reset Filters
                  </Button>
                </Box>
              </Fade>
            )}
          </Box>
        ) : (
          // Table view for desktop
          <TableContainer 
            component={Paper} 
            sx={{ 
              borderRadius: 2, 
              overflow: 'hidden',
              boxShadow: 3,
              mb: 2
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <StyledHeaderCell onClick={() => handleSort("id")} sx={{ cursor: 'pointer' }}>
                    <Box display="flex" alignItems="center">
                      ID
                      {sortField === "id" && (
                        <Zoom in={true}>
                          <SortIcon fontSize="small" sx={{ ml: 0.5, fontSize: '1rem' }} />
                        </Zoom>
                      )}
                    </Box>
                  </StyledHeaderCell>
                  <StyledHeaderCell onClick={() => handleSort("name")} sx={{ cursor: 'pointer' }}>
                    <Box display="flex" alignItems="center">
                      Name
                      {sortField === "name" && (
                        <Zoom in={true}>
                          <SortIcon fontSize="small" sx={{ ml: 0.5, fontSize: '1rem' }} />
                        </Zoom>
                      )}
                    </Box>
                  </StyledHeaderCell>
                  <StyledHeaderCell onClick={() => handleSort("department")} sx={{ cursor: 'pointer' }}>
                    <Box display="flex" alignItems="center">
                      Department
                      {sortField === "department" && (
                        <Zoom in={true}>
                          <SortIcon fontSize="small" sx={{ ml: 0.5, fontSize: '1rem' }} />
                        </Zoom>
                      )}
                    </Box>
                  </StyledHeaderCell>
                  <StyledHeaderCell>Email</StyledHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student, index) => (
                    <StyledTableRow key={student.id} style={{ animationDelay: `${0.05 * index}s` }}>
                      <StyledTableCell>
                        <Chip 
                          size="small" 
                          label={student.id} 
                          sx={{ 
                            fontWeight: 'medium',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: getAvatarColor(student.id),
                              mr: 1,
                              fontSize: '0.875rem'
                            }}
                          >
                            {getInitials(student.name)}
                          </Avatar>
                          <Typography variant="body1" fontWeight="medium">
                            {student.name}
                          </Typography>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          size="small"
                          label={`${getDepartmentIcon(student.department)} ${student.department}`}
                          sx={{
                            backgroundColor: alpha(departmentColors[student.department] || theme.palette.grey[500], 0.1),
                            color: departmentColors[student.department] || theme.palette.grey[700],
                            fontWeight: 500,
                            borderRadius: 1
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box display="flex" alignItems="center">
                          <EmailIcon fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                          <Typography variant="body2">
                            {student.email || `${student.id}@example.com`}
                          </Typography>
                        </Box>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                      <Box py={4}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No students found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Try adjusting your search or filters
                        </Typography>
                        <Button 
                          variant="outlined" 
                          color="primary"
                          onClick={handleClearFilters}
                          startIcon={<RefreshIcon />}
                        >
                          Reset Filters
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {/* Pagination */}
        {filteredStudents.length > 0 && (
          <AnimatedBox delay={0.4}>
            <TablePagination
              component="div"
              count={filteredStudents.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sx={{
                borderRadius: 2,
                mt: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                '& .MuiTablePagination-selectIcon': {
                  color: theme.palette.primary.main
                }
              }}
            />
          </AnimatedBox>
        )}
      </AnimatedBox>
    </Container>
  );
};

export default StudentDetails;