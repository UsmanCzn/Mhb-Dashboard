import { Grid, Typography,Button,FormControl,InputLabel,MenuItem,Select } from '@mui/material'; 
import {  TableControl ,CustomersTable} from 'features';
import React, { useState,useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import NewCustomer from 'components/customers/newCustomer';
import RewardsTable from 'features/Rewards/index';
import RewardProgram from 'features/rewardProgram';
import NewReward from 'components/rewards/newReward';
import { useFetchBranchList } from 'features/BranchesTable/hooks/useFetchBranchesList';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';

export default function Rewards() {
    const { type } = useParams();

    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false)
    const [reload, setReload] = useState(false)
    const { branchesList} = useFetchBranchList(reload);

   
    const {brandsList}=useFetchBrandsList(reload) 

    const [selectedBrand,setselectedBrand]=useState({})
   
    useEffect(
        ()=>{   

            if(brandsList[0]?.id){  
            setselectedBrand(brandsList[0]) 

        }
        else{
            console.log("now goes to zero ","sb");
        }
        }
        ,[brandsList]
    )
  return (
    <Grid container spacing={2}>
 
        
        <Grid item xs={12}>

            <Grid container  alignItems="center" justifyContent="space-between">
                <Grid item xs={6}>
                    <Typography fontSize={22} fontWeight={700}>
                       Rewards
                    </Typography>
                </Grid>
                <Grid item xs={"auto"}>
                    
                   <Button size="small" variant="contained" 
                   sx={{ textTransform: 'capitalize' }}
                   onClick={
                    ()=>setModalOpen(true)
                   }
                   >
                                   Add New loyalty
                 </Button> 
   
                   </Grid>
                {/* <Grid item xs={6}>
                    <TableControl type="Customer"/>
                </Grid> */}
            </Grid>




        </Grid>
        <Grid item xs="auto">
                        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{"Brand"}</InputLabel>
             <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select" 
          value={selectedBrand}
          label={"Brand"} 
          onChange={(event)=>{ 
            setselectedBrand(event.target.value)
          }}
        >
            {
             brandsList.map((row, index) => {  
                    return (
                        <MenuItem value={row} >
                          { row?.name}
                          </MenuItem>
                    )
             }
             )
            }
           
        </Select>
        </FormControl>
                        </Grid>
        <Grid item xs={12}>
            {/* <RewardsTable  reload={reload}/> */}
            <RewardProgram  selectedBrand={selectedBrand} />
        </Grid>
        <NewReward modalOpen={modalOpen} setModalOpen={setModalOpen} setReload={setReload} branchesList={branchesList} />

    </Grid>
  );
}
