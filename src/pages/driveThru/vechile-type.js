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
import CreateVehicle from './create-vehicle-type';
import { useAuth } from 'providers/authProvider';


const VechileType = () => {
    const { user, userRole, isAuthenticated } = useAuth();

    const [reload, setReload] = useState(false);
    const { brandsList } = useFetchBrandsList(false);
    const [selectedBrand, setselectedBrand] = useState('');
    const [anchorEl, setAnchorEl] =  useState(null);
    const [Car, setCar] = useState([])
    const [selectedCarType, setselectedCarType] = useState()
    const open = Boolean(anchorEl);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleModalOpen = () => setDialogOpen(true);
    const handleDialogClose  = () => setDialogOpen(false);
    const handleSave = (payload="") => {
        // Handle the data sent from the dialog here
        setDialogOpen(false)
        getCarType()
        // Optionally, update your data grid or perform other actions
      };
    const deleteCarType = async () => {
        console.log(selectedCarType);
        const response = await carService.DeleteOffer(selectedCarType.carTypeId)
        if(response){
            getCarType()  
        }
    }
    const handleClick = (event,params) => {
    setselectedCarType(params?.row); 
    setAnchorEl(event.currentTarget);
    };

    const getCarType = async () => {
    setReload(true);
    try {
        const response = await  carService.getCarType(selectedBrand.id)
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
            field: "carTypeName",
            headerName: "Car Type Name",
            headerAlign: "left",
            flex: 1, 
        },
        {
            field: "carTypeNativeName",
            headerName: "Car TypeNative Name",
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
          console.log(selectedCarType);
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
        getCarType()
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
                    Vechiles Type
                </Typography>
            </Grid>
            
            <Grid item xs={'auto'} sx={{display:"flex",gap:"20px"}}>
                <Button
                    size="small"
                    variant="contained"
                    disabled={user?.isAccessRevoked}
                    sx={{ textTransform: 'capitalize' }}
                    onClick={() =>{ handleModalOpen (true); setselectedCarType("")}}
                >
                    Create New Vechiles
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
      getRowId={(row)=>row.carTypeId}
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
                       <MenuItem disabled={user?.isAccessRevoked} key={index} onClick={()=> handleClose(row)} value={row.name}>{row.name}</MenuItem>
                   )
            }
            )
           }
        

      </Menu>
    </Grid>
    
    <CreateVehicle open={dialogOpen} onClose={handleDialogClose} onSave={handleSave} car={selectedCarType}/>

    </Grid>
  )
}

export default VechileType