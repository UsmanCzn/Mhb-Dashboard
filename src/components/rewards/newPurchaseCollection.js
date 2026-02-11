import React, { useEffect, useState } from "react";
import { Grid, Typography, TextField, Button, Alert, Modal, Box } from '@mui/material';

import Counter from 'components/companies/counter';
import DropDown from 'components/dropdown';

import { ServiceFactory } from "services/index";
import rewardService from "services/rewardService";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { useSnackbar } from 'notistack';

const App = ({
  purchaseCollection,
  modal,
  setModal,
  setReload,
  branchesList,
  selectedBrand
}) => {

  const getNextYearDate = () => {
    const aYearFromNow = new Date();
    aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
    return aYearFromNow;
  };

  const customerService = ServiceFactory.get('customer');

  const [data, setData] = useState({
    amountPurchaseReward: 0,
    groupOfCustomers: 0,
    giftPrograms: [],
    branchIds: [],
    startDate: new Date(),
    endDate: getNextYearDate()
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

  const createPurchaseCollection = async () => {
    let payload = { ...data };
    payload.amount = data.amountPurchaseReward;
    payload.brandGroupId = data.groupOfCustomers;
    payload.rewardProgramGifts = data.giftPrograms;

    await rewardService.createPurchasesCollectionProgram(payload)
      .then(() => {
        setReload(prev => !prev);
        setModal(false);
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
  }, [selectedBrand]);

  return (
    <Modal
      open={modal}
      onClose={() => setModal(false)}
    >
      <Box sx={modalStyle}>
        <Grid container spacing={{ xs: 2, sm: 4 }} mb={2}>
          <Grid item xs={12}>
            <Typography
              variant="h5"
              sx={{ fontSize: { xs: '1.1rem', sm: '1.4rem' } }}
            >
              Add New Stamps
            </Typography>
          </Grid>
        </Grid>

        {/* Dropdowns */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography>Stores</Typography>
            <DropDown
              title="Select Stores"
              list={branchesList}
              data={data}
              setData={setData}
              keyo="branchIds"
              mt={2}
              type="groups"
              notRequired
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography>Customers Groups & Tiers</Typography>
            <DropDown
              title="Select the group of customers & Tiers"
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
        <Grid container justifyContent={{ xs: 'center', sm: 'flex-end' }} mt={4}>
          <Button
            variant="contained"
            onClick={createPurchaseCollection}
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

/* ===================== */
/* Responsive Modal Style */
/* ===================== */

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
