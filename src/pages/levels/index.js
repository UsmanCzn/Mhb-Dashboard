import { Grid, Typography, InputLabel, FormControl, Select, MenuItem, Menu, Box } from '@mui/material';
import { TableControl, CustomersTable } from 'features';
import React, { useEffect, useState } from 'react';
import DataGridComponent from 'components/DataGridComponent';
import { useNavigate, useParams } from 'react-router-dom';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import NewCustomer from 'components/customers/newCustomer';
import TierTable from 'features/Customers/TierTable/tierTable';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import { useFetchLevelData } from 'features/Levels/hooks/useFetchLevelsData';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import tiersService from 'services/tiersService';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import RedButton from 'components/redButton';
import NewLevel from 'features/Levels/NewLevel';
import { useSnackbar } from 'notistack';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function LevelForm() {
    const { type } = useParams();

    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [editing, setIsEditing] = useState(false);

    const { brandsList } = useFetchBrandsList(reload);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [selectedBrand, setselectedBrand] = useState({});
    const [pointCollection, setPointCollection] = useState();
    const [deleteAlert, setDeleteAlert] = React.useState(false);
    const [newModal, setNewModal] = useState(false);
    const hideModal = (value) => {
        setNewModal(value);
    };

    const showAddNew = () => {
        setIsEditing(false);
        setNewModal(true);
    };

    const handleDeletelickOpen = () => {
        setDeleteAlert(true);
    };

    const handleDeletelickClose = () => {
        setDeleteAlert(false);
    };

    const deleteItem = async () => {
        let payload = {
            id: pointCollection.id
        };
        await tiersService
            .deleteLevel(payload)
            .then((res) => {
                console.log(JSON.stringify(res));
                // setModal(false);
                // setReload((prev) => !prev);
            })
            .catch((err) => {
                console.log(err?.response?.data);
                if (err?.response?.data?.error?.validationErrors?.length > 0) {
                    enqueueSnackbar(err?.response?.data?.error?.validationErrors[0]?.message, {
                        variant: 'error'
                    });
                } else {
                    enqueueSnackbar(err?.response?.data?.error?.message, {
                        variant: 'error'
                    });
                }
            });
        setDeleteAlert(false);
    };

    const open = Boolean(anchorEl);
    useEffect(() => {
        if (brandsList[0]?.id) {
            setselectedBrand(brandsList[0]);
        } else {
            console.log('now goes to zero ', 'sb');
        }
    }, [brandsList]);

    const handleClose = (data) => {
        if (data.modal && data?.name === 'Edit') {
            setIsEditing(true);
            setNewModal(true);
        } else if (data?.name == 'Delete') {
            handleDeletelickOpen();
            // deletePointsCollection(pointCollection?.id);
        } else if (data?.name == 'Duplicate') {
            setDuplicateModal(true);
        }

        setAnchorEl(null);
    };

    const handleClick = (event, params) => {
        setPointCollection(params?.row);
        setAnchorEl(event.currentTarget);
    };

    const { response, fetchTiersList, loading, totalRowCount, productTypes, tiersList, regenerateResponse, subtype } = useFetchLevelData(
        selectedBrand,
        reload
    );

    const groupsColumnFormater = (item) => {
        return (
            <Grid container spacing={1} direction="column">
                <Typography component="ul">
                    {item?.itemNames?.map((obj) => {
                        return (
                            <li>
                                <Typography variant="h6">{obj}</Typography>
                            </li>
                        );
                    })}
                </Typography>
            </Grid>
        );
    };
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            headerAlign: 'left'
        },

        {
            field: 'name',
            headerName: 'Customer Group',
            flex: 1.2,
            headerAlign: 'left'
        },
        {
            field: 'itemNames',
            headerName: 'Sub Items Allowed To Redeem',
            flex: 1.4,
            headerAlign: 'left',
            renderCell: (params) => groupsColumnFormater(params.row)
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
            name: 'Edit',
            modal: true
        }
    ];

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={6}>
                        <Typography fontSize={22} fontWeight={700}>
                            Levels
                        </Typography>
                    </Grid>
                    <Grid item xs="auto">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{'Brand'}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedBrand}
                                label={'Brand'}
                                onChange={(event) => {
                                    setselectedBrand(event.target.value);
                                    fetchTiersList(event.target.value);
                                }}
                            >
                                {brandsList.map((row, index) => {
                                    return <MenuItem value={row}>{row?.name}</MenuItem>;
                                })}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid container alignItems="center" justifyContent="space-between" my={2}>
                        <Grid item xs={6}></Grid>
                        <Grid item xs={'auto'}>
                            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }} onClick={showAddNew}>
                                Add New Level
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Box my={2}>
                    <DataGridComponent
                        rows={regenerateResponse}
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
                                <MenuItem onClick={() => handleClose(row)} value={row.name}>
                                    {row.name}
                                </MenuItem>
                            );
                        })}
                    </Menu>
                </Box>
            </Grid>
            {/*  "Delete Alert" */}
            <div>
                <Dialog
                    open={deleteAlert}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleDeletelickOpen}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{'Are You Sure?'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">Are you sure, you want to delete?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeletelickClose} variant="outlined">
                            cancel
                        </Button>
                        <RedButton onClick={deleteItem} variant="primary">
                            Delete
                        </RedButton>
                    </DialogActions>
                </Dialog>
            </div>

            <NewLevel
                modal={newModal}
                setModal={hideModal}
                selectedBrand={selectedBrand}
                setReload={setReload}
                editItem={pointCollection}
                subtype={subtype}
                tiersList={tiersList}
                isEditing={editing}
            />
        </Grid>
    );
}
