import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, Grid, Paper, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import branchServices from 'services/branchServices';

export default function AddEditRegion() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { brandId, branchId, regionId } = useParams();

    const toIdValue = (value) => {
        const numericValue = Number(value);
        return Number.isNaN(numericValue) ? value : numericValue;
    };

    const parsedBrandId = useMemo(() => toIdValue(brandId), [brandId]);
    const parsedBranchId = useMemo(() => toIdValue(branchId), [branchId]);
    const parsedRegionId = useMemo(() => (regionId ? Number(regionId) : null), [regionId]);

    const [formValues, setFormValues] = useState({
        name: '',
        nativeName: '',
        brandId: parsedBrandId || '',
        branchId: parsedBranchId || ''
    });
    const [errors, setErrors] = useState({
        name: '',
        nativeName: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = (values) => {
        const nextErrors = {
            name: values.name?.trim() ? '' : 'Region Name is required.',
            nativeName: values.nativeName?.trim() ? '' : 'Region Name Native is required.'
        };
        setErrors(nextErrors);
        return !nextErrors.name && !nextErrors.nativeName;
    };

    useEffect(() => {
        if (!parsedRegionId) {
            return;
        }

        const loadRegion = async () => {
            setIsLoading(true);
            try {
                const res = await branchServices.getRegions(parsedBrandId, parsedBranchId);
                const allRegions = res?.data?.result || [];
                const targetRegion = allRegions.find((item) => Number(item.id) === parsedRegionId);

                if (targetRegion) {
                    setFormValues({
                        name: targetRegion.name || '',
                        nativeName: targetRegion.nativeName || '',
                        brandId: targetRegion.brandId || parsedBrandId || '',
                        branchId: targetRegion.branchId || parsedBranchId || ''
                    });
                } else {
                    enqueueSnackbar('Region not found', { variant: 'warning' });
                }
            } catch (error) {
                enqueueSnackbar('Failed to load region', { variant: 'error' });
            } finally {
                setIsLoading(false);
            }
        };

        loadRegion();
    }, [enqueueSnackbar, parsedBrandId, parsedBranchId, parsedRegionId]);

    const onChange = (field) => (event) => {
        const value = event.target.value;
        setFormValues((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        const isValid = validate(formValues);
        if (!isValid) {
            return;
        }

        const payload = {
            name: formValues.name.trim(),
            nativeName: formValues.nativeName.trim(),
            branchId: formValues.branchId || parsedBranchId,
            brandId: formValues.brandId || parsedBrandId,
            isHidden: false,
            ...(parsedRegionId ? { id: parsedRegionId } : {})
        };

        if (!payload.branchId || !payload.brandId) {
            enqueueSnackbar('Brand or branch id is missing. Please re-open this page from Regions.', { variant: 'error' });
            return;
        }

        setIsSubmitting(true);
        try {
            if (parsedRegionId) {
                await branchServices.updateDeliveryRegion(payload);
                enqueueSnackbar('Region updated successfully!', { variant: 'success' });
            } else {
                await branchServices.createDeliveryRegion(payload);
                enqueueSnackbar('Region created successfully!', { variant: 'success' });
            }
            navigate('/regions');
        } catch (error) {
            enqueueSnackbar('Something went wrong. Please try again.', { variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography fontSize={22} fontWeight={700}>
                    {parsedRegionId ? 'Edit' : 'Add New'} Region
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box component="form" onSubmit={onSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Region Name"
                                        value={formValues.name}
                                        onChange={onChange('name')}
                                        error={Boolean(errors.name)}
                                        helperText={errors.name}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Region Name Native"
                                        value={formValues.nativeName}
                                        onChange={onChange('nativeName')}
                                        error={Boolean(errors.nativeName)}
                                        helperText={errors.nativeName}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{ textTransform: 'capitalize' }}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? <CircularProgress size={20} color="inherit" /> : `${parsedRegionId ? 'Update' : 'Add New'} Region`}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
}
