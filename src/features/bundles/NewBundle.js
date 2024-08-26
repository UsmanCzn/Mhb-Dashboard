import React, { useEffect, useState } from 'react';
import { Grid, Typography, TextField, Button, Alert, Modal, Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material';

import Counter from 'components/companies/counter';
import FormControl from '@mui/material/FormControl';
import DropDown from 'components/dropdown';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import MenuItem from '@mui/material/MenuItem';
import { CloudUploadOutlined } from '@ant-design/icons';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ServiceFactory } from 'services/index';
import rewardService from 'services/rewardService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Select from '@mui/material/Select';
import { useSnackbar } from 'notistack';
import tiersService from 'services/tiersService';
import { useFetchProductTypeList } from 'features/Store/ProductType/hooks/useFetchProductTypeList';
import { useFetchProductsList } from 'features/Store/Products/hooks/useFetchProductsList';
import fileService from 'services/fileService';

const NewBundle = ({ modal, setModal, setReload, selectedBrand, editItem,isEditing   }) => {
    const customerService = ServiceFactory.get('customer');


    const getNextYearDate = () => {
        const aYearFromNow = new Date();
        aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
        return aYearFromNow
    }
    const [p1, setP1] = useState(null);

    const [data, setData] = useState({
        brandId: selectedBrand?.id,
        bundleImageUrl:null,
        bundleName: '', 
        price: 0,
         validityDays: 0,
  quantity: 0,
  discountUpTo: 0,
  startDate: new Date(),
  endDate: getNextYearDate(),
        bundleItems:[]
    });
    const { productTypes } = useFetchProductTypeList(true, selectedBrand);
    const { productsList } = useFetchProductsList(true, selectedBrand);

    const [groupValue, setGroupValue] = useState(null);
    const [productValue, setProductValue] = useState(null);
    
     

    const handleChange = (event) => {
        setGroupValue(event.target.value);
    };
    const handleProductChange = (event) => {
        setProductValue(event.target.value);
    };

    const [selectedValues, setSelectedValues] = useState([]);

    // Function to handle checkbox changes
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        if (checked) {
            setSelectedValues((prevValues) => [...prevValues, name]);
        } else {
            setSelectedValues((prevValues) => prevValues.filter((value) => value !== name));
        }
    };

    // Function to get the comma-separated string of selected values
    const getSelectedValuesString = () => {
        return selectedValues.join(', ');
    };
 
    useEffect(() => {
        if(isEditing&&editItem !== undefined){
            setData({ 
                ...data,
                brandId: selectedBrand?.id,
                // bundleImageUrl:editItem?.bundleImageUrl,
                bundleName: editItem?.bundleName, 
                price: editItem?.price,
                 validityDays: editItem?.validityDays,
          quantity: editItem?.quantity,
          discountUpTo: editItem?.discountUpTo,
          startDate: editItem?.startDate,
          endDate: editItem?.endDate,
                bundleItems:editItem?.bundleItems
            })
        }
        else{
            setData({
                brandId: selectedBrand?.id,
                bundleImageUrl:null,
                bundleName: '', 
                price: 0,
                 validityDays: 0,
          quantity: 0,
          discountUpTo: 0,
          startDate: new Date(),
          endDate: getNextYearDate(),
                bundleItems:[]
            })
        }
    }, [editItem,isEditing]);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [err, setErr] = useState('');


    const addProduct = ()=>{
        if(data?.bundleItems?.find(obj=>obj?.id==productValue?.id)?.id)
        return  
 const newProduct = {
    productSubCategory: productValue?.productSubTypeId || 0,   
    productId: productValue?.id || 0, 
    "orderValue": 1,                      
    ...productValue,   
};
 
setData((prevData) => ({
    ...prevData,
    bundleItems: [...prevData.bundleItems, newProduct]
}));
    }
    const removeItemFromBundle = (itemId) => {
        setData((prevData) => ({
            ...prevData,
            bundleItems: prevData.bundleItems.filter((item) => item.id !== itemId),
        }));
    };
    const createNewBundle = async () => {
        // Create a new payload by copying the data and modifying the bundleItems array
        console.log(data,"da");
        let payload = {
            ...data,
            brandId:selectedBrand?.id,
            bundleItems: data.bundleItems.map((item) => ({
                productSubCategory: item.productSubTypeId || 0, // Set productSubCategory from productSubTypeId
                productId: item.id || 0,    
                orderValue:1                    // Set productId from id
            }))
        };
        if(p1!=null){ 
    
        await fileService
        .uploadBranchLogo(p1)
        .then((res) => {
            payload.bundleImageUrl = res.data?.result;
        })
        .catch((err) => {
            console.log(err.response.data);
        });
    }
        // Call the reward service to add a new bundle
        await rewardService.addNewBundle(payload)
            .then((res) => {
                setReload(prev => !prev);
                setModal(false);
            })
            .catch((err) => {
                console.log(err);
                enqueueSnackbar(
                    err?.response?.data?.error?.message
                        ? err?.response?.data?.error?.message
                        : "Something went wrong, try again!",
                    {
                        variant: 'error',
                    }
                );
            });
    };
    const updateBundle = async () => {
        // Create a new payload by copying the data and modifying the bundleItems array
        console.log(data,"da");
        let payload = {
            ...data,
            brandId:selectedBrand?.id,
            bundleItems: data.bundleItems.map((item) => ({
                productSubCategory: item.productSubTypeId || 0, // Set productSubCategory from productSubTypeId
                productId: item.id || 0,    
                orderValue:1                    // Set productId from id
            }))
        };
    
        if(p1!=null){ 
        await fileService
        .uploadBranchLogo(p1)
        .then((res) => {
            payload.bundleImageUrl = res.data?.result;
        })
        .catch((err) => {
            console.log(err.response.data);
        });
    }
        // Call the reward service to add a new bundle
        await rewardService.updateBundle(payload)
            .then((res) => {
                setReload(prev => !prev);
                setModal(false);
            })
            .catch((err) => {
                console.log(err);
                enqueueSnackbar(
                    err?.response?.data?.error?.message
                        ? err?.response?.data?.error?.message
                        : "Something went wrong, try again!",
                    {
                        variant: 'error',
                    }
                );
            });
    };
    return (
        <Modal open={modal} onClose={() => setModal(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>
                <Grid container spacing={4} mb={2}>
                    <Grid item xs={12}>
                        <Typography required variant="h5">
                            {'Add New Bundle'}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Bundle Name"
                                        variant="outlined"
                                        value={data.bundleName}
                                        onChange={(e) => setData({ ...data, bundleName: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        type="number"
                                        label="Bundle Price"
                                        variant="outlined"
                                        value={data.price}
                                        onChange={(e) => setData({ ...data, price: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        type="number"
                                        fullWidth
                                        label="Bundle Validity (Days)"
                                        variant="outlined"
                                        value={data.validityDays}
                                        onChange={(e) => setData({ ...data, validityDays: e.target.value })}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} my={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Quantity"
                                        variant="outlined"
                                        value={data.quantity}
                                        onChange={(e) => setData({ ...data, quantity: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Discount"
                                        variant="outlined"
                                        value={data.discountUpTo}
                                        onChange={(e) => setData({ ...data, discountUpTo: e.target.value })}
                                    />
                                </Grid>
                                 
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4} mt={2}>
                                <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{"Select Category"}</InputLabel>
             <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          multiple={ false}
          value={groupValue}
          label={"Select Category"}
          required={ true}
          onChange={handleChange}
        >
            {
             productTypes?.map((row, index) => { 
                    return (
                        <MenuItem value={ 
                        row
                        } >
                          { row?.name  
                          }
                          </MenuItem>
                    )
             }
             )
            }
           
        </Select>
        </FormControl>
                                </Grid>
                                <Grid item xs={4} mt={2}>
                                <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{"Select Item"}</InputLabel>
             <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          multiple={ false}
          value={productValue}
          label={"Select Item"}
          required={ true}
          onChange={handleProductChange}
        >
            {
             productsList?.filter(obj=>obj?.productTypeId==groupValue?.id)?.map((row, index) => { 
                    return (
                        <MenuItem value={ 
                        row
                        } >
                          { row?.name  
                          }
                          </MenuItem>
                    )
             }
             )
            }
           
        </Select>
        </FormControl>
                                </Grid>
                                <Grid item xs={4} mt={2}> 
                                            <Button onClick={() => addProduct()}  >
                                                Save
                                            </Button> 
                                </Grid>
                            </Grid>
                        </Grid>
                        

                        {data?.bundleItems?.map((row, index) => {
                                return (
                                    <Grid container spacing={2} my={1}>
                                        <Grid item xs={3}>
                                             
                                            <Box border={0.8} borderRadius={1} p={1}>
                                                <Typography variant="body1">
                                                    {row?.name}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        
                                        <Grid item xs={3}>
                                            <Button onClick={() =>  removeItemFromBundle(row?.id)} color="error">
                                                remove
                                            </Button>
                                        </Grid>
                                    </Grid>
                                );
                            })}

<Grid item xs={12}>
                            <Box
                                sx={{
                                    width: '60%',
                                    height: 200,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    mt: 2,
                                    backgroundColor: '#eee',
                                    ml: '20%'
                                }}
                            >
                                <img
                                    src={data?.bundleImageUrl}
                                    style={{
                                        width: 100,
                                        height: 70
                                    }}
                                    alt="img"
                                />

                                <CloudUploadOutlined style={{ fontSize: '26px', color: '#08c' }} />

                                <input
                                    type="file"
                                    value={data.bundleImageUrl}
                                    onChange={async (e) => {
                                        setP1(e.currentTarget.files[0]);
                                    }}
                                />
                            </Box>
                        </Grid>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={8} />
                            <Grid container spacing={2} justifyContent="flex-end">
                                <Grid item>
                                    <Button variant="outlined" onClick={() => setModal(false)}>
                                        Cancel
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button primay variant="contained" onClick={isEditing?updateBundle:createNewBundle}>
                                        Save
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default NewBundle;
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    overflow: 'scroll'
};
