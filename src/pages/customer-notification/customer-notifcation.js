import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Typography, Button, Box, FormControl, InputLabel, Menu, MenuItem, Select, Avatar, Tooltip } from '@mui/material';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import DataGridComponent from 'components/DataGridComponent';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useLocation, useNavigate } from 'react-router-dom';
const CustomerNotification = () => {
    const [selectedBrand, setselectedBrand] = useState({});
    const [reload, setReload] = useState(false);
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([
        {
            title: 'tile',
            image: 'https://syyve.blob.core.windows.net/users-avatar/default-user.png',
            text: 'text here text here',
            groups: [{ name: 'Group 1' }, { name: 'Group 2' }],
            date: 'sads',
            id: 1
        }
    ]);
    const [anchorEl, setAnchorEl] = useState(null);
    const { brandsList } = useFetchBrandsList(reload);
    const open = Boolean(anchorEl);
    const fetchNotifications = async () => {};
    const handleClick = (event, params) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (data) => {
        if (!data.modal && data.route) {
            navigate(`/createNotification`);
        } else if (data?.name == 'Edit Brand') {
            setUpdateData(brand);
            setUpdate(true);
            setModalOpen(true);
        }
        setAnchorEl(null);
    };
    useEffect(() => {
        if (brandsList[0]?.id) {
            setselectedBrand(brandsList[0]);
        }
    }, [brandsList]);

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
            field: 'title',
            headerName: 'Title',
            headerAlign: 'left'
        },
        {
            field: 'text',
            headerName: 'Text',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'groups',
            headerName: 'Group of Customers',
            flex: 1,
            headerAlign: 'left'
        },
        {
            field: 'date',
            headerName: 'Date & Time',
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
            name: 'Edit Brand',
            modal: true
        }
    ];
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={'auto'}>
                        <Typography fontSize={22} fontWeight={700}>
                            Notifications
                        </Typography>
                    </Grid>
                    <Box alignItems="center" sx={{ display: 'flex', gap: '10px' }}>
                        <Grid item xs={'auto'}>
                            <Button
                                size="small"
                                onClick={() => {
                                    navigate(`/createNotification`);
                                }}
                                variant="contained"
                                sx={{ textTransform: 'capitalize' }}
                            >
                                Add New Notification
                            </Button>
                        </Grid>
                        <Grid item xs={6} justifyContent="flex-end">
                            <FormControl>
                                <InputLabel id="demo-simple-select-label">{'Brand'}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedBrand}
                                    label={'Brand'}
                                    onChange={(event) => {
                                        setselectedBrand(event.target.value);
                                    }}
                                >
                                    {brandsList.map((row, index) => {
                                        return (
                                            <MenuItem key={index} value={row}>
                                                {row?.name}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <DataGridComponent
                    rows={brandsList}
                    columns={columns}
                    loading={false}
                    getRowId={(row) => row.id}
                    rowsPerPageOptions={[10]}
                    totalRowCount={brandsList?.length ?? 0}
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
            </Grid>
        </Grid>
    );
};

export default CustomerNotification;
