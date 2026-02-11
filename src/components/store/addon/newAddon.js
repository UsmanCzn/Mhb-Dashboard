import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Grid, Button, Switch,RadioGroup,FormControlLabel,Radio,FormControl,FormLabel, } from "@mui/material/index";
import DropDown from 'components/dropdown'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CloudUploadOutlined } from '@ant-design/icons';
import { ServiceFactory } from "services/index";
import constants from "helper/constants";
import storeServices from "services/storeServices";
import fileService from "services/fileService";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import imageCompression from 'browser-image-compression';
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
    overflow: 'scroll',
    height: '80%'
};

const NewAddon = ({
    modalOpen,
    setModalOpen,
    setReload,
    update,
    updateData,
    selectedBrand,
    selectedProduct,
    addonGroupList,
    setAddsonReload,
    selectedGroup
}) => {
    const [p1, setP1] = useState(null);

    const [data, setData] = useState({
        productAdditionsGroupId: '',
        name: '',
        nativeName: '',
        orderValue: 0,
        price: 0,
        pointsOfCost: 0,
        posId: 0,
        calories: '',
        fat: '',
        protien: '',
        carbo: '',
        image: '',
        canBeMultiple: false,
        maxMultipleValue: 0
    });

    console.log(selectedGroup,"selectedGroup in newAddon");
    useEffect(() => {
        if (update) {
            setData({
                ...data,
                name: updateData?.name,
                nativeName: updateData?.nativeName,
                orderValue: updateData?.orderValue,
                price: updateData?.price,
                posId: updateData?.posId,
                pointsOfCost: updateData?.pointsOfCost,
                calories: updateData?.calories,
                fat: updateData?.fat,
                protien: updateData?.protien,
                carbo: updateData?.carbo,
                productAdditionsGroupId: updateData?.productAdditionsGroupId,
                image: updateData?.image,
                canBeMultiple: updateData.canBeMultiple,
                maxMultipleValue: updateData.maxMultipleValue
            });
        } else {
            setData({
                name: '',
                nativeName: '',
                orderValue: 0,
                price: 0,
                pointsOfCost: 0,
                posId: '',
                calories: '',
                fat: '',
                protien: '',
                carbo: '',
                productAdditionsGroupId: selectedGroup?.id ?? '',
                image: '',
                canBeMultiple: false,
                maxMultipleValue: 0
            });
        }
    }, [update, updateData,selectedGroup]);

    const createNewType = async (event) => {
        event.preventDefault();

        let payload = {
            ...data,
            brandId: selectedBrand?.id,
            productId: selectedProduct?.id,
            posId: 1
};
                const options = {
            maxSizeMB: 0.1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        };
        if(p1){
        const compressedFile = await imageCompression(p1, options);
        await fileService
            .uploadProductImage(compressedFile)
            .then((res) => {
                payload.image = res.data?.result;
            })
            .catch((err) => {
                console.log(err.response.data);
            });}
        await storeServices
            .createProductAddition(payload)

            .then((res) => {
                console.log(res?.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                // setReload((prev) => !prev);
                setAddsonReload((prev) => !prev);
                setModalOpen(false);
                setP1(null);
                setData({
                    name: '',
                    nativeName: '',
                    orderValue: 0,
                    price: 0,
                    pointsOfCost: 0,
                    posId: '',
                    calories: '',
                    fat: '',
                    protien: '',
                    carbo: '',
                    productAdditionsGroupId: selectedGroup?.id ?? '',
                    image: ''
                });
            });
    };

    const EditType = async (event) => {
        event.preventDefault();

        let payload = {
            ...data,
            brandId: selectedBrand?.id,
            id: updateData?.id
        };
        if(p1){
        const options = {
            maxSizeMB: 0.1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        };
        const compressedFile = await imageCompression(p1, options);
        await fileService
            .uploadProductImage(compressedFile)
            .then((res) => {
                payload.image = res.data?.result;
            })
            .catch((err) => {
                console.log(err.response.data);
            });
        }

        await storeServices
            .updateProductAddition(payload, selectedBrand?.id)

            .then((res) => {
                console.log(res?.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
              setAddsonReload((prev) => !prev);
                // setReload((prev) => !prev);
                setModalOpen(false);
            });
    };



return (
  <Modal
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <form onSubmit={update ? EditType : createNewType}>
      <Box
        sx={{
          ...style,
          width: { xs: '95%', sm: 800, md: 1000 },
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Grid container spacing={4}>
          {/* Title */}
          <Grid item xs={12}>
            <Typography variant="h5" fontSize={26}>
              {update ? 'Edit Add-on' : 'Create Add-on'}
            </Typography>
          </Grid>

          {/* Brand */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
              Brand : {selectedBrand?.name}
            </Typography>
          </Grid>

          {/* Addon Group */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <DropDown
                  title="Add-on Group"
                  list={addonGroupList}
                  data={data}
                  setData={setData}
                  keyo="productAdditionsGroupId"
                  type="normal"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Basic Info */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Sort Order"
                  value={data.orderValue}
                  onChange={(e) =>
                    setData({ ...data, orderValue: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Add-on Name"
                  required
                  value={data.name}
                  onChange={(e) =>
                    setData({ ...data, name: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Add-on Native Name"
                  value={data.nativeName}
                  onChange={(e) =>
                    setData({
                      ...data,
                      nativeName: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Pricing */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Price"
                  required
                  value={data.price}
                  onChange={(e) =>
                    setData({ ...data, price: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Points of cost"
                  required
                  value={data.pointsOfCost}
                  onChange={(e) =>
                    setData({
                      ...data,
                      pointsOfCost: e.target.value,
                    })
                  }
                />
              </Grid>

              {data.canBeMultiple && (
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Max value for Addon"
                    required
                    value={data.maxMultipleValue}
                    onChange={(e) =>
                      setData({
                        ...data,
                        maxMultipleValue: e.target.value,
                      })
                    }
                  />
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* Allow Multiple */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1">
              Allow Multiple
            </Typography>
            <Switch
              checked={data.canBeMultiple}
              onChange={(event) =>
                setData({
                  ...data,
                  canBeMultiple: event.target.checked,
                })
              }
            />
          </Grid>

          {/* Nutrition */}
          <Grid item xs={12}>
            <Typography variant="h6">
              Nutrition Facts
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Calories"
                  value={data.calories}
                  onChange={(e) =>
                    setData({ ...data, calories: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Fat"
                  value={data.fat}
                  onChange={(e) =>
                    setData({ ...data, fat: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Protein"
                  value={data.protien}
                  onChange={(e) =>
                    setData({ ...data, protien: e.target.value })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Carbo"
                  value={data.carbo}
                  onChange={(e) =>
                    setData({ ...data, carbo: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              Addon Image
            </Typography>

            <Box
              sx={{
                width: { xs: '100%', sm: '60%' },
                height: 170,
                mx: 'auto',
                mt: 2,
                backgroundColor: '#eee',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <img
                src={data?.image}
                alt="img"
                style={{ width: 100, height: 70 }}
              />

              <CloudUploadOutlined
                style={{ fontSize: 26, color: '#08c' }}
              />

              <input
                type="file"
                onChange={(e) =>
                  setP1(e.currentTarget.files[0])
                }
              />
            </Box>
          </Grid>

          {/* Footer */}
          <Grid item xs={12}>
            <Grid
              container
              spacing={2}
              justifyContent={{ xs: 'center', sm: 'flex-end' }}
            >
              <Grid item xs={12} sm="auto">
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
              </Grid>

              <Grid item xs={12} sm="auto">
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                >
                  {update
                    ? 'Edit Add-on'
                    : 'Create new Add-on'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </form>
  </Modal>
);

};

export default NewAddon

