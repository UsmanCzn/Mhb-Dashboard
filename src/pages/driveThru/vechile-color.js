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
  import CreateVehicleColor from "./create-vehicle-color";

const VechileColor = () => {
    const [reload, setReload] = useState(false);
    const { brandsList } = useFetchBrandsList(false);
    const [selectedBrand, setselectedBrand] = useState('');
    const [anchorEl, setAnchorEl] =  useState(null);
    const [Car, setCar] = useState([])
    const [selectedCarColor, setselectedCarBrand] = useState()
    const open = Boolean(anchorEl);
    const [dialogOpen, setDialogOpen] = useState(false);
  
    const handleModalOpen = () => setDialogOpen(true);
    const handleDialogClose  = () => setDialogOpen(false);
    const handleSave = (payload="") => {
        // Handle the data sent from the dialog here
        setDialogOpen(false)
        getCarColor()
        // Optionally, update your data grid or perform other actions
      };
    const deleteCarType = async () => {
        console.log(selectedCarColor);
        const response = await carService.DeleteOffer(selectedCarColor.carTypeId)
        if(response){
          getCarColor()  
        }
    }
    const handleClick = (event,params) => {
    setselectedCarBrand(params?.row); 
    setAnchorEl(event.currentTarget);
    };
  
    const getCarColor = async () => {
    setReload(true);
    try {
        const response = await  carService.getCarColors(selectedBrand.id)
        setCar(response.data.result ?? []);
        setReload(false);
  
    } catch (error) {
        console.error("Error fetching car types:", error);
        throw error; 
    }
    };
    const columns = [
        {
            field: "hexColor",
            headerName: "Color",
            headerAlign: "left", 
            renderCell: params =>getColor(params?.row)
        },
        {
            field: "carColorName",
            headerName: "Name",
            headerAlign: "left",
            flex: 1, 
        },
        // {
        //     field: "carColorNativeName",
        //     headerName: "Native Name",
        //     headerAlign: "left", 
        //     flex: 1,
        // },
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
          console.log(selectedCarColor);
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
        getCarColor()
       }
    }, [selectedBrand])
  
    const getColor= (row) =>{
      return <div style={{
        height: '40px',
        width: '40px',
        borderRadius: '50%',
        backgroundColor: row?.hexColor || 'transparent' // Optional: Just to visualize the div
      }}></div>
    }
    
  return (
    <Grid container spacing={2}>
    <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={'auto'}>
                <Typography fontSize={22} fontWeight={700}>
                    Vechiles Color
                </Typography>
            </Grid>
            
            <Grid item xs={'auto'} sx={{display:"flex",gap:"20px"}}>
                <Button
                    size="small"
                    variant="contained"
                    sx={{ textTransform: 'capitalize' }}
                    onClick={() =>{ handleModalOpen (true); setselectedCarBrand("")}}
                >
                    Create New Vechiles Color
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
      getRowId={(row)=>row.carColorId}
      rowsPerPageOptions={[10]}
      totalRowCount={0}
      fetchCallback={()=>{}} 
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
                       <MenuItem key={index} onClick={()=> handleClose(row)} value={row.name}>{row.name}</MenuItem>
                   )
            }
            )
           }
        

      </Menu>
    </Grid>
    
    <CreateVehicleColor open={dialogOpen} onClose={handleDialogClose} onSave={handleSave} car={selectedCarColor}/>

    </Grid>
  )
}

export default VechileColor