import { Chip, Grid, Menu, MenuItem, Typography, Box } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import moment from 'moment/moment';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchOrdersList } from './hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationSound from 'assets/audio/orderSound.mp3';
import orderServices from 'services/orderServices';
import AssignTaskDialog from './assign-task-dialog';
import { useSnackbar } from 'notistack';
import { useAuth } from 'providers/authProvider';

export default function OrdersTable({ type, setData, setModalOpen, selectedBranch, data, filter, filterStatus }) {
    const { user, userRole, isAuthenticated } = useAuth();

    const navigate = useNavigate();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [selectedRow, setSelectedRow] = useState();
    const location = useLocation();

    const { ordersList, fetchOrdersList, totalRowCount, loading } = useFetchOrdersList({
        selectedBranch,
        playAudio,
        filter,
        filterStatus
    });

    const [anchorEl, setAnchorEl] = useState(null);
    const [brand, setBrand] = useState({});
    const open = Boolean(anchorEl);
    const [statustypes, setStatusTypes] = useState([]);
    const [options, setOptions] = useState([
        {
            name: 'Open/Print',
            modal: true
        }
    ]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const handleAssignTask = () => {
        console.log('Task Assigned');
        setIsDialogOpen(false); // Close dialog after assigning the task
        enqueueSnackbar('Task has been assigned', {
            variant: 'success'
        });
    };
    const getOrderTypes = async () => {
        orderServices
            .getOrderTypes()
            .then((res) => {
                setStatusTypes(res?.data?.result);
            })
            .catch((err) => {
                console.log(err?.response);
            });
    };

    useEffect(() => {
        console.log('useEffect rerunning, Parent 2');
        getOrderTypes();
    }, []);
    const handleClick = (event, params) => {
        setData(params?.row);
        setSelectedRow(params?.row);
        // setModalOpen(true)

        setAnchorEl(event.currentTarget);
        if (params?.row?.status == 'Open') {
            setOptions([
                {
                    name: 'Open/Print',
                    modal: true
                },
                {
                    name: 'Accept',
                    modal: false
                },
                {
                    name: 'Reject',
                    modal: false
                }
            ]);
        } else if (params?.row?.status == 'Accepted' && params?.row?.deliverySystem === 'HomeDeliver' && !params.row?.verdiOrderId) {
            setOptions([
                {
                    name: 'Open/Print',
                    modal: true
                },
                {
                    name: 'Request Driver',
                    modal: false
                }
            ]);
        } else if (params?.row?.status == 'Accepted') {
            setOptions([
                {
                    name: 'Open/Print',
                    modal: true
                },
                {
                    name: 'Ready',
                    modal: false
                }
            ]);
        } else if (params?.row?.status == 'OutForDelivery' && params?.row?.verdiTrackingLink) {
            setOptions([
                {
                    name: 'Open/Print',
                    modal: true
                },
                {
                    name: 'Track Order',
                    modal: false
                }
            ]);
        } else if (params?.row?.status == 'Ready' && params?.row?.deliverySystem === 'HomeDeliver') {
            setOptions([
                {
                    name: 'Open/Print',
                    modal: true
                }
                // {
                //     name: 'Close',
                //     modal: false
                // }
            ]);
        } else if (params?.row?.status == 'Ready') {
            setOptions([
                {
                    name: 'Open/Print',
                    modal: true
                },
                {
                    name: 'Close',
                    modal: false
                }
            ]);
        } else {
            setOptions([
                {
                    name: 'Open/Print',
                    modal: true
                }
            ]);
        }
    };
    const handleClose = (Data) => {
        if (Data?.name == 'Open/Print') {
            setModalOpen(true);
        } else if (Data?.name == 'Accept') {
            updateOrderStatus(statustypes?.find((obj) => obj?.title == 'Accepted')?.id);
            console.log('Accept');
        } else if (Data?.name == 'Request Driver') {
            handleOpenDialog();
        } else if (Data?.name == 'Reject') {
            console.log('Reject');
            updateOrderStatus(statustypes?.find((obj) => obj?.title == 'Rejected')?.id);
        } else if (Data?.name == 'Ready') {
            updateOrderStatus(statustypes?.find((obj) => obj?.title == 'Ready')?.id);
            console.log('Ready');
        } else if (Data?.name == 'Close') {
            updateOrderStatus(statustypes?.find((obj) => obj?.title == 'Closed')?.id);
            console.log('Close');
        } else if (Data?.name == 'Track Order') {
            window.open(data?.verdiTrackingLink, '_blank');
        }
        setAnchorEl(null);
    };

    const updateOrderStatus = async (id) => {
        let payload = {
            id: data?.id,
            status: id,
            reason: ''
        };

        await orderServices
            .updateOrderStatus(payload)
            .then((res) => {
                console.log(res?.data);
                ordersList.forEach((element) => {
                    if (element.id === selectedRow.id) {
                        element.status = statustypes?.find((obj) => obj?.id == id)?.title;
                    }
                });
            })
            .catch((err) => {
                console.log(err?.response?.data);
            })
            .finally(() => {
                // setTimerReload(prev=>!prev)
            });
    };

    const columns = [
        {
            field: 'branchName',
            headerName: 'For Branch',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'deliverySystem',
            headerName: 'Type',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'orderNumber',
            headerName: 'Order Number',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0.5,
            headerAlign: 'left'
        },
        {
            field: 'customerPhoneNumber',
            headerName: 'Customer',
            flex: 1.2,
            headerAlign: 'left',
            renderCell: (params) => {
                return (
                    <Typography variant="h6">
                        {
                            params?.row?.customerName + ' ' + params?.row?.customerSurname
                            // +"\n" +
                            //  params?.row?.customerPhoneNumber
                        }
                    </Typography>
                );
            }
        },
        {
            field: 'creationDate',
            headerName: 'Date',
            flex: 1.2,
            headerAlign: 'left',
            renderCell: (params) => {
                return <Typography>{moment(params?.row?.creationDate).format('DD-MMM-YYYY hh:mm a')}</Typography>;
            }
        },
        // {
        //   field: "paymentMethod",
        //   headerName: "Payment Type",
        //   flex: 1,
        //   headerAlign: "left",
        // },
        {
            field: 'isHiddven',
            headerName: 'Order details',
            flex: 1.2,
            headerAlign: 'left',
            renderCell: (params) => {
                return (
                    <Grid container direction="column">
                        <Typography component="div" sx={{ '& ul': { m: 0, p: 0 }, '& li': { marginLeft: '-1em' } }}>
                            <ul>
                                {params?.row?.products?.map((obj) => (
                                    <li>
                                        <Typography variant="h6">{obj?.name + ' x ' + obj?.quantity}</Typography>
                                    </li>
                                ))}
                            </ul>
                        </Typography>
                    </Grid>
                );
            }
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

    const audioPlayer = useRef(null);

    function playAudio() {
        audioPlayer.current.play();
    }

    return (
        <div>
            <DataGridComponent
                rows={ordersList}
                columns={columns}
                loading={loading}
                getRowId={(row) => row.id}
                rowsPerPageOptions={[10]}
                totalRowCount={totalRowCount}
                fetchCallback={fetchOrdersList}
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

            <AssignTaskDialog open={isDialogOpen} onClose={handleCloseDialog} onAssignTask={handleAssignTask} selectedOrder={data} />
            <audio ref={audioPlayer} src={NotificationSound}>
                <track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions" />
            </audio>
        </div>
    );
}
