import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Grid, Button, Switch } from "@mui/material/index";


import Counter from 'components/counter/counter'
import DropDown from 'components/dropdown'

import { ServiceFactory } from "services/index";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useParams } from 'react-router-dom';
 
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

const NewConstantCollection = ({
  modalOpen,
  setModalOpen,
  setReload,
  customerGroups,
  editData
}) => {


  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const brandService = ServiceFactory.get('brands')
  const branchService = ServiceFactory.get('branch')
  const generateDefaultExpirationDate = () => {
    var d = new Date()
    var year = d.getFullYear()
    var month = d.getMonth()
    var day = d.getDate()
    return new Date(year + 10, month, day)
  }
  const { bhid } = useParams();

  const [reward, setReward] = useState({
    amount: 0,
    name: ""
  })
  const addNewProgram = () => {

    if (reward.name == "") {
      enqueueSnackbar('Please add reward name', {
        variant: 'error',
      });
      return
    }
    setData({
      ...data,
      giftPrograms: [...data.giftPrograms, reward]
    })
    setReward({
      amount: 0,
      name: ""
    })
  }
  const removeProgram = (index) => {
    setData(
      prev => {
        prev.giftPrograms = prev.giftPrograms.filter((obj, ind) => ind != index)
        return { ...prev }
      }
    )
  }
  const [data, setData] = useState({
    groupOfCustomers: null,
    giftPrograms: [],
    discountPercentage: 100,
    limitPerMonth: 1000,
    limitPerYear: 1000,
    startDate: new Date(),
    endDate: generateDefaultExpirationDate()
  })

  useEffect(
    () => {
      
      if (editData != null) {
        setData({
          ...data,
          groupOfCustomers: editData.brandGroupId,
          giftPrograms: editData.rewardProgramGifts,
          discountPercentage: editData.discountPercentage,
          limitPerMonth: editData.limitPerMonth,
          limitPerYear: editData.limitPerYear,
          startDate: editData.startDate,
          endDate: editData.endDate,
        })
      }
    }
    , [editData]
  )
  const editConstantScedule = async (event) => {
    console.log("editing old");

    event.preventDefault()
    if (data.groupOfCustomers == null) {
      enqueueSnackbar('Please customer group', {
        variant: 'error',
      });
      return
    }
    if (data.giftPrograms.length < 1) {
      enqueueSnackbar('Please add atleast one reward program', {
        variant: 'error',
      });
      return
    }
    let payload = {
      "id": editData?.id,
      "branchId": bhid,
      "brandGroupId": data.groupOfCustomers,
      "startDate": data.startDate,
      "endDate": data.endDate,
      "discountPercentage": data.discountPercentage,
      "limitPerMonth": data.limitPerMonth,
      "limitPerYear": data.limitPerYear,
      "rewardProgramGifts": data.giftPrograms
    }
    await branchService.EditConstantDiscountProgram(payload)
      .then((res) => {
        console.log(res?.data);
      })
      .catch((err) => {
        console.log(err.response?.data);
      })
      .finally(() => {
        setReload(prev => !prev)
        setModalOpen(false)
      })
  }
  const createNewConstantScedule = async (event) => {
    event.preventDefault()
    console.log("creating neew");
    if (data.groupOfCustomers == null) {
      enqueueSnackbar('Please customer group', {
        variant: 'error',
      });
      return
    }
    if (data.giftPrograms.length < 1) {
      enqueueSnackbar('Please add atleast one reward program', {
        variant: 'error',
      });
      return
    }
    let payload = {
      "branchId": bhid,
      "brandGroupId": data.groupOfCustomers,
      "startDate": data.startDate,
      "endDate": data.endDate,
      "discountPercentage": data.discountPercentage,
      "limitPerMonth": data.limitPerMonth,
      "limitPerYear": data.limitPerYear,
      "rewardProgramGifts": data.giftPrograms
    }
    await branchService.CreateConstantDiscountProgram(payload)
      .then((res) => {
        console.log(res?.data);
      })
      .catch((err) => {
        console.log(err.response?.data);
      })
      .finally(() => {
        setReload(prev => !prev)
        setModalOpen(false)
      })
  }


  return (
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <form onSubmit={editData?.id ? editConstantScedule : createNewConstantScedule} >
        <Box sx={style} >
          <Grid item>
            <Typography variant="h4">Create new constant collection </Typography>
          </Grid>
          <Grid item xs={12} mt={2}>
            <Grid container spacing={2} >
              <Grid item xs={3}>
                <Typography
                  required variant="h6">Set a percentage of constant discount </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  required variant="h6">Max limit spent per month </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  required variant="h6">Max limit spent per year </Typography>
              </Grid>


            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} >
              <Grid item xs={3}>

                <Counter title=""
                  value="discountPercentage" data={data} setData={setData}
                />
              </Grid>
              <Grid item xs={3}>

                <Counter title=""
                  value="limitPerMonth" data={data} setData={setData}
                />
              </Grid>

              <Grid item xs={3}>

                <Counter title=""
                  value="limitPerYear" data={data} setData={setData}
                />
              </Grid>

            </Grid>
          </Grid>

          <Grid item xs={12} mt={3}>
            <Grid container spacing={2} >
              <Grid item xs={3}>
                <Typography
                  required variant="h6">Select the group of customers </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography
                  required variant="h6">Select Time period</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography
                  required variant="h6">Gift Programs</Typography>
              </Grid>


            </Grid>
          </Grid>

          <Grid item xs={12}>


            <Grid container spacing={2} mt={0} >
              <Grid item xs={3}  >

                <DropDown title="Select the group of customers"
                  list={customerGroups}
                  data={data}
                  setData={setData}
                  keyo={"groupOfCustomers"}
                  mt={1}
                  type="customerGroup"
                />

              </Grid>
              <Grid item xs={2} marginTop={1}  >
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  localeText={{ start: 'Check-in', end: 'Check-out' }}
                >
                  <DatePicker
                    label="From"
                    renderInput={(params) => <TextField {...params} />}
                    value={data.startDate}
                    onChange={(newValue) => {
                      setData({
                        ...data,
                        startDate: newValue
                      })
                    }}
                  />
                </LocalizationProvider>

              </Grid>
              <Grid item xs={2} marginTop={1}  >
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  localeText={{ start: 'Check-in', end: 'Check-out' }}
                >
                  <DatePicker
                    label="To"
                    renderInput={(params) => <TextField {...params} />}
                    value={data.endDate}
                    onChange={(newValue) => {
                      setData({
                        ...data,
                        endDate: newValue
                      })
                    }}
                  />
                </LocalizationProvider>

              </Grid>
              <Grid item xs={4}>

                <Typography
                  required variant="h7"> </Typography>
                <Grid container spacing={0} marginTop={1} >
                  <Grid item xs={2}>
                    <TextField id="outlined-basic" fullWidth variant="outlined"
                      value={reward.amount}
                      onChange={
                        (e) => {
                          setReward({
                            ...reward,
                            amount: e.target.value
                          })
                        }
                      } />
                  </Grid>
                  <Grid xs={0.4} />
                  <Grid item xs={6}>
                    <TextField id="outlined-basic" fullWidth label="Gift name" variant="outlined"
                      value={reward.name}
                      onChange={
                        (e) => {
                          setReward({
                            ...reward,
                            name: e.target.value
                          })
                        }
                      } />
                  </Grid>
                  <Grid xs={0.4} />

                  <AddCircleOutlineIcon onClick={addNewProgram} sx={{
                    marginTop: 1
                  }} />

                </Grid>
                {
                  data?.giftPrograms?.map((row, index) => {
                    return (
                      <Grid container spacing={0} mt={2} >

                        <Grid item xs={2}>
                          <TextField id="outlined-basic" fullWidth variant="outlined"
                            value={row.amount}
                            editable={false}

                          />
                        </Grid>
                        <Grid xs={0.4} />
                        <Grid item xs={6}>
                          <TextField id="outlined-basic" fullWidth label="Gift name" variant="outlined"
                            value={row.name}
                            editable={false}
                          />
                        </Grid>
                        <Grid xs={0.4} />

                        <RemoveCircleOutlineIcon onClick={() => removeProgram(index)} sx={{
                          marginTop: 1
                        }} />



                      </Grid>
                    )
                  })
                }
              </Grid>



              <Grid item xs={12} mt={8}>
                <Grid container >

                  <Grid item xs={8} />
                  <Grid container spacing={2}

                    justifyContent="flex-end"
                  >

                    <Grid item>
                      <Button variant="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
                    </Grid>
                    <Grid item>
                      <Button primay variant="contained" type="Submit" >{editData?.id ? "Save" : "Create constant collection"}</Button>
                    </Grid>

                  </Grid>


                </Grid>

              </Grid>

            </Grid>
          </Grid>
        </Box>
      </form>
    </Modal>

  )
}

export default NewConstantCollection

