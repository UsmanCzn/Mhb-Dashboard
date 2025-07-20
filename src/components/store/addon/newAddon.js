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
    setAddsonReload
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

    const customerServices = ServiceFactory.get('customer');

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
                price: '',
                pointsOfCost: '',
                posId: '',
                calories: '',
                fat: '',
                protien: '',
                carbo: '',
                productAdditionsGroupId: '',
                image: '',
                canBeMultiple: false,
                maxMultipleValue: 0
            });
        }
    }, [update, updateData]);

    const createNewType = async (event) => {
        event.preventDefault();

        let payload = {
            ...data,
            brandId: selectedBrand?.id,
            productId: selectedProduct?.id,
            posId: 1
        };

        await fileService
            .uploadProductImage(p1)
            .then((res) => {
                payload.image = res.data?.result;
            })
            .catch((err) => {
                console.log(err.response.data);
            });
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
                    price: '',
                    pointsOfCost: '',
                    posId: '',
                    calories: '',
                    fat: '',
                    protien: '',
                    carbo: '',
                    productAdditionsGroupId: '',
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

        await fileService
            .uploadProductImage(p1)
            .then((res) => {
                payload.image = res.data?.result;
            })
            .catch((err) => {
                console.log(err.response.data);
            });

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
                <Box sx={style}>
                    <Grid container spacing={4}>
                        <Grid item>
                            <Typography variant="h5" fontSize={26}>
                                {' '}
                                {update ? 'Edit Add-on' : 'Create Add-on'}{' '}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                                        Brand : {selectedBrand?.name}{' '}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    {/* <Typography variant="h6">Product : {selectedProduct?.name} </Typography> */}
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <DropDown
                                        title="Add-on Group"
                                        list={addonGroupList}
                                        data={data}
                                        setData={setData}
                                        keyo={'productAdditionsGroupId'}
                                        type="normal"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Sort Order"
                                        variant="outlined"
                                        value={data.orderValue}
                                        onChange={(e) => setData({ ...data, orderValue: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Add-on Name"
                                        variant="outlined"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData({ ...data, name: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Add-on Native Name"
                                        variant="outlined"
                                        value={data.nativeName}
                                        onChange={(e) => setData({ ...data, nativeName: e.target.value })}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Price"
                                        variant="outlined"
                                        required
                                        value={data.price}
                                        onChange={(e) => setData({ ...data, price: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Points of cost"
                                        variant="outlined"
                                        required
                                        value={data.pointsOfCost}
                                        onChange={(e) => setData({ ...data, pointsOfCost: e.target.value })}
                                    />
                                </Grid>
                                {data.canBeMultiple && (
                                    <Grid item xs={4}>
                                        <TextField
                                            id="outlined-basic"
                                            fullWidth
                                            label="Max value for Addon"
                                            variant="outlined"
                                            required
                                            value={data.maxMultipleValue}
                                            onChange={(e) => setData({ ...data, maxMultipleValue: e.target.value })}
                                        />
                                    </Grid>
                                )}

                                {/* <Grid item xs={4}>
                <TextField id="outlined-basic" fullWidth label="POS" variant="outlined" required
                  value={data.posId}
                  onChange={(e) => setData({ ...data, posId: e.target.value })}
                />
              </Grid> */}
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Typography required variant="h7">
                                        Allow Multiple
                                    </Typography>
                                    <Box
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            mt: 2
                                        }}
                                    >
                                        <Switch
                                            checked={data.canBeMultiple}
                                            onChange={(event) => {
                                                setData({
                                                    ...data,
                                                    canBeMultiple: event.target.checked
                                                });
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={0}>
                                <Grid item xs={4}>
                                    <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                                        Nutrition Facts :
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Calories"
                                        variant="outlined"
                                        value={data.calories}
                                        onChange={(e) => setData({ ...data, calories: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Fat"
                                        variant="outlined"
                                        value={data.fat}
                                        onChange={(e) => setData({ ...data, fat: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Protein"
                                        variant="outlined"
                                        value={data.protien}
                                        onChange={(e) => setData({ ...data, protien: e.target.value })}
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Carbo"
                                        variant="outlined"
                                        value={data.carbo}
                                        onChange={(e) => setData({ ...data, carbo: e.target.value })}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}></Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={4}>
                                    <Typography variant="h7">Addon Image</Typography>
                                </Grid>
                                <Grid item xs={8} />

                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            width: '60%',
                                            height: 170,
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
                                            src={data?.image}
                                            style={{
                                                width: 100,
                                                height: 70
                                            }}
                                            alt="img"
                                        />
                                        <CloudUploadOutlined style={{ fontSize: '26px', color: '#08c' }} />

                                        <input
                                            type="file"
                                            onChange={async (e) => {
                                                setP1(e.currentTarget.files[0]);
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Footer */}

                        <Grid item xs={12}>
                            <Grid container>
                                <Grid container spacing={2} justifyContent="space-between">
                                    <Grid item>
                                        {/* <Button variant="outlined" color="error" onClick={() => deleteAddon()}>Delete this product</Button> */}
                                    </Grid>

                                    <Grid item>
                                        <Grid container spacing={2}>
                                            <Grid item>
                                                <Button variant="outlined" onClick={() => setModalOpen(false)}>
                                                    Cancel
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button primay variant="contained" type="Submit">
                                                    {update ? 'Edit Add-on' : 'Create new Add-on'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
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

