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


export default function BrandsTable({ type, setUpdate, setUpdateData, setModalOpen }) {
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
            headerAlign: 'left',
            renderCell: ({ row }) => {
                const handleError = (event) => {
                    event.target.src = 'https://syyve.blob.core.windows.net/users-avatar/default-user.png'; // Provide a fallback image
                };

                return (
                    <img
                        style={{
                            width: 40,
                            height: 40
                        }}
                        onError={handleError}
                        src={row.logoUrl || 'https://syyve.blob.core.windows.net/users-avatar/default-user.png'}
                        alt="brand logo"
                    />
                );
            }
        },
        {
            field: 'name',
            headerName: 'Brand Name',
            headerAlign: 'left'
        },
        {
            field: 'amountOfBranches',
            headerName: 'Branches',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'amountOfGroups',
            headerName: 'Group of Customers',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'amountOfCustomers',
            headerName: 'Customers',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'isHidden',
            headerName: 'Hidden',
            flex: 1,
            headerAlign: 'left',
            renderCell: (params) => {
                return params.row.isHidden ? (
                    <Tooltip title="Hidden">
                        {' '}
                        <CheckCircleIcon />{' '}
                    </Tooltip>
                ) : (
                    <Tooltip title="Not Hidden">
                        <CancelIcon />
                    </Tooltip>
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
                        <MenuItem key={index} onClick={() => handleClose(row)} value={row.name}>
                            {row.name}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
}
