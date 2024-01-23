import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chip, IconButton, Menu, MenuItem } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import moment from 'moment/moment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import customerService from 'services/customerService';

const CreditRequestTable = () => {
    const navigate = useNavigate();

    const location = useLocation();

    const [creditRequest, setCreditRequest] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        getCreditRequest();
        // return () => {
        //   second
        // }
    }, []);

    // GET CREDIT DETAILS
    const getCreditRequest = async () => {
        await customerService
            .getCreditDetails()
            .then((res) => {
                console.log(res?.data?.result, 'creditrequest');
                setCreditRequest(res.data.result);
                // setWalletDetails(res?.data?.result);
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });
    };

    const handleClick = (event, params) => {
        console.log(event, params);
        setSelectedRow(params.row);
        setAnchorEl(event.currentTarget);

        //   setBrand(params?.row);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (data) => {
        // if (!data.modal && data.route) {
        //     navigate(`${location.pathname}/${branch?.id}/${data.route}`);
        // } else if (data?.name == 'Edit Brand') {
        //     setUpdateData(brand);
        //     setUpdate(true);
        //     setModalOpen(true);
        // }
        console.log(data);
        if (data.name == 'Accept') {
            const body = {
                brandId: selectedRow?.brandId,
                customerId: selectedRow?.customerId,
                increaseBalanceAmount: selectedRow?.increaseBalanceAmount,
                walletComments: selectedRow?.walletComments,
                expiryDate: selectedRow?.expiryDate,
                id: selectedRow?.id,
                isAccepted: true
            };
            updatewalletRequestbyId(body);
        } else {
            const body = {
                brandId: selectedRow?.brandId,
                customerId: selectedRow?.customerId,
                increaseBalanceAmount: selectedRow?.increaseBalanceAmount,
                walletComments: selectedRow?.walletComments,
                expiryDate: selectedRow?.expiryDate,
                id: selectedRow?.id,
                isAccepted: false
            };
            updatewalletRequestbyId(body);
        }
        setAnchorEl(null);
    };

    const updatewalletRequestbyId = async (body) => {
        await customerService
            .UpdateCreditDepositWalletByid(body)
            .then((res) => {
                // setCreditBalance(res.data.result[0]);
                // setWalletDetails(res?.data?.result);
                getCreditRequest();
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });
    };

    const columns = [
        {
            field: 'fullName',
            headerName: 'User Name',
            headerAlign: 'left'
        },
        {
            field: 'emailAddress',
            headerName: 'Email',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'phoneNumber',
            headerName: 'PhoneNumber',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'increaseBalanceAmount',
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
                return <MoreVertIcon onClick={(event) => handleClick(event, params)} />;
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
                rows={creditRequest}
                columns={columns}
                loading={false}
                getRowId={(row) => row.id}
                rowsPerPageOptions={[10]}
                totalRowCount={creditRequest?.length}
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

export default CreditRequestTable;
