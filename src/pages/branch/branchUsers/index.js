import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import {
    Typography, Grid,Button
} from '@mui/material';

import { useLocation, useParams } from 'react-router-dom';
import { ServiceFactory } from 'services/index';
import { BackToList } from './components'; 
import { BranchUsers} from 'features';
import  NewScedule from 'components/branches/newScedule'; 

export default function Branchusers() {
 
   
    const branchServices = ServiceFactory.get("branch")
    const [branch, setBranch] = useState({}) 
    const [modalOpen, setModalOpen] = useState(false)
    const { bhid } = useParams();

 
    const getBranch=async()=>{

        await branchServices.getBranchById(bhid) 
          .then((res)=>{
              setBranch(res?.data?.result)  
          })
          .catch((err)=>{
              console.log(err.response);
          })
      }
  
    
      useEffect(
          ()=>{
              getBranch() 
          }
          ,[]
      )
  
  
    return (
        <>
            <Grid container spacing={4}>

                <Grid item xs={12}>

                    <Grid container alignItems="center" justifyContent="space-between">

                        <Grid item xs="auto">
                            <Typography variant="h6">Branch Users</Typography>
                        </Grid>
                        <Grid item xs={6} textAlign="end">
                            <BackToList />
                        </Grid>

                    </Grid>
                </Grid>

                <Grid item xs={12}>

                    <Grid container alignItems="center" justifyContent="space-between">

                        <Grid item xs="auto">
                        <Typography variant="h2">{branch?.name}</Typography>
                        </Grid>
                        <Grid item xs={6} textAlign="end">
                            <Button
                                size='small'
                                variant="contained"
                                sx={{ textDecoration: 'none' }}
                     onClick={()=>setModalOpen(true)}
                            >
                                Create new User
                            </Button>
                        </Grid>

                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <BranchUsers /> 
                </Grid>


            </Grid>
            
            <NewScedule modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </>
    );
}
