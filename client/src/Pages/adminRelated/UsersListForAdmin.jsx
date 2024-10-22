import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../utils/axiosInstant';
import Button from 'react-bootstrap/Button';
//  for table 
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
// ------------------------------------
function UsersListForAdmin() {
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(''); 
  const [response, setResponse] = useState({
    message: '',
    status: null
  });

  // Function to fetch all users
  const fetchAllUsers = async () => {
    setLoading(true); 
    try {
      const response = await axiosInstance.get('api/admin/getAllUsers');
      setUsers(response.data); 
    } catch (error) {
      setError('Failed to fetch users'); 
      console.error(error.message);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchAllUsers(); 
  }, []);

  // function to delete user
  const deleteUser = async (userId) => {
    try {
      const response = await axiosInstance.delete(`/api/admin/deleteUser/${userId}`);
      
      if (response.status === 200) {
        setResponse({
          message: 'User deleted successfully',
          status: true
        });
       
        fetchAllUsers(); 
      } else {
        setResponse({
          message: `Unexpected status code: ${response.status}`,
          status: false
        });
      }
    } catch (error) {
      if (error.response) {
        setResponse({
          message: error.response.data.msg || 'Error deleting user',
          status: false
        });
      } else {
        setResponse({
          message: 'Unknown error occurred',
          status: false
        });
      }
    }
  };
  // ---------table-----------
  // * Table section from material UI
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
// ------------------------------------
  return (
    <div>
      {/* <h1>List Of user Information </h1> */}
{/* -------------test a table */}
<h3 style={{
    backgroundColor: response.status === false ? '#FF8164' : (response.status ? 'green' : 'transparent'),
    color: 'black',
    fontWeight: 'bold',
    display: 'inline',
    padding: '10px',
    margin: '10px',
    borderRadius: '5px',
    textDecoration: 'underline',
  }}>{response.message}</h3>

<TableContainer className="toShowStaffForward m-2" component={Paper}>
   
      <Table  sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead className="background">
          <TableRow className="background">
            <StyledTableCell className="border" align="center">First Name</StyledTableCell>
            <StyledTableCell align="center">Last Name</StyledTableCell>
            <StyledTableCell className="border" align="center">Email</StyledTableCell>
            <StyledTableCell align="center">User Name</StyledTableCell>
            <StyledTableCell className="border" align="center">User Role</StyledTableCell>
          </TableRow>
        </TableHead>
        {users.map((user,j) => {
      let staffDataDisplay = (
        <TableBody className="" >
            <StyledTableRow >
              <StyledTableCell className="border" align="center">{user.firstname}</StyledTableCell>
              <StyledTableCell align="center">{user.lastname}</StyledTableCell>
              <StyledTableCell className="border" align="center">{user.email}</StyledTableCell>
              <StyledTableCell align="center">{user.username}</StyledTableCell>
              <StyledTableCell align="center">
  {user.role === '0' ? 'admin' : user.role === '1' ? 'user' : user.role === '3' ? 'sub admin' : ''}
</StyledTableCell>

            </StyledTableRow>
              <StyledTableCell  className="d-flex ">
              <Button variant="success" style={{margin:"5px"}}>
                <Link to={`/admin/profileUpdate/${user.userid}`} style={{ textDecoration: 'none', color: 'white' }}>Update Profile</Link>
              </Button>

                <Button style={{margin:"5px"}} onClick={() => deleteUser(user.userid)} variant="danger">Delete </Button>
              </StyledTableCell>
        </TableBody>
      )
      return staffDataDisplay;
    }
    
    
    )}
      </Table>
    </TableContainer>

    </div>
  );
}

export default UsersListForAdmin;

