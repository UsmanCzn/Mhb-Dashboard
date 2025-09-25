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
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

const CreditReport = () => {
      const [creditReports, setCreditReports] = useState([]);
      const [creditSummary, setCreditSummary] = useState();
      const [anchorEl, setAnchorEl] = useState(null);
      const [selectedRow, setSelectedRow] = useState(null);
      const [totalLength, setTotalLength] = useState(0);
      const [page, setpage] = useState(0)
      
    
      const { enqueueSnackbar } = useSnackbar();
      const { user } = useAuth();
    
      const [selectedBrand, setselectedBrand] = useState('');
      const [reload, setReload] = useState(false);
    
      const { brandsList } = useFetchBrandsList(reload);
    
      const open = Boolean(anchorEl);

      const MONTHS = [
      { value: 1, label: 'January' }, { value: 2, label: 'February' },
      { value: 3, label: 'March' },   { value: 4, label: 'April' },
      { value: 5, label: 'May' },     { value: 6, label: 'June' },
      { value: 7, label: 'July' },    { value: 8, label: 'August' },
      { value: 9, label: 'September'},{ value:10, label: 'October' },
      { value:11, label: 'November' },{ value:12, label: 'December' },
      ];
    
      const now = new Date();
      const YEARS = Array.from({ length: 11 }, (_, i) => now.getFullYear() - i);
      const [year, setYear] = useState(now.getFullYear());
      const [month, setMonth] = useState(now.getMonth() + 1);
      // Fetch scan requests on mount
      useEffect(() => {
        if (selectedBrand) {
          getCreditReport();
        }
      }, [selectedBrand, year, month,page]);
    
      // Setup brands and branches on load/update
      useEffect(() => {
        if (brandsList.length > 0) {
          const initialBrand = brandsList[0];
          setselectedBrand(initialBrand);
        }
      }, [brandsList]);
    
      // API: Get Scan Requests
      const getCreditReport = async () => {
        try {
          const res = await customerService.getCreditReports(selectedBrand?.id,year,month , 10, page+1);
            console.log(res);
            
          setCreditReports(res.data.result.rows);
          setCreditSummary(res.data.result?.summary)
          setTotalLength(res.data.result.totalCount);
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

        // DataGrid Columns
        const columns = [
          {
            field: 'customerName',
            headerName: 'Customer Name',
            flex: 1,
            headerAlign: 'left',
          },
          {
            field: 'creditsGiven',
            headerName: 'Credit Given',
            flex: 0.7,
            headerAlign: 'left',
            // valueFormatter: ({ value }) =>
            //   value !== undefined && value !== null ? `${value.toFixed(2)} KWD` : '--',
          },
          {
            field: 'creditUsed',
            headerName: 'Credit Used',
            flex: 0.7,
            headerAlign: 'left',
            // valueFormatter: ({ value }) =>
            //   value !== undefined && value !== null ? `${value.toFixed(2)} KWD` : '--',
          },
          {
            field: 'remainingCredit',
            headerName: 'Credit Remaining',
            flex: 0.7,
            headerAlign: 'left',
            // valueFormatter: ({ value }) =>
            //   value !== undefined && value !== null ? `${value.toFixed(2)} KWD` : '--',
          },
          {
            field: 'lastUsageUtc',
            headerName: 'Creation Time',
            flex: 1.1,
            headerAlign: 'left',
            valueGetter: (params) => params.row?.lastUsageUtc,
            renderCell: (params) =>
              params.row?.lastUsageUtc
                ? moment(params.row.lastUsageUtc).format('DD/MM/YYYY HH:mm')
                : '--',
          },
          // {
          //   field: 'pointsEarned',
          //   headerName: 'Points Earned',
          //   flex: 0.7,
          //   headerAlign: 'left',
          // },
          // {
          //   field: 'comment',
          //   headerName: 'Comment',
          //   flex: 1,
          //   headerAlign: 'left',
          // },
      
          // {
          //   field: 'actions',
          //   headerName: 'Actions',
          //   sortable: false,
          //   flex: 0.5,
          //   headerAlign: 'left',
          //   renderCell: (params) => (
          //     !params.row.isAct && (
          //       <MoreVertIcon onClick={(event) => handleClick(event, params)} style={{ cursor: 'pointer' }} />
          //     )
          //   ),
          // },
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
        <Grid item  xs={12} sm={8} md={6} lg={5} xl={4}>
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

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="year-label">Year</InputLabel>
                <Select
                  labelId="year-label"
                  label="Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  {YEARS.map(y => (
                    <MenuItem key={y} value={y}>{y}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="month-label">Month</InputLabel>
                <Select
                  labelId="month-label"
                  label="Month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {MONTHS.map(m => (
                    <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container sx={{ mb: 2 }} spacing={2}>
        <Grid item xs={3}>
          <AnalyticEcommerce title="Total Credit Added" isLoading={false} count={creditSummary?.totalCreditsAdded} percentage={27.4} extra="1,943" />
        </Grid>
        <Grid item xs={3}>
          <AnalyticEcommerce title="Total Credit Used" isLoading={false} count={creditSummary?.totalCreditsUsed} percentage={27.4} extra="1,943" />
        </Grid>
        <Grid item xs={3}>
          <AnalyticEcommerce title="Remaining Unused Credits" isLoading={false} count={creditSummary?.remainingUnusedCredits} percentage={27.4} extra="1,943" />
        </Grid>
        <Grid item xs={3}>
          <AnalyticEcommerce title="Top Spending Customer" isLoading={false} count={creditSummary?.topSpendingCustomer} percentage={27.4} extra="1,943" />
        </Grid>
      </Grid>

      {/* Main Data Table */}
      <DataGridComponent
        rows={creditReports}
        columns={columns}
        loading={false}
        getRowId={(row) => row.userId}
        rowsPerPageOptions={[10]}
        totalRowCount={totalLength||0}
        fetchCallback={(e)=>setpage(e)}
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
}

export default CreditReport