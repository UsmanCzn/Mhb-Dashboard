import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chip, IconButton, Menu, MenuItem } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import moment from 'moment/moment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import customerService from 'services/customerService';
import refundService from 'services/refundService'; 
import { useSnackbar } from 'notistack';
import { useAuth } from 'providers/authProvider';

const RefundRequest = () => {
        const [refundRequest, setRefundRequest] = useState([]);
        const [anchorEl, setAnchorEl] = useState(null);
        const [selectedRow, setSelectedRow] = useState(null);
        const { enqueueSnackbar, closeSnackbar } = useSnackbar();
        const { user } = useAuth();

        const open = Boolean(anchorEl);
        useEffect(() => {
            getRefundRequest();
        }, []);

        // GET CREDIT DETAILS
        const getRefundRequest = async () => {
            await refundService
                .getRefundRequests()
                .then((res) => {
                    console.log(res?.data?.result, 'request');
                    setRefundRequest(res.data.result);
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
                "refundId": selectedRow.id,
                "action": true
                };
                acceptRequest(body);
            } else if (data.name == 'Reject') {
               const body = {
                "refundId": selectedRow.id,
                "action": false
                };
                rejectRequest(body);
            }
            setAnchorEl(null);
        };

        const acceptRequest = async (body) => {
            await refundService
                .ApproveRefundRequest(body)
                .then((res) => {
                    enqueueSnackbar('Request Accepted', {
                        variant: 'success'
                    });
                    getRefundRequest();
                })
                .catch((err) => {
                    console.log(err?.response?.data);
                });
        };

        const rejectRequest = async (body) => {
            await refundService
                .ApproveRefundRequest(body)
                .then((res) => {
                    enqueueSnackbar('Request Rejected', {
                        variant: 'error'
                    });
                    getRefundRequest();
                })
                .catch((err) => {
                    console.log(err?.response?.data);
                });
        };

const columns = [
  {
    field: 'customerFullName',
    headerName: 'Customer Name',
    flex: 1.2,
    minWidth: 180,
    headerAlign: 'left',
    align: 'left',
    renderCell: ({ value }) => (
      <span
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={value}
      >
        {value || '--'}
      </span>
    ),
  },
  {
    field: 'customerDisplayEmail',
    headerName: 'Email',
    flex: 1.4,
    minWidth: 220,
    headerAlign: 'left',
    align: 'left',
    renderCell: ({ value }) => (
      <span
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={value}
      >
        {value || '--'}
      </span>
    ),
  },
  {
    field: 'customerDisplayPhone',
    headerName: 'Phone Number',
    flex: 1,
    minWidth: 150,
    headerAlign: 'left',
    align: 'left',
    renderCell: ({ value }) => value || '--',
  },
  {
    field: 'orderNumber',
    headerName: 'Order Number',
    flex: 1,
    minWidth: 150,
    headerAlign: 'left',
    align: 'left',
  },
  {
    field: 'amount',
    headerName: 'Amount',
    flex: 0.9,
    minWidth: 140,
    headerAlign: 'right',
    align: 'right',
    renderCell: ({ value }) =>
      value != null ? `${value} KD` : '--',
  },
  {
    field: 'refundMethod',
    headerName: 'Refund Method',
    flex: 1,
    minWidth: 160,
    headerAlign: 'left',
    align: 'left',
    renderCell: (params) => {
      const refundMethod = params.row?.refundMethod;
      const method =
        refundMethod === 0
          ? 'Bank Transfer'
          : 'Credit Refund';

      return <span>{method}</span>;
    },
  },
  {
    field: 'refundReason',
    headerName: 'Refund Reason',
    flex: 1.4,
    minWidth: 220,
    headerAlign: 'left',
    align: 'left',
    renderCell: ({ value }) => (
      <span
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={value}
      >
        {value || '--'}
      </span>
    ),
  },
  {
    field: 'refunded',
    headerName: 'Refund Status',
    flex: 0.9,
    minWidth: 150,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => {
      const refunded = params.row?.refunded;
      const acted = params.row?.isAct;

      if (!acted) {
        return <Chip label="Pending" color="warning" size="small" />;
      }

      return refunded ? (
        <Chip label="Refunded" color="success" size="small" />
      ) : (
        <Chip label="Rejected" color="error" size="small" />
      );
    },
  },
  {
    field: 'refundDoneTime',
    headerName: 'Action Time',
    flex: 1.1,
    minWidth: 180,
    headerAlign: 'left',
    align: 'left',
    renderCell: (params) => {
      const actionTime = params.row?.refundDoneTime;
      const formattedTime = actionTime
        ? moment(actionTime).format('DD/MM/YYYY')
        : 'No Date Available';

      return (
        <span style={{ whiteSpace: 'nowrap' }}>
          {formattedTime}
        </span>
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
                    rows={refundRequest}
                    columns={columns}
                    loading={false}
                    getRowId={(row) => row.id}
                    pMode="client"
                    rowsPerPageOptions={[10]}
                    totalRowCount={refundRequest?.length}
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
                            <MenuItem disabled={user?.isAccessRevoked} key={index} onClick={() => handleClose(row)} value={row.name}>
                                {row.name}
                            </MenuItem>
                        );
                    })}
                </Menu>
            </>
        );
}

export default RefundRequest