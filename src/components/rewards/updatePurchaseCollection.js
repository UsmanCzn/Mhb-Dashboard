import React, { useEffect, useState } from "react";
import { Grid, Typography, TextField, Button, Alert, Modal, Box } from '@mui/material';

import Counter from 'components/companies/counter';
import DropDown from 'components/dropdown';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { ServiceFactory } from "services/index";
import rewardService from "services/rewardService";
import { useSnackbar } from 'notistack';

const App = ({
  purchaseCollection,
  modal,
  setModal,
  setReload,
  selectedBrand
}) => {

  const customerService = ServiceFactory.get('customer');
  const branchService = ServiceFactory.get('branch');

  const [data, setData] = useState({
    amountPurchaseReward: 0,
    groupOfCustomers: 0,
    giftPrograms: [],
    startDate: "",
    endDate: ""
  });

  const { enqueueSnackbar } = useSnackbar();
  const [err, setErr] = useState('');
  const [reward, setReward] = useState({ amount: 0, name: "" });
  const [customerGroups, setCustomerGroups] = useState([]);

  const getCustomergroups = async () => {
    await customerService.GetCustomersGroups()
      .then((res) => {
        const filteredGroups =
          res?.data?.result?.data?.data.filter(
            (item) => item.brandId === selectedBrand.id
          );
        setCustomerGroups(filteredGroups);
      })
      .catch(() => {});
  };

  const editPurchaseCollection = async () => {
    let payload = { ...purchaseCollection };
    payload.amount = data.amountPurchaseReward;
    payload.brandGroupId = data.groupOfCustomers;
    payload.rewardProgramGifts = data.giftPrograms;
    payload.startDate = data.startDate;
    payload.endDate = data.endDate;

    await rewardService.editPurchasesCollectionProgram(payload)
      .then(() => {
        setModal(false);
        setReload(prev => !prev);
      })
      .catch((err) => {
        if (err?.response?.data?.error?.validationErrors?.length > 0) {
          enqueueSnackbar(
            err.response.data.error.validationErrors[0].message,
            { variant: 'error' }
          );
        } else {
          enqueueSnackbar(
            err?.response?.data?.error?.message,
            { variant: 'error' }
          );
        }
      });
  };

  useEffect(() => {
    getCustomergroups();
    setData({
      ...data,
      amountPurchaseReward: purchaseCollection?.amount,
      giftPrograms: purchaseCollection.rewardProgramGifts,
      groupOfCustomers: purchaseCollection.brandGroupId,
      startDate: purchaseCollection.startDate,
      endDate: purchaseCollection.endDate
    });
  }, [purchaseCollection]);

  return (
    <Modal open={modal} onClose={() => setModal(false)}>
      <Box sx={modalStyle}>
        {/* Header */}
        <Grid container spacing={{ xs: 2, sm: 4 }} mb={2}>
          <Grid item xs={12}>
            <Typography
              variant="h5"
              sx={{ fontSize: { xs: '1.1rem', sm: '1.4rem' } }}
            >
              Edit Stamps
            </Typography>
          </Grid>
        </Grid>

        {/* Customer Group */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>Group of customers</Typography>
            <DropDown
              title="Select the group of customers"
              list={customerGroups}
              data={data}
              setData={setData}
              keyo="groupOfCustomers"
              mt={2}
              type="customerGroup"
            />
          </Grid>
        </Grid>

        {/* Dates */}
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={data.startDate}
                onChange={(newValue) =>
                  setData({ ...data, startDate: newValue })
                }
                renderInput={(params) => (
                  <TextField {...params} fullWidth size="small" />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                value={data.endDate}
                onChange={(newValue) =>
                  setData({ ...data, endDate: newValue })
                }
                renderInput={(params) => (
                  <TextField {...params} fullWidth size="small" />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>

        {/* Counter */}
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={6}>
            <Counter
              title="Set amount of purchases to get reward"
              value="amountPurchaseReward"
              data={data}
              setData={setData}
            />
          </Grid>
        </Grid>

        {/* Actions */}
        <Grid
          container
          justifyContent={{ xs: 'center', sm: 'flex-end' }}
          mt={4}
        >
          <Button
            variant="contained"
            onClick={editPurchaseCollection}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Save
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
};

export default App;

/* ========================= */
/* Responsive Modal Styling */
/* ========================= */

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',

  width: {
    xs: '95%',
    sm: '85%',
    md: '70%'
  },

  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: { xs: 2, sm: 4 },
  borderRadius: 1,
  overflowY: 'auto'
};
