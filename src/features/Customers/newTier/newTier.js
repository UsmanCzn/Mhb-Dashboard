import React, { useEffect, useState } from 'react';
import { Grid, Typography, TextField, Button, Modal, Box } from '@mui/material';

import Counter from 'components/companies/counter';
import DropDown from 'components/dropdown';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ServiceFactory } from 'services/index';
import rewardService from 'services/rewardService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';

import { useSnackbar } from 'notistack';
import tiersService from 'services/tiersService';

const NewTier = ({ modal, setModal, brand, editItem, setReload }) => {
    const customerService = ServiceFactory.get('customer');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedBrand, setselectedBrand] = useState(brand);
    const [data, setData] = useState({
        brandId: selectedBrand?.id ?? 0,
        name: '',
        nativeName: '',
        benefits: '',
        benefitsNative: '',
        bottomLimit: '',
        topLimit: 0,
        punchesForFreeItems: 0
    });

    const { brandsList } = useFetchBrandsList(true);

    useEffect(() => {
        if (editItem !== undefined) {
            const localBrand = brandsList.find((b) => b.id === editItem.brandId);
            setselectedBrand(localBrand);
            setData((prev) => ({
                ...prev,
                name: editItem.name ?? '',
                nativeName: editItem.nativeName ?? '',
                benefits: editItem.benefits ?? '',
                benefitsNative: editItem.benefitsNative ?? '',
                bottomLimit: editItem.pointsProgramGroupSettings?.bottomLimit ?? '',
                topLimit: editItem.pointsProgramGroupSettings?.topLimit ?? '',
                punchesForFreeItems: editItem.pointsProgramGroupSettings?.punchesForFreeItems ?? '',
                id: editItem.id
            }));
            setIsEditing(true);
        } else {
            setselectedBrand(brand);
            setData((prev) => ({
                ...prev,
                name: '',
                nativeName: '',
                benefits: '',
                benefitsNative: '',
                bottomLimit: '',
                topLimit: '',
                punchesForFreeItems: '',
                id: 0
            }));
            setIsEditing(false);
        }
    }, [editItem, brand, brandsList]);

    const { enqueueSnackbar } = useSnackbar();
    const [err, setErr] = useState('');

    const createNewTier = async () => {
        const payload = {
            ...data,
            brandId: selectedBrand?.id
        };

        if (isEditing) {
            try {
                await tiersService.updateTier(payload);
                setData((prev) => ({
                    ...prev,
                    name: '',
                    nativeName: '',
                    benefits: '',
                    benefitsNative: '',
                    id: 0,
                    bottomLimit: '',
                    topLimit: '',
                    punchesForFreeItems: ''
                }));
                setModal(false);
                setReload((prev) => !prev);
            } catch (err) {
                if (err?.response?.data?.error?.validationErrors?.length > 0) {
                    enqueueSnackbar(err.response.data.error.validationErrors[0].message, { variant: 'error' });
                } else if (err?.response?.data?.error?.message) {
                    enqueueSnackbar(err.response.data.error.message, { variant: 'error' });
                }
            }
        } else {
            try {
                await tiersService.createNewTier(payload);
                setData((prev) => ({
                    ...prev,
                    name: '',
                    nativeName: '',
                    benefits: '',
                    benefitsNative: '',
                    bottomLimit: '',
                    topLimit: '',
                    punchesForFreeItems: ''
                }));
                setModal(false);
                setReload((prev) => !prev);
            } catch (err) {
                if (err?.response?.data?.error?.validationErrors?.length > 0) {
                    enqueueSnackbar(err.response.data.error.validationErrors[0].message, { variant: 'error' });
                } else if (err?.response?.data?.error?.message) {
                    enqueueSnackbar(err.response.data.error.message, { variant: 'error' });
                }
            }
        }
    };

    const fixedTextareaSx = {
  mt: 2,
  // Keep the label/input aligned nicely at the top
  '& .MuiInputBase-root': { alignItems: 'flex-start' },
  // Target the multiline textarea
  '& textarea': {
    height: 140,        // fixed height (px)
    overflow: 'auto',   // scroll when content exceeds height
    resize: 'none',     // prevent manual resize (optional)
  },
};


    return (
        <Modal open={modal} onClose={() => setModal(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>
                <Grid container spacing={4} mb={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5">Create New Tier</Typography>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography>Tier Name</Typography>
                        <TextField
                            fullWidth
                            label="Tier Name"
                            variant="outlined"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            sx={{ mt: 2 }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography>Tier Name (Native language)</Typography>
                        <TextField
                            fullWidth
                            label="Tier Name in native language"
                            variant="outlined"
                            value={data.nativeName}
                            onChange={(e) => setData({ ...data, nativeName: e.target.value })}
                            sx={{ mt: 2 }}
                        />
                    </Grid>

                    {/* NEW: Benefits */}
                    <Grid item xs={12} md={6}>
                        <Typography>Benefits</Typography>
                        <TextField
                            fullWidth
                            label="Benefits"
                            variant="outlined"
                            value={data.benefits}
                            onChange={(e) => setData({ ...data, benefits: e.target.value })}
                            multiline
                            minRows={3}
                            maxRows={6}
                            sx={{ mt: 2 }}
                        />
                    </Grid>

                    {/* NEW: Benefits (Native) */}
                    <Grid item xs={12} md={6}>
                        <Typography>Benefits (Native language)</Typography>
                        <TextField
                            fullWidth
                            label="Benefits in native language"
                            variant="outlined"
                            value={data.benefitsNative}
                            onChange={(e) => setData({ ...data, benefitsNative: e.target.value })}
                            multiline
                            minRows={3}
                            maxRows={6}
                            sx={{ mt: 2 }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography>Points required</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                fullWidth
                                label="From"
                                variant="outlined"
                                value={data.bottomLimit}
                                onChange={(e) => setData({ ...data, bottomLimit: +e.target.value })}
                                sx={{ mt: 2, mr: 2 }}
                            />
                            <Typography>To</Typography>
                            <TextField
                                fullWidth
                                label="To"
                                variant="outlined"
                                value={data.topLimit}
                                onChange={(e) => setData({ ...data, topLimit: +e.target.value })}
                                sx={{ mt: 2, ml: 2 }}
                            />
                        </Box>

                        <TextField
                            fullWidth
                            label="Punches For Free Items"
                            variant="outlined"
                            value={data.punchesForFreeItems}
                            onChange={(e) => setData({ ...data, punchesForFreeItems: e.target.value })}
                            sx={{ mt: 2 }}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={4} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                        <Grid container justifyContent="flex-end" spacing={2}>
                            <Grid item>
                                <Button variant="outlined" onClick={() => setModal(false)}>
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" onClick={createNewTier}>
                                    Save
                                </Button>
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
    overflow: 'auto'
};
