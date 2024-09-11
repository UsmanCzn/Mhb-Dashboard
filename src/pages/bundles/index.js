import { Grid, Typography, InputLabel, FormControl, Select, MenuItem, Menu, Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DataGridComponent from 'components/DataGridComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import { useFetchLevelData } from 'features/Levels/hooks/useFetchLevelsData';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import tiersService from 'services/tiersService';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import RedButton from 'components/redButton';
import NewBundle from 'features/bundles/NewBundle';
import { useSnackbar } from 'notistack';
import { useFetchBundlesData } from 'features/bundles/hooks/useFetchBundlesData';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function BundlesForm() {
    const { type } = useParams();
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [editing, setIsEditing] = useState(false);

    const { brandsList } = useFetchBrandsList(reload);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [selectedBrand, setSelectedBrand] = useState({});
    const [bundleItem, setBundleItem] = useState();
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
            id: bundleItem?.id
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
            setSelectedBrand(brandsList[0]);
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
        setBundleItem(params?.row);
        setAnchorEl(event.currentTarget);
    };

    const { bundlesList, fetchBundlesList, loading, totalRowCount, } = useFetchBundlesData(
        selectedBrand,
        reload
    );

    const groupsColumnFormater = (item) => {
        return (
            <Grid container spacing={1} direction="column">
                <Typography component="ul">
                    {item?.itemNames?.map((obj, index) => {
                        return (
                            <li key={index}>
                                <Typography variant="h6">{obj}</Typography>
                            </li>
                        );
                    })}
                </Typography>
            </Grid>
        );
    };
    const activeColumnFormater = (item) => {
        return (
            <img
                alt="img"
                src={item?.bundleImageUrl}
                style={{
                    width: 40,
                    height: 40
                }}
            />
        );
    };
    const columns = [
        {
            field: 'id',
            headerName: 'Image',
            headerAlign: 'left',
            renderCell: (params) => activeColumnFormater(params.row)
        },

        {
            field: 'bundleName',
            headerName: 'Bundle Name',
            flex: 1.2,
            headerAlign: 'left'
        },
        {
            field: 'price',
            headerName: 'Price',
            flex: 1.4,
            headerAlign: 'left', 
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            flex: 1,
            headerAlign: 'left', 
        },
        {
            field: 'discountUpTo',
            headerName: 'Discount',
            flex: 1,
            headerAlign: 'left', 

            renderCell: (params) => <Typography variant="h7">{params?.row?.discountUpTo} %</Typography>
        },
        {
            field: 'validityDays',
            headerName: 'Validity',
            flex: 1,
            headerAlign: 'left', 
        },
        
        {
            field: 'isRewardMfissisng',
            headerName: 'Actions',
            sortable: false,
            flex: 0,
            headerAlign: 'left',

            renderCell: (params) => {
                return <MoreVertIcon onClick={(event) => handleClick(event, params)} />;
            }
        },
    ];

    const options = [
        {
            name: 'Edit',
            modal: true
        },
        {
            name: 'Delete',
            modal: false
        }
    ]; 
 
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={6}>
                        <Typography fontSize={22} fontWeight={700}>
                            Bundles
                        </Typography>
                    </Grid>
                    <Grid item xs="auto">
    <Grid container direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Grid item>
            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }} onClick={showAddNew}>
                Add New Bundle
            </Button>
        </Grid>

        <Grid item xs={12} sm="auto">
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{'Brand'}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedBrand}
                    label={'Brand'}
                    onChange={(event) => {
                        setSelectedBrand(event.target.value);
                        fetchTiersList(event.target.value);
                    }}
                >
                    {brandsList.map((row, index) => (
                        <MenuItem key={index} value={row}>
                            {row?.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    </Grid>
</Grid>


                    <Grid container alignItems="center" justifyContent="space-between" my={2}>
                        <Grid item xs={6}></Grid>
                        <Grid item xs={'auto'}>
                            {/* <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }} onClick={showAddNew}>
                                Add New Level
                            </Button> */}
                        </Grid>
                    </Grid>
                </Grid>

                <Box my={2}>
                    <DataGridComponent
                        rows={bundlesList}
                        columns={columns}
                        loading={loading}
                        getRowId={(row) => row.id}
                        rowsPerPageOptions={[10]}
                        totalRowCount={totalRowCount}
                        fetchCallback={fetchBundlesList}
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

            <NewBundle
                modal={newModal}
                setModal={hideModal}
                selectedBrand={selectedBrand}
                setReload={setReload}
                editItem={bundleItem}  
                isEditing={editing}
            />
        </Grid>
    );
}
