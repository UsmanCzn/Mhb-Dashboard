import { Chip, Grid, Typography,Menu,MenuItem,Button,FormControl,InputLabel,Select } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent'; 
import React,{useState,useEffect} from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchAddonGroupList } from './hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NewProductType from 'components/store/productType/newProductType';
import NewProduct from 'components/store/products/newProduct';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import { useFetchProductsList } from 'features/Store/Products/hooks/useFetchProductsList';
import NewAddonGroup from 'components/store/addonGroup/newAddonGroup';
import storeServices from 'services/storeServices';
import AddonTable from 'components/Addon/addonTable';

export default function AddonsGroups({  
  selectedBrand
 }) {

  const navigate = useNavigate();

  const location = useLocation();

  const [reload,setReload] =useState(false)
  const [modalOpen,setModalOpen]=useState(false)
 
  const [selectedProduct,setselectedProduct]=useState({})

    
 
   
   
    const [anchorEl, setAnchorEl] =  useState(null);
    const [customer, setCustomer] =  useState({});

    const [update, setUpdate] =  useState(false);
    const [updateData, setUpdateData] =  useState({});
    const [type, setType] =  useState({});

  const open = Boolean(anchorEl);
  const handleClick = (event,params) => { 
    setCustomer(params); 
    setType(params?.row); 
    setAnchorEl(event.currentTarget);
  };
 
  const {brandsList}=useFetchBrandsList(reload) 
 
//   console.log(selectedProduct,"selectedProduct in index");s

const handleClose = (data) => {  

    if(data?.name=="Update"){
      setUpdate(true)
      setUpdateData(type)
      setModalOpen(true)
    }
    else if(data?.name=="Delete"){
      deleteAddonGroup(type)
    }
    setAnchorEl(null);
  };
  
  const deleteAddonGroup=async(type)=>{

    await storeServices.deleteProductAddonGroup(type?.id)
    .then((res)=>{
     setReload(prev=>{ return !prev})
    })
    .catch((err)=>{
     console.log(err?.response?.data);
    })
   }
  

  
   


     


  return (
    <> 
      <Grid item xs={12} mb={2}>

<Grid container  alignItems="center" justifyContent="space-between">
    <Grid item xs={6}>
        <Typography  variant="h5" fontSize={33}>
           Add-Ons
        </Typography>
    </Grid>
   
 
</Grid>

</Grid>
    
    <AddonTable 
       selectedBrand={selectedBrand}
    reload={reload}
    setReload={setReload}

       />
      
    
       
 
    </>
  );
}
