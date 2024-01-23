import React from "react";

import { Modal, Box, Typography, 
    TextField, Grid,Button,MenuItem,Select,FormControl,InputLabel
 } from "@mui/material/index"; 
 

const App=({
    title
})=>{
    const options = [
        'one', 'two', 'three'
      ];
      const [age, setAge] = React.useState('');

      const handleChange = (event) => {
        setAge(event.target.value);
      };
    return ( 
        <>
         {/* <Typography variant="h7">{title}</Typography>
                <Box sx={{
                  width:'100%',
                   display: 'flex',
                  justifyContent:'space-between',
                  flexDirection:'row',
                  alignItems:'center',
                  mt:2
                }}> */}
       <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{title}</InputLabel>
             <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Category"
          onChange={handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        </FormControl>
            {/* <Dropdown options={options}  value={options[0]} placeholder="Select an option" /> */}
                {/* </Box> */}
        </>
    )
}

export default App