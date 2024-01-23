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

const NewTier = ({ modal, setModal, setReload, selectedBrand, editItem }) => {
    const customerService = ServiceFactory.get('customer');
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState({
        brandId: selectedBrand?.id,
        name: '',
        nativeName: '',
        bottomLimit: '',
        topLimit: 0,
        punchesForFreeItems: 0
    });

    useEffect(() => {
        if (editItem !== undefined) {
            setData({
                ...data,
                name: editItem.name,
                nativeName: editItem.nativeName,
                bottomLimit: editItem.pointsProgramGroupSettings?.bottomLimit ?? '',
                topLimit: editItem.pointsProgramGroupSettings?.topLimit ?? '',
                punchesForFreeItems: editItem.pointsProgramGroupSettings?.punchesForFreeItems ?? '',
                id: editItem.id
            });
            setIsEditing(true);
        } else {
            setData({
                ...data,
                name: '',
                nativeName: '',
                bottomLimit: '',
                topLimit: '',
                punchesForFreeItems: '',
                id: 0
            });
        }
    }, [editItem]);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [err, setErr] = useState('');

    const createNewTier = async () => {
        let payload = { ...data, brandId: selectedBrand?.id };
        if (isEditing) {
            console.log(JSON.stringify(payload));
            await tiersService
                .updateTier(payload)
                .then((res) => {
                    setData({
                        ...data,
                        name: '',
                        nativeName: '',
                        id: 0,
                        bottomLimit: '',
                        topLimit: '',
                        punchesForFreeItems: ''
                    });
                    setModal(false);
                    setReload((prev) => !prev);
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
        } else {
            await tiersService
                .createNewTier(payload)
                .then((res) => {
                    setData({
                        ...data,
                        name: '',
                        nativeName: '',
                        id: 0,
                        bottomLimit: '',
                        topLimit: '',
                        punchesForFreeItems: ''
                    });
                    setModal(false);
                    setReload((prev) => !prev);
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
        }
    };

    return (
        <Modal open={modal} onClose={() => setModal(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>
                <Grid container spacing={4} mb={2}>
                    <Grid item xs={12}>
                        <Typography required variant="h5">
                            {'Create New Tier'}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid item xs={6}>
                    <Typography variant="h7">Tier Name</Typography>
                    <TextField
                        id="outlined-basic"
                        fullWidth
                        label="Tier Name"
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
                    <Typography variant="h7">Tier Name (Native language)</Typography>
                    <TextField
                        id="outlined-basic"
                        fullWidth
                        label="Tier Name in native language"
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

                <Grid item xs={6}>
                    <Typography variant="h7">Points required </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            direction: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <TextField
                            id="outlined-basic"
                            fullWidth
                            label="From"
                            variant="outlined"
                            value={data.bottomLimit}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    bottomLimit: e.target.value
                                });
                            }}
                            sx={{
                                mt: 2,
                                mr: 2
                            }}
                        />

                        <Typography variant="h7">To </Typography>

                        <TextField
                            id="outlined-basic"
                            fullWidth
                            label="To"
                            variant="outlined"
                            value={data.topLimit}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    topLimit: e.target.value
                                });
                            }}
                            sx={{
                                mt: 2,
                                ml: 2
                            }}
                        />
                    </Box>
                    <TextField
                        id="outlined-basic"
                        fullWidth
                        label="Punches For Free Items"
                        variant="outlined"
                        value={data.punchesForFreeItems}
                        onChange={(e) => {
                            setData({
                                ...data,
                                punchesForFreeItems: e.target.value
                            });
                        }}
                        sx={{
                            mt: 2
                        }}
                    />
                </Grid>

                {/* <Grid item xs={6}>
                    <Box
                        sx={{
                            display: 'flex',
                            direction: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <Typography variant="h7">Notify Users when joining </Typography>
                        <Checkbox defaultChecked />
                    </Box>
                </Grid> */}
                {/* <Grid item xs={6}>
                    <Typography variant="h7">Notification Message </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            direction: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <TextField
                            id="outlined-basic"
                            fullWidth
                            label="Title"
                            variant="outlined"
                            value={data.notificationTitle}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    notificationTitle: e.target.value
                                });
                            }}
                            sx={{
                                mt: 2
                            }}
                        />

                        <TextField
                            id="outlined-basic"
                            fullWidth
                            label="Body"
                            variant="outlined"
                            value={data.notificationMessage}
                            onChange={(e) => {
                                setData({
                                    ...data,
                                    notificationMessage: e.target.value
                                });
                            }}
                            sx={{
                                mt: 2,
                                ml: 2
                            }}
                        />
                    </Box>
                </Grid>

                <Grid item xs={6}>
                    <Typography variant="h7">Notification Message in Native Language</Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            direction: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <TextField
                            id="outlined-basic"
                            fullWidth
                            label="Title"
                            variant="outlined"
                            // value={reward.amount}
                            // onChange={
                            //     (e)=>{
                            //         setReward({
                            //             ...reward,
                            //             amount:e.target.value
                            //         })
                            //     }
                            // }
                            sx={{
                                mt: 2
                            }}
                        />

                        <TextField
                            id="outlined-basic"
                            fullWidth
                            label="Body"
                            variant="outlined"
                            // value={reward.amount}
                            // onChange={
                            //     (e)=>{
                            //         setReward({
                            //             ...reward,
                            //             amount:e.target.value
                            //         })
                            //     }
                            // }
                            sx={{
                                mt: 2,
                                ml: 2
                            }}
                        />
                    </Box>
                </Grid> */}

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

export default NewTier;
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
