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

const CreateVehicleColor = ({ open, onClose,onSave, car }) => {
  const { brandsList } = useFetchBrandsList(false);
  const [selectedBrand, setselectedBrand] = useState('');
  const [ViewImage, setViewImage] = useState(null);
  const [Image, setImage] = useState(null);
  
  const initialData = {
    brandId: 0,
    carColorName: '',
    carColorNativeName: '',
    imageUrl: '',
    hexColor:''
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

  const createCarColor = async () => {
    if (!car) {
      try {
        if (Image) {
          const uploadRes = await fileService.uploadProductImage(Image);
          const payload = {
            brandId: selectedBrand?.id,
            carColorName: data.carColorName,
            carColorNativeName: data.carColorNativeName,
            hexColor:data.hexColor
          };
          const response = await carService.CreateCarColor(payload);
          setImage(null);
          setData(initialData);
          onSave()
        } else {
          const payload = {
            brandId: selectedBrand?.id,
            carColorName: data.carColorName,
            carColorNativeName: data.carColorNativeName,
            hexColor:data.hexColor
          };
          const response = await carService.CreateCarColor(payload);
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
          carColorId:data.carColorId,
          brandId: selectedBrand?.id,
          carColorName: data.carColorName,
          carColorNativeName: data.carColorNativeName,
          hexColor:data.hexColor
        };
        const response = await carService.UpdateCarColor(payload);
        setImage(null);
        onSave()
      } else {
        const payload = {
          carColorId:data.carColorId,
          brandId: selectedBrand?.id,
          carColorName: data.carColorName,
          carColorNativeName: data.carColorNativeName,
          hexColor:data.hexColor
        };
        const response = await carService.UpdateCarColor(payload);
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
    <DialogTitle id="dialog-title">{car ?'Update Color':'Create New Color'}</DialogTitle>
    <DialogContent>
      <Grid container spacing={2}>
        {/* <Grid item xs={12}>
          <UploadFile Image={ViewImage} setImage={setImage} />
        </Grid> */}
        <Grid item xs={6}>
          <TextField
            margin="dense"
            id="carColorName"
            name="carColorName"
            label="Color Name"
            type="text"
            fullWidth
            variant="outlined"
            value={data.carColorName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            margin="dense"
            id="carColorNativeName"
            name="carColorNativeName"
            label="Color Native Name"
            type="text"
            variant="outlined"
            fullWidth
            value={data.carColorNativeName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            margin="dense"
            id="hexColor"
            name="hexColor"
            type="color"
            fullWidth
            value={data.hexColor}
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
      <Button onClick={createCarColor} color="primary">
        Save
      </Button>
    </DialogActions>
  </Dialog>
  )
}

export default CreateVehicleColor