import { Grid, Typography, InputLabel, FormControl, Select, MenuItem, Menu, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DataGridComponent from 'components/DataGridComponent';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import brandServices from 'services/brandServices';
import { useAuth } from 'providers/authProvider';
import TopupModal  from './add-edit-modal'
import walletTopupService from "services/walletTopupService";
import ConfirmationModal from 'components/confirmation-modal';

const WalletTopups = () => {
  const [reload, setReload] = useState(false);
  const [loading, setloading] = useState(false);
  const [openModal, setopenModal] = useState(false);
  const [topups, setTopups] = useState([]);
  const [selectedTopUps, setselectedTopUps] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const { brandsList } = useFetchBrandsList(reload);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [selectedBrand, setselectedBrand] = useState({});
  const { user, userRole, isAuthenticated } = useAuth();


      const handleCancelDelete = () => {
          setDeleteModalOpen(false);
      };

    useEffect(() => {
      if (brandsList[0]?.id) {
          setselectedBrand(brandsList[0]);
  
        } else {
        }
    }, [brandsList]);

      useEffect(() => {
        // Place your Get Top up calls here
        if(selectedBrand){
            getWalletTopups(selectedBrand)
        }
      }, [selectedBrand]);


        const columns = [ 
          {
              field: 'title',
              headerName: 'Title',
              flex: 1.2,
              headerAlign: 'left'
            },
            {
              field: 'topUpValue',
              headerName: 'Amount in Wallet',
              flex: 1.4,
              headerAlign: 'left',
            },
            {
              field: 'noOfDaysValidFor',
              headerName: 'Valid Days',
              flex: 1.4,
              headerAlign: 'left',
            },
            {
              field: 'creditValue',
              headerName: 'Credit',
              flex: 1.4,
              headerAlign: 'left',
            },
            {
              field: 'isRewardMfissisng',
              headerName: 'Action',
              sortable: false,
              flex: 0.5,
              headerAlign: 'left',
              
              renderCell: (params) => {
                return <MoreVertIcon onClick={(event) => handleClick(event, params)} />;
              }
            }
        ];

        const options = [
            {
                name: 'Edit',
                modal: true
            },
            {
                name: 'Delete',
                modal: true
            },
            ];


        const addNewTopups = () =>{
            setselectedTopUps(null);
            setopenModal(true);
            }
        
        const getWalletTopups = async(brand) =>{
        setloading(true)
        try{
            const res = await walletTopupService.getAllTopupWalletByBrand(brand?.id)
        if(res){
            console.log(res?.data.result);
            setTopups(res?.data.result)
            setloading(false)
        }}
        catch(err){
            setloading(false)
        }
        }


const onDelete = async () => {
  if (!selectedTopUps?.id) {
    console.warn("No selected topup to delete");
    return;
  }
  try {

    const res = await walletTopupService.DeleteWalletTopUp(selectedTopUps.id);
    setDeleteModalOpen(false);
    await getWalletTopups(selectedBrand);
  } catch (error) {
    console.error("Failed to delete topup:", error);
    enqueueSnackbar("Failed to delete. Please try again.", { variant: "error" });
  }
};



        const handleClick  = (event, param)=>{
        setselectedTopUps(param.row)
        setAnchorEl(event.currentTarget);
        }


        const handleClose = (data) => {
        if (data.modal && data?.name === 'Edit') {
            setopenModal(true)
           
        } else if (data?.name == 'Delete') {
            setDeleteModalOpen(true)
            // handleDeletelickOpen();
            // deletePointsCollection(pointCollection?.id);
        } 
        
        setAnchorEl(null);
        };





        const open = Boolean(anchorEl);
const onCloseModal = (shouldOpen = false) => {
  setopenModal(shouldOpen);
  if (selectedBrand?.id) {
    getWalletTopups(selectedBrand); // ensure brand is passed
  }
};




        return (
            <>
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={6}>
                    <Typography fontSize={22} fontWeight={700}>
                        Wallet Topups
                    </Typography>
                </Grid>
                <Box alignItems='center' sx={{display:'flex', gap:'10px'}}>
                    <Grid item xs="auto">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{'Brand'}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedBrand}
                                label={'Brand'}
                                onChange={(event) => {
                                    // getCampaings(event.target.value.id)
                                    setselectedBrand(event.target.value);
                                }}
                            >
                                {brandsList.map((row, index) => {
                                    return (
                                        <MenuItem key={index} value={row}>
                                            {row?.name}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={'auto'}>
                        <Button size="small" disabled={user?.isAccessRevoked} variant="contained" sx={{ textTransform: 'capitalize' }} onClick={() => addNewTopups()}>
                            Add Wallet Topups
                        </Button>
                    </Grid>
                </Box>
                <Grid container alignItems="center" justifyContent="space-between" my={2}>
                    <Grid item xs={6}></Grid>
                </Grid>
            </Grid>

            <Box my={2}>
                <DataGridComponent
                    columns={columns}
                    loading={loading}
                    rows={topups}
                    getRowId={(row) => row.id}
                    rowsPerPageOptions={[10]}
                    totalRowCount={topups.length}
                    fetchCallback={() => getWalletTopups}
                />
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button'
                    }}
                >
                    {options.map((row, index) => {
                        return (
                            <MenuItem disabled={user?.isAccessRevoked} key={index} onClick={() => handleClose(row)} value={row.name}>
                                {row.name}
                            </MenuItem>
                        );
                    })}
                </Menu>
            </Box>
        </Grid>
    </Grid>

    <TopupModal
        openModal={openModal}
        onCloseModal={onCloseModal}
        brandId={selectedBrand.id}
        Topup={selectedTopUps} // pass an object to edit
      />

                  <ConfirmationModal
                open={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={()=>onDelete()}
                statement={`Are you sure you want to Delete this? `}
            />
    </>
);

}
export default WalletTopups