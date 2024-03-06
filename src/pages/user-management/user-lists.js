import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { useLocation, useNavigate, useHistory } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import userManagementService from 'services/userManagementService';

import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationModal from '../../components/confirmation-modal';

const UserList = () => {
    const navigate = useNavigate();

    const headers = [
        { name: 'Name', value: 'name' },
        { name: 'Email', value: 'email' },
        { name: 'Phone', value: 'phoneNumber' },
        { name: 'Role', value: 'role' },
        { name: 'Action', value: 'action' }
    ];
    const roles =  [
        {
            "id": 3,
            "name": "Company Admin"
        },
        {
            "id": 5,
            "name": "Brand Manager"
        },
        {
            "id": 7,
            "name": "Branch User"
        }
    ]
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

    const getUserName = (user)=> {
        return  roles.find((role)=> user.roles[0] === role.id).name
    }

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
            userRole: userRole ? userRole?.name : null
        };
    });

    const handleDeleteUser = (userId) => {
        setSelectedUserId(userId);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await userManagementService.DeleteUser(selectedUserId);
            if (response) {
                getUsersList();
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
        navigate('/create-user');
    };

    const handleEditUser = (userId) => {
        navigate(`/update-user/${userId}`);
    };

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
                                            <TableCell>{row.name + ' ' + row.surname}</TableCell>
                                            <TableCell>{row.emailAddress}</TableCell>
                                            <TableCell>{row?.phoneNumber}</TableCell>
                                            <TableCell>{getUserName(row)}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <Button
                                                        variant="outlined"
                                                        type="primary"
                                                        style={{ color: '#DD4D2B', border: 'none' }}
                                                        onClick={() => handleDeleteUser(row.userId)}
                                                    >
                                                        <DeleteIcon />
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
