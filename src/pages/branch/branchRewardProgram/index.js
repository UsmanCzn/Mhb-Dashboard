import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import {
    Typography, Grid,Button
} from '@mui/material';

import { useLocation, useParams } from 'react-router-dom';
import { ServiceFactory } from 'services/index';
import { BackToList } from './components'; 
import RewardProgram from 'features/rewardProgram';
import  NewScedule from 'components/branches/newScedule'; 

export default function BranchRewardProgram() {

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
                            <Typography variant="h5">Branch Reward Program</Typography>
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
                           
                        </Grid>

                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Grid container alignItems="center">

                        <Grid item xs={1}>
                            <img alt= {branch?.name}
                                src= "https://images.unsplash.com/photo-1668571350460-3b7bf36b87e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                                style={{
                                    width:"100%", 
                                    aspectRatio:1,
                                    borderRadius:"50%"
                                }}
                            
                            />

                        </Grid>
                        <Grid item xs={1/2}/>

                        <Grid item xs={4}>
                        <Grid item xs={12}>   
                            <Typography variant="h5">Address:  </Typography> {branch?.branchAddress}
                </Grid>
                <Grid item xs={12}>   
                            <Typography variant="h5">Email: </Typography>  {branch?.emailAddress}
                </Grid>
                       </Grid>
                    </Grid>


                </Grid>
                

                <Grid item xs={12}>

                    <RewardProgram bhid={bhid} /> 
                </Grid>


            </Grid>
            
            <NewScedule modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </>
    );
}
