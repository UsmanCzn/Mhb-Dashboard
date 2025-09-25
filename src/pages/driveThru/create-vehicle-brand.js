import React, { useState, useEffect } from 'react';
import { 
  Grid,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Avatar,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import UploadFile from 'components/Upload-File/upload-file';
import fileService from 'services/fileService';
import carService from 'services/carService';

const CreateVechileBrand = ({ open, onClose,onSave, car }) => {
    const { brandsList } = useFetchBrandsList(false);
    const [selectedBrand, setselectedBrand] = useState('');
    const [ViewImage, setViewImage] = useState(null);
    const [Image, setImage] = useState(null);
    const initialData = {
        brandId: 0,
        carBrandName: '',
        carBrandNativeName: '',
        description:"",
        imageUrl: ''
      };
      const [data, setData] = useState(initialData);
  
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData({
          ...data,
          [name]: value
        });
      };
      
      useEffect(() => {
        // Check if brandsList has at least one item and selectedBrand is not set
        if (brandsList.length > 0) {
          const initialBrand = brandsList[0];
          setselectedBrand(initialBrand);
        }
      }, [brandsList]);
    
      useEffect(() => {
        if (car) {
          const temp = { ...car };
          const brand = brandsList.find(brand => brand.id === car.brandId)
          setselectedBrand(brand);
          setData(temp);
          setViewImage(temp.imageUrl);
    
        } else {
          setViewImage(null);
          setData(initialData);
        }
      }, [car]);
    
      const createCarBrand = async () => {
        if (!car) {
          try {
            if (Image) {
              const uploadRes = await fileService.uploadProductImage(Image);
              const payload = {
                brandId: selectedBrand?.id,
                carBrandName: data.carBrandName,
                carBrandNativeName: data.carBrandNativeName,
                imageUrl: uploadRes.data.result,
                description:data.description
              };
              const response = await carService.CreateCarBrand(payload);
              setImage(null);
              setData(initialData);
              onSave()
            } else {
              const payload = {
                brandId: selectedBrand?.id,
                carBrandName: data.carBrandName,
                carBrandNativeName: data.carBrandNativeName,
                description:data.description
              };
              const response = await carService.CreateCarBrand(payload);
              setData(initialData);
              onSave()
            }
          } catch (error) {
            // Handle error
          }
        } else {
          // Update car logic
          if (Image) {
            const uploadRes = await fileService.uploadProductImage(Image);
            const payload = {
              carBrandId:data.carBrandId,
              brandId: selectedBrand?.id,
              carBrandName: data.carBrandName,
              carBrandNativeName: data.carBrandNativeName,
              imageUrl: uploadRes.data.result,
              description:data.description
            };
            const response = await carService.UpdateCarBrand(payload);
            setImage(null);
            onSave()
          } else {
            const payload = {
              carBrandId:data.carBrandId,
              brandId: selectedBrand?.id,
              carBrandName: data.carBrandName,
              carBrandNativeName: data.carBrandNativeName,
              imageUrl: data.imageUrl,
              description:data.description
            };
            const response = await carService.UpdateCarBrand(payload);
            onSave()
          }
        }
      };
  return (
    <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
  >
    <DialogTitle id="dialog-title">{car?'Update Vehicle Brand':'Create Vehicle Brand'}</DialogTitle>
    <DialogContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <UploadFile Image={ViewImage} setImage={setImage} />
        </Grid>
        <Grid item xs={6}>
          <TextField
            margin="dense"
            id="carBrandName"
            name="carBrandName"
            label="Brand Name"
            type="text"
            fullWidth
            variant="outlined"
            value={data.carBrandName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            margin="dense"
            id="carBrandNativeName"
            name="carBrandNativeName"
            label="Brand Native Name"
            type="text"
            fullWidth
            variant="outlined"
            value={data.carBrandNativeName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="brand-select-label">Brand</InputLabel>
            <Select
              labelId="brand-select-label"
              id="brand-select"
              value={selectedBrand}
              label="Brand"
              onChange={(event) => {
                setselectedBrand(event.target.value);
              }}
            >
              {brandsList.map((row, index) => (
                <MenuItem key={index} value={row}>
                  {row?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
        <TextField
          multiline
          maxRows={6}
          margin="dense"
          id="description"
          name="description"
          fullWidth
          label="Description"
          value={data.description}
          onChange={handleInputChange}
        />
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={createCarBrand} color="primary">
        Save
      </Button>
    </DialogActions>
  </Dialog>
  )
}

export default CreateVechileBrand