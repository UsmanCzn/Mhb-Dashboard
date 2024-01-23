import { Chip, Grid, Typography, Menu, MenuItem } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchCustomerList } from './hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useFetchAppsList } from './hooks/useFetchAppsList';
import moment from 'moment';

export default function AppsTable({ reload, setUpdate, setUpdateData, setModalOpen }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { appsList, fetchAppsList, totalRowCount, loading } = useFetchAppsList(reload);

    const activeColumnFormater = (item) => {
        return (
            <img
                alt="img"
                src={item?.logoUrl}
                style={{
                    width: 40,
                    height: 40
                }}
            />
        );
    };
    const nameColumnFormater = (item) => {
        return <Typography variant="h6">{item?.name + ' '}</Typography>;
    };
    const dateFormater = (item) => {
        return <Typography variant="h6">{moment(item?.endSubscriptionDate.toString()).format('DD-MMM-YYYY')}</Typography>;
    };
    const groupsColumnFormater = (item) => {
        return (
            <Grid container spacing={1}>
                {item?.customerGroups?.map((obj) => {
                    return (
                        <Grid item xs="auto">
                            {' '}
                            <Typography variant="h6" px={2} mr={1} border={0.6} borderRadius={1}>
                                {obj}
                            </Typography>
                        </Grid>
                    );
                })}
            </Grid>
        );
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const [customer, setCustomer] = useState({});

    const open = Boolean(anchorEl);
    const handleClick = (event, params) => {
        setCustomer(params?.row);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (data) => {
        if (data?.name == 'Edit App') {
            const dateObj = new Date(customer.endSubscriptionDate);

            // Extract day, month, and year from the Date object
            const day = dateObj.getDate().toString().padStart(2, '0');
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Note: January is 0, so we add 1
            const year = dateObj.getFullYear();

            // Create the formatted date string in "dd/mm/yyyy" format
            const formattedDate = `${month}/${day}/${year}`;
            const updatedObject = {
                ...customer,
                formattedEndSubscriptionDate: formattedDate
            };
            setUpdateData(updatedObject);
            setUpdate(true);
            setModalOpen(true);
        }
        setAnchorEl(null);
    };

    const columns = [
        {
            field: 'logo',
            headerName: 'Logo',
            headerAlign: 'left',
            renderCell: (params) => activeColumnFormater(params.row)
        },
        {
            field: 'name',
            headerName: 'Company Name',
            flex: 1,
            headerAlign: 'left',
            renderCell: (params) => nameColumnFormater(params.row)
        },
        {
            field: 'category',
            headerName: 'Category',
            flex: 1,
            headerAlign: 'left',
            renderCell: (params) => {
                // console.log(params?.row);
            }
        },

        {
            field: 'endSubscriptionDate',
            headerName: 'End Subscription date',
            flex: 1,
            headerAlign: 'left',
            renderCell: (params) => dateFormater(params.row)
        },
        {
            field: 'isRewardMfissisng',
            headerName: 'Action',
            sortable: false,
            flex: 1,
            headerAlign: 'left',

            renderCell: (params) => {
                return <MoreVertIcon onClick={(event) => handleClick(event, params)} />;
            }
        }
    ];

    const options = [
        {
            name: 'Edit App',
            modal: true
        }
    ];

    return (
        <>
            <DataGridComponent
                rows={appsList}
                columns={columns}
                loading={loading}
                getRowId={(row) => row.id}
                rowsPerPageOptions={[10]}
                totalRowCount={totalRowCount}
                fetchCallback={fetchAppsList}
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
