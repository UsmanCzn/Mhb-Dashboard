import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Grid, Button, Switch, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel } from "@mui/material/index";
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
const types = [
  {
    id: 1,
    name: "Stamps"
  },
  {
    id: 2,
    name: "Points"
  },
  {
    id: 3,
    name: "Cashback"
  }
]
const NewReward = ({
  modalOpen,
  setModalOpen,
  setReload,
  branchesList
}) => {


  const [data, setData] = useState({
    startDate: new Date(),
    endDate: new Date(),
    customerGroups: [],
    type: 1,
    location: []
  })



  const [groups, setGroups] = useState([])
  const customerServices = ServiceFactory.get("customer")



  useEffect(
    () => {

    }
    , []
  )

  return (
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <form  >

        <Box sx={style} >
          <Grid container spacing={4} >
            <Grid item>
              <Typography variant="h4">Create new Loyalty</Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2} >

                <Grid item xs={4}>
                  <DropDown title="Type"
                    list={types}
                    data={data}
                    setData={setData}
                    keyo={"type"}
                    type="normal"
                  />
                </Grid>
                <Grid item xs={4}>

                </Grid>
                <Grid item xs={4}>

                </Grid>


              </Grid>
            </Grid>

            {
              data?.type==1?
              <>
                <Grid item xs={12}>
              <Grid container spacing={2} >
                <Grid item xs={6} >

                  <TextField id="outlined-basic" fullWidth label="# of stamps to get a free item" variant="outlined" required
                    value={data.surname}
                    onChange={(e) => setData({ ...data, surname: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DropDown title="Locations"
                    list={branchesList}
                    data={data}
                    setData={setData}
                    keyo="location"
                    type="groups"
                  />

                </Grid>
                <Grid item xs={4}>

                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2} >
                <Grid item xs={4}>
                  <DropDown title="Groups"
                    list={groups}
                    data={data}
                    setData={setData}
                    keyo="customerGroups"
                    type="normal"
                  />
                </Grid>
                <Grid item xs={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start Date"
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
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="End Date"
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

              </Grid>
            </Grid>
              </>
              :
              data?.type==2?
              <>
              <Grid item xs={12}>
            <Grid container spacing={2} >
              <Grid item xs={6} >

                <TextField id="outlined-basic" fullWidth label="set amount of points per 1 KD" variant="outlined" required
                  value={data.surname}
                  onChange={(e) => setData({ ...data, surname: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <DropDown title="Locations"
                  list={branchesList}
                  data={data}
                  setData={setData}
                  keyo="customerGroups"
                  type="groups"
                />

              </Grid>
              <Grid item xs={4}>

              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2} >
              <Grid item xs={4}>
                <DropDown title="Groups"
                  list={groups}
                  data={data}
                  setData={setData}
                  keyo="customerGroups"
                  type="groups"
                />
              </Grid>
              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start Date"
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="End Date"
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

            </Grid>
          </Grid>
            </>
            :
            data?.type==3?
            <>
            <Grid item xs={12}>
          <Grid container spacing={2} >
            <Grid item xs={4} >

              <TextField id="outlined-basic" fullWidth label="Set amount of points per 1 KD" variant="outlined" required
                value={data.surname}
                onChange={(e) => setData({ ...data, surname: e.target.value })}
              />
            </Grid>
            <Grid item xs={4} >

<TextField id="outlined-basic" fullWidth label="Value of 1 point" variant="outlined" required
  value={data.surname}
  onChange={(e) => setData({ ...data, surname: e.target.value })}
/>
</Grid>
            <Grid item xs={4}>
              <DropDown title="Locations"
                list={branchesList}
                data={data}
                setData={setData}
                keyo="customerGroups"
                type="groups"
              />

            </Grid>
            <Grid item xs={4}>

            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2} >
            <Grid item xs={4}>
              <DropDown title="Groups"
                list={groups}
                data={data}
                setData={setData}
                keyo="customerGroups"
                type="groups"
              />
            </Grid>
            <Grid item xs={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
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

          </Grid>
        </Grid>
          </>
          :
          null
            }

           







            {/* Footer */}



            <Grid item xs={12}>
              <Grid container >

                <Grid item xs={8} />
                <Grid container spacing={2}

                  justifyContent="flex-end"
                >

                  <Grid item>
                    <Button variant="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
                  </Grid>
                  <Grid item>
                    <Button primay variant="contained" type="Submit" >Create new Loyalty</Button>
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

export default NewReward

