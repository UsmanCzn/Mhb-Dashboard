import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chip, IconButton, Menu, MenuItem } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import moment from 'moment/moment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import customerService from 'services/customerService';
import { useSnackbar } from 'notistack';
import { useAuth } from 'providers/authProvider';

const PointsRequestTable = () => {

    const [pointsRequest, setPointsRequest] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { user } = useAuth();
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
            .getUsedPointsRequest(user.roleId===2)
            .then((res) => {
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
    flex: 1.2,
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
    field: 'email',
    headerName: 'Email',
    flex: 1.4,
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
    field: 'brandName',
    headerName: 'Brand Name',
    flex: 1.2,
    minWidth: 180,
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
    field: 'phone',
    headerName: 'Phone Number',
    flex: 1,
    minWidth: 150,
    headerAlign: 'left',
    align: 'left',
    renderCell: ({ value }) => value || '--',
  },
  {
    field: 'actionTime',
    headerName: 'Action Time',
    flex: 1.1,
    minWidth: 180,
    headerAlign: 'left',
    align: 'left',
    renderCell: (params) => {
      const actionTime = params.row?.actionTime;
      const actionType = params.row?.type;
      const formattedTime = actionTime
        ? moment(actionTime).format('DD/MM/YYYY')
        : 'No Date Available';

      return (
        <span style={{ whiteSpace: 'nowrap' }}>
          {formattedTime} {actionType ? `(${actionType})` : ''}
        </span>
      );
    },
  },
  {
    field: 'redeemablePoints',
    headerName: 'Amount Request',
    flex: 0.9,
    minWidth: 150,
    headerAlign: 'right',
    align: 'right',
    renderCell: ({ value }) => value ?? '--',
  },
  {
    field: 'walletComments',
    headerName: 'Comments',
    flex: 1.4,
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
    field: 'isAccepted',
    headerName: 'Approval Status',
    flex: 0.9,
    minWidth: 150,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => {
      const acted = params.row?.isAct;
      const accepted = params.row?.isAccepted;

      if (!acted) {
        return <Chip label="Pending" color="warning" size="small" />;
      }

      return accepted ? (
        <Chip label="Accepted" color="success" size="small" />
      ) : (
        <Chip label="Rejected" color="error" size="small" />
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
                rows={pointsRequest}
                columns={columns}
                loading={false}
                getRowId={(row) => row.id}
                rowsPerPageOptions={[10]}
                pMode="client"
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
                        <MenuItem disabled={user?.isAccessRevoked} key={index} onClick={() => handleClose(row)} value={row.name}>
                            {row.name}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
};

export default PointsRequestTable;
