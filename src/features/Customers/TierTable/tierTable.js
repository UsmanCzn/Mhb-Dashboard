import { Chip, Grid, Typography, Menu, MenuItem, Button, Card, Box } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchRewardList } from '../hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useFetchBranchList } from 'features/BranchesTable/hooks/useFetchBranchesList';
import moment from 'moment-jalaali';
import rewardService from 'services/rewardService';
import NewTier from '../newTier/newTier';
import { useTiers } from '../hooks/useTiers';
import { FaPencilAlt } from 'react-icons/fa';

import LinearProgress from '@mui/material/LinearProgress';

export default function TierTable({ selectedBrand, reload, customerGroups, setReload, newModal, setNewModal, setPointCollectionRef,pointCollectionRef }) {
    const navigate = useNavigate();
    const location = useLocation();

    const { tiersList, fetchTiersList, totalRowCount, loading } = useTiers(reload, selectedBrand);

    const [modal, setModal] = useState(false);

    // const [newModal, setNewModal] = useState(false);
    const upperMarin = 0.5;
    const [myLoading, setloading] = useState(true);

    // const groupsColumnFormater = (item) => {
    //     return (
    //         <Grid container spacing={1}>
    //             <Grid item xs="auto">
    //                 <Typography variant="h6" px={2} mr={1} border={0.6} borderRadius={1}>
    //                     {customerGroups?.find((obj) => obj?.id == item?.brandGroupId)?.name}
    //                 </Typography>
    //             </Grid>
    //         </Grid>
    //     );
    // };

    // const rewardsColumnFormater = (item) => {
    //     return (
    //         <Grid container spacing={1}>
    //             <Grid item xs="auto">
    //                 {item?.rewardProgramGifts?.map((obj, index) => {
    //                     return (
    //                         <Typography key={index} variant="h6" px={2} mr={1} border={0.6} borderRadius={1}>
    //                             {obj?.name + ' - ' + obj?.amount}
    //                         </Typography>
    //                     );
    //                 })}
    //             </Grid>
    //         </Grid>
    //     );
    // };
    // const dateColumnFormater = (item) => {
    //     return (
    //         <Typography variant="h6">
    //             {moment(item?.startDate).format('DD/MM/YYYY') + ' - ' + moment(item?.endDate)?.format('DD/MM/YYYY')}
    //         </Typography>
    //     );
    // };

    const deletePointsCollection = async (id) => {
        await rewardService
            .DeleteDiscountProgram(id)
            .then((res) => {
                setReload((prev) => !prev);
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });
    };
    const [anchorEl, setAnchorEl] = useState(null);
    const [pointCollection, setPointCollection] = useState();

    const open = Boolean(anchorEl);
    const handleClick = (event, params) => {
        setPointCollection(params?.row);

        setPointCollectionRef(false);
        setAnchorEl(event.currentTarget);
    };
    const setSelectedItem = (item) => {
        setPointCollection(item);
        setNewModal(true);
    };

    const handleClose = (data) => {
        if (data.modal && data?.name == 'Edit') {
            setNewModal(true);
        } else if (data?.name == 'Delete') {
            deletePointsCollection(pointCollection?.id);
        } else if (data?.name == 'Duplicate') {
            setDuplicateModal(true);
        }

        setAnchorEl(null);
    };

    const [imageError, setImageError] = useState(false);
    useEffect(() => {
        setloading(loading);
    }, [loading]);
    useEffect(() => {

        if (pointCollectionRef) {
            setPointCollection();
        }
    }, [pointCollectionRef]);
    const showLoader = () => {
        if (myLoading) {
            return (
                <Box sx={{ width: '100%' }} my={1}>
                    <LinearProgress />
                </Box>
            );
        } else {
            <></>;
        }
    };
    const handleImageError = () => {
        setImageError(true);
    };

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            headerAlign: 'left'
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 0.7,
            headerAlign: 'left'
        },
        {
            field: 'brandName',
            headerName: 'Brand',
            flex: 1,
            headerAlign: 'left'
        },
        // {
        //     field: 'numberOfCustomers',
        //     headerName: 'Number of Customers',
        //     flex: 1.2,
        //     headerAlign: 'left'
        // },
        // {
        //     field: 'sendNotification',
        //     headerName: 'Send Notification',
        //     flex: 1,
        //     headerAlign: 'left'
        // },

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
            name: 'Edit',
            modal: true
        }
    ];

    return (
        <>
            {/* {myLoading ? showLoader() : <></>} */}
            {/* <Grid container mb={2} justifyContent="flex-end">
                <Grid item xs={'auto'}>
                    <Button
                        size="small"
                        variant="contained"
                        sx={{ textTransform: 'capitalize' }}
                        onClick={() => {
                            setPointCollection();
                            setNewModal(true);
                        }}
                    >
                        Add New Tier
                    </Button>
                </Grid>
            </Grid> */}

            <DataGridComponent
                rows={tiersList}
                columns={columns}
                loading={loading}
                getRowId={(row) => row.id}
                rowsPerPageOptions={[10]}
                totalRowCount={totalRowCount}
                fetchCallback={fetchTiersList}
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

            {/* <Grid container spacing={2}>
                {myLoading ? showLoader() : <></>}
                {tiersList.map((item, index) => (
                    <Grid item key={index} xs={6} sm={6} md={4} lg={3}>
                        <Card>
                            {imageError ? (
                                <img
                                    src={item.logo}
                                    alt="user avatar"
                                    onError={handleImageError}
                                    style={{ objectFit: 'cover', height: '200px', width: '100%' }}
                                />
                            ) : (
                                <img
                                    src={selectedBrand?.logoUrl}
                                    style={{ objectFit: 'cover', height: '150px', width: '100%' }}
                                    alt="user avatara"
                                />
                            )}
                            <Box p={1}>
                                <Box
                                    sx={{
                                        width: '100%',
                                        mt: 1
                                    }}
                                    justifyContent="space-between"
                                    display="flex"
                                >
                                    <Grid container>
                                        <Grid item xs={11}>
                                            <Box>
                                                <Typography variant="h7" style={{ fontSize: '12px' }}>
                                                    {'Name'}
                                                    <Typography variant="h5" style={{ fontSize: '14px' }}>
                                                        {item?.name}
                                                    </Typography>
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Box my={upperMarin}>
                                                <FaPencilAlt onClick={() => setSelectedItem(item)} />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box my={upperMarin}>
                                    <Typography variant="h7" style={{ fontSize: '12px' }}>
                                        {'Brand'}
                                        <Typography variant="h5" style={{ fontSize: '14px' }}>
                                            {selectedBrand.name}
                                        </Typography>
                                    </Typography>
                                </Box>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Box>
                                            <Typography variant="h7" style={{ fontSize: '12px' }}>
                                                {'No of Customer'}
                                                <Typography variant="h5" style={{ fontSize: '14px' }}>
                                                    {selectedBrand.amountOfCustomers}
                                                </Typography>
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box my={upperMarin}>
                                            <Typography variant="h7" style={{ fontSize: '12px' }}>
                                                {'Send Notification'}
                                                <Typography variant="h5" style={{ fontSize: '14px' }}>
                                                    {item.sendNotification ? 'true' : 'false'}
                                                </Typography>
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid> */}

            <NewTier modal={newModal} setModal={setNewModal} brand={selectedBrand} editItem={pointCollection} setReload={setReload} />
        </>
    );

    function LongMenu() {
        const [anchorEl, setAnchorEl] = (React.useState < null) | (HTMLElement > null);
        const open = Boolean(anchorEl);

        const handleClose = () => {
            setAnchorEl(null);
        };

        return (
            <div>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button'
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch'
                        }
                    }}
                >
                    {options.map((option, index) => (
                        <MenuItem key={index} selected={option === 'Pyxis'} onClick={handleClose}>
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        );
    }
}
