import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Chip, IconButton, Menu, MenuItem } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import customerService from 'services/customerService';
import moment from 'moment-jalaali';

const CreditRequestTable = ({user}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [creditRequest, setCreditRequest] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [reload, setreload] = useState(false);
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
                setreload(false);
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });
    };

    const handleClick = (event, params) => {
        setSelectedRow(params.row);

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
        } else if (data.name === 'Reject') {
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
        setreload(true);
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

    const getStatus = (param) => {
        if (param.isAct && param.isAccepted) {
            return 'Accepted';
        } else if (param.isAct && !param.isAccepted) {
            return 'Rejected';
        } else {
            return 'Pending';
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
    field: 'emailAddress',
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
    field: 'phoneNumber',
    headerName: 'Phone Number',
    flex: 1,
    minWidth: 150,
    headerAlign: 'left',
    align: 'left',
    renderCell: ({ value }) => value || '--',
  },
  {
    field: 'creationTime',
    headerName: 'Created Date',
    flex: 1,
    minWidth: 160,
    headerAlign: 'left',
    align: 'left',
    renderCell: (params) =>
      params.row?.creationTime
        ? moment(params.row.creationTime).format('DD/MM/YYYY')
        : '--',
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
    field: 'increaseBalanceAmount',
    headerName: 'Amount Request',
    flex: 0.9,
    minWidth: 150,
    headerAlign: 'right',
    align: 'right',
    renderCell: ({ value }) => (value != null ? `${value} KD` : '--'),
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
                rows={creditRequest}
                columns={columns}
                loading={reload}
                getRowId={(row) => row.id}
                pMode="client"
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
                        <MenuItem disabled={user?.isAccessRevoked} onClick={() => handleClose(row)} value={row.name}>
                            {row.name}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
};

export default CreditRequestTable;
