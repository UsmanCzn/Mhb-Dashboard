import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Grid, Button, Switch,RadioGroup,FormControlLabel,Radio,FormControl,FormLabel } from "@mui/material/index";
import DropDown from 'components/dropdown'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CloudUploadOutlined } from '@ant-design/icons';
import { ServiceFactory } from "services/index";
import constants from "helper/constants";

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
              setGroups(res?.data?.result?.data?.data);
          })
          .catch((err) => {
              console.log(err?.data);
          });
  };

  useEffect(() => {
      getCountries();
      GetCustomersGroups();
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
          applicationLanguage: 'string',
          companyId: constants.COMPANY_ID,
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
              <Box sx={style}>
                  <Grid container spacing={4}>
                      <Grid item>
                          <Typography variant="h4">Update Customer</Typography>
                      </Grid>
                      <Grid item xs={12}>
                          <Grid container spacing={2}>
                              <Grid item xs={4}>
                                  <TextField
                                      id="outlined-basic"
                                      fullWidth
                                      label="First Name"
                                      variant="outlined"
                                      required
                                      value={data.name}
                                      onChange={(e) => setData({ ...data, name: e.target.value })}
                                  />
                              </Grid>
                              <Grid item xs={4}>
                                  <TextField
                                      id="outlined-basic"
                                      fullWidth
                                      label="Last Name"
                                      variant="outlined"
                                      required
                                      value={data.surname}
                                      onChange={(e) => setData({ ...data, surname: e.target.value })}
                                  />
                              </Grid>
                              <Grid item xs={4}>
                                  <TextField
                                      id="outlined-basic"
                                      fullWidth
                                      label="Email"
                                      type="email"
                                      variant="outlined"
                                      required
                                      value={data.displayEmailAddress}
                                      onChange={(e) => setData({ ...data, displayEmailAddress: e.target.value })}
                                  />
                              </Grid>
                          </Grid>
                      </Grid>
                      <Grid item xs={12}>
                          <Grid container spacing={2}>
                              <Grid item xs={4}>
                                  <RadioGroup
                                      aria-labelledby="demo-radio-buttons-group-label"
                                      defaultValue="male"
                                      name="radio-buttons-group"
                                      row
                                      value={data.gender}
                                      onChange={(e) => {
                                          setData({
                                              ...data,
                                              gender: e.target.value
                                          });
                                      }}
                                  >
                                      <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>

                                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                                  </RadioGroup>
                              </Grid>
                              <Grid item xs={4}>
                                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                                      <DatePicker
                                          label="Birthday"
                                          value={data.dateOfBirth}
                                          onChange={(newValue) => {
                                              setData({
                                                  ...data,
                                                  dateOfBirth: newValue
                                              });
                                          }}
                                          renderInput={(params) => <TextField fullWidth {...params} />}
                                      />
                                  </LocalizationProvider>
                              </Grid>
                              <Grid item xs={4}>
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

                      <Grid item xs={12}>
                          <Grid container spacing={2}>
                              <Grid item xs={4}>
                                  <DropDown
                                      title="Country"
                                      list={countries}
                                      data={data}
                                      setData={setData}
                                      keyo={'countryId'}
                                      type="country"
                                  />
                              </Grid>
                              <Grid item xs={4}>
                                  <TextField
                                      id="outlined-basic"
                                      fullWidth
                                      label="Phone"
                                      variant="outlined"
                                      required
                                      value={data.displayPhoneNumber}
                                      disabled
                                      onChange={(e) => setData({ ...data, displayPhoneNumber: e.target.value })}
                                  />
                              </Grid>
                              <Grid item xs={4}>
                                  <TextField id="outlined-basic" fullWidth label="Signup date" variant="outlined" disabled />
                              </Grid>
                          </Grid>
                      </Grid>

                      <Grid item xs={12}>
                          <Grid container spacing={2}>
                              {/* <Grid item xs={4}>
                <TextField id="outlined-basic" fullWidth label="Password" type="password" variant="outlined" required 
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                />
              </Grid> */}
                              <Grid item xs={4}>
                                  {/* <TextField id="outlined-basic" fullWidth label="Wallet Subtitle" variant="outlined" /> */}
                              </Grid>
                              <Grid item xs={4}>
                                  {/* <TextField id="outlined-basic" fullWidth label="Brand Email" variant="outlined" /> */}
                              </Grid>
                          </Grid>
                      </Grid>

                      {/* Footer */}

                      <Grid item xs={12}>
                          <Grid container>
                              <Grid item xs={8} />
                              <Grid container spacing={2} justifyContent="flex-end">
                                  <Grid item>
                                      <Button variant="outlined" onClick={() => setModalOpen(false)}>
                                          Cancel
                                      </Button>
                                  </Grid>
                                  <Grid item>
                                      <Button primay variant="contained" type="Submit">
                                          Update Customer
                                      </Button>
                                  </Grid>
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

