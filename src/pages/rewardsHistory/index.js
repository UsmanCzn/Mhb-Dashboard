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
    {/* Header */}
    <Grid item xs={12}>
      <Grid
        container
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
      >
        {/* Title */}
        <Grid item xs={12} sm={6}>
          <Typography fontSize={22} fontWeight={700}>
            Rewards History
          </Typography>
        </Grid>

        {/* Filters */}
        <Grid item xs={12} sm="auto">
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            {/* Brand */}
            <FormControl fullWidth size="small">
              <InputLabel id="brand-select-label">Brand</InputLabel>
              <Select
                labelId="brand-select-label"
                value={selectedBrand}
                label="Brand"
                onChange={(event) => {
                  setselectedBrand(event.target.value);
                  changeFilteredBranches(event.target.value);
                }}
              >
                {brandsList.map((row, index) => (
                  <MenuItem key={index} value={row}>
                    {row?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Branch */}
            <FormControl fullWidth size="small">
              <InputLabel id="branch-select-label">Branch</InputLabel>
              <Select
                labelId="branch-select-label"
                value={selectedBranch}
                label="Branch"
                onChange={(event) => setselectedBranch(event.target.value)}
              >
                {filteredBranches.map((row, index) => (
                  <MenuItem key={index} value={row}>
                    {row?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
    </Grid>

    {/* Search */}
    <Grid item xs={12} sm={6} md={2} lg={2}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}
      >
        <TextField
          fullWidth
          size="small"
          id="search"
          label="Search Users"
          variant="outlined"
          placeholder="Search Here..."
          onChange={(event) => setSearch(event.target.value)}
        />
      </Box>
    </Grid>

    {/* Table */}
    <Grid item xs={12}>
      <RewardsHistoryTable
        reload={reload}
        search={search}
        branchId={selectedBranch.id}
      />
    </Grid>

    {/* Modal */}
    <NewCustomer
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      setReload={setReload}
    />
  </Grid>
);

}
