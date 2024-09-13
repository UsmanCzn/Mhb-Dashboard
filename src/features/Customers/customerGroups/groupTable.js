import { Chip, Grid, Typography, Menu, MenuItem, Button, Card, Box } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchRewardList } from '../hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useFetchBranchList } from 'features/BranchesTable/hooks/useFetchBranchesList';
import moment from 'moment-jalaali';
import rewardService from 'services/rewardService';
import NewCustomer from '../newTier/newCustomer';
import { FaPencilAlt } from 'react-icons/fa';
import LinearProgress from '@mui/material/LinearProgress';

import { useCustomerGroup } from '../hooks/useCustomerGroups';

const CustomerGroupTable = forwardRef(({ selectedBrand, reload, customerGroups, setReload }, ref) => {
    const navigate = useNavigate();

    const location = useLocation();

    const { tiersList, fetchTiersList, totalRowCount, loading } = useCustomerGroup(reload, selectedBrand);
    const upperMarin = 0.5;
    const [modal, setModal] = useState(false);
    const [myLoading, setloading] = useState(true);
    const [newModal, setNewModal] = useState(false);
    const hideModal = (value) => {
        setNewModal(value);
    };
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    const groupsColumnFormater = (item) => {
        return (
            <Grid container spacing={1}>
                <Grid item xs="auto">
                    <Typography variant="h6" px={2} mr={1} border={0.6} borderRadius={1}>
                        {customerGroups?.find((obj) => obj?.id == item?.brandGroupId)?.name}
                    </Typography>
                </Grid>
            </Grid>
        );
    };

    const rewardsColumnFormater = (item) => {
        return (
            <Grid container spacing={1}>
                <Grid item xs="auto">
                    {item?.rewardProgramGifts?.map((obj) => {
                        return (
                            <Typography variant="h6" px={2} mr={1} border={0.6} borderRadius={1}>
                                {obj?.name + ' - ' + obj?.amount}
                            </Typography>
                        );
                    })}
                </Grid>
            </Grid>
        );
    };
    const dateColumnFormater = (item) => {
        return (
            <Typography variant="h6">
                {moment(item?.startDate).format('DD/MM/YYYY') + ' - ' + moment(item?.endDate)?.format('DD/MM/YYYY')}
            </Typography>
        );
    };

    const deletePointsCollection = async (id) => {
        await rewardService
            .DeleteDiscountProgram(id)

            .then((res) => {
                console.log(res.data, 'delete response');
                setReload((prev) => !prev);
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });
    };
    const [anchorEl, setAnchorEl] = useState(null);
    const [pointCollection, setPointCollection] = useState({});
    const setSelectedItem = (item) => {
        setPointCollection(item);
        setNewModal(true);
    };

    const open = Boolean(anchorEl);
    const handleClick = (event, params) => {
        setPointCollection(params?.row);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (data, index) => {
        if (data.modal && data?.name == 'Edit') {
            setNewModal(true);
        } else if (data?.name == 'Delete') {
            deletePointsCollection(pointCollection?.id);
        } else if (data?.name == 'Duplicate') {
            setDuplicateModal(true);
        }
        setAnchorEl(null);
    };

    useEffect(() => {
        setloading(loading);
    }, [loading]);
    const showLoader = () => {
        if (myLoading) {
            return (
                <Box sx={{ width: '100%' }} my={1}>
                    <LinearProgress />
                </Box>
            );
        } else {
            <></>;
        }
    };

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            headerAlign: 'left'
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 0.7,
            headerAlign: 'left'
        },
        {
            field: 'brandName',
            headerName: 'Brand',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'numberOfCustomers',
            headerName: 'Number of Customers',
            flex: 1.2,
            headerAlign: 'left'
        },
        {
            field: 'sendNotification',
            headerName: 'Send Notification',
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
            name: 'Edit',
            modal: true
        },
        {
            name: 'Duplicate',
            modal: true
        },
        {
            name: 'Delete',
            modal: true
        }
    ];
    const theme = {
        spacing: 8
    };

    const showAddNew = () => {
        setPointCollection();
        setNewModal(true);
    };
    useImperativeHandle(ref, () => ({
        showAddNew
    }));
    return (
        <>
            <Grid container mb={2} justifyContent="flex-end">
                <Grid item xs={'auto'}></Grid>
            </Grid>
            {/* <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={6}></Grid>
                <Grid item xs={'auto'}>
                    <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }} onClick={showAddNew}>
                        Add New Customer Group
                    </Button>
                </Grid>
            </Grid> */}
            <Grid container mb={2} justifyContent="flex-end"></Grid>
            {/* <DataGridComponent
                rows={tiersList}
                columns={columns}
                loading={loading}
                getRowId={(row) => row.id}
                rowsPerPageOptions={[10]}
                totalRowCount={totalRowCount}
                fetchCallback={fetchTiersList}
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
                        <MenuItem onClick={() => handleClose(row, index)} value={row.name} key={index}>
                            {row.name}
                        </MenuItem>
                    );
                })}
            </Menu> */}
            {showLoader()}
            <Grid container spacing={2}>
                {tiersList.map((item, index) => (
                    <Grid item key={index} xs={6} sm={6} md={4} lg={3}>
                        <Card>
                            {imageError ? (
                                <img
                                    src={item.logo}
                                    alt="user avatar"
                                    onError={handleImageError}
                                    style={{ objectFit: 'cover', height: '200px', width: '100%' }}
                                />
                            ) : (
                                <img
                                    src={selectedBrand?.logoUrl}
                                    style={{ objectFit: 'cover', height: '150px', width: '100%' }}
                                    alt="user avatara"
                                />
                            )}
                            <Box p={1}>
                                <Box
                                    sx={{
                                        width: '100%',
                                        mt: 1
                                    }}
                                    justifyContent="space-between"
                                    display="flex"
                                >
                                    <Grid container>
                                        <Grid item xs={11}>
                                            <Box>
                                                <Typography variant="h7" style={{ fontSize: '12px' }}>
                                                    {'Name'}
                                                    <Typography variant="h5" style={{ fontSize: '14px' }}>
                                                        {item?.name}
                                                    </Typography>
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Box my={upperMarin}>
                                                <FaPencilAlt onClick={() => setSelectedItem(item)} />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box my={upperMarin}>
                                    <Typography variant="h7" style={{ fontSize: '12px' }}>
                                        {'Brand'}
                                        <Typography variant="h5" style={{ fontSize: '14px' }}>
                                            {selectedBrand.name}
                                        </Typography>
                                    </Typography>
                                </Box>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Box>
                                            <Typography variant="h7" style={{ fontSize: '12px' }}>
                                                {'No of Customer'}
                                                <Typography variant="h5" style={{ fontSize: '14px' }}>
                                                    {selectedBrand.amountOfCustomers}
                                                </Typography>
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box my={upperMarin}>
                                            <Typography variant="h7" style={{ fontSize: '12px' }}>
                                                {'Send Notification'}
                                                <Typography variant="h5" style={{ fontSize: '14px' }}>
                                                    {item.sendNotification ? 'true' : 'false'}
                                                </Typography>
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <NewCustomer
                modal={newModal}
                setModal={hideModal}
                selectedBrand={selectedBrand}
                setReload={setReload}
                editItem={pointCollection}
            />
        </>
    );
});
export default CustomerGroupTable;
