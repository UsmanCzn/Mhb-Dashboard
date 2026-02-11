import React, { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
} from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import { useAuth } from 'providers/authProvider';
import UpdateCommissionDialog from './updateCommissionDialog';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import brandCommissionService from 'services/brandCommissionService';

const CommissionSetup = () => {
  const [commission, setCommission] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedBrand, setselectedBrand] = useState(null);

  const { user } = useAuth();
  const { brandsList } = useFetchBrandsList(false);

  /* ------------------------------------
     Auto select first brand
  -------------------------------------*/
  useEffect(() => {
    if (brandsList?.length ) {
      setselectedBrand(brandsList[0]);
    }
  }, [brandsList]);

  /* ------------------------------------
     Fetch commission when brand changes
  -------------------------------------*/
  useEffect(() => {
    if (selectedBrand?.id) {
      getBrandCommission(selectedBrand.id);
    }
  }, [selectedBrand]);

  /* ------------------------------------
     API call
  -------------------------------------*/
  const getBrandCommission = async (brandId) => {
    setLoading(true);
    try {
      const res = await brandCommissionService.getBrandCommission(brandId);

      setCommission(res?.data?.result ? [res?.data?.result]:[] ?? []);
    } catch (error) {
      console.error('Failed to fetch commission', error);
      setCommission([]);
    } finally {
      setLoading(false);
    }
  };

const columns = [
  {
    field: 'percentageCommission',
    headerName: 'Commission (%)',
    flex: 0.6,
    minWidth: 150,
    headerAlign: 'right',
    align: 'right',
    valueFormatter: ({ value }) =>
      value !== null && value !== undefined
        ? `${value}%`
        : '-',
  },
  {
    field: 'flatCommission',
    headerName: 'Flat Commission',
    flex: 0.6,
    minWidth: 160,
    headerAlign: 'right',
    align: 'right',
    valueFormatter: ({ value }) =>
      value !== null && value !== undefined
        ? `${value} KD`
        : '-',
  },
  {
    field: 'methods',
    headerName: 'Payment Methods',
    flex: 1.2,
    minWidth: 220,
    sortable: false,
    headerAlign: 'left',
    align: 'left',
    renderCell: ({ row }) => {
      const methods = [];

      if (row.isKnetEnabled) methods.push('KNET');
      if (row.isAplePayEnabled) methods.push('Apple Pay');
      if (row.isCCEnabled) methods.push('Credit Card');
      if (row.isWalletCreditEnabled) methods.push('Wallet');
      if (row.isOtherPaymentEnabled) methods.push('Other');

      return (
        <span
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={methods.join(', ')}
        >
          {methods.length ? methods.join(', ') : '-'}
        </span>
      );
    },
  },
  {
    field: 'isEnabled',
    headerName: 'Status',
    flex: 0.6,
    minWidth: 120,
    headerAlign: 'center',
    align: 'center',
    renderCell: ({ value }) => (
      <span
        style={{
          color: value ? '#2e7d32' : '#d32f2f',
          fontWeight: 600,
          fontSize: 13,
          whiteSpace: 'nowrap',
        }}
      >
        {value ? 'Enabled' : 'Disabled'}
      </span>
    ),
  },
];



const handleUpdateCommission = async (payload) => {

  
  try {
    if (commission.length > 0) {
      await brandCommissionService.UpdateBrandCommission(payload);
    } else {
      await brandCommissionService.CreateBrandCommission(payload);
    }

    setOpenUpdate(false);
    getBrandCommission(selectedBrand.id);
  } catch (error) {
    console.error('Commission update failed', error);
  }
};


  return (
    <>
      {/* Header */}
      <Grid container mb={2} justifyContent="flex-end">
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Grid item xs="auto" minWidth={200}>
            <FormControl fullWidth>
              <InputLabel>Brand</InputLabel>
              <Select
                value={selectedBrand || ''}
                label="Brand"
                onChange={(e) => setselectedBrand(e.target.value)}
              >
                {brandsList.map((brand) => (
                  <MenuItem key={brand.id} value={brand}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs="auto">
            <Button
              size="small"
              disabled={user?.isAccessRevoked}
              variant="contained"
              sx={{ textTransform: 'capitalize' }}
              onClick={() => setOpenUpdate(true)}
            >
              Update Commission
            </Button>
          </Grid>
        </Box>
      </Grid>

      {/* Table */}
      <DataGridComponent
        rows={commission}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id}
        rowsPerPageOptions={[10]}
      />

      {/* Modal */}
      <UpdateCommissionDialog
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        onSubmit={handleUpdateCommission}
        commissionData={commission.length > 0 ? commission[0] : null} // edit if exists
        brandId={selectedBrand?.id}
      />

    </>
  );
};

export default CommissionSetup;
