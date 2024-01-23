// Import necessary dependencies
import React, { useState } from 'react';
import { Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

// ConfirmationModal component
const EditStockModal = ({ open, onClose, onUpdateStock, selectedProduct }) => {
    const [Amount, setAmount] = useState(selectedProduct?.branchQty || 0);
    const [available, setavailable] = useState(selectedProduct?.isQtyAvailable);
    const isFormValid = () => {
        return Amount !== ''; // Add any other form validation as needed
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Typography sx={{ fontSize: 18 }} color="text.primary">
                    Edit Stock Information {selectedProduct?.name}
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ width: '650px' }}>
                <Box>
                    <Typography sx={{ fontSize: 14 }} color="text.primary">
                        Stock Amount
                    </Typography>
                    <TextField
                        id="outlined-basic"
                        fullWidth
                        variant="outlined"
                        required
                        type="number"
                        disabled={!available}
                        value={Amount}
                        onChange={(e) => {
                            setAmount(e.target.value);
                        }}
                    />
                </Box>
                <Box sx={{ margin: '10px 0 0 0' }}>
                    <FormControlLabel
                        control={
                            <Switch
                                onChange={(e) => {
                                    setavailable(e.target.checked);
                                    if (!e.target.checked) {
                                        setAmount(0);
                                    } else {
                                        setAmount(1000);
                                    }
                                }}
                                checked={available}
                            />
                        }
                        label="Make this product available"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    type="submit"
                    onClick={() => {
                        if (isFormValid()) {
                            onUpdateStock({ amount: Amount, availability: available });
                            setAmount(0);
                        }
                    }}
                    color="primary"
                    disabled={!isFormValid()}
                >
                    Update Stock
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditStockModal;
