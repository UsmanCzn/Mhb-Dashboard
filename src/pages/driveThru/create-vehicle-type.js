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

const CreateVehicle = ({ open, onClose,onSave, car }) => {
  const { brandsList } = useFetchBrandsList(false);
  const [selectedBrand, setselectedBrand] = useState('');
  const [ViewImage, setViewImage] = useState(null);
  const [Image, setImage] = useState(null);
  
  const initialData = {
    brandId: 0,
    carTypeName: '',
    carTypeNativeName: '',
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

  const createCarType = async () => {
    if (!car) {
      try {
        if (Image) {
          const uploadRes = await fileService.uploadProductImage(Image);
          const payload = {
            brandId: selectedBrand?.id,
            carTypeName: data.carTypeName,
            carTypeNativeName: data.carTypeNativeName,
            imageUrl: uploadRes.data.result
          };
          const response = await carService.CreateCarType(payload);
          setImage(null);
          setData(initialData);
          onSave()
        } else {
          const payload = {
            brandId: selectedBrand?.id,
            carTypeName: data.carTypeName,
            carTypeNativeName: data.carTypeNativeName
          };
          const response = await carService.CreateCarType(payload);
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
          carTypeId:data.carTypeId,
          brandId: selectedBrand?.id,
          carTypeName: data.carTypeName,
          carTypeNativeName: data.carTypeNativeName,
          imageUrl: uploadRes.data.result
        };
        const response = await carService.UpdateCarType(payload);
        setImage(null);
        onSave()
      } else {
        const payload = {
          carTypeId:data.carTypeId,
          brandId: selectedBrand?.id,
          carTypeName: data.carTypeName,
          carTypeNativeName: data.carTypeNativeName,
          imageUrl: data.imageUrl
        };
        const response = await carService.UpdateCarType(payload);
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
      <DialogTitle id="dialog-title">{car ? 'Update Vehicle':'Create New Vehicle'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <UploadFile Image={ViewImage} setImage={setImage} />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              id="carTypeName"
              name="carTypeName"
              label="Vehicle Name"
              type="text"
              fullWidth
              variant="outlined"
              value={data.carTypeName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              id="carTypeNativeName"
              name="carTypeNativeName"
              label="Vehicle Native Name"
              type="text"
              fullWidth
              variant="outlined"
              value={data.carTypeNativeName}
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={createCarType} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateVehicle;
