import { Chip, IconButton, Menu, MenuItem } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import moment from 'moment/moment';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchBrandsList } from './hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Tooltip from '@mui/material/Tooltip';
import { useAuth } from 'providers/authProvider';


export default function BrandsTable({ type, setUpdate, setUpdateData, setModalOpen }) {

    const { user, userRole, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const location = useLocation();

    const { brandsList, fetchBrandsList, totalRowCount, loading } = useFetchBrandsList();

    const [anchorEl, setAnchorEl] = useState(null);
    const [brand, setBrand] = useState({});

    const open = Boolean(anchorEl);
    const handleClick = (event, params) => {
        setBrand(params?.row);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (data) => {
        if (!data.modal && data.route) {
            navigate(`${location.pathname}/${branch?.id}/${data.route}`);
        } else if (data?.name == 'Edit Brand') {
            navigate('/addEditBrand/' + brand.id);
            setUpdateData(brand);
            setUpdate(true);
            setModalOpen(true);
        }
        setAnchorEl(null);
    };

const columns = [
  {
    field: 'image',
    headerName: 'Image',
    minWidth: 80,
    flex: 0.6,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    renderCell: ({ row }) => {
      const handleError = (event) => {
        event.target.src =
          'https://syyve.blob.core.windows.net/users-avatar/default-user.png';
      };

      return (
        <img
          src={
            row.logoUrl ||
            'https://syyve.blob.core.windows.net/users-avatar/default-user.png'
          }
          onError={handleError}
          alt="brand logo"
          style={{
            width: 40,
            height: 40,
            borderRadius: 6,
            objectFit: 'cover',
          }}
        />
      );
    },
  },
  {
    field: 'name',
    headerName: 'Brand Name',
    minWidth: 180,
    flex: 1.4,
    headerAlign: 'left',
    align: 'left',
    renderCell: (params) => (
      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {params.value}
      </span>
    ),
  },
  {
    field: 'amountOfBranches',
    headerName: 'Branches',
    minWidth: 120,
    flex: 0.8,
    headerAlign: 'left',
    align: 'left',
  },
  {
    field: 'amountOfGroups',
    headerName: 'Customer Groups',
    minWidth: 160,
    flex: 1,
    headerAlign: 'left',
    align: 'left',
  },
  {
    field: 'amountOfCustomers',
    headerName: 'Customers',
    minWidth: 140,
    flex: 1,
    headerAlign: 'left',
    align: 'left',
  },
  {
    field: 'isHidden',
    headerName: 'Hidden',
    minWidth: 100,
    flex: 0.7,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) =>
      params.row.isHidden ? (
        <Tooltip title="Hidden">
          <CheckCircleIcon color="error" />
        </Tooltip>
      ) : (
        <Tooltip title="Visible">
          <CancelIcon color="success" />
        </Tooltip>
      ),
  },
  {
    field: 'actions',
    headerName: 'Action',
    sortable: false,
    minWidth: 80,
    flex: 0.5,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => (
      <MoreVertIcon
        sx={{ cursor: 'pointer' }}
        onClick={(event) => handleClick(event, params)}
      />
    ),
  },
];


    const options = [
        {
            name: 'Edit Brand',
            modal: true
        },
        // {
        //     name: 'Create Brand User',
        //     modal: true
        // },
        // {
        //     name: 'Show all Brand Users',
        //     modal: false,
        //     route: 'branchRewardProgram'
        // },
        // {
        //     name: 'QR scans',
        //     modal: false,
        //     route: 'branchTimings'
        // },
        // {
        //     name: 'Brand Fees',
        //     modal: true
        // },
        // {
        //     name: 'Brand Taxs',
        //     modal: true
        // },
        // {
        //     name: 'Brand Payments',
        //     modal: true
        // },
        // {
        //     name: 'Brand Topups',
        //     modal: true
        // },
        // {
        //     name: 'Brand Cars Settings',
        //     modal: true
        // },
        // {
        //     name: 'Brand Tutorial',
        //     modal: true
        // },
        // {
        //     name: 'Brand Events',
        //     modal: true
        // }
    ];

    return (
        <>
            <DataGridComponent
                rows={brandsList}
                columns={columns}
                loading={loading}
                getRowId={(row) => row.id}
                rowsPerPageOptions={[10]}
                totalRowCount={brandsList?.length ??0}
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
                        <MenuItem disabled={user?.isAccessRevoked} key={index} onClick={() => handleClose(row)} value={row.name}>
                            {row.name}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
}
