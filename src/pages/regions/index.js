import React, { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    Menu,
    MenuItem,
    Select,
    Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DataGridComponent from 'components/DataGridComponent';
import branchServices from 'services/branchServices';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

export default function Regions() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { brandsList } = useFetchBrandsList();

    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [branches, setBranches] = useState([]);
    const [regions, setRegions] = useState([]);
    const [loadingBranches, setLoadingBranches] = useState(false);
    const [loadingRegions, setLoadingRegions] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);

    const open = Boolean(anchorEl);

    const filteredBranches = useMemo(() => {
        if (!selectedBrand) {
            return [];
        }
        return branches.filter((branch) => String(branch.brandId) === String(selectedBrand));
    }, [branches, selectedBrand]);

    const fetchBranches = async () => {
        setLoadingBranches(true);
        try {
            const res = await branchServices.getAllBranches();
            setBranches(res?.data?.result || []);
        } catch (error) {
            enqueueSnackbar('Failed to load branches', { variant: 'error' });
        } finally {
            setLoadingBranches(false);
        }
    };

    const fetchRegions = async (brandId, branchId) => {
        if (!brandId || !branchId) {
            setRegions([]);
            return;
        }

        setLoadingRegions(true);
        try {
            const res = await branchServices.getRegions(brandId, branchId);
            setRegions(res?.data?.result || []);
        } catch (error) {
            setRegions([]);
            enqueueSnackbar('Failed to load regions', { variant: 'error' });
        } finally {
            setLoadingRegions(false);
        }
    };

    useEffect(() => {
        fetchBranches();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-select first brand once brands list loads
    useEffect(() => {
        if (brandsList.length > 0 && !selectedBrand) {
            setSelectedBrand(brandsList[0].id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brandsList]);

    // Reset branch when brand changes (manual or auto)
    useEffect(() => {
        setSelectedBranch('');
        setRegions([]);
    }, [selectedBrand]);

    // Auto-select first branch once branches are available for the selected brand
    useEffect(() => {
        if (filteredBranches.length > 0 && !selectedBranch) {
            setSelectedBranch(filteredBranches[0].id);
        }
    }, [filteredBranches, selectedBranch]);

    useEffect(() => {
        fetchRegions(selectedBrand, selectedBranch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBrand, selectedBranch]);

    const handleMenuClick = (event, row) => {
        setSelectedRegion(row);
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 180,
            flex: 1
        },
        {
            field: 'nativeName',
            headerName: 'Native Name',
            minWidth: 180,
            flex: 1
        },
        {
            field: 'isHidden',
            headerName: 'Status',
            minWidth: 120,
            flex: 0.8,
            renderCell: (params) => (params.row?.isHidden ? 'Hidden' : 'Visible')
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            minWidth: 100,
            flex: 0.6,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <IconButton size="small" onClick={(event) => handleMenuClick(event, params.row)}>
                    <MoreVertIcon fontSize="small" />
                </IconButton>
            )
        }
    ];

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                    <Grid item xs="auto">
                        <Typography fontSize={22} fontWeight={700}>
                            Delivery Regions
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <FormControl size="small" sx={{ minWidth: 220 }}>
                                <InputLabel id="regions-brand-select-label">Brand</InputLabel>
                                <Select
                                    labelId="regions-brand-select-label"
                                    value={selectedBrand}
                                    label="Brand"
                                    onChange={(event) => setSelectedBrand(event.target.value)}
                                >
                                    {brandsList.map((brand) => (
                                        <MenuItem key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Branch dropdown hidden as requested */}

                            <Button
                                variant="contained"
                                sx={{ textTransform: 'capitalize' }}
                                disabled={!selectedBrand || !selectedBranch}
                                onClick={() => navigate(`/regions/add-edit/${selectedBrand}/${selectedBranch}`)}
                            >
                                Add New Region
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                {loadingRegions ? (
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <DataGridComponent
                        rows={regions}
                        columns={columns}
                        loading={loadingRegions}
                        getRowId={(row) => row.id}
                        rowsPerPageOptions={[10]}
                        totalRowCount={regions?.length ?? 0}
                        onRowClick={() => {}}
                        pSize={10}
                        pMode={'client'}
                    />
                )}
            </Grid>

            <Menu anchorEl={anchorEl} open={open} onClose={closeMenu}>
                <MenuItem
                    onClick={() => {
                        if (!selectedRegion) {
                            return;
                        }
                        navigate(`/regions/add-edit/${selectedBrand}/${selectedBranch}/${selectedRegion.id}`);
                        closeMenu();
                    }}
                >
                    Edit
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        if (!selectedRegion) {
                            return;
                        }
                        navigate(`/delivery-areas/${selectedBrand}/${selectedBranch}/${selectedRegion.id}`);
                        closeMenu();
                    }}
                >
                    Delivery Areas
                </MenuItem>
            </Menu>
        </Grid>
    );
}
