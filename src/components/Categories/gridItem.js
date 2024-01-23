import React from "react";
import { Chip, Grid, Typography, Box, MenuItem, Button } from '@mui/material';



const GridItem = ({
    item,
    brand, 
}) => {

  
    return (
        <Grid item xs={6} sm={4} md={3}
            sx={{
                height: 260, 
                my:2
            }}
        >

<Box sx={{
    width:'100%',
    height:"100%",
    // backgroundColor:"white",
    display:"flex",
    justifyContent:"center", 
    px:2
     

    
}}>
     <Box sx={{
         width:'100%',
         height:260,
         border: '1px solid lightGrey',
    backgroundColor:"white", 
    p:2,
    borderRadius:2 ,
    
     }}
     boxShadow={1}
     flexDirection="column"
     display="flex"
     >
         
          
            <Typography  variant="h5" style={{ fontSize: '16px' }}>
                {item?.name}
            </Typography>
           
            

     </Box>


</Box>

        </Grid>
    )
}

export default GridItem