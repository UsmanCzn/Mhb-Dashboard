import React, { useState, useEffect } from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, Box, Menu } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DataGridComponent from 'components/DataGridComponent';
import moment from 'moment/moment';
import customerService from 'services/customerService';
import { useSnackbar } from 'notistack';
import { useAuth } from 'providers/authProvider';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import { useBranches } from 'providers/branchesProvider';

const ScanRequest = () => {
  const [scanRequest, setScanRequest] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [totalLength, setTotalLength] = useState(0);

  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const [selectedBrand, setselectedBrand] = useState('');
  const [selectedBranch, setselectedBranch] = useState('');
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [reload, setReload] = useState(false);

  const { brandsList } = useFetchBrandsList(reload);
  const { branchesList } = useBranches();

  const open = Boolean(anchorEl);

  // Set filtered branches when brand changes
  const changeFilteredBranches = (brand) => {
    const branchesForSelectedBrand = branchesList.filter((branch) => branch.brandId === brand.id);
    setFilteredBranches(branchesForSelectedBrand);
    if (branchesForSelectedBrand.length > 0) {
      setselectedBranch(branchesForSelectedBrand[0]);
    }
  };

  // Fetch scan requests on mount
  useEffect(() => {
    if (selectedBrand && selectedBranch) {
      getScanRequest();
    }
  }, [selectedBrand, selectedBranch]);

  // Setup brands and branches on load/update
  useEffect(() => {
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

  // API: Get Scan Requests
  const getScanRequest = async (page=0) => {
    try {
      const res = await customerService.getScanRequest(selectedBrand?.id, selectedBranch?.id, 10, page);
      console.log(res.data.result);
      
      setScanRequest(res.data.result.item1);
      setTotalLength(res.data.result.item2);
    } catch (err) {
      console.log(err?.response?.data);
    }
  };

  // Menu open/close and actions
  const handleClick = (event, params) => {
    setSelectedRow(params.row);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (data) => {
    if (data?.name === 'Accept') {
      const body = {
        id: selectedRow.id,
        brandId: selectedRow?.brandId,
      };
      acceptRequest(body);
    } else if (data?.name === 'Reject') {
      const body = {
        id: selectedRow.id,
        brandId: selectedRow?.brandId,
      };
      rejectRequest(body);
    }
    setAnchorEl(null);
  };

  const acceptRequest = async (body) => {
    try {
      await customerService.ResolveScanDispute(body.id,true);
      enqueueSnackbar('Request Accepted', { variant: 'success' });
      getScanRequest();
    } catch (err) {
      console.log(err?.response?.data);
    }
  };

  const rejectRequest = async (body) => {
    try {
      await customerService.ResolveScanDispute(body.id,false);
      enqueueSnackbar('Request Rejected', { variant: 'error' });
      getScanRequest();
    } catch (err) {
      console.log(err?.response?.data);
    }
  };

  // DataGrid Columns
  const columns = [
    {
      field: 'customerName',
      headerName: 'Customer Name',
      flex: 1,
      headerAlign: 'left',
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 0.7,
      headerAlign: 'left',
      valueFormatter: ({ value }) =>
        value !== undefined && value !== null ? `${value.toFixed(2)} KWD` : '--',
    },
    {
      field: 'creationTime',
      headerName: 'Creation Time',
      flex: 1.1,
      headerAlign: 'left',
      valueGetter: (params) => params.row?.creationTime,
      renderCell: (params) =>
        params.row?.creationTime
          ? moment(params.row.creationTime).format('DD/MM/YYYY HH:mm')
          : '--',
    },
    {
      field: 'pointsEarned',
      headerName: 'Points Earned',
      flex: 0.7,
      headerAlign: 'left',
    },
    {
      field: 'comment',
      headerName: 'Comment',
      flex: 1,
      headerAlign: 'left',
    },

    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      flex: 0.5,
      headerAlign: 'left',
      renderCell: (params) => (
        !params.row.isAct && (
          <MoreVertIcon onClick={(event) => handleClick(event, params)} style={{ cursor: 'pointer' }} />
        )
      ),
    },
  ];

  // Options for menu actions
  const options = [
    { name: 'Accept', modal: false },
    { name: 'Reject', modal: false },
  ];

  return (
    <>
      {/* Brand & Branch Filters */}
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="flex-end"
        sx={{ mb: 2 }}
      >
        <Grid item xs={12} sm={8} md={6} lg={5} xl={4}>
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="brand-select-label">Brand</InputLabel>
                <Select
                  labelId="brand-select-label"
                  id="brand-select"
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="branch-select-label">Branch</InputLabel>
                <Select
                  labelId="branch-select-label"
                  id="branch-select"
                  value={selectedBranch}
                  label="Branch"
                  onChange={(event) => {
                    setselectedBranch(event.target.value);
                  }}
                >
                  {filteredBranches.map((row, index) => (
                    <MenuItem key={index} value={row}>
                      {row?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Main Data Table */}
      <DataGridComponent
        rows={scanRequest}
        columns={columns}
        loading={false}
        getRowId={(row) => row.id}
        rowsPerPageOptions={[10]}
        totalRowCount={totalLength||0}
        fetchCallback={()=>getScanRequest}
      />

      {/* Actions Menu */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {options.map((row, index) => (
          <MenuItem
            disabled={user?.isAccessRevoked}
            key={index}
            onClick={() => handleClose(row)}
            value={row.name}
          >
            {row.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );

};

export default ScanRequest;
