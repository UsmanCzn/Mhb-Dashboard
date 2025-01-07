import React, { useState, useEffect } from 'react';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import { useParams } from 'react-router-dom';
import paymentServices from 'services/paymentServices';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const AddPaymentMethod = () => {
    const [branchZero, setBranchZero] = useState([
          {
              id: 0,
              name: 'All Branches'
          }
      ]);
  
      const { id } = useParams();
      const navigate = useNavigate();
      const gatewayOptions = [
          { title: 'Tap', value: 1 },
          { title: 'Ottu', value: 2 },
          { title: 'Tehseeel', value: 3 },
          { title: 'Square', value: 4 },
          { title: 'Checkout', value: 5 },
          { title: 'MyFatoorah', value: 6 },
          { title: 'Hesabi', value: 7 }
      ];
      const formik = useFormik({
          initialValues: {
              sandBoxKey: '',
              liveKey: '',
              sandBoxApiUrl: '',
              liveApiUrl: '',
              currencyCode: '',
              merchantId: '',
              paymentId: '',
              gateway: 1,
              paymentSystemName: ''
          },
          validationSchema: Yup.object({
              sandBoxKey: Yup.string().required('Sandbox Key is required'),
              liveKey: Yup.string().required('Live Key is required'),
              sandBoxApiUrl: Yup.string().required('Sandbox API URL is required'),
              liveApiUrl: Yup.string().required('Live API URL is required'),
              currencyCode: Yup.string().required('Currency Code is required'),
              merchantId: Yup.string().required('Merchant ID is required'),
              paymentId: Yup.string().required('Payment Type is required'),
              gateway: Yup.number().required('Gateway is required')
          }),
          onSubmit: (values) => {
              console.log('Form values:', values);
              SubmitForm(values);
          }
      });

      const PaymentsTypes = [
          { name: 'Wallet', id: 1, arabicName: 'محفظة' },
          { name: 'KNET', id: 2, arabicName: 'ك نت' },
          { name: 'VISA/MASTER CARD', id: 3, arabicName: 'بطاقة ائتمان' },
          { name: 'BENEFIT', id: 4, arabicName: 'بنفت' },
          { name: 'Mada', id: 5, arabicName: 'مادہ' },
          { name: 'Square', id: 6, arabicName: 'مربع' },
          { name: 'ApplePay', id: 7, arabicName: 'ApplePay' },
          { name: 'GooglePay', id: 8, arabicName: 'GooglePay' },
          { name: 'CASH', id: 9, arabicName: 'CASH' }
      ];
      const [reload, setReload] = useState(false);
      const { brandsList } = useFetchBrandsList(reload);
      const [selectedBranch, setselectedBranch] = useState({});
      const { enqueueSnackbar, closeSnackbar } = useSnackbar();
      useEffect(() => {
          if (brandsList[0]?.id) {
              setselectedBranch(brandsList[0]);
          }
          if (id) {
              getByid(id);
          }
      }, [brandsList]);

      const getByid = async (id) => {
          try {
              // Replace 'yourBrandId' with the actual brandId you want to pass
              const response = await paymentServices.GetPaymentById(id);
              const temp = { ...response.data.result };
              formik.setValues({
                  sandBoxKey: temp.sandBoxSecretKey,
                  liveKey: temp.liveSecretKey,
                  sandBoxApiUrl: temp.sandBoxServerDomain,
                  liveApiUrl: temp.liveServerDomain,
                  currencyCode: temp.apiCurrencyCode,
                  merchantId: temp.merchantId,
                  paymentId: temp.paymentSystemId,
                  gateway: temp.gatewayId,
                  paymentSystemName: temp.paymentSystemName // Assuming there's a `gatewayId` or default to 1
              });
              console.log(response, 'getByid');
          } catch (error) {
              console.error('Error fetching brand payments:', error);
          }
      };

      const SubmitForm = async (values) => {
          if (!id) {
              try {
                  const body = {
                      id: 0,
                      brandId: selectedBranch?.id,
                      paymentSystemName: values.paymentSystemName,
                      paymentSystemAr: values.paymentSystemName,
                      paymentSystemId: values.paymentId,
                      isUsedForTopUp: true,
                      isUsedForCheckOut: true,
                      livePublicKey: '',
                      liveSecretKey: values.liveKey,
                      sandBoxPubicKey: '',
                      sandBoxSecretKey: values.sandBoxKey,
                      merchantId: values.merchantId,
                      apiCurrencyCode: values.currencyCode,
                      code: values.currencyCode,
                      liveServerDomain: values.liveApiUrl,
                      sandBoxServerDomain: values.sandBoxApiUrl,
                      gatewayId: values.gateway
                  };
                  const response = await paymentServices.CreateNewPaymentMethods(body);
                  if (response) {
                      enqueueSnackbar('Action Performed Successfully', {
                          variant: 'success'
                      });
                      navigate('/payments-settings/methods');
                  }
              } catch (error) {
                  console.error('Error fetching brand payments:', error);
              }
          } else {
              const body = {
                  id: 0,
                  brandId: selectedBranch?.id,
                  paymentSystemName: values.paymentSystemName,
                  paymentSystemAr: values.paymentSystemName,
                  paymentSystemId: values.paymentId,
                  isUsedForTopUp: true,
                  isUsedForCheckOut: true,
                  livePublicKey: '',
                  liveSecretKey: values.liveKey,
                  sandBoxPubicKey: '',
                  sandBoxSecretKey: values.sandBoxKey,
                  merchantId: values.merchantId,
                  apiCurrencyCode: values.CurrencyCode,
                  code: values.currencyCode,
                  liveServerDomain: values.liveApiUrl,
                  sandBoxServerDomain: values.sandBoxApiUrl,
                  gatewayId: values.gateway
              };
              body.id = +id;
              const response = await paymentServices.UpdatePaymentMethods(body);
              if (response) {
                  enqueueSnackbar('Action Performed Successfully', {
                      variant: 'success'
                  });
                  navigate('/payments-settings/methods');
              }
          }
      };
  
      const card = (
          <>
              <form onSubmit={formik.handleSubmit}>
                  <CardContent>
                      <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                          Configure Payment Gateway
                      </Typography>
                      <Grid container spacing={2}>
                          <Grid item xs={6}>
                              <Typography sx={{ fontSize: 14 }} color="text.primary">
                                  Sandbox Key
                              </Typography>
                              <TextField
                                  id="sandBoxKey"
                                  name="sandBoxKey"
                                  fullWidth
                                  variant="outlined"
                                  value={formik.values.sandBoxKey}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={formik.touched.sandBoxKey && Boolean(formik.errors.sandBoxKey)}
                                  helperText={formik.touched.sandBoxKey && formik.errors.sandBoxKey}
                              />
                          </Grid>
                          <Grid item xs={6}>
                              <Typography sx={{ fontSize: 14 }} color="text.primary">
                                  Live Key
                              </Typography>
                              <TextField
                                  id="liveKey"
                                  name="liveKey"
                                  fullWidth
                                  variant="outlined"
                                  value={formik.values.liveKey}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={formik.touched.liveKey && Boolean(formik.errors.liveKey)}
                                  helperText={formik.touched.liveKey && formik.errors.liveKey}
                              />
                          </Grid>
                          <Grid item xs={6}>
                              <Typography sx={{ fontSize: 14 }} color="text.primary">
                                  Sandbox API URL
                              </Typography>
                              <TextField
                                  id="sandBoxApiUrl"
                                  name="sandBoxApiUrl"
                                  fullWidth
                                  variant="outlined"
                                  value={formik.values.sandBoxApiUrl}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={formik.touched.sandBoxApiUrl && Boolean(formik.errors.sandBoxApiUrl)}
                                  helperText={formik.touched.sandBoxApiUrl && formik.errors.sandBoxApiUrl}
                              />
                          </Grid>
                          <Grid item xs={6}>
                              <Typography sx={{ fontSize: 14 }} color="text.primary">
                                  Live API URL
                              </Typography>
                              <TextField
                                  id="liveApiUrl"
                                  name="liveApiUrl"
                                  fullWidth
                                  variant="outlined"
                                  value={formik.values.liveApiUrl}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={formik.touched.liveApiUrl && Boolean(formik.errors.liveApiUrl)}
                                  helperText={formik.touched.liveApiUrl && formik.errors.liveApiUrl}
                              />
                          </Grid>
                          <Grid item xs={6}>
                              <Typography sx={{ fontSize: 14 }} color="text.primary">
                                  Currency Code
                              </Typography>
                              <TextField
                                  id="currencyCode"
                                  name="currencyCode"
                                  fullWidth
                                  variant="outlined"
                                  value={formik.values.currencyCode}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={formik.touched.currencyCode && Boolean(formik.errors.currencyCode)}
                                  helperText={formik.touched.currencyCode && formik.errors.currencyCode}
                              />
                          </Grid>
                          <Grid item xs={6}>
                              <Typography sx={{ fontSize: 14 }} color="text.primary">
                                  Merchant ID
                              </Typography>
                              <TextField
                                  id="merchantId"
                                  name="merchantId"
                                  fullWidth
                                  variant="outlined"
                                  value={formik.values.merchantId}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={formik.touched.merchantId && Boolean(formik.errors.merchantId)}
                                  helperText={formik.touched.merchantId && formik.errors.merchantId}
                              />
                          </Grid>
                          <Grid item xs={6}>
                              <FormControl fullWidth error={formik.touched.paymentId && Boolean(formik.errors.paymentId)}>
                                  <Typography sx={{ fontSize: 14 }} color="text.primary">
                                      Payments
                                  </Typography>
                                  <Select
                                      id="paymentId"
                                      name="paymentId"
                                      value={formik.values.paymentId}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                  >
                                      {PaymentsTypes.map((row, index) => (
                                          <MenuItem key={index} value={row.id}>
                                              {row?.name}
                                          </MenuItem>
                                      ))}
                                  </Select>
                                  {formik.touched.paymentId && formik.errors.paymentId && (
                                      <Typography color="error" variant="body2">
                                          {formik.errors.paymentId}
                                      </Typography>
                                  )}
                              </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                              <FormControl fullWidth error={formik.touched.gateway && Boolean(formik.errors.gateway)}>
                                  <Typography sx={{ fontSize: 14 }} color="text.primary">
                                      Gateway
                                  </Typography>
                                  <Select
                                      id="gateway"
                                      name="gateway"
                                      value={formik.values.gateway}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                  >
                                      {gatewayOptions.map((option) => (
                                          <MenuItem key={option.value} value={option.value}>
                                              {option.title}
                                          </MenuItem>
                                      ))}
                                  </Select>
                                  {formik.touched.gateway && formik.errors.gateway && (
                                      <Typography color="error" variant="body2">
                                          {formik.errors.gateway}
                                      </Typography>
                                  )}
                              </FormControl>
                          </Grid>
                      </Grid>
                  </CardContent>
                  <CardActions style={{ justifyContent: 'flex-end' }}>
                      <Button type="submit" size="small" variant="contained">
                          {id ? 'Update' : 'Save'}
                      </Button>
                  </CardActions>
              </form>
          </>
      );
  
      return (
          <Grid container spacing={2}>
              <Grid item xs={12}>
                  <Grid container alignItems="center" justifyContent="space-between">
                      <Grid item xs="auto">
                          <Typography fontSize={22} fontWeight={700}>
                              Payment Provider
                          </Typography>
                      </Grid>
  
                      <Grid item xs="auto">
                          <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">{'Brand'}</InputLabel>
                              <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={selectedBranch}
                                  label={'Branch'}
                                  onChange={(event) => {
                                      setselectedBranch(event.target.value);
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
                  </Grid>
  
                  <Grid item xs={12} style={{ margin: '10px 0 0 0' }} alignItems="center" justifyContent="space-between">
                      <Card variant="outlined">{card}</Card>
                  </Grid>
              </Grid>
          </Grid>
      );
  };

export default AddPaymentMethod;
