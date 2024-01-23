import { Box, Button, IconButton, InputAdornment, OutlinedInput, Stack } from '@mui/material';
import React, { useMemo } from 'react';
import SearchIcon from "@mui/icons-material/Search"; 


export default function TablesControl({type}) {

  return (
    <Box sx={{
      display: 'flex'
    }}>

      <Box sx={{flex: 1}}/>

      <Stack direction={"row"} spacing={2}>
        
        <OutlinedInput
          type={'text'}
          size="small"
          placeholder='Search'
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                edge="end"
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
        />
{
  type=="filter"?
  null
  :
        <Button 
          size='small' 
          variant="contained" 
          sx={{textDecoration: 'none'}}
        >
          {`Add ${type}`}
        </Button>
        
}

      </Stack>

    </Box>
  );
}
