import { Grid, Typography, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { TableControl, BranchesTable } from 'features';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import NewBranch from 'components/branches/newBranch';
import { useSnackbar } from 'notistack';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';

export default function Branches() {
    const { type } = useParams();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [searchParams] = useSearchParams();
    const brandId = searchParams.get('brandId'); // Get brandId from query params
    const [modalOpen, setModalOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const navigate = useNavigate();
    const [update, setUpdate] = useState(false);
    const [updateData, setUpdateData] = useState({});
    const { brandsList } = useFetchBrandsList(false);

    // Initialize selectedBrand based on brandId (default to 'all' if brandId is not present)
    const [selectedBrand, setSelectedBrand] = useState(brandId || 'all');

    // Update selectedBrand whenever brandId changes
    useEffect(() => {
        setSelectedBrand(brandId || 'all');
    }, [brandId]);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs="auto">
                            <Typography fontSize={22} fontWeight={700}>
                                Stores
                            </Typography>
                        </Grid>

                        <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <Grid item xs="auto">
                                <Button
                                    size="small"
                                    variant="contained"
                                    sx={{ textTransform: 'capitalize' }}
                                    onClick={() => {
                                        navigate('/locationAddEdit');
                                    }}
                                >
                                    Create New Store
                                </Button>
                            </Grid>
                            <Grid item xs="auto">
                                <FormControl fullWidth>
                                    <InputLabel id="branch-select-label">Brand</InputLabel>
                                    <Select
                                        labelId="branch-select-label"
                                        id="branch-select"
                                        sx={{ minWidth: '100px' }}
                                        value={selectedBrand}
                                        label="Brand"
                                        onChange={(event) => {
                                            setSelectedBrand(event.target.value);
                                        }}
                                    >
                                        <MenuItem value="all">All Brands</MenuItem>
                                        {brandsList.map((row, index) => (
                                            <MenuItem key={index} value={row.id}>
                                                {row.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <BranchesTable
                        type="Branch"
                        reload={reload}
                        bid={selectedBrand}
                        setUpdate={setUpdate}
                        setUpdateData={setUpdateData}
                        setModalOpen={setModalOpen}
                    />
                </Grid>

                <NewBranch
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    setReload={setReload}
                    update={update}
                    updateData={updateData}
                />
            </Grid>
        </>
    );
}
