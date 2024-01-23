import { Chip, Grid, Typography,Menu,MenuItem,Button,FormControl,InputLabel,Select } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent'; 
import React,{useState,useEffect} from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom'; 
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NewProductType from 'components/store/productType/newProductType';
import NewProduct from 'components/store/products/newProduct';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import { useFetchProductsList } from 'features/Store/Products/hooks/useFetchProductsList';
import NewAddon from 'components/store/addon/newAddon';
import storeServices from 'services/storeServices';
import { useFetchAddonList } from './hooks';
import { useFetchAddonGroupList } from '../AddonGroups/hooks/useFetchAddonGroupList';

export default function Addons({  
  selectedBrand
 }) {

  const navigate = useNavigate();

  const location = useLocation();

  const [reload,setReload] =useState(false)
  const [modalOpen,setModalOpen]=useState(false)
 
  const [selectedProduct,setselectedProduct]=useState({})

    const { productsList } = useFetchProductsList(reload,selectedBrand); 
    const { addonList, fetchAddonList, totalRowCount, loading } = useFetchAddonList(reload,selectedBrand,selectedProduct);
    const { addonGroupList } = useFetchAddonGroupList(reload,selectedBrand,selectedProduct); 


   
   
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
 
  // const {brandsList}=useFetchBrandsList(reload) 
 
   console.log(selectedProduct,"selectedProduct in index");

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

    await storeServices.deleteProductAddon(type?.id,selectedBrand?.id)
    .then((res)=>{
     setReload(prev=>{ return !prev})
    })
    .catch((err)=>{
     console.log(err?.response?.data);
    })
   }
  

  useEffect(
      ()=>{ 
        
          if(Boolean(productsList[0]?.id)&&Object.keys(selectedProduct).length===0){
          setselectedProduct(productsList[0]) 
        }
        else if(Boolean(productsList[0]?.id)) {
         setselectedProduct( productsList?.find(obj=>obj?.id===selectedProduct?.id))
        }
      }
      ,[productsList]
  )
  console.log(selectedProduct?.id,"selectedProduct frd");
    const columns = [
      
      {
        field: "id",
        headerName: "ID",
        headerAlign: "left", 
    },
    {
      field: "orderValue",
      headerName: "Order Value",
      headerAlign: "left", 
      flex:0.7,

  },
      {
          field: "name",
          headerName: "Name", 
          headerAlign: "left",  
        flex:0.7,

      }, 
      {
        field: "nativeName",
        headerName: "Native Name", 
        flex:0.7,
        headerAlign: "left",  
    }, 
      {
          field: "price",
          headerName: "Price", 
          headerAlign: "left",
        flex:0.7,
 
      }, 
    {
      field: "isRewardMfissisng",
      headerName: "Action",
      sortable: false, 
      headerAlign: "left",
      
      renderCell: (params) => { 
            return <MoreVertIcon 
                onClick={(event)=>handleClick(event,params)} />
          }
    },
      ];


      const options=[
        {
          name:"Update",
          modal:true, 
        },
        {
          name:"Delete",
          modal:true, 
        }

      ]


  return (
    <> 
      <Grid item xs={12} mb={2}>

<Grid container  alignItems="center" justifyContent="space-between">
    <Grid item xs={6}>
        <Typography  variant="h4">
           Add-ons
        </Typography>
    </Grid>
    <Grid item xs={4}>
        <Grid container justifyContent="space-between" >
        <Grid item xs={6}>
    <FormControl fullWidth >
        <InputLabel id="demo-simple-select-label">{"Select Product"}</InputLabel>
             <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select" 
          value={selectedProduct}
          label={"Select Product"} 
          onChange={(event)=>{
            setselectedProduct(event.target.value)
          }}
        >
            {
             productsList.map((row, index) => { 
                    return (
                        <MenuItem value={row} >
                          { row?.name}
                          </MenuItem>
                    )
             }
             )
            }
           
        </Select>
        </FormControl>
       </Grid>
       <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}
                       onClick={() =>{ 
                        setUpdate(false)
                        setUpdateData({})
                        setModalOpen(true)
                      }}
                   >
                       Add New Add-on
     </Button>

     </Grid>

       </Grid>
 
</Grid>

</Grid>
    <DataGridComponent
      rows={addonList}
      columns={columns}
      loading={loading} 
      getRowId={(row)=>row.id}
      rowsPerPageOptions={[10]}
      totalRowCount={totalRowCount}
      fetchCallback={fetchAddonList} 
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
                       <MenuItem onClick={()=> handleClose(row)} value={row.name}>{row.name}</MenuItem>
                   )
            }
            )
           }
       

      </Menu>
      <NewAddon  modalOpen={modalOpen} setModalOpen={setModalOpen} 
       setReload={setReload}  
       selectedBrand={selectedBrand}
       selectedProduct={selectedProduct}
       update={update} updateData={updateData} 
       addonGroupList={addonGroupList}
       />
       

         
 
    </>
  );
}
