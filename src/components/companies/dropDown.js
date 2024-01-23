import React from 'react';

import { Modal, Box, Typography, TextField, Grid, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material/index';
import { setDefaultLocale } from 'react-datepicker';

const App = ({ title, setData, data }) => {
    const handleChange = (event) => {
        setData((prev) => {
            prev['CategoryName'] = event.target.value;
            return { ...prev };
        });
    };
    return (
        <>
            <Typography variant="h7">{title}</Typography>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    mt: 2
                }}
            >
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={data.CategoryName}
                        label="Category"
                        required
                        onChange={handleChange}
                    >
                        <MenuItem value="Cafe">Cafe</MenuItem>
                        <MenuItem value="Restaurant">Restaurant</MenuItem>
                    </Select>
                </FormControl>
                {/* <Dropdown options={options}  value={options[0]} placeholder="Select an option" /> */}
            </Box>
        </>
    );
};

export default App;
