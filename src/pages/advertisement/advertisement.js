import React, { useEffect, useState } from 'react';
import { Grid, Typography, Button, Box } from '@mui/material';
import AdvertisementTable from './advertisment-table';
import AdvertisementDialog from './advertisement-modal';

const Advertisement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAdvertisement, setSelectedAdvertisement] = useState(undefined);
  const [reload, setReload] = useState(false);

  const handleOpenDialog = () => {
    setSelectedAdvertisement(undefined);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setReload(true);
  };

  return (
    <>
      <Grid container spacing={2}>
        {/* Header */}
        <Grid item xs={12}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Grid item xs={12} sm="auto">
              <Typography fontSize={22} fontWeight={700}>
                Advertisement
              </Typography>
            </Grid>

            <Grid item xs={12} sm="auto">
              <Box
                display="flex"
                justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
              >
                <Button
                  size="small"
                  variant="contained"
                  sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
                  onClick={handleOpenDialog}
                >
                  Create New Advertisement
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* Table */}
    <Grid item xs={12}>
      <AdvertisementTable
        selectAdvertisement={setSelectedAdvertisement}
        setModalOpen={setOpenDialog}
        reload={reload}
        setreload={setReload}
      />
    </Grid>

        {/* Dialog */}
        <AdvertisementDialog
          open={openDialog}
          onClose={handleCloseDialog}
          advertisement={selectedAdvertisement?.row}
        />
      </Grid>
    </>
  );
};

export default Advertisement;
