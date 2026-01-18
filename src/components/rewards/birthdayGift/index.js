import React, { useEffect, useState } from 'react';
import { Grid, Button } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import UpdateBirthdayGiftModal from './birthdayGiftModal';
import { useSnackbar } from 'notistack';
import brandServices from 'services/brandServices';

export default function BirthdayGift({ selectedBrand, setReload, user }) {
  const [birthdayGift, setBirthdayGift] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (selectedBrand) {
      const gift = {
        id: 'birthday-gift-row',
        birthDayGiftPoints: selectedBrand?.birthDayGiftPoints ?? 0,
        birthDayGiftItems: selectedBrand?.birthDayGiftItems ?? 0,
        birthDayGiftCredit: selectedBrand?.birthDayGiftCredit ?? 0,
        birthDayGiftRedemptionTypes: selectedBrand?.birthDayGiftRedemptionTypes ?? '',
        // <-- use a single canonical field name (number of days)
        birthDayGiftExpiryDays: selectedBrand?.birthDayGiftExpiryDays ?? 0,
        enableBirthDayGiftsForBrand: !!selectedBrand?.enableBirthDayGiftsForBrand,
      };

      setBirthdayGift([gift]);
      setSelectedGift(gift);
      
    }
  }, [selectedBrand]);

  const ORDER_TYPES = [
    { key: '0', label: 'Pickup' },
    { key: '5', label: 'Drive Thru' },
    { key: '1', label: 'Car Service' },
  ];
  const ORDER_MAP = ORDER_TYPES.reduce((m, o) => ((m[o.key] = o.label), m), {});

  const columns = [
    { field: 'birthDayGiftPoints', headerName: 'Points', headerAlign: 'left', flex: 0.6 },
    { field: 'birthDayGiftItems', headerName: 'Items', flex: 0.6, headerAlign: 'left' },
    { field: 'birthDayGiftCredit', headerName: 'Credit', flex: 0.6, headerAlign: 'left' },
    {
      field: 'birthDayGiftRedemptionTypes',
      headerName: 'Redemption Types',
      flex: 1.2,
      headerAlign: 'left',
      valueGetter: ({ row }) =>
        (row.birthDayGiftRedemptionTypes || '')
          .toString()
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((k) => ORDER_MAP[k] || k)
          .join(', '),
    },
    {
      field: 'birthDayGiftExpiryDays',
      headerName: 'Expiry (Days)',
      flex: 0.8,
      headerAlign: 'left',
      // optionally format to ensure we always display a number / fallback
      valueGetter: ({ row }) =>
        row.birthDayGiftExpiryDays !== undefined && row.birthDayGiftExpiryDays !== null
          ? String(row.birthDayGiftExpiryDays)
          : '0',
    },
    {
      field: 'enableBirthDayGiftsForBrand',
      headerName: 'Enabled',
      flex: 0.5,
      headerAlign: 'left',
      valueGetter: ({ row }) => (row.enableBirthDayGiftsForBrand ? 'Yes' : 'No'),
    },
  ];

  const getErrorMessage = (err) =>
    err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.';

  const handleSaved = async (payload) => {
    try {
      // normalize payload.expiryDate -> birthDayGiftExpiryDays (number)
      const expiryDays = Number(payload.expiryDate ?? payload.expiryDays ?? 0) || 0;

      const updated = {
        ...selectedBrand,
        birthDayGiftPoints: Number(payload.points) || 0,
        birthDayGiftItems: Number(payload.items) || 0,
        birthDayGiftCredit: Number(payload.credit) || 0,
        birthDayGiftRedemptionTypes: payload.redemptionTypes || '',
        // canonical field on brand
        birthDayGiftExpiryDays: expiryDays,
        enableBirthDayGiftsForBrand: !!payload.enableBirthDayGiftsForBrand,
      };



      await brandServices.UpdateBrand(updated);

      const gridRow = {
        id: 'birthday-gift-row',
        birthDayGiftPoints: updated.birthDayGiftPoints,
        birthDayGiftItems: updated.birthDayGiftItems,
        birthDayGiftCredit: updated.birthDayGiftCredit,
        birthDayGiftRedemptionTypes: updated.birthDayGiftRedemptionTypes,
        // keep the same canonical field name
        birthDayGiftExpiryDays: updated.birthDayGiftExpiryDays,
        enableBirthDayGiftsForBrand: updated.enableBirthDayGiftsForBrand,
      };

      setBirthdayGift([gridRow]);
      setSelectedGift(gridRow);
      setOpenUpdate(false);
      setReload?.((x) => !x);
      enqueueSnackbar('Birthday gift updated successfully.', { variant: 'success' });
    } catch (error) {
      console.error('Failed to update birthday gift:', error);
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  };

  return (
    <>
      <Grid container mb={2} justifyContent="flex-end">
        <Grid item xs="auto">
          <Button
            size="small"
            disabled={user?.isAccessRevoked}
            variant="contained"
            sx={{ textTransform: 'capitalize' }}
            onClick={() => setOpenUpdate(true)}
          >
            Update Birthday Gift
          </Button>
        </Grid>
      </Grid>

      <DataGridComponent
        rows={birthdayGift}
        columns={columns}
        loading={false}
        getRowId={(row) => row.id ?? 'birthday-gift-row'}
        rowsPerPageOptions={[10]}
      />

      <UpdateBirthdayGiftModal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        initialValues={{
          points: selectedGift?.birthDayGiftPoints ?? 0,
          credit: selectedGift?.birthDayGiftCredit ?? 0,
          items: selectedGift?.birthDayGiftItems ?? 0,
          // pass canonical expiry value to modal (string or number accepted)
          expiryDate: selectedGift?.birthDayGiftExpiryDays ?? '',
          redemptionTypes: selectedGift?.birthDayGiftRedemptionTypes ?? [],
          enableBirthDayGiftsForBrand: !!selectedGift?.enableBirthDayGiftsForBrand,
        }}
        onSave={handleSaved}
      />
    </>
  );
}
