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

const NewCategory = ({
  modalOpen,
  setModalOpen,
  setReload,
  selectedBrand
}) => {

 
  const [data, setData] = useState({  
    name:"",
    nativeName:"",
    category:""
  })
 
  const customerServices=ServiceFactory.get("customer")
 const [types,setTypes]=useState([])

  
  const createNewType=async (event)=>{

    event.preventDefault()
    // console.log(data,"data");

    // let payload={
    //   ...data,
    //   "companyId": constants.COMPANY_ID,
    //   "userName": data.phoneNumber,   
    //   "applicationLanguage": "en"
    // }

    // console.log(payload,"payload");
    // await customerServices.createNewCustomer(payload)

    // .then((res)=>{
    //   console.log(res?.data);
    // })
    // .catch((err)=>{
    //   console.log(err);
    // })
    // .finally(()=>{
    //   setReload(prev=>!prev)
    //   setModalOpen(false)
    // })

  }

 

  return (
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <form onSubmit={createNewType}>
        
        <Box sx={style} >
        <Grid container spacing={4} >
          <Grid item>
            <Typography variant="h4">Create new Category</Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} >
            <Grid item xs={4}>
                <DropDown title="productType"
                  list={types}
                  data={data}
                  setData={setData}
                  keyo={"productType"}
                  type="productType"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField id="outlined-basic" fullWidth label="Category Name" variant="outlined" required
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField id="outlined-basic" fullWidth label="Category Native Name" variant="outlined" required
                  value={data.nativeName}
                  onChange={(e) => setData({ ...data, nativeName: e.target.value })}
                />
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
                  <Button primay variant="contained" type="Submit" >Create new Category</Button>
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

export default NewCategory

