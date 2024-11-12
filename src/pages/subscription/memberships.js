import React, { useState, useEffect } from 'react';
import MembershipFormModal from './create-subscriptions';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, Typography, Menu, MenuItem, Grid } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import membershipService from 'services/membership.service';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const Membership = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedMembership, setSelectedMembership] = useState();
    const navigate = useNavigate();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [loading, setloading] = useState(true);
    const [memberships, setmemberships] = useState([]);
    useEffect(() => {
        getAllActiveAndInActiveMemberships();
    }, []);

    const open = Boolean(anchorEl);
    const handleClick = (event, params) => {
        setSelectedMembership(params.row);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (data) => {
        console.log(selectedMembership, 'selected Member');
        if (data.name === 'Generate Invoice') {
            generateInovice();
        } else {
            navigate(`/membership-detail/${selectedMembership?.companyId}`);
        }
        // if (!data.modal && data.route) {
        // }
        setAnchorEl(null);
    };

    const generateInovice = async () => {
        try {
            const response = await membershipService.CreateMembershipInvoice({
                memberShipId: selectedMembership?.id,
                companyId: selectedMembership?.companyId
            });
            console.log(response.data.result.item2);
            if (response.data.result.item2 === 'Already Exist') {
                enqueueSnackbar(`Invoice already exists `, {
                    variant: 'error'
                });
            } else {
                enqueueSnackbar(`Invoice has been generated for ${selectedMembership.companyName}`, {
                    variant: 'success'
                });
            }
        } catch (err) {
            enqueueSnackbar(err.response.data.error.message, {
                variant: 'error'
            });
        }
    };
    const getAllActiveAndInActiveMemberships = async () => {
        try {
            const [activeMemberships, inactiveMemberships] = await Promise.all([
                membershipService.getAllActiveMembershipForAdmin(),
                membershipService.getAllInactiveMembershipForAdmin()
            ]);
            setmemberships([...activeMemberships.data.result, ...inactiveMemberships.data.result]);
            setloading(false);

            // You can now use activeMemberships and inactiveMemberships as needed
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            field: 'companyName',
            headerName: 'Company Name',
            flex: 0.7,
            headerAlign: 'left'
        },
        {
            field: 'phoneNumber',
            headerName: 'Phone Number',
            flex: 1,
            headerAlign: 'left'
            // renderCell: params => groupsColumnFormater(params.row)
        },
        {
            field: 'memberShipName',
            headerName: 'Membership',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'emailAddress',
            headerName: 'Email',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'isRewardMfissisng',
            headerName: 'Action',
            sortable: false,
            flex: 0.5,
            headerAlign: 'left',

            renderCell: (params) => {
                return <MoreVertIcon onClick={(event) => handleClick(event, params)} />;
            }
        }
    ];

    const options = [
        {
            name: 'Generate Invoice'
        },
        {
            name: 'View Details'
        }
    ];
    const handlePageChange = (newPage) => {};
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        getAllActiveAndInActiveMemberships();
        {
            setIsModalOpen(false);
        }
    };

    return (
        <div>
            <Grid container justifyContent="flex-end" sx={{ mb: 2 }} spacing={2}>
                <Button variant="contained" color="primary" onClick={handleOpenModal}>
                    Create Membership
                </Button>
            </Grid>
            <>
                <DataGridComponent
                    rows={memberships}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row.id}
                    rowsPerPageOptions={[10]}
                    totalRowCount={10}
                    fetchCallback={handlePageChange}
                />
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button'
                    }}
                >
                    {options.map((row, index) => {
                        return (
                            <MenuItem key={index} onClick={() => handleClose(row)} value={row.name}>
                                {row.name}
                            </MenuItem>
                        );
                    })}
                </Menu>
            </>
            <MembershipFormModal open={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default Membership;
