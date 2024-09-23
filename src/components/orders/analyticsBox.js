import React from "react";
import {  Box,Clickable  } from "@mui/material/index";


const App=({
    title,
    count,
    handleClick,
    filter,
    value
})=>{
    return (
        // <Clickable onClick={handleClick}>
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                bgcolor: 'background.paper',
                boxShadow: 1,
                borderRadius: 2,
                minWidth: '100%',
                height: 45,
                px: 2,
                alignItems: 'center',
                borderColor: value === filter ? 'green' : 'text.secondary',
                borderWidth: value === filter ? 2 : 0,
                borderStyle: 'solid',
                cursor: 'pointer' // Add cursor style to indicate clickability
            }}
            onClick={handleClick}
        >
            <Box sx={{ color: title == 'Accepted' ? 'green' : 'text.secondary' }}>{title}</Box>
            <Box sx={{ color: 'text.primary', fontSize: 14, fontWeight: 'medium', px: 2 }}>{count}</Box>
        </Box>
        // </Clickable>
    );
}

export default App