import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Grid, Button, Switch,RadioGroup,FormControlLabel,Radio,FormControl,FormLabel } from "@mui/material/index";
import DropDown from 'components/dropdown'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CloudUploadOutlined } from '@ant-design/icons';
import { ServiceFactory } from "services/index";
import constants from "helper/constants";
 import { useAuth } from 'providers/authProvider';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "70%", 
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
  overflow: 'scroll',

};

const UpdateCustomer = ({
  modalOpen,
  setModalOpen,
  setReload,
  prevData
}) => {

    const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: '85%', md: '70%' },
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: { xs: 2, sm: 4 },
  borderRadius: 2,
  overflowY: 'auto'
};


 const { user, userRole, isAuthenticated } = useAuth();
  const [data, setData] = useState({
      name: '',
      surname: '',
      displayEmailAddress: '',
      displayPhoneNumber: '',
      gender: '',
      dateOfBirth: new Date(),
      customerGroups: [],
      countryId: 202
  });

  const [countries, setCountries] = useState([]);
  const [groups, setGroups] = useState([]);
  const customerServices = ServiceFactory.get('customer');

  const getCountries = async () => {
      await customerServices
          .getCountries()
          .then((res) => {
              setCountries(res?.data?.result);
          })
          .catch((err) => {
              console.log(err?.data);
          });
  };
  const GetCustomersGroups = async () => {
      await customerServices
          .GetCustomersGroups()
          .then((res) => {
            console.log(res?.data?.result?.data?.data);
            
              setGroups(res?.data?.result?.data?.data);
          })
          .catch((err) => {
              console.log(err?.data);
          });
  };

  const GetCustomersGroupsForMaster = async (cid) => {
      await customerServices
          .GetCustomerGroupsMaster(cid)
          .then((res) => {
            console.log(userRole,"userRoleuserRoleuserRole");
            
              setGroups(res?.data?.result);
          })
          .catch((err) => {
              console.log(err?.data);
          });
  };

  useEffect(() => {
      getCountries();
    if(!(userRole && userRole==='ADMIN')){
      GetCustomersGroups();      

    }
  }, []);

  useEffect(() => {
      setData({
          ...data,
          name: prevData?.name,
          surname: prevData?.surname,
          displayEmailAddress: prevData?.displayEmailAddress,
          gender: prevData?.gender,
          dateOfBirth: prevData?.dateOfBirth,
          customerGroups: prevData?.customerGroups?.map((o) => o?.id),
          countryId: prevData?.countryId,
          displayPhoneNumber: prevData?.displayPhoneNumber
      });
      if(userRole&&userRole==='ADMIN'){
      GetCustomersGroupsForMaster(prevData?.companyId)
    }
  }, [prevData]);

  const updateCustomer = async (event) => {
      event.preventDefault();
      let payload = {
          id: prevData?.id,
          name: data.name,
          surname: data.surname,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          displayEmail: data.displayEmailAddress,
          displayPhone: data.displayPhoneNumber,
          countryId: data.countryId,
          applicationLanguage: '',
          companyId: prevData?.companyId,
          customerGroups: [...data.customerGroups]
      };

      await customerServices
          .updateCustomerDetail(payload)

          .then((res) => {
              console.log(res?.data);
          })
          .catch((err) => {
              console.log(err);
          })
          .finally(() => {
              setReload((prev) => !prev);
              setModalOpen(false);
          });
  };

return (
  <Modal
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <form onSubmit={updateCustomer}>
      <Box sx={modalStyle}>
        <Grid container spacing={{ xs: 2, sm: 4 }}>
          {/* Title */}
          <Grid item xs={12}>
            <Typography variant="h4">Update Customer</Typography>
          </Grid>

          {/* Name / Email */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="First Name"
                  required
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Last Name"
                  required
                  value={data.surname}
                  onChange={(e) => setData({ ...data, surname: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  required
                  disabled
                  value={data.displayEmailAddress}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Gender / Birthday / Groups */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  row
                  value={data.gender}
                  onChange={(e) =>
                    setData({ ...data, gender: e.target.value })
                  }
                >
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                </RadioGroup>
              </Grid>

              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Birthday"
                    value={data.dateOfBirth}
                    onChange={(newValue) =>
                      setData({ ...data, dateOfBirth: newValue })
                    }
                    renderInput={(params) => (
                      <TextField {...params} fullWidth size="small" />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={4}>
                <DropDown
                  title="Groups"
                  list={groups}
                  data={data}
                  setData={setData}
                  keyo="customerGroups"
                  type="groups"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Country / Phone / Signup */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <DropDown
                  title="Country"
                  list={countries}
                  data={data}
                  setData={setData}
                  keyo="countryId"
                  type="country"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Phone"
                  required
                  disabled
                  value={data.displayPhoneNumber}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Signup Date"
                  disabled
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Footer Actions */}
          <Grid item xs={12}>
            <Grid
              container
              justifyContent={{ xs: 'center', sm: 'flex-end' }}
              spacing={2}
            >
              <Grid item>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
              </Grid>

              <Grid item>
                <Button
                  size="small"
                  variant="contained"
                  type="submit"
                >
                  Update Customer
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </form>
  </Modal>
);

}

export default UpdateCustomer

