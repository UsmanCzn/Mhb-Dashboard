import { Grid, Typography, Button, TextField, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { TableControl, CustomersTable } from 'features';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import NewCustomer from 'components/customers/newCustomer';
import RewardsTable from 'features/Rewards/index';
import RewardsHistoryTable from 'features/RewardsHistoryTable/index';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import { useBranches } from 'providers/branchesProvider';
export default function RewardsHistory() {
    const { type } = useParams();

    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedBrand, setselectedBrand] = useState('');
    const [selectedBranch, setselectedBranch] = useState('');
    const [filteredBranches, setFilteredBranches] = useState([]);

    const { brandsList } = useFetchBrandsList(reload);
    const { branchesList } = useBranches();

    useEffect(() => {
        // Check if brandsList has at least one item and selectedBrand is not set
        if (brandsList.length > 0) {
            const initialBrand = brandsList[0];
            setselectedBrand(initialBrand);
            const branchesForSelectedBrand = branchesList.filter((branch) => branch.brandId === initialBrand.id);

            setFilteredBranches(branchesForSelectedBrand);

            if (branchesForSelectedBrand.length > 0) {
                setselectedBranch(branchesForSelectedBrand[0]);
            }
        }
    }, [brandsList, branchesList]);
    const changeFilteredBranches = (brand) => {
        const branchesForSelectedBrand = branchesList.filter((branch) => branch.brandId === brand.id);

        setFilteredBranches(branchesForSelectedBrand);
        if (branchesForSelectedBrand.length > 0) {
            setselectedBranch(branchesForSelectedBrand[0]);
        }
    };
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={6}>
                        <Typography fontSize={22} fontWeight={700}>
                            Rewards History
                        </Typography>
                    </Grid>
                    <Grid item xs={'auto'}>
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
                                            changeFilteredBranches(event.target.value);
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
                                        {filteredBranches.map((row, index) => {
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
                        {/* <Button size="small" variant="contained" 
            sx={{ textTransform: 'capitalize' }} >
                            Add New loyalty
            </Button>  */}
                    </Grid>
                    {/* <Grid item xs={6}>
            <TableControl type="Customer"/>
        </Grid> */}
                </Grid>
            </Grid>
            <Grid sx={{ display: 'flex', justifyContent: 'space-between' }} item xs={12}>
                <TextField
                    id="search"
                    label="Search Users"
                    variant="outlined"
                    placeholder="Search Here..."
                    onChange={(event) => {
                        setSearch(event.target.value);
                    }}
                />
                {/* <TableControl  type="filter"/> */}
            </Grid>

            <Grid item xs={12}>
                <RewardsHistoryTable reload={reload} search={search} branchId={selectedBranch.id} />
            </Grid>
            <NewCustomer modalOpen={modalOpen} setModalOpen={setModalOpen} setReload={setReload} />
        </Grid>
    );
}
