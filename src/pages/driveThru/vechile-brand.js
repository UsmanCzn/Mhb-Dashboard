import { 
  Grid,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Avatar,
  Select,
  Menu,
  MenuItem,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions, } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent/index';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import React, { useState, useEffect } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import carService from 'services/carService';
import CreateVechileBrand from "./create-vehicle-brand"
import { useAuth } from 'providers/authProvider';


const VechileBrand = () => {
    const { user, userRole, isAuthenticated } = useAuth();

  const [reload, setReload] = useState(false);
  const { brandsList } = useFetchBrandsList(false);
  const [selectedBrand, setselectedBrand] = useState('');
  const [anchorEl, setAnchorEl] =  useState(null);
  const [Car, setCar] = useState([])
  const [selectedCarBrand, setselectedCarBrand] = useState()
  const open = Boolean(anchorEl);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleModalOpen = () => setDialogOpen(true);
  const handleDialogClose  = () => setDialogOpen(false);
  const handleSave = (payload="") => {
      // Handle the data sent from the dialog here
      setDialogOpen(false)
      getCarBrand()
      // Optionally, update your data grid or perform other actions
    };
  const deleteCarType = async () => {
      console.log(selectedCarBrand);
      const response = await carService.DeleteOffer(selectedCarBrand.carTypeId)
      if(response){
        getCarBrand()  
      }
  }
  const handleClick = (event,params) => {
  setselectedCarBrand(params?.row); 
  setAnchorEl(event.currentTarget);
  };

  const getCarBrand = async () => {
  setReload(true);
  try {
      const response = await  carService.getCarBrands(selectedBrand.id)
      setCar(response.data.result ?? []);
      setReload(false);

  } catch (error) {
      console.error("Error fetching car types:", error);
      throw error; 
  }
  };
  const columns = [
      {
          field: "imageUrl",
          headerName: "Image",
          headerAlign: "left", 
          renderCell: params =>getCarImage(params?.row)
      },
      {
          field: "carBrandName",
          headerName: "Name",
          headerAlign: "left",
          flex: 1, 
      },
      {
          field: "carBrandNativeName",
          headerName: "Native Name",
          headerAlign: "left", 
          flex: 1,
      },
      {
          field: "isRewardMfissisng",
          headerName: "Action",
          sortable: false,
          flex: 0.5,
          headerAlign: "left",
          
          renderCell: (params) => { 
                return <MoreVertIcon 
                    onClick={(event)=>handleClick(event,params)} />
              }
        },
      ];


  const options=[
      {
      name:"Edit",
      modal:true,  
      },
      // {
      // name:"Delete",
      // modal:true,  
      // }

  ];

  const handleClose = (data) => {  
      if(data.modal&&data?.name=="Edit"){
        console.log(selectedCarBrand);
        handleModalOpen(true)
      }
      else  if( data?.name=="Delete"){
        console.log("delete");
        deleteCarType()
      } 
      setAnchorEl(null);
    };

  useEffect(() => {
      // Check if brandsList has at least one item and selectedBrand is not set
      if (brandsList.length > 0) {
          const initialBrand = brandsList[0];
          setselectedBrand(initialBrand);
      }
  }, [brandsList]);

  useEffect(() => {
     if(selectedBrand){ 
      getCarBrand()
     }
  }, [selectedBrand])

  const getCarImage= (row) =>{
    return <Avatar alt="Remy Sharp" src={row.imageUrl ?? ""} />
  }
  
  return (
    <Grid container spacing={2}>
    <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={'auto'}>
                <Typography fontSize={22} fontWeight={700}>
                    Vechiles Brand
                </Typography>
            </Grid>
            
            <Grid item xs={'auto'} sx={{display:"flex",gap:"20px"}}>
                <Button
                    size="small"
                    variant="contained"
                    disabled={user?.isAccessRevoked}
                    sx={{ textTransform: 'capitalize' }}
                    onClick={() =>{ handleModalOpen (true); setselectedCarBrand("")}}
                >
                    Create New Vechiles Brand
                </Button>
                <FormControl>
                <InputLabel id="demo-simple-select-label">{'Brand'}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedBrand}
                    label={'Brand'}
                    onChange={(event) => {
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
        </Grid>
    </Grid>
    <Grid item xs={12}>
    <DataGridComponent
      rows={Car}
      columns={columns}
      loading={reload} 
      getRowId={(row)=>row.carBrandId}
      rowsPerPageOptions={[10]}
      totalRowCount={Car.length}
      fetchCallback={()=>{}} 
      pMode="client"
    />
     <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
         
          {
            options.map((row, index) => { 
                   return (
                       <MenuItem  disabled={user?.isAccessRevoked} key={index} onClick={()=> handleClose(row)} value={row.name}>{row.name}</MenuItem>
                   )
            }
            )
           }
        

      </Menu>
    </Grid>
    
    <CreateVechileBrand open={dialogOpen} onClose={handleDialogClose} onSave={handleSave} car={selectedCarBrand}/>

    </Grid>
  )
}

export default VechileBrand