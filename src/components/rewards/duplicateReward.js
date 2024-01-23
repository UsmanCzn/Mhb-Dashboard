

import React, { useEffect, useState } from "react";
import { Grid, Typography, TextField, Button,Alert,Modal,Box } from '@mui/material';

import Counter from 'components/companies/counter'
import DropDown from 'components/dropdown'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ServiceFactory } from "services/index";
import rewardService from "services/rewardService";
import { useSnackbar } from 'notistack';

const App = ({
    reward,
    modal,
    setModal,
    setReload, 
    branchesList
}) => {


  
    const [data, setData] = useState({
        rewardId:0,
        branchIds:[]
        
    })
    // const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [err,setErr]=useState('')
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    

    const [customerGroups,setCustomerGroups]=useState([])

  
    const duplicateReward=async ()=>{  
        await  rewardService.DuplicateReward(data) 
        .then((res)=>{ 
            console.log("customers groups Edit response", res?.data)
            setModal(false)
            setReload(prev=>!prev)
        })
        .catch((err)=>{
            console.log(err?.response?.data);
            enqueueSnackbar(err?.response?.data?.error?.message, {
                variant: 'error',
              });
        })
    }
   



    
    useEffect(()=>{

        setData({
            ...data,
            rewardId:reward?.id
        })
    },[reward])

      

   


    
    return (
        <Modal
        open={modal}  
        onClose={() => setModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
<Box sx={style} > 


<Grid container spacing={4} mb={2}>

<Grid item xs={12}>
<Typography required variant="h5">{  "Duplicate Reward" }</Typography>
                    </Grid>
                    </Grid>

        <Grid container spacing={4}>

          


        <Grid item xs={12} my={1}>

<Typography  variant="h7">Branches</Typography> 
<DropDown title="Select Branches"
        list={branchesList}
        data={data}
        setData={setData}
        keyo={"branchIds"}
        mt={2}
        type="groups"
        notRequired={true}
    />

</Grid>



            <Grid item xs={12}>
                <Grid container >

                    <Grid item xs={8} />
                    <Grid container spacing={2}

                        justifyContent="flex-end"
                    >

                        {/* <Grid item>
                            <Button variant="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
                        </Grid> */}
                        <Grid item>
                            <Button primay variant="contained" onClick={duplicateReward} >Save</Button>
                        </Grid>

                    </Grid>


                </Grid>

            </Grid>



        </Grid>



        </Box>

</Modal>
    )
}



export default App
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