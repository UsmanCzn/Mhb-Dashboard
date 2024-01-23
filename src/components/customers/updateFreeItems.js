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

const UpdateFreeItems = ({
  modalOpen,
  setModalOpen,
  setReload,
  prevData,
  brandName
}) => {

 
  const [data, setData] = useState({ 
    freeItems:0,
    punches:0,
    pointsEarned:0,  
    comments:"",  
  })
 
  const customerServices=ServiceFactory.get("customer")

  

  useEffect(
    ()=>{
      
      
    }
    ,[]
  )
  
  // useEffect(
  //   ()=>{ 
  //       setData({
  //         ...data,
  //         wallet:0,
  //         credit:0,
  //         comment:"", 
  //       })
  //   }
  //   ,[prevData]
  // )

  const updateCustomer=async (event)=>{

    event.preventDefault() 

    let payload={
      ...data,
      "id":prevData?.id,
      "companyId": constants.COMPANY_ID,
      "userName": prevData.phoneNumber,   
      "applicationLanguage": "en"
    }
 
    await customerServices.updateCustomerDetail(payload)

    .then((res)=>{
      console.log(res?.data);
    })
    .catch((err)=>{
      console.log(err);
    })
    .finally(()=>{
      setReload(prev=>!prev)
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
      <form onSubmit={updateCustomer}>
        
        <Box sx={style} >
        <Grid container spacing={4} >
          <Grid item>
            <Typography variant="h4">Update Request</Typography>
          </Grid>
          <Grid item xs={12}>
          <Typography variant="h6">Brand : {brandName} </Typography> 

    </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} >

              <Grid item xs={4}>
                <TextField id="outlined-basic" fullWidth label="Free Items" variant="outlined" 
                  value={data.freeItems}
                  onChange={(e) => setData({ ...data, freeItems: e.target.value })}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField id="outlined-basic" fullWidth label="Punches" variant="outlined" 
                  value={data.punches}
                  onChange={(e) => setData({ ...data, punches: e.target.value })}
                />
              </Grid>
              <Grid item xs={4}>
              <TextField id="outlined-basic" fullWidth label="Points Earned" variant="outlined" 
                  value={data.pointsEarned}
                  onChange={(e) => setData({ ...data, pointsEarned: e.target.value })}
                />
              </Grid>


            </Grid>
          </Grid>
    

          <Grid item xs={12}>
            <Grid container spacing={2} >
             
              <Grid item xs={12}>
                <TextField id="outlined-basic" fullWidth label="Comment" variant="outlined"  type="text" 
                  value={data.comment}
                  onChange={(e) => setData({ ...data, comment: e.target.value })}
                  multiline
                />
              </Grid>
             

            </Grid>
          </Grid>


          <Grid item xs={12}>
            <Grid container spacing={2} >
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
            <Grid container >

              <Grid item xs={8} />
              <Grid container spacing={2}

                justifyContent="flex-end"
              >

                <Grid item>
                  <Button variant="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
                </Grid>
                <Grid item>
                  <Button primay variant="contained" type="Submit" >Submit </Button>
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

export default UpdateFreeItems

