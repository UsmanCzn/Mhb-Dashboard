import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chip, IconButton, Menu, MenuItem } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import moment from 'moment/moment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import customerService from 'services/customerService';
import { useSnackbar } from 'notistack';


const PointsRequestTable = () => {

    const [pointsRequest, setPointsRequest] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    
    const open = Boolean(anchorEl);

    useEffect(() => {
        getPointsRequest();
        // return () => {
        //   second
        // }
    }, []);

    // GET CREDIT DETAILS
    const getPointsRequest = async () => {
        await customerService
            .getUsedPointsRequest()
            .then((res) => {
                console.log(res?.data?.result, 'request');
                setPointsRequest(res.data.result);
                // setWalletDetails(res?.data?.result);
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });
    };

    const handleClick = (event, params) => {
        setSelectedRow(params.row);
        setAnchorEl(event.currentTarget);

        //   setBrand(params?.row);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (data) => {
        console.log(data);
        if (data.name == 'Accept') {
            const body = {
                id: selectedRow.id,
                brandId: selectedRow?.brandId,
                customerId: selectedRow?.customerId,
                increaseFreeItemsCount: 0,
                increasePunchesCount: 0,
                pointsUsed: selectedRow.redeemablePoints,
                pointsEarned: 0,
                comments: ''
            };
            acceptRequest(body);
        } else if (data.name == 'Reject') {
            const body = {
                id: selectedRow.id,
                brandId: selectedRow?.brandId,
                customerId: selectedRow?.customerId,
                increaseFreeItemsCount: 0,
                increasePunchesCount: 0,
                pointsUsed: 0,
                pointsEarned: 0,
                comments: ''
            };
            rejectRequest(body);
        }
        setAnchorEl(null);
    };

    const acceptRequest = async (body) => {
        await customerService
            .acceptUsedPointsRequest(body)
            .then((res) => {
                enqueueSnackbar('Request Accepted', {
                    variant: 'success'
                });
                getPointsRequest();
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });
    };

    const rejectRequest = async (body) => {
        await customerService
            .rejectUsedPointsRequest(body)
            .then((res) => {
                enqueueSnackbar('Request Rejected', {
                    variant: 'error'
                });
                getPointsRequest();
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });
    };
    const columns = [
        {
            field: 'userName',
            headerName: 'User Name',
            headerAlign: 'left'
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'brandName',
            headerName: 'Brand Name',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'phone',
            headerName: 'PhoneNumber',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'actionTime',
            headerName: 'Action Time',
            flex: 1,
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
            field: 'redeemablePoints',
            headerName: 'Amount Request',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'walletComments',
            headerName: 'Comments',
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
                console.log(params.row.isAct, 'ssoopd');
                return !params.row.isAct && <MoreVertIcon onClick={(event) => handleClick(event, params)} />;
            }
        }
    ];

    const options = [
        {
            name: 'Accept',
            modal: false
        },
        {
            name: 'Reject',
            modal: false
        }
    ];
    return (
        <>
            <DataGridComponent
                rows={pointsRequest}
                columns={columns}
                loading={false}
                getRowId={(row) => row.id}
                rowsPerPageOptions={[10]}
                totalRowCount={pointsRequest?.length}
                // fetchCallback={getCreditRequest}
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
                        <MenuItem onClick={() => handleClose(row)} value={row.name}>
                            {row.name}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
};

export default PointsRequestTable;
