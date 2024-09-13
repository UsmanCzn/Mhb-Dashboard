import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

import { useLocation, useNavigate, useHistory } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Menu } from '@mui/material';
import userManagementService from 'services/userManagementService';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import ConfirmationModal from '../../components/confirmation-modal';
import customerService from 'services/customerService';
import { alignments } from '../../../../../AppData/Local/Microsoft/TypeScript/5.5/node_modules/@floating-ui/utils/dist/floating-ui.utils';

const UserList = () => {
    const navigate = useNavigate();
    const [companies, setcompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const headers = [
        { name: 'Name', value: 'name' },
        { name: 'Email', value: 'email' },
        { name: 'Phone', value: 'phoneNumber' },
        { name: 'Role', value: 'role' },
        { name: 'Action', value: 'action' }
    ];
    const roles = [
        {
            id: 3,
            name: 'Company Admin'
        },
        {
            id: 5,
            name: 'Brand Manager'
        },
        {
            id: 7,
            name: 'Branch User'
        }
    ];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [users, setUsers] = useState([]);
    const [usersRoles, setUsersRoles] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null); // State to store the selected user for delete confirmation
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event, data) => {
        setSelectedUserId(data.userId);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (action, data, index) => {
        console.log(action, data, index, 'row click');
        if (action === 'delete') {
            handleDeleteUser();
        } else if (action === 'edit') {
            navigate(`/create-user/${selectedCompany}/${selectedUserId}`);
        }
        setAnchorEl(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedCompany(value);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getUserName = (user) => {
        return roles.find((role) => user.roles[0] === role.id).name;
    };

    const getUsersList = async () => {
        try {
            const response = await userManagementService.getAllUsers(selectedCompany);
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

    const getCompanies = async () => {
        try {
            const res = await customerService.getComapniesByUserRole();
            if (res) {
                const tempComp = res.data.result;
                if (tempComp.length) {
                    let index = tempComp.findIndex((e) => e.name === 'Holmes Bakehouse');
                    if (index >= 0) {
                        setSelectedCompany(tempComp[index].id);
                    } else {
                        setSelectedCompany(tempComp[0].id);
                    }
                }
                setcompanies(res.data.result);
            }
        } catch (err) {}
    };

    useEffect(() => {
        getUserRoles();
        getCompanies();
    }, []);
    useEffect(() => {
        getUsersList();
    }, [selectedCompany]);

    const mergedUsers = users?.map((user) => {
        const userRole = Array.isArray(usersRoles) && usersRoles?.find((role) => role.id === user.userId);
        return {
            ...user,
            userRole: userRole ? userRole?.name : null
        };
    });

    const handleDeleteUser = () => {
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
        navigate(`/create-user/${selectedCompany}`);
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Typography fontSize={22} fontWeight={700}>
                            User Management
                        </Typography>
                        <Box alignItems="center" sx={{ display: 'flex', gap: '10px' }}>
                            <Grid item xs={'auto'}>
                                {/* <div>
                                    <label htmlFor="Company">Company</label>
                                </div> */}
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    fullWidth
                                    title="Company"
                                    value={selectedCompany}
                                    label="Company"
                                    name="companyId"
                                    onChange={handleInputChange}
                                >
                                    {companies.map((row, index) => {
                                        return (
                                            <MenuItem key={index} value={row.id}>
                                                {row?.name}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </Grid>
                            <Grid item xs={'auto'}>
                                <Button onClick={handleCreateNewUser} size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
                                    Create New User
                                </Button>
                            </Grid>
                        </Box>
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
                                                    <MoreVertIcon onClick={(event) => handleClick(event, row)} />
                                                    <Menu
                                                        id="basic-menu"
                                                        anchorEl={anchorEl}
                                                        open={open}
                                                        onClose={handleClose}
                                                        MenuListProps={{
                                                            'aria-labelledby': 'basic-button'
                                                        }}
                                                    >
                                                        <MenuItem onClick={() => handleClose('delete', row, index)}>Delete</MenuItem>
                                                        <MenuItem onClick={() => handleClose('edit', row, index)}>Edit</MenuItem>
                                                    </Menu>
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
