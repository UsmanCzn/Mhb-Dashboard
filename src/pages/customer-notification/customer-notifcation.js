import React, { useState, useEffect, useMemo } from 'react';
import {
    Grid,
    Typography,
    Button,
    Box,
    FormControl,
    InputLabel,
    Menu,
    MenuItem,
    Select,
    Avatar,
    Tooltip,
    Chip,
    Stack
} from '@mui/material';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import DataGridComponent from 'components/DataGridComponent';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useLocation, useNavigate } from 'react-router-dom';
import { ServiceFactory } from 'services/index';
import moment from 'moment-jalaali';
const CustomerNotification = ({user}) => {

    const [selectedBrand, setselectedBrand] = useState({});
    const [reload, setReload] = useState(false);
    const [customerGroup, setCustomerGroup] = useState([]);
    const customerService = ServiceFactory.get('customer');

    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setselectedNotification] = useState();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const fetchData = async () => {
        setReload(true);
        try {
            const [customerGroupsResponse, notificationsResponse] = await Promise.all([
                customerService.GetCustomersGroups(),
                customerService.GetAllCustomerNotification()
            ]);
            // Process customer groups
            if (customerGroupsResponse) {
                
                const tempGroup = customerGroupsResponse.data.result.data.data.filter((group) => group.type === 'Base');
                setCustomerGroup(tempGroup);
            }
            // Process notifications
            if (notificationsResponse) {
                setNotifications(notificationsResponse.data.result);
            }
            setReload(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const acceptNotification = async (data) => {
        try {
            const response = await customerService.AcceptNotification(data);
            if (response) {
                fetchData();
            }
        } catch (error) {
            console.log(error);
        }
    };
    const rejecttNotification = async (data) => {
        try {
            const response = await customerService.RejectNotification(data);
            if (response) {
                fetchData();
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const handleClick = (event, params) => {
        setselectedNotification(params.row);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (data) => {
        console.log(data);
        const payload = {
            notificationMessage: selectedNotification.notificationMessage,
            notificationTitle: selectedNotification.notificationTitle,
            notificationMessageNative: selectedNotification.notificationMessageNative,
            notificationTitleNative: selectedNotification.notificationTitleNative,
            notificationRequestid: selectedNotification.id,
            comments: selectedNotification.comments,
            notificationType: selectedNotification.notificationType,
            branchId: selectedNotification.branchId,
            brandId: selectedNotification.brandId ?? 0,
            notificationDate: selectedNotification.notificationDate,
            customersGroups: selectedNotification.requestGroup.map((e) => e.requestGroupID)
        };
        if (data.name === 'Accept') {
            acceptNotification(payload);
        } else if (data.name === 'Reject') {
            rejecttNotification(payload);
        }

        setAnchorEl(null);
    };

    const columns = [
        {
            field: 'notificationTitle',
            headerName: 'Title',
            headerAlign: 'left',
            flex: 0.5
        },
        {
            field: 'notificationMessage',
            headerName: 'Text',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'comments',
            headerName: 'Comments',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'notificationDate',
            headerName: 'Date',
            flex: 0.5,
            headerAlign: 'left',
            renderCell: (params) => {
                return <p>{moment(params.row?.notificationDate).format('DD/MM/YYYY')}</p>;
            }
        },
        {
            field: 'actionTime',
            headerName: 'Action Time',
            flex: 0.5,
            headerAlign: 'left',
            renderCell: (params) => {
                const actionTime = params.row?.actionTime;
                const actionType = params.row?.type; // Assuming `type` is available in the row data

                // Handle null or undefined case for actionTime
                const formattedTime = actionTime ? moment(actionTime).format('DD/MM/YYYY') : 'No Date Available';

                return (
                    <p>
                        {formattedTime} {actionType ? `(${actionType})` : ''}
                    </p>
                );
            }
        },
        {
            field: 'groups',
            headerName: 'Group of Customers',
            flex: 1,
            headerAlign: 'left',
            renderCell: (params) => {
                // Find all matching customer groups based on requestGroupID
                const matchedGroups =
                    customerGroup.filter((group) => params.row.requestGroup.some((request) => request?.requestGroupID === group.id)) || [];
                return (
                    <div sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {matchedGroups.length > 0 ? (
                            matchedGroups.map((group) => (
                                <Chip color="primary" key={group?.id} label={group?.name} style={{ margin: '2px' }} />
                            ))
                        ) : (
                            <div></div>
                        )}
                    </div>
                );
            }
        },
        // {
        //     field: 'date',
        //     headerName: 'Date & Time',
        //     flex: 1,
        //     headerAlign: 'left'
        // },

        {
            field: 'isRewardMfissisng',
            headerName: 'Action',
            sortable: false,
            flex: 1,
            headerAlign: 'left',

            renderCell: (params) => {
                return !params.row.isAct && <MoreVertIcon onClick={(event) => handleClick(event, params)} />;
            }
        }
    ];

    const options = [
        {
            name: 'Accept',
            modal: true
        },
        {
            name: 'Reject',
            modal: true
        }
    ];
    return (
        <Grid container spacing={2}>
            {/* <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={'auto'}>
                        <Typography fontSize={22} fontWeight={700}>
                            Notifications
                        </Typography>
                    </Grid>
                    <Box alignItems="center" sx={{ display: 'flex', gap: '10px' }}>
                        <Grid item xs={'auto'}>
                            <Button
                                size="small"
                                onClick={() => {
                                    navigate(`/createNotification`);
                                }}
                                variant="contained"
                                sx={{ textTransform: 'capitalize' }}
                            >
                                Add New Notification
                            </Button>
                        </Grid>
                        <Grid item xs={6} justifyContent="flex-end">
                            <FormControl>
                                <InputLabel id="demo-simple-select-label">{'Brand'}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedBrand}
                                    label={'Brand'}
                                    onChange={(event) => {
                                        setselectedBrand(event.target.value);
                                    }}
                                >
                                    {brandsList.map((row, index) => {
                                        return (
                                            <MenuItem key={index} value={row}>
                                                {row?.name}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Box>
                </Grid>
            </Grid> */}
            <Grid item xs={12}>
                <DataGridComponent
                    rows={notifications}
                    columns={columns}
                    loading={reload}
                    getRowId={(row) => row.id}
                    rowsPerPageOptions={[10]}
                    totalRowCount={notifications?.length ?? 0}
                    // fetchCallback={fetchBrandsList}
                    pSize={10}
                    pMode={'client'}
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
            
                            <MenuItem disabled={user?.isAccessRevoked} key={index} onClick={() => handleClose(row)} value={row.name}>
                                {row.name}
                            </MenuItem>
                        );
                    })}
                </Menu>
            </Grid>
        </Grid>
    );
};

export default CustomerNotification;
