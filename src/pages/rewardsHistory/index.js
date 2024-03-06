import { Grid, Typography,Button,TextField } from '@mui/material'; 
import {  TableControl ,CustomersTable} from 'features';
    import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import NewCustomer from 'components/customers/newCustomer';
import RewardsTable from 'features/Rewards/index';
import RewardsHistoryTable from 'features/RewardsHistoryTable/index';

export default function RewardsHistory() {
    const { type } = useParams();

    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false)
    const [reload, setReload] = useState(false)
    const [search, setSearch] = useState("")


   

  return (
    <Grid container spacing={2}>
 
        
    <Grid item xs={12}>

    <Grid container  alignItems="center" justifyContent="space-between">
        <Grid item xs={6}>
            <Typography fontSize={22} fontWeight={700}>
                Rewards History
            </Typography>
        </Grid>
        <Grid item xs={"auto"}>
            
            {/* <Button size="small" variant="contained" 
            sx={{ textTransform: 'capitalize' }} >
                            Add New loyalty
            </Button>  */}

            </Grid>
        {/* <Grid item xs={6}>
            <TableControl type="Customer"/>
        </Grid> */}
    </Grid>

    </Grid>
    <Grid item xs={12}>
    <TextField
      id="search"
      label="Search Users"
      variant="outlined"
      placeholder="Search Here..."
      onChange={(event)=>{
        setSearch(event.target.value)
      }}
    />
        {/* <TableControl  type="filter"/> */}
    </Grid>
    <Grid item xs={12}>
        <RewardsHistoryTable  reload={reload} search={search}/>
    </Grid>
    <NewCustomer modalOpen={modalOpen} setModalOpen={setModalOpen} setReload={setReload}  />
    </Grid>
  );
}
