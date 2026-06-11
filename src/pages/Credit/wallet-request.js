import React, { useState, useEffect } from 'react';
import { Chip, Menu, MenuItem } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import moment from 'moment/moment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import customerService from 'services/customerService';
import { useSnackbar } from 'notistack';
import { useAuth } from 'providers/authProvider';

const WalletRequest = () => {
    const [walletRequest, setWalletRequest] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuth();

    const open = Boolean(anchorEl);
    const walletBrandId = 32;

    useEffect(() => {
        getWalletRequest();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getWalletRequest = async () => {
        setLoading(true);
        try {
            const res = await customerService.getAllWalletIncreaseRequestByBrandId(walletBrandId);
            setWalletRequest(res?.data?.result || []);
        } catch (err) {
            console.log(err?.response?.data);
            enqueueSnackbar('Failed to load wallet requests', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (event, params) => {
        setSelectedRow(params.row);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (data) => {
        if (data?.name === 'Accept') {
            updateWalletRequest(selectedRow?.id, true);
        } else if (data?.name === 'Reject') {
            updateWalletRequest(selectedRow?.id, false);
        }

        setAnchorEl(null);
    };

    const updateWalletRequest = async (id, isAccept) => {
        if (!id && id !== 0) return;
        setLoading(true);
        try {
            await customerService.acceptRejectDepositWalletById(id, isAccept);
            enqueueSnackbar(isAccept ? 'Request Accepted' : 'Request Rejected', {
                variant: isAccept ? 'success' : 'error'
            });
            getWalletRequest();
        } catch (err) {
            console.log(err?.response?.data);
            enqueueSnackbar('Failed to update wallet request', { variant: 'error' });
            setLoading(false);
        }
    };

    const columns = [
        {
            field: 'fullName',
            headerName: 'User Name',
            flex: 1.2,
            minWidth: 180,
            headerAlign: 'left',
            align: 'left',
            renderCell: ({ value }) => value || '--'
        },
        {
            field: 'emailAddress',
            headerName: 'Email',
            flex: 1.4,
            minWidth: 220,
            headerAlign: 'left',
            align: 'left',
            renderCell: ({ value }) => value || '--'
        },
        {
            field: 'brandName',
            headerName: 'Brand Name',
            flex: 1.1,
            minWidth: 170,
            headerAlign: 'left',
            align: 'left',
            renderCell: ({ value }) => value || '--'
        },
        {
            field: 'phoneNumber',
            headerName: 'Phone Number',
            flex: 1,
            minWidth: 150,
            headerAlign: 'left',
            align: 'left',
            renderCell: ({ value }) => value || '--'
        },
        {
            field: 'creationTime',
            headerName: 'Created Date',
            flex: 1,
            minWidth: 160,
            headerAlign: 'left',
            align: 'left',
            renderCell: (params) => (params.row?.creationTime ? moment(params.row.creationTime).format('DD/MM/YYYY') : '--')
        },
        {
            field: 'increaseBalanceAmount',
            headerName: 'Amount Request',
            flex: 0.9,
            minWidth: 150,
            headerAlign: 'right',
            align: 'right',
            renderCell: ({ value }) => (value != null ? value : '--')
        },
        {
            field: 'walletComments',
            headerName: 'Comments',
            flex: 1.4,
            minWidth: 220,
            headerAlign: 'left',
            align: 'left',
            renderCell: ({ value }) => value || '--'
        },
        {
            field: 'isAccepted',
            headerName: 'Approval Status',
            flex: 0.9,
            minWidth: 150,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                const acted = params.row?.isAct;
                const accepted = params.row?.isAccepted;

                if (!acted) return <Chip label="Pending" color="warning" size="small" />;
                return accepted ? (
                    <Chip label="Accepted" color="success" size="small" />
                ) : (
                    <Chip label="Rejected" color="error" size="small" />
                );
            }
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
                )
        }
    ];

    const options = [
        { name: 'Accept', modal: false },
        { name: 'Reject', modal: false }
    ];

    return (
        <>
            <DataGridComponent
                rows={walletRequest}
                columns={columns}
                loading={loading}
                getRowId={(row) => row.id}
                pMode="client"
                rowsPerPageOptions={[10]}
                totalRowCount={walletRequest?.length}
            />

            <Menu
                id="wallet-request-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{
                    'aria-labelledby': 'wallet-request-menu-button'
                }}
            >
                {options.map((row, index) => (
                    <MenuItem disabled={user?.isAccessRevoked} key={index} onClick={() => handleClose(row)} value={row.name}>
                        {row.name}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default WalletRequest;
