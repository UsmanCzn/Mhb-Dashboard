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
  
 }) {

  const navigate = useNavigate();

  const location = useLocation();

  const [reload,setReload] =useState(false)
  const [modalOpen,setModalOpen]=useState(false)
 
  const [selectedProduct,setselectedProduct]=useState({})
  

  const [selectedBrand, setselectedBrand] = useState({}) 
 
   
   
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
  useEffect(
    () => {

        if (brandsList[0]?.id) {
          setselectedBrand(brandsList[0])
        }
    }
    , [brandsList]
)
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
              <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item xs={6}>
                      <Typography fontSize={22} fontWeight={700}>
                          Add-Ons
                      </Typography>
                  </Grid>
                  <Grid item xs="auto">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{"Brand"}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedBrand}
                                label={"Brand"}
                                onChange={(event) => {
                                  setselectedBrand(event.target.value)
                                }}
                            >
                                {
                                    brandsList.map((row, index) => {
                                        return (
                                            <MenuItem value={row} >
                                                {row?.name}
                                            </MenuItem>
                                        )
                                    }
                                    )
                                }

                            </Select>
                        </FormControl>
                    </Grid>
              </Grid>
          </Grid>

          <AddonTable selectedBrand={selectedBrand} reload={reload} setReload={setReload} />
      </>
  );
}
