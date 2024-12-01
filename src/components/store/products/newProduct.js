import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Grid, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import DropDown from 'components/dropdown';
import imageCompression from 'browser-image-compression';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CloudUploadOutlined } from '@ant-design/icons';
import { ServiceFactory } from 'services/index';
import constants from 'helper/constants';
import { useFetchProductTypeList } from 'features/Store/ProductType/hooks/useFetchProductTypeList';
import { useFetchBranchList } from 'features/BranchesTable/hooks/useFetchBranchesList';
import storeServices from 'services/storeServices';
import { useFetchAddonGroupList } from 'features/Store/AddonGroups/hooks/useFetchAddonGroupList';
import fileService from 'services/fileService';

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

const NewProduct = ({ modalOpen, setModalOpen, setReload, selectedBrand }) => {
    const [data, setData] = useState({
        name: '',
        nativeName: '',
        category: '',
        addonGroup: '',
        addon: [],
        type: '',
        branches: [],
        price: 0,
        addongroups: [],
        orderValue: 0,
        pointsOfCost: 0,
        isDeliveryProduct: false
    });

    const { productTypes, fetchProductTypesList, totalRowCount, loading } = useFetchProductTypeList(true, selectedBrand);

    const { branchesList } = useFetchBranchList(true);
    const { addonGroupList } = useFetchAddonGroupList(true, selectedBrand);
    const filteredBranch = branchesList.filter((e) => e.brandId === selectedBrand.id);
    const [types, setTypes] = useState([]);
    const [categories, setCategories] = useState([]);

    const [p1, setP1] = useState(null);

    const createNewProduct = async (event) => {
        event.preventDefault();

        let payload = {
            productTypeId: data.type,
            productSubTypeId: data.category,
            orderValue: +data.orderValue,
            customerBranch: data.branches,

            brandId: selectedBrand?.id,
            newProducts: [
                {
                    name: data?.name,
                    price: data?.price,
                    pointsOfCost: +data?.pointsOfCost || 0,
                    nativeName: data?.nativeName,
                    isDeliveryProduct: data?.isDeliveryProduct,

                    productGroups: data?.addongroups?.map((obj) => {
                        return {
                            prodGroupId: obj?.addonGroup,
                            productAddOns: data?.addon?.map((ob) => {
                                return {
                                    addOnId: ob,
                                    orderValue: 0
                                };
                            })
                        };
                    })
                }
            ]
        };

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        };
        try {
            const compressedFile = await imageCompression(p1, options);

            await fileService
                .uploadProductImage(compressedFile)
                .then((res) => {
                    payload.newProducts[0].productImage = res.data?.result;
                })
                .catch((err) => {
                    console.log(err.response.data);
                });
            await storeServices
                .createNewProduct(payload)

                .then((res) => {
                    console.log(res?.data);
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    setReload((prev) => !prev);
                    setModalOpen(false);
                });
        } catch (error) {
            console.log(error);
        }
    };
    const updateProduct = async (event) => {
        event.preventDefault();
        // console.log(data,"data");

        let payload = {
            productId: data?.id,
            productTypeId: data.type,
            productSubTypeId: data.category,
            orderValue: data?.orderValue,

            name: data?.name,
            price: data?.price,
            nativeName: data?.nativeName
        };

        console.log(payload, 'payload');
        await storeServices
            .createNewProduct(payload)

            .then((res) => {
                console.log(res?.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setReload((prev) => !prev);
                setModalOpen(false);
            });
    };
    useEffect(() => {
        if (data?.type) {
            setCategories(productTypes?.find((obj) => obj.id == data?.type)?.subTypes);
            // console.log(productTypes?.find(obj=>obj.id==data?.type)?.subTypes);
        }
    }, [data.type]);

    useEffect(() => {
        setData({
            name: '',
            nativeName: '',
            category: '',
            addonGroup: '',
            addon: [],
            type: '',
            branches: [],
            price: 0,
            addongroups: []
        });
    }, []);

    useEffect(() => {
        setTypes(productTypes);
    }, [productTypes]);

    const addAddon = () => {
        setData({
            ...data,
            addongroups: [
                ...data.addongroups,
                {
                    addon: data.addon,
                    addonGroup: data.addonGroup
                }
            ]
        });
    };

    const removeAddon = (index) => {
        setData((prev) => {
            prev.addongroups = prev.addongroups.filter((obj, ind) => ind != index);
            return { ...prev };
        });
    };

    return (
        <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <form onSubmit={createNewProduct}>
                <Box sx={style}>
                    <Grid container spacing={4}>
                        <Grid item>
                            <Typography variant="h4">Create new Product </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <DropDown title="Product Type" list={types} data={data} setData={setData} keyo={'type'} type="normal" />
                                </Grid>
                                <Grid item xs={4}>
                                    <DropDown
                                        title="Category"
                                        list={categories}
                                        data={data}
                                        setData={setData}
                                        keyo={'category'}
                                        type="normal"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <DropDown
                                        title="Assign to Branches"
                                        list={filteredBranch}
                                        data={data}
                                        setData={setData}
                                        keyo={'branches'}
                                        type="groups"
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
                                        label="Product Name"
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
                                        label="Product Native Name"
                                        variant="outlined"
                                        value={data.nativeName}
                                        onChange={(e) => setData({ ...data, nativeName: e.target.value })}
                                    />
                                </Grid>
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
                                        type="number"
                                        fullWidth
                                        label="Points Of Cost"
                                        variant="outlined"
                                        value={data.pointsOfCost}
                                        onChange={(e) => setData({ ...data, pointsOfCost: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Sort Order"
                                        variant="outlined"
                                        required
                                        type="number"
                                        value={data.orderValue}
                                        onChange={(e) => setData({ ...data, orderValue: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <InputLabel id="delivery-product-label">Is Delivery Product</InputLabel>
                                        <Select
                                            labelId="delivery-product-label"
                                            value={data.isDeliveryProduct}
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    isDeliveryProduct: e.target.value
                                                })
                                            }
                                            label="Is Delivery Product"
                                        >
                                            <MenuItem value={true}>Yes</MenuItem>
                                            <MenuItem value={false}>No</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* <Grid item xs={12}>
            <Grid container spacing={2} >
          <Grid item xs={4}>
              <DropDown title="Addon Group"
                  list={addonGroupList}
                  data={data}
                  setData={setData}
                  keyo={"addongroup"}
                  type="normal"
                />
              </Grid>


              <Grid item xs={4}>
              <DropDown title="Addons"
                  list={addonList}
                  data={data}
                  setData={setData}
                  keyo={"category"}
                  type="normal"
                />
              </Grid>



              </Grid>
              </Grid> */}

                        <Grid item xs={12}>
                            <Typography variant="h6">Addons</Typography>
                            <Grid container spacing={2} mt={1}>
                                <Grid item xs={3}>
                                    <DropDown
                                        title="Addon Group"
                                        list={addonGroupList}
                                        data={data}
                                        setData={setData}
                                        keyo={'addonGroup'}
                                        type="normal"
                                        notRequired
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                    <Button onClick={addAddon}>Add new</Button>
                                </Grid>
                            </Grid>

                            {data?.addongroups?.map((row, index) => {
                                return (
                                    <Grid container spacing={2} my={1}>
                                        <Grid item xs={3}>
                                            <TextField
                                                id="outlined-basic"
                                                fullWidth
                                                label="Addon Group name"
                                                variant="outlined"
                                                value={addonGroupList?.find((obj) => obj.id == row.addonGroup)?.name}
                                                editable={false}
                                            />
                                        </Grid>

                                        <Grid item xs={3}>
                                            <Button onClick={() => removeAddon(index)} color="error">
                                                remove
                                            </Button>
                                        </Grid>
                                    </Grid>
                                );
                            })}
                        </Grid>

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
                                {/* <img src={ p1 } 
                 style={{
                  width:100,
                  height:70
                }}

                 alt="img"
                 /> */}
                                <CloudUploadOutlined style={{ fontSize: '26px', color: '#08c' }} />

                                <input
                                    type="file"
                                    onChange={async (e) => {
                                        setP1(e.currentTarget.files[0]);
                                    }}
                                />
                            </Box>
                        </Grid>

                        {/* Footer */}

                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={8} />
                                <Grid container spacing={2} justifyContent="flex-end">
                                    <Grid item>
                                        <Button variant="outlined" onClick={() => setModalOpen(false)}>
                                            Cancel
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button primay variant="contained" type="Submit">
                                            Save
                                        </Button>
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

export default NewProduct;
