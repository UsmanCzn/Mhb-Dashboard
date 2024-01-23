import React, { useEffect } from "react";

import { Modal, Box, Typography,Stack, TextField, Grid,Button } from "@mui/material/index"; 
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
const App=({
    title,
    data,
    setData,
    value
})=>{


  const decr=()=>{
    if(data[value]>0)
    setData(prev=> {
      prev[value]--;
      return {...prev}
    })
  }

  const incr=()=>{ 
    setData(prev=> {
      prev[value]++;
      return {...prev}
    })
  }
    return ( 
        <Stack>
         <Typography variant="h7" 
         >{title}</Typography>
                <Box sx={{
                  width:'100%',
                   display: 'flex',
                  justifyContent:'space-between',
                  flexDirection:'row',
                  alignItems:'center',
                  mt:2
                }}>
              <RemoveCircleOutlineIcon onClick={decr} />
              <Typography variant="p">{data[value]}</Typography>
              <AddCircleOutlineIcon  onClick={incr}>+</AddCircleOutlineIcon>
                </Box>
        </Stack>
    )
}

export default App