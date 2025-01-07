import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chip, IconButton, Menu, MenuItem } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import moment from 'moment/moment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import customerService from 'services/customerService';
import { useSnackbar } from 'notistack';

const FreeDrinksRequest = () => {
        const [freeDrinksRequest, setFreeDinksRequest] = useState([]);
        const [anchorEl, setAnchorEl] = useState(null);
        const [selectedRow, setSelectedRow] = useState(null);
        const { enqueueSnackbar, closeSnackbar } = useSnackbar();
        const open = Boolean(anchorEl);
        useEffect(() => {
            getFreeDrinksRequest();
        }, []);

        // GET CREDIT DETAILS
        const getFreeDrinksRequest = async () => {
            await customerService
                .getUsedPointsRequest()
                .then((res) => {
                    console.log(res?.data?.result, 'request');
                    setFreeDinksRequest(res.data.result);
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
                    increaseFreeItemsCount: selectedRow.increaseFreeItemsCount,
                    increasePunchesCount: 0,
                    pointsUsed: 0,
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
                    getFreeDrinksRequest();
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
                    getFreeDrinksRequest();
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
                field: 'increaseFreeItemsCount',
                headerName: 'Items Request',
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
                    rows={freeDrinksRequest.filter((e) => e.increaseFreeItemsCount > 0)}
                    columns={columns}
                    loading={false}
                    getRowId={(row) => row.id}
                    rowsPerPageOptions={[10]}
                    totalRowCount={freeDrinksRequest.filter((e) => e.increaseFreeItemsCount > 0)?.length}
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
}

export default FreeDrinksRequest