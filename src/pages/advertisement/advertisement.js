import React, { useEffect, useState, } from 'react';

import { Grid, Typography, Button } from '@mui/material';
import AdvertisementTable from './advertisment-table';
import AdvertisementDialog from './advertisement-modal';

const Advertisement = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAdvertisement, setSelectedAdvertisement] = useState(undefined)
    const [reload, setReload] = useState(false)
    const handleOpenDialog = () => {
    setSelectedAdvertisement(undefined);
    setOpenDialog(true);
    };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReload(true)
  };
  return (
    <>
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={'auto'}>
                    <Typography fontSize={22} fontWeight={700}>
                    Advertisement
                    </Typography>
                </Grid>
                <Grid item xs={'auto'}>
                    <Button
                        size="small"
                        variant="contained"
                        sx={{ textTransform: 'capitalize' }}
                        onClick={() => handleOpenDialog()}
                    >
                        Create New Advertisement
                    </Button>
                </Grid>
            </Grid>
        </Grid>
        <AdvertisementTable selectAdvertisement={setSelectedAdvertisement} setModalOpen={setOpenDialog} reload={reload} setreload={setReload}/>
        <AdvertisementDialog open={openDialog} onClose={handleCloseDialog} advertisement={selectedAdvertisement?.row}/>
        </Grid>
        </>
  )
}

export default Advertisement