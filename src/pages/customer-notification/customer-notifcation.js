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
    Stack,
    Backdrop,
    CircularProgress
} from '@mui/material';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import DataGridComponent from 'components/DataGridComponent';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useLocation, useNavigate } from 'react-router-dom';
import { ServiceFactory } from 'services/index';
import moment from 'moment-jalaali';
import { useSnackbar } from 'notistack';
const CustomerNotification = ({user}) => {

    const [selectedBrand, setselectedBrand] = useState({});
    const [reload, setReload] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [customerGroup, setCustomerGroup] = useState([]);
    const customerService = ServiceFactory.get('customer');

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

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
        setActionLoading(true);
        try {
            const response = await customerService.AcceptNotification(data);
            if (response) {
                await fetchData();
                enqueueSnackbar('Notification accepted successfully', {
                    variant: 'success'
                });
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar(error?.response?.data?.error?.message || 'Failed to accept notification', {
                variant: 'error'
            });
        } finally {
            setActionLoading(false);
        }
    };
    const rejecttNotification = async (data) => {
        setActionLoading(true);
        try {
            const response = await customerService.RejectNotification(data);
            if (response) {
                await fetchData();
                enqueueSnackbar('Notification rejected successfully', {
                    variant: 'success'
                });
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar(error?.response?.data?.error?.message || 'Failed to reject notification', {
                variant: 'error'
            });
        } finally {
            setActionLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const handleClick = (event, params) => {
        setselectedNotification(params.row);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = async (data) => {
        console.log(data);
        if (!data?.name || !selectedNotification) {
            setAnchorEl(null);
            return;
        }

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
        setAnchorEl(null);

        if (data.name === 'Accept') {
            await acceptNotification(payload);
        } else if (data.name === 'Reject') {
            await rejecttNotification(payload);
        }
    };

        const columns = [
        {
            field: 'notificationTitle',
            headerName: 'Title',
            flex: 0.8,
            minWidth: 160,
            headerAlign: 'left',
            align: 'left',
            renderCell: ({ value }) => (
            <span
                style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                title={value}
            >
                {value || '--'}
            </span>
            ),
        },
        {
            field: 'notificationMessage',
            headerName: 'Text',
            flex: 1.4,
            minWidth: 240,
            headerAlign: 'left',
            align: 'left',
            renderCell: ({ value }) => (
            <span
                style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                title={value}
            >
                {value || '--'}
            </span>
            ),
        },
        {
            field: 'comments',
            headerName: 'Comments',
            flex: 1.2,
            minWidth: 220,
            headerAlign: 'left',
            align: 'left',
            renderCell: ({ value }) => (
            <span
                style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                title={value}
            >
                {value || '--'}
            </span>
            ),
        },
        {
            field: 'notificationDate',
            headerName: 'Date',
            flex: 0.6,
            minWidth: 130,
            headerAlign: 'left',
            align: 'left',
            renderCell: (params) =>
            params.row?.notificationDate
                ? moment(params.row.notificationDate).format('DD/MM/YYYY')
                : '--',
        },
        {
            field: 'actionTime',
            headerName: 'Action Time',
            flex: 0.9,
            minWidth: 170,
            headerAlign: 'left',
            align: 'left',
            renderCell: (params) => {
            const actionTime = params.row?.actionTime;
            const actionType = params.row?.type;

            return (
                <span style={{ whiteSpace: 'nowrap' }}>
                {actionTime
                    ? moment(actionTime).format('DD/MM/YYYY')
                    : 'No Date Available'}
                {actionType ? ` (${actionType})` : ''}
                </span>
            );
            },
        },
        {
            field: 'groups',
            headerName: 'Group of Customers',
            flex: 1.4,
            minWidth: 240,
            headerAlign: 'left',
            align: 'left',
            sortable: false,
            renderCell: (params) => {
            const matchedGroups =
                customerGroup.filter((group) =>
                params.row.requestGroup?.some(
                    (request) => request?.requestGroupID === group.id
                )
                ) || [];

            return (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {matchedGroups.length > 0
                    ? matchedGroups.map((group) => (
                        <Chip
                        key={group.id}
                        label={group.name}
                        size="small"
                        color="primary"
                        />
                    ))
                    : '--'}
                </div>
            );
            },
        },
        {
            field: 'actions',
            headerName: 'Action',
            sortable: false,
            flex: 0.4,
            minWidth: 80,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) =>
            !params.row.isAct && (
                <MoreVertIcon
                sx={{ cursor: 'pointer' }}
                onClick={(event) => handleClick(event, params)}
                />
            ),
        },
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
                    loading={reload || actionLoading}
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
            
                            <MenuItem disabled={user?.isAccessRevoked || actionLoading} key={index} onClick={() => handleClose(row)} value={row.name}>
                                {row.name}
                            </MenuItem>
                        );
                    })}
                </Menu>
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={actionLoading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Grid>
        </Grid>
    );
};

export default CustomerNotification;
