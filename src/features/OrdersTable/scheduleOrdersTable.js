import { Chip, Grid, Menu, MenuItem, Typography, Box, Button, Stack } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import moment from 'moment/moment';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchOrdersList } from './hooks';
import { useFetchScheduledOrdersList } from './hooks/useFetchScheduledOrdersList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationSound from 'assets/audio/orderSound.mp3';
import orderServices from 'services/orderServices';
import AssignTaskDialog from './assign-task-dialog';
import { useSnackbar } from 'notistack';
import { useAuth } from 'providers/authProvider';
import RefundRequestDialog from 'features/refund/refund';
import refundService from 'services/refundService';

export default function ScheduledOrdersTable({ type, setData, setModalOpen, selectedBranch, selectedBrand, data, filter, filterStatus }) {
    const { user, userRole, isAuthenticated } = useAuth();
    const [isRefundOpen, setIsRefundOpen] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [selectedRow, setSelectedRow] = useState();
    const location = useLocation();

    // ===== NEW: audio enable/disable flag (default OFF) =====
    const [audioEnabled, setAudioEnabled] = useState(true);

    const { ordersList, fetchOrdersList, totalRowCount, loading } = useFetchScheduledOrdersList({
        selectedBranch,
        selectedBrand,
        playAudio,
        filter,
        filterStatus
    });

    const shouldShowRefundButton = (order) => {
        if (!order) return false;

        const orderRefunded = order.isRefunded === true;

        const anyProductRefunded =
            Array.isArray(order.products) &&
            order.products.some(p => p?.isRefunded === true);

        // Show button ONLY if neither the order nor any product is refunded
        return !orderRefunded && !anyProductRefunded;
    };

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
        getOrderTypes();
    }, []);
    const handleClick = (event, params) => {
        setData(params?.row);
        setSelectedRow(params?.row);
        // setModalOpen(true)
        console.log(params?.row ,"order");
        
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
        const base = [{ name: 'Open/Print', modal: true }];
                if (shouldShowRefundButton(params?.row)) {
                base.push({ name: 'Refund Request', modal: true });
                }

             setOptions(base);
                }
                };
    const handleClose = (Data) => {
        if (Data?.name == 'Open/Print') {
            setModalOpen(true);
        }
        else if (Data?.name === 'Refund Request') {
      setIsRefundOpen(true);
        }
        else if (Data?.name == 'Accept') {
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

const submitRefund = async (dialogData) => {

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
                                    <li key={obj?.id ?? obj?.name}>
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

    // ===== MODIFIED: only play if audioEnabled is true =====
    async function playAudio() {
        if (!audioEnabled) return; // respect user's choice
        try {
            await audioPlayer.current?.play();
        } catch (e) {
            // Some browsers block autoplay until a user gesture occurs
            console.warn('Audio play blocked until user interacts (toggle the sound ON once).', e);
        }
    }

    // simple toggle button handler
    const toggleAudioEnabled = () => setAudioEnabled((v) => !v);

    return (
        <div>
            {/* Simple On/Off button for order sound */}
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <Button
                    size="small"
                    variant={audioEnabled ? 'contained' : 'outlined'}
                    color={audioEnabled ? 'success' : 'inherit'}
                    onClick={toggleAudioEnabled}
                >
                    {audioEnabled ? 'Order Sound: On' : 'Order Sound: Off'}
                </Button>
            </Stack>

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
            <RefundRequestDialog
            open={isRefundOpen}
            onClose={() => setIsRefundOpen(false)}
            onSubmit={submitRefund}
            order={data ? { id: data.id, products: data.products || [] } : null}
            />
            <audio ref={audioPlayer} src={NotificationSound}>
                <track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions" />
            </audio>
        </div>
    );
}
