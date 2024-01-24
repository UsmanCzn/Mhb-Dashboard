import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { useLocation, useNavigate, useHistory } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import userManagementService from 'services/userManagementService';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import ConfirmationModal from "../../components/confirmation-modal";


const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 90
    },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`
    }
];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 }
];


const UserList = () => {

    const navigate = useNavigate();



    const headers = [
        { name: 'Name', value: 'name' },
        { name: 'Email', value: 'email' },
        { name: 'Phone', value: 'phoneNumber' },
        { name: 'Role', value: 'role' },
        { name: 'Action', value: 'action' }
    ];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [users, setUsers] = useState([]);
    const [usersRoles, setUsersRoles] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null); // State to store the selected user for delete confirmation
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const getUsersList = async () => {
        try {
            const response = await userManagementService.getAllUsers();
            if (response && response.data && response.data.result) {
                setUsers(response.data.result);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const getUserRoles = async () => {
        try {
            const response = await userManagementService.getUserRoles();
            if (response) {
                setUsersRoles(response?.data?.result);
            }
        } catch (error) {
            console.error('Error fetching user roles', error);
        }
    };

    useEffect(() => {
        getUserRoles();
        getUsersList();
    }, []);

    const mergedUsers = users?.map((user) => {
        const userRole = Array.isArray(usersRoles) && usersRoles?.find((role) => role.id === user.userId);
        return {
            ...user,
            userRole: userRole ? userRole?.name : null,
        };
    });


    const handleDeleteUser = (userId) => {
        setSelectedUserId(userId);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await userManagementService.DeleteUser(selectedUserId);
            if(response){
                getUsersList();
                console.log(response,"successfully Deleted")
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
        setDeleteModalOpen(false);
    };

    const handleCancelDelete = () => {
        setSelectedUserId(null);
        setDeleteModalOpen(false);
    };

    const handleCreateNewUser = () => {
        navigate('/user-management');
    };

    const handleEditUser = (userId) =>{
        navigate(`/update-user/${userId}`)
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs={'auto'}>
                            <Typography fontSize={22} fontWeight={700}>
                                Users Management
                            </Typography>
                        </Grid>
                        <Grid item xs={'auto'}>
                            <Button onClick={handleCreateNewUser} size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
                                Create New User
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <div>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {headers?.map((e, index) => (
                                            <TableCell key={index}>{e.name}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mergedUsers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{row.name + " " + row.surname}</TableCell>
                                            <TableCell>{row.emailAddress}</TableCell>
                                            <TableCell>{row?.phoneNumber}</TableCell>
                                            <TableCell>{row.userRole ? row.userRole : ""}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <Button variant='outlined' type='primary' style={{color:'#DD4D2B',border:'none'}} onClick={() => handleDeleteUser(row.userId)}>
                                                        <DeleteIcon/>
                                                    </Button>
                                                    <Button variant='outlined' type='primary' style={{color:'#1890FF',border:'none'}} onClick={() => handleEditUser(row.userId)}>
                                                        <EditIcon/>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={users?.length || 0}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />

                    </div>
                </Grid>
            </Grid>
            <ConfirmationModal
                open={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                statement={`Are you sure you want to delete this user?`}
            />
        </>
    );
};

export default UserList;
