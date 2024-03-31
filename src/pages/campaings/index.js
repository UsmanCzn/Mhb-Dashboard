import { Grid, Typography, InputLabel, FormControl, Select, MenuItem, Menu, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DataGridComponent from 'components/DataGridComponent';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import brandServices from 'services/brandServices';


import CampaingModal from './campaing-modal'

const Campaings = () => {
  const [reload, setReload] = useState(false);
  const [loading, setloading] = useState(false);
  const [openModal, setopenModal] = useState(false)
  const [campaings, setCampaings] = useState([])
  const [selectedCampaings, setselectedCampaings] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null);
  const { brandsList } = useFetchBrandsList(reload);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [selectedBrand, setselectedBrand] = useState({});
  
  useEffect(() => {
    if (brandsList[0]?.id) {
        setselectedBrand(brandsList[0]);
        getCampaings(brandsList[0]?.id)

      } else {
      }
  }, [brandsList]);
  useEffect(() => {
    getCampaings(selectedBrand.id)
  }, [selectedBrand])
  
  

  const columns = [ 
    {
        field: 'brandEventName',
        headerName: 'Name',
        flex: 1.2,
        headerAlign: 'left'
      },
      {
        field: 'startDate',
        headerName: 'Start Date ',
        flex: 1.4,
        headerAlign: 'left',
      },
      {
        field: 'endDate',
        headerName: 'End Date ',
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
  
  const addNewCampaing = () =>{
    setselectedCampaings(null)

    setopenModal(true)
  }
  
  const getCampaings = async(id) =>{
    setloading(true)
    try{
    const res =await brandServices.getBrandEvents(id);
    if(res){
      setCampaings(res.data.result)
      setloading(false)

    }}
    catch(err){
      setloading(false)
    }
  }

  const handleClick  = (event, param)=>{
    setselectedCampaings(param.row)
    setAnchorEl(event.currentTarget);
  }
  
  const handleClose = (data) => {
    if (data.modal && data?.name === 'Edit') {
        setopenModal(true)

        
        // setNewModal(true);
    } else if (data?.name == 'Delete') {
        deleteCampaing()
        // handleDeletelickOpen();
        // deletePointsCollection(pointCollection?.id);
      } 
      
      setAnchorEl(null);
    };

  const deleteCampaing = async ()=>{
    try{
      const res = await brandServices.deleteBrandEvent(selectedCampaings.id)
      if(res){
        getCampaings(selectedBrand.id)
      }
    }catch(error){

    }
  }

const open = Boolean(anchorEl);
  const  onCloseModal = (state)=>{
        setopenModal(state)
        getCampaings(selectedBrand.id)
    }
return (
  <Grid container spacing={2}>
    <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={6}>
                <Typography fontSize={22} fontWeight={700}>
                    Campaings
                </Typography>
            </Grid>
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
                                setselectedBrand(event.target.value)
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

            <Grid container alignItems="center" justifyContent="space-between" my={2}>
                <Grid item xs={6}></Grid>
                <Grid item xs={'auto'}>
                    <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }} onClick={()=>addNewCampaing()}>
                        Add New Campaings
                    </Button>
                </Grid>
            </Grid>
        </Grid>

        <Box my={2}>
            <DataGridComponent
                columns={columns}
                loading={loading}
                rows={campaings}
                getRowId={(row) => row.id}
                rowsPerPageOptions={[10]}
                totalRowCount={campaings.length}
                fetchCallback={()=>getCampaings}
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
                        <MenuItem key={index} onClick={() => handleClose(row)} value={row.name}>
                            {row.name}
                        </MenuItem>
                    );
                })}
            </Menu>
        </Box>
    </Grid>
    <CampaingModal openModal={openModal} onCloseModal={onCloseModal}  campaing={selectedCampaings} brandId={selectedBrand.id}/>
    </Grid>
  )
}

export default Campaings