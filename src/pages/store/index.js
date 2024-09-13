import React, { useEffect, useState } from 'react';

// material-ui
import {
    Box, Tab, Typography, Grid,FormControl,InputLabel,MenuItem,Select
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import ProductType from "features/Store/ProductType" 
import Products from "features/Store/Products" 


import { ServiceFactory } from 'services/index';
import storeServices from 'services/storeServices';
import constants from 'helper/constants'; 
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import AddonsGroups from 'features/Store/AddonGroups';
import Addons from 'features/Store/Addons/index';

export default function Store() {
    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [reload,setReload]=useState(false)

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
        <>
            <Grid container spacing={2}>

                <Grid item xs={12}>

                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs="auto">
                            <Typography fontSize={22} fontWeight={700}>
                                Store
                            </Typography>
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
                    </Grid>
                </Grid>

                <Grid item xs={12}>

                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 0.3, borderColor: 'divider', marginTop: 0 }}>
                            <TabList onChange={handleChange}>
                                <Tab label="Type & Category" value="1" />
                                <Tab label="Product" value="2" />
                                <Tab label="Add-on Groups" value="3" />
                                <Tab label="Add-ons" value="4" /> 
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <ProductType  selectedBrand={selectedBrand}    />
                        </TabPanel>
                        <TabPanel value="2"> 
                        <Products selectedBrand={selectedBrand} />
                        </TabPanel>
                        <TabPanel value="3">
                        <AddonsGroups selectedBrand={selectedBrand} />
                        </TabPanel>
                        <TabPanel value="4">
                        <Addons selectedBrand={selectedBrand} />
                        </TabPanel>
                    </TabContext>

                </Grid>

            </Grid>
        </>
    );
}
