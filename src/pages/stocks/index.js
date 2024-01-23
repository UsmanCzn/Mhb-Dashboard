import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import StockList from '../stocks/stocks-list';
import { useBranches } from 'providers/branchesProvider';

const Stocks = () => {
    const [reload, setReload] = useState(false);
    const [selectedBrand, setselectedBrand] = useState('');
    const [selectedBranch, setselectedBranch] = useState('');

    const { brandsList } = useFetchBrandsList(reload);
    const { branchesList } = useBranches();

    useEffect(() => {
        // Check if brandsList has at least one item and selectedBrand is not set
        if (brandsList.length > 0) {
            const initialBrand = brandsList[0];
            setselectedBrand(initialBrand);
            setselectedBranch(branchesList[0]);
        }
    }, [brandsList, branchesList]);
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs={6}>
                            <Typography fontSize={22} fontWeight={700}>
                                STOCKS
                            </Typography>
                        </Grid>
                        <Box sx={{ display: 'flex', gap: '15px' }}>
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
                                        }}
                                    >
                                        {brandsList.map((row, index) => {
                                            return (
                                                <MenuItem key={index} value={row}>
                                                    {row?.name}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs="auto">
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">{'Branch'}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={selectedBranch}
                                        label={'Branch'}
                                        onChange={(event) => {
                                            setselectedBranch(event.target.value);
                                        }}
                                    >
                                        {branchesList.map((row, index) => {
                                            return (
                                                <MenuItem key={index} value={row}>
                                                    {row?.name}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <StockList brandid={selectedBrand?.id} branchid={selectedBranch?.id} />
                </Grid>
            </Grid>
        </>
    );
};

export default Stocks;
