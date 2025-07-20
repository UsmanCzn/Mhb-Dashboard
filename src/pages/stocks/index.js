import React, { useState, useEffect } from 'react';
import {
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box
} from '@mui/material';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import StockList from '../stocks/stocks-list';
import { useBranches } from 'providers/branchesProvider';

const Stocks = () => {
    const [reload, setReload] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null);

    const { brandsList } = useFetchBrandsList(reload);
    const { branchesList } = useBranches();

    const filteredBranches = selectedBrand
        ? branchesList.filter(branch => branch.brandId === selectedBrand.id)
        : [];

    useEffect(() => {
        if (brandsList.length > 0) {
            const initialBrand = brandsList[0];
            setSelectedBrand(initialBrand);

            const initialBranch = branchesList.find(
                b => b.brandId === initialBrand.id
            );
            if (initialBranch) {
                setSelectedBranch(initialBranch);
            }
        }
    }, [brandsList, branchesList]);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs={6}>
                            <Typography fontSize={22} fontWeight={700}>
                                Products Management
                            </Typography>
                        </Grid>
                        <Box sx={{ display: 'flex', gap: '15px' }}>
                            {/* Brand Select */}
                            <Grid item xs="auto">
                                <FormControl fullWidth>
                                    <InputLabel>Brand</InputLabel>
                                    <Select
                                        value={selectedBrand?.id || ''}
                                        label="Brand"
                                        onChange={(event) => {
                                            const brand = brandsList.find(b => b.id === event.target.value);
                                            setSelectedBrand(brand);
                                            const branch = branchesList.find(br => br.brandId === brand?.id);
                                            setSelectedBranch(branch || null);
                                        }}
                                    >
                                        {brandsList.map((row) => (
                                            <MenuItem key={row.id} value={row.id}>
                                                {row.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Branch Select */}
                            <Grid item xs="auto">
                                <FormControl fullWidth>
                                    <InputLabel>Branch</InputLabel>
                                    <Select
                                        value={selectedBranch?.id || ''}
                                        label="Branch"
                                        onChange={(event) => {
                                            const branch = filteredBranches.find(b => b.id === event.target.value);
                                            setSelectedBranch(branch);
                                        }}
                                    >
                                        {filteredBranches.map((row) => (
                                            <MenuItem key={row.id} value={row.id}>
                                                {row.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>

                {/* Stock List */}
                <Grid item xs={12}>
                    <StockList
                        brandid={selectedBrand?.id}
                        branchid={selectedBranch?.id}
                    />
                </Grid>
            </Grid>
        </>
    );
};

export default Stocks;
