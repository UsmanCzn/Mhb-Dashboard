import React, { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import DataGridComponent from 'components/DataGridComponent';
import branchServices from 'services/branchServices';

export default function Areas() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { brandId, branchId, regionId } = useParams();
    const [areas, setAreas] = useState([]);
    const [regionName, setRegionName] = useState('');
    const [loading, setLoading] = useState(false);
    const [updatingAreaId, setUpdatingAreaId] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [createErrors, setCreateErrors] = useState({
        name: '',
        nativeName: '',
        sortOrder: ''
    });
    const [createValues, setCreateValues] = useState({
        name: '',
        nativeName: '',
        sortOrder: ''
    });

    const parsedBrandId = useMemo(() => Number(brandId), [brandId]);
    const parsedBranchId = useMemo(() => Number(branchId), [branchId]);
    const parsedRegionId = useMemo(() => Number(regionId), [regionId]);

    const open = Boolean(anchorEl);

    const fetchAreas = async () => {
        if (!parsedBrandId || !parsedBranchId || !parsedRegionId) {
            setAreas([]);
            return;
        }

        setLoading(true);
        try {
            const res = await branchServices.getRegions(parsedBrandId, parsedBranchId);
            const allRegions = res?.data?.result || [];
            const selectedRegion = allRegions.find((region) => Number(region.id) === parsedRegionId);

            if (!selectedRegion) {
                setAreas([]);
                setRegionName('');
                enqueueSnackbar('Region not found', { variant: 'warning' });
                return;
            }

            setRegionName(selectedRegion.name || '');
            const mappedAreas = (selectedRegion.children || []).map((area) => ({
                ...area,
                regionId: selectedRegion.id,
                regionName: selectedRegion.name,
                regionNativeName: selectedRegion.nativeName
            }));
            setAreas(mappedAreas);
        } catch (error) {
            setAreas([]);
            enqueueSnackbar('Failed to load delivery areas', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAreas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parsedBrandId, parsedBranchId, parsedRegionId]);

    const handleMenuClick = (event, row) => {
        setSelectedArea(row);
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const toggleAreaVisibility = async (row) => {
        setUpdatingAreaId(row.id);
        try {
            await branchServices.updateDeliveryAreaHide({
                brandId: parsedBrandId,
                regionId: parsedRegionId,
                areaId: row.id,
                isHidden: !row.isHidden
            });
            enqueueSnackbar(`Area ${row.isHidden ? 'unhidden' : 'hidden'} successfully`, { variant: 'success' });
            await fetchAreas();
        } catch (error) {
            enqueueSnackbar('Failed to update area status', { variant: 'error' });
        } finally {
            setUpdatingAreaId(null);
        }
    };

    const openCreateDialog = () => {
        setCreateErrors({
            name: '',
            nativeName: '',
            sortOrder: ''
        });
        setCreateValues({
            name: '',
            nativeName: '',
            sortOrder: ''
        });
        setIsCreateDialogOpen(true);
    };

    const closeCreateDialog = () => {
        setIsCreateDialogOpen(false);
    };

    const onCreateValueChange = (field) => (event) => {
        const nextValue = event.target.value;
        setCreateValues((prev) => ({ ...prev, [field]: nextValue }));
        if (createErrors[field]) {
            setCreateErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const validateCreateArea = () => {
        const nextErrors = {
            name: createValues.name?.trim() ? '' : 'Area name is required.',
            nativeName: createValues.nativeName?.trim() ? '' : 'Area native name is required.',
            sortOrder:
                createValues.sortOrder !== '' && !Number.isNaN(Number(createValues.sortOrder))
                    ? ''
                    : 'Sort order must be a valid number.'
        };

        setCreateErrors(nextErrors);
        return !nextErrors.name && !nextErrors.nativeName && !nextErrors.sortOrder;
    };

    const createArea = async () => {
        if (!parsedBrandId || !parsedBranchId || !parsedRegionId) {
            enqueueSnackbar('Brand, branch, or region id is missing.', { variant: 'error' });
            return;
        }

        if (!validateCreateArea()) {
            return;
        }

        setIsCreating(true);
        try {
            await branchServices.createDeliveryArea({
                name: createValues.name.trim(),
                nativeName: createValues.nativeName.trim(),
                deliveryRegionId: parsedRegionId,
                branchId: parsedBranchId,
                brandId: parsedBrandId,
                sortOrder: Number(createValues.sortOrder)
            });
            enqueueSnackbar('Delivery area created successfully', { variant: 'success' });
            closeCreateDialog();
            await fetchAreas();
        } catch (error) {
            enqueueSnackbar('Failed to create delivery area', { variant: 'error' });
        } finally {
            setIsCreating(false);
        }
    };

    const columns = [
        {
            field: 'name',
            headerName: 'Area Name',
            minWidth: 220,
            flex: 1
        },
        {
            field: 'nativeName',
            headerName: 'Area Native Name',
            minWidth: 220,
            flex: 1
        },
        {
            field: 'isHidden',
            headerName: 'Status',
            minWidth: 140,
            flex: 0.8,
            renderCell: (params) => (params.row?.isHidden ? 'Hidden' : 'Visible')
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            minWidth: 100,
            flex: 0.5,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <IconButton
                    size="small"
                    disabled={updatingAreaId === params.row.id}
                    onClick={(event) => handleMenuClick(event, params.row)}
                >
                    <MoreVertIcon fontSize="small" />
                </IconButton>
            )
        }
    ];

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                    <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography fontSize={22} fontWeight={700}>
                                Delivery Areas {regionName ? `- ${regionName}` : ''}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Brand: {brandId} | Branch: {branchId} | Region: {regionId}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" sx={{ textTransform: 'capitalize' }} onClick={openCreateDialog}>
                                Add Delivery Area
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                {loading ? (
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <DataGridComponent
                        rows={areas}
                        columns={columns}
                        getRowId={(row) => row.id}
                        rowsPerPageOptions={[10]}
                        totalRowCount={areas?.length ?? 0}
                        onRowClick={() => {}}
                        pSize={10}
                        pMode={'client'}
                    />
                )}
            </Grid>

            <Menu anchorEl={anchorEl} open={open} onClose={closeMenu}>
                <MenuItem
                    onClick={async () => {
                        if (!selectedArea) {
                            return;
                        }
                        await toggleAreaVisibility(selectedArea);
                        closeMenu();
                    }}
                >
                    {selectedArea?.isHidden ? 'Unhide' : 'Hide'}
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        navigate('/regions');
                        closeMenu();
                    }}
                >
                    Back to Regions
                </MenuItem>
            </Menu>

            <Dialog open={isCreateDialogOpen} onClose={closeCreateDialog} fullWidth maxWidth="sm">
                <DialogTitle>Add Delivery Area</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Area Name"
                                value={createValues.name}
                                onChange={onCreateValueChange('name')}
                                error={Boolean(createErrors.name)}
                                helperText={createErrors.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Area Native Name"
                                value={createValues.nativeName}
                                onChange={onCreateValueChange('nativeName')}
                                error={Boolean(createErrors.nativeName)}
                                helperText={createErrors.nativeName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Sort Order"
                                type="number"
                                value={createValues.sortOrder}
                                onChange={onCreateValueChange('sortOrder')}
                                error={Boolean(createErrors.sortOrder)}
                                helperText={createErrors.sortOrder}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeCreateDialog} disabled={isCreating}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={createArea} disabled={isCreating}>
                        {isCreating ? <CircularProgress size={18} color="inherit" /> : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}
