import React, { useEffect, useState } from 'react';
import { Grid, Typography, TextField, Button, Alert, Modal, Box, Checkbox } from '@mui/material';

import Counter from 'components/companies/counter';
import DropDown from 'components/dropdown';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ServiceFactory } from 'services/index';
import rewardService from 'services/rewardService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { useSnackbar } from 'notistack';
import tiersService from 'services/tiersService';

const NewCustomer = ({ modal, setModal, setReload, selectedBrand, editItem }) => {
    const customerService = ServiceFactory.get('customer');
    const [isEditing, setIsEditing] = useState(false);

    const [data, setData] = useState({
        brandId: selectedBrand?.id,
        name: '',
        nativeName: '',
        id: 0,
        groupType:1,
    });

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [err, setErr] = useState('');
    useEffect(() => {
        if (editItem !== undefined) {
            setData({
                ...data,
                name: editItem.name,
                nativeName: editItem.nativeName,
                id: editItem.id
            });
            setIsEditing(true);
        } else {
            setData({
                ...data,
                name: '',
                nativeName: ''
            });
            setIsEditing(false);
        }
    }, [editItem]);
    const createNewTier = async () => {
        let payload = { ...data, brandId: selectedBrand?.id };
        if (isEditing) {
            await tiersService
                .updateCustomerGroup(payload)
                .then((res) => {
                    setData({
                        ...data,
                        name: '',
                        nativeName: ''
                    });
                    setModal(false);
                    setReload((prev) => !prev);
                })
                .catch((err) => {
                    console.log(err);
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
        } else {
            await tiersService
                .createNewCustomerGroup(payload)
                .then((res) => {
                    setData({
                        ...data,
                        name: '',
                        nativeName: ''
                    });
                    setModal(false);
                    setReload((prev) => !prev);
                })
                .catch((err) => {
                    console.log(err);
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
        }
    };

    return (
        <Modal open={modal} onClose={() => setModal(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>
                <Grid container spacing={4} mb={2}>
                    <Grid item xs={12}>
                        <Typography required variant="h5">
                            {'Create New Customer Group'}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid item xs={6}>
                    <Typography variant="h7">Group Name</Typography>
                    <TextField
                        id="outlined-basic"
                        fullWidth
                        label="Group Name"
                        variant="outlined"
                        value={data.name}
                        onChange={(e) => {
                            setData({
                                ...data,
                                name: e.target.value
                            });
                        }}
                        sx={{
                            mt: 2
                        }}
                    />
                </Grid>

                <Grid item xs={6}>
                    <Typography variant="h7">Group Name (Native language)</Typography>
                    <TextField
                        id="outlined-basic"
                        fullWidth
                        label="Group Name (native language)"
                        variant="outlined"
                        value={data.nativeName}
                        onChange={(e) => {
                            setData({
                                ...data,
                                nativeName: e.target.value
                            });
                        }}
                        sx={{
                            mt: 2
                        }}
                    />
                </Grid>

                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={8} />
                            <Grid container spacing={2} justifyContent="flex-end">
                                <Grid item>
                                    <Button variant="outlined" onClick={() => setModal(false)}>
                                        Cancel
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button primay variant="contained" onClick={createNewTier}>
                                        Save
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default NewCustomer;
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    overflow: 'scroll'
};
