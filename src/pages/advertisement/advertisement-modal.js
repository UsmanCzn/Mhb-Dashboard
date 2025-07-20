import React,{ useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Grid, MenuItem,Select,FormControl,InputLabel } from '@mui/material';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import UploadFile from 'components/Upload-File/upload-file';
import fileService from 'services/fileService';
import advertisementService from 'services/advertisementService';
import { ServiceFactory } from "services/index";
import { useAuth } from 'providers/authProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import carService from 'services/carService';





function AdvertisementDialog({ open, onClose, advertisement }) {
  const initialData = {
    brandId: 0,
    brandNewsImageUrl: '',
    title: '',
    customerGroupId: 0,
    status: '',
    startDate: new Date(),
    endDate: new Date(),
    advertType: 0,
    showingOccurence: 0,
  }
  const user  = useAuth();
  const customerService = ServiceFactory.get('customer') 
  const [load, setload] = useState(false)
  const [Image, setImage] = useState(null);
  const [ViewImage, setViewImage] = useState(null);
  const [customerGroup, setCustomerGroup] = useState([])
  const [formData, setFormData] = useState(initialData);
  const { brandsList } = useFetchBrandsList(false);
    const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    getCutsomerGroups()
    if (brandsList.length > 0) {
        const initialBrand = brandsList[0];
        handleChange({target:{name:"brandId",value:initialBrand.id}})
    }
  }, [brandsList]);

  useEffect(() => {
  if (advertisement) {
      const temp = { ...advertisement };
      setFormData(temp)
      setViewImage(temp.brandNewsImageUrl)
  } else {
      setViewImage(null);
      setFormData(initialData)
  }
  }, [advertisement]);

  const getCutsomerGroups =async ()=>{
    
    const response = await customerService.GetCustomersGroups()
    if (response){
      const tempGroup = response.data.result.data.data.filter((group) =>
        (group.type === "DefaultBrandGroup" || group.type === "BrandGroup") &&
        group.brandId == formData.brandId
      );
      setCustomerGroup(tempGroup)
    } 
  }



  const handleSubmit = async(event) => {
    event.preventDefault(); 
    setload(true)
    if (!advertisement) {
      try {
          if(Image){
          const uploadRes = await fileService.uploadProductImage(Image);
          const payload = {
            authorId:+user.userId,
            ...formData,
            "brandNewsImageUrl": uploadRes.data.result,
          };
          await advertisementService.createNewAdvertisements(payload);
          setImage(null);
          setload(false)
          handleClose();
        }
        else{
          const payload = {
            authorId:+user.userId,
            ...formData
          };
          await advertisementService.createNewAdvertisements(payload);
          setload(false)
        }
          
      } catch (err) {
          console.error(err);
      }
  } else {
      if(Image){
          const uploadRes = await fileService.uploadProductImage(Image);
          const payload = {
            authorId:+user.userId,
            ...formData,
            "brandNewsImageUrl": uploadRes.data.result,
          };
          await advertisementService.updateNewAdvertisements(payload);
          setImage(null);
          setload(false);
          handleClose();
      }
      else{
          const payload = {
            authorId:+user.userId,
             ...advertisement
          };
          await advertisementService.updateNewAdvertisements(payload);
          setImage(null);
          setload(false);
          handleClose();  
      }
      
  }


    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      {load && <Box sx={{width: '100%'}}>
      <LinearProgress />
      </Box>}
      <DialogTitle>Create Advertisement</DialogTitle>
      <DialogContent>
   
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
          <Grid item xs={12} sx={{justifyContent:"center"}}>
          <UploadFile Image={ViewImage} setImage={setImage}/>
            </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{mt:1}}>
            <InputLabel id="demo-simple-select-label">Brands</InputLabel>
              <Select
                id="brandId"
                name="brandId"
                label="Brand ID"
                value={formData.brandId}
                onChange={handleChange}
              >
                { 
                brandsList.map((row, index) => {
                    return (
                        <MenuItem key={index} value={row.id}>
                            {row?.name}
                        </MenuItem>
                    );
                })
                }
              </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} >
              <TextField
                fullWidth
                margin="dense"
                id="title"
                name="title"
                label="Title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                InputLabelProps={{
                    shrink: true,
                  }}
              />
            </Grid>
            <Grid item xs={6}>
            <FormControl fullWidth sx={{mt:1}}>
            <InputLabel id="demo-simple-select-label">Customer Group</InputLabel>
              <Select
                fullWidth
                margin="dense"
                id="customerGroupId"
                name="customerGroupId"
                value={formData.customerGroupId}
                onChange={handleChange}
              >
                {customerGroup.map((group)=>{
                  return <MenuItem value={group.id}>{group.name}</MenuItem>
                })}
          
              </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="dense"
                id="status"
                name="status"
                label="Status"
                type="text"
                InputLabelProps={{
                    shrink: true,
                  }}
                value={formData.status}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                  fullWidth
                  name="startDate"
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(value)=>handleChange({target:{name:'startDate',value}})}
                  renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                  fullWidth
                  name="endDate"
                  label="End Date"
                  type="date"
                  value={formData.endDate}
                  onChange={(value)=>handleChange({target:{name:'endDate',value}})}
                  renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
            </Grid>
            {/* <Grid item xs={6}>
              <TextField
                fullWidth
                margin="dense"
                id="advertType"
                name="advertType"
                label="Advert Type"
                type="number"
                value={formData.advertType}
                onChange={handleChange}
              />
            </Grid> */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="dense"
                id="showingOccurence"
                name="showingOccurence"
                label="Showing Occurence"
                type="number"
                value={formData.showingOccurence}
                onChange={handleChange}
              />
            </Grid>
          
          </Grid>
          <Button type="submit" color="primary">
            Submit
          </Button>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AdvertisementDialog;
