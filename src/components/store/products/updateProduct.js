import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Grid,
    Button,
    Switch,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl,
    FormLabel
} from '@mui/material/index';
import DropDown from 'components/dropdown';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CloudUploadOutlined } from '@ant-design/icons';
import { ServiceFactory } from 'services/index';
import constants from 'helper/constants';
import { useFetchProductTypeList } from 'features/Store/ProductType/hooks/useFetchProductTypeList';
import { useFetchBranchList } from 'features/BranchesTable/hooks/useFetchBranchesList';
import storeServices from 'services/storeServices';
import fileService from 'services/fileService';
import { useFetchAddonList } from 'features/Store/Addons/hooks/useFetchAddonList';
import { useFetchAddonGroupList } from 'features/Store/AddonGroups/hooks/useFetchAddonGroupList';
import imageCompression from 'browser-image-compression';
import LinearProgress from '@mui/material/LinearProgress';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height: '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    overflow: 'scroll'
};

const UpdateProduct = ({ modalOpen, setModalOpen, setReload, selectedBrand, update, updateData }) => {
    const [p1, setP1] = useState(null);
    // const [p2, setP2] = useState(null);
    const { productTypes, fetchProductTypesList } = useFetchProductTypeList(true, selectedBrand);
        const [ImageUpload, setImageUpload] = useState(false);
    const { addonList } = useFetchAddonList(true);
    const { addonGroupList } = useFetchAddonGroupList(true, selectedBrand);

    const [data, setData] = useState({
        name: '',
        nativeName: '',
        price: 0,
        pointsOfCost: 0,
        isMerchProduct: true,
        orderValue: 0,
        isMerchProduct: true,
        productImage: '',
        productSecondImage: '',
        productThirdImage: '',
        isProductImageDeleted: true,
        calories: '',
        fat: '',
        protien: '',
        showIsOutOfStock: true,
        productDeliveryText: '',
        carbo: '',
        estimatePreparationTimeInMinutes: 0,
        posId: 0,
        isEligibleForFreeItem: true,
        isQtyAvailable: true,
        isTopProduct: false,
        isFeaturedProduct: false,
        dontMissOutProduct: false,
         
        punchesForPurchase: 0,
        commentAllowed: true,
        productDescription: '',
        productQtyWithBranchs: [],
        productSubTypeId: 0,
        type: 0,
        addongroups: [],
        addonGroup: '',
        addon: [],
        productGroups: []
    });

    const { branchesList } = useFetchBranchList(true);
    const [types, setTypes] = useState([]);
    const [categories, setCategories] = useState([]);

    const updateProductData = async (event) => {
        event.preventDefault();
    
        let payload = {
            ...data,
            productId: updateData?.id,
            productQtyWithBranchs: data?.productQtyWithBranchs?.map((branchId) => ({
                availabilityQtyIn: 1000,
                availabilityQty: 1000,
                branchid: branchId,
                isSuggest: false,
                productId: updateData?.productId,
                isQtyAvailable: true
            })),
            productGroups: data?.productGroups?.map((prodGroupId) => ({
                prodGroupId: prodGroupId
            }))
        };
    
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        };
    
        try {
            if (p1) {
                setImageUpload(true);
    
                const compressedFile = await imageCompression(p1, options);
                const imageResponse = await fileService.uploadProductImage(compressedFile);
                payload.productImage = imageResponse.data?.result;
            }
    
            const updateResponse = await storeServices.updateProduct(payload);
            console.log(updateResponse?.data, 'updateddddddd');
    
        } catch (error) {
            console.error(error.response?.data || error.message || error);
        } finally {
            setImageUpload(false);
            setReload((prev) => !prev);
            setModalOpen(false);
        }
    };
    

    const deleteProduct = async () => {
        await storeServices
            .deleteProduct(updateData?.id)

            .then((res) => {
                // console.log(res?.data, "deleted");
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setReload((prev) => !prev);
                setModalOpen(false);
            });
    };

    const addAddon = () => {
        if (data.addonGroup == null) return;
        console.log(data.addonGroup, 'data.addonGroup');
        setData({
            ...data,
            productGroups: [
                ...data.productGroups,
                {
                    prodGroupId: data.addonGroup
                }
            ]
        });
    };

    const removeAddon = (index) => {
        setData((prev) => {
            prev.productGroups = prev.productGroups.filter((obj, ind) => ind != index);
            return { ...prev };
        });
    };

    useEffect(() => {
        // console.log(updateData,"updateData----+.");
        // fetchProductTypesList()
        setData({
            name: updateData?.name,
            nativeName: updateData?.nativeName,
            price: updateData?.price,
            pointsOfCost: updateData?.pointsOfCost,
            isMerchProduct: updateData?.isMerchProduct,
            orderValue: updateData?.orderValue,
            isMerchProduct: updateData?.isMerchProduct,
            productImage: updateData?.productImage,
            productSecondImage: updateData?.productSecondImage,
            productThirdImage: updateData?.productThirdImage,
            isProductImageDeleted: updateData?.isProductImageDeleted,
            calories: updateData?.calories,
            fat: updateData?.fat,
            protien: updateData?.protien,
            showIsOutOfStock: updateData?.showIsOutOfStock,
            productDeliveryText: updateData?.productDeliveryText,
            carbo: updateData?.carbo,
            estimatePreparationTimeInMinutes: updateData?.estimatePreparationTimeInMinutes,
            posId: updateData?.posId,
            isEligibleForFreeItem: updateData?.isEligibleForFreeItem,
            isQtyAvailable: updateData?.isQtyAvailable,
            punchesForPurchase: updateData?.punchesForPurchase,
            commentAllowed: updateData?.commentAllowed,
            productDescription: updateData?.productDescription ? updateData?.productDescription : '',
            productQtyWithBranchs: updateData?.productQtyWithBranchs?.map((obj) => obj?.branchid),
            productSubTypeId: updateData?.productSubTypeId,
            productTypeId: updateData?.productTypeId,
            productGroups: updateData?.productAddOnGroups?.map((obj) => obj?.productAdditionsGroupId),
            addonGroup: '',
            isTopProduct: updateData?.isTopProduct,
            isFeaturedProduct: updateData?.isFeaturedProduct,
            dontMissOutProduct: updateData?.dontMissOutProduct

             
        });

        setP1(null);
    }, [updateData]);
    // const fileToDataUri = file =>
    // new Promise((resolve, reject) => {
    //   const reader = new FileReader();
    //   reader.onload = event => {
    //     resolve(event.target.result);
    //   };
    //   reader.readAsDataURL(file);

    // });

    // useEffect(
    //   ()=>{
    //     if(productTypes?.length>0&&updateData?.productSubTypeId){
    //       productTypes.forEach(element => {
    //         element?.subTypes?.forEach(elemento => {
    //           if(elemento?.id==updateData?.productSubTypeId){
    //             setData(prev=>{
    //             return {...prev,
    //               productTypeId:element?.id,  }
    //               // productSubTypeId:elemento?.id
    //             })
    //           }
    //         });
    //       });
    //     }
    //   }
    //   ,[productTypes,updateData]
    // )
    useEffect(() => {
        if (data?.productTypeId) {
            setCategories(productTypes?.find((obj) => obj.id == data?.productTypeId)?.subTypes);
        }
    }, [data.productTypeId]);

    useEffect(() => {
        if (productTypes?.length > 0) {
            setTypes(productTypes);
        }
    }, [productTypes]);
    return (
        <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            
            <form onSubmit={updateProductData}>
                {ImageUpload && <Box sx={{ width: '100%' }}>
                <LinearProgress />
                </Box>}
                <Box sx={style}>
                    <Grid container spacing={4}>
                        <Grid item>
                            <Typography variant="h4">Update Product </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <DropDown
                                        title="Product Type"
                                        list={types}
                                        data={data}
                                        setData={setData}
                                        keyo={'productTypeId'}
                                        type="normal"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <DropDown
                                        title="Category"
                                        list={categories}
                                        data={data}
                                        setData={setData}
                                        keyo={'productSubTypeId'}
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
                                        type="number"
                                        onChange={(e) => setData({ ...data, orderValue: e.target.value })}
                                    />
                                </Grid>

                                <Grid item xs={4}>
                                    <TextField id="outlined-basic" fullWidth label="Points Of Cost" variant="outlined"
                                        value={data.pointsOfCost}
                                        onChange={(e) => setData({ ...data, pointsOfCost: e.target.value })}
                                    />
                                </Grid>
                {/* <Grid item xs={4}>
                  <TextField id="outlined-basic" fullWidth label="POS ID" variant="outlined"
                    value={data.posId}
                    onChange={(e) => setData({ ...data, posId: e.target.value })}
                  />
                </Grid>  */}

                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Estimate Preparation Time In Minutes"
                                        variant="outlined"
                                        value={data.estimatePreparationTimeInMinutes}
                                        onChange={(e) => setData({ ...data, estimatePreparationTimeInMinutes: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Punches For Purchase"
                                        variant="outlined"
                                        value={data.punchesForPurchase}
                                        onChange={(e) => setData({ ...data, punchesForPurchase: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        multiline
                                        label="Product Description"
                                        variant="outlined"
                                        type="text"
                                        value={data.productDescription}
                                        onChange={(e) => setData({ ...data, productDescription: e.target.value })}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        
            <Grid item xs={12}>
              <Grid container spacing={2} >
                <Grid item xs={3}>
                  <TextField id="outlined-basic" fullWidth label="Calories" variant="outlined"
                    value={data.calories}
                    onChange={(e) => setData({ ...data, calories: e.target.value })}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField id="outlined-basic" fullWidth label="Fat" variant="outlined"
                    value={data.fat}
                    onChange={(e) => setData({ ...data, fat: e.target.value })}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField id="outlined-basic" fullWidth label="Protein" variant="outlined"
                    value={data.protien}
                    onChange={(e) => setData({ ...data, protien: e.target.value })}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField id="outlined-basic" fullWidth label="Carbo" variant="outlined"
                    value={data.carbo}
                    onChange={(e) => setData({ ...data, carbo: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                {/* <Grid item xs={4}>
                  <TextField id="outlined-basic" fullWidth label="Carbo" variant="outlined"
                    value={data.carbo}
                    onChange={(e) => setData({ ...data, carbo: e.target.value })}
                  />
                </Grid> */}
                                {/* <Grid item xs={4}>
                  <TextField id="outlined-basic" fullWidth label="Estimate Preparation Time In Minutes" variant="outlined"
                    value={data.estimatePreparationTimeInMinutes}
                    onChange={(e) => setData({ ...data, estimatePreparationTimeInMinutes: e.target.value })}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField id="outlined-basic" fullWidth label="Punches For Purchase" variant="outlined"
                    value={data.punchesForPurchase}
                    onChange={(e) => setData({ ...data, punchesForPurchase: e.target.value })}
                  />
                </Grid> */}
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                {/* <Grid item xs={3}>
                  <Typography required variant="h7">Is Merch Product</Typography>
                  <Box sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    mt: 2
                  }}>
                    <Switch checked={data.isMerchProduct}
                      onChange={
                        (event) => {
                          setData(prev => (
                            {
                              ...prev,
                              isMerchProduct: event.target.checked
                            }
                          ))
                        }
                      } />
                  </Box>
                </Grid> */}
                                <Grid item xs={3}>
                                    <Typography required variant="h7">
                                        Eligible For Free Item
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
                                            checked={data.isEligibleForFreeItem}
                                            onChange={(event) => {
                                                setData((prev) => ({
                                                    ...prev,
                                                    isEligibleForFreeItem: event.target.checked
                                                }));
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                {/* <Grid item xs={3}>
                  <Typography required variant="h7">show Is Out Of Stock</Typography>
                  <Box sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    mt: 2
                  }}>
                    <Switch checked={data.showIsOutOfStock}
                      onChange={
                        (event) => {
                          setData(prev => (
                            {
                              ...prev,
                              showIsOutOfStock: event.target.checked
                            }
                          ))
                        }
                      } />
                  </Box>
                </Grid> */}

                                <Grid item xs={3}>
                                    <Typography required variant="h7">
                                        Product Image Deleted
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
                                            checked={data.isProductImageDeleted}
                                            onChange={(event) => {
                                                setData((prev) => ({
                                                    ...prev,
                                                    isProductImageDeleted: event.target.checked
                                                }));
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography required variant="h7">
                                        Quantity Available
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
                                            checked={data.isQtyAvailable}
                                            onChange={(event) => {
                                                setData((prev) => ({
                                                    ...prev,
                                                    isQtyAvailable: event.target.checked
                                                }));
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography required variant="h7">
                                        Comment Allowed
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
                                            checked={data.commentAllowed}
                                            onChange={(event) => {
                                                setData((prev) => ({
                                                    ...prev,
                                                    commentAllowed: event.target.checked
                                                }));
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={3}>
                            <Typography required variant="h7">
                                 Top Selling Product
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
                                    checked={data.isTopProduct}
                                    onChange={(event) => {
                                        setData((prev) => ({
                                            ...prev,
                                            isTopProduct: event.target.checked
                                        }));
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography required variant="h7">
                                Featured Product
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
                                    checked={data.isFeaturedProduct}
                                    onChange={(event) => {
                                        setData((prev) => ({
                                            ...prev,
                                            isFeaturedProduct: event.target.checked
                                        }));
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography required variant="h7">
                                Don't Miss out Product
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
                                    checked={data.dontMissOutProduct}
                                    onChange={(event) => {
                                        setData((prev) => ({
                                            ...prev,
                                            dontMissOutProduct: event.target.checked
                                        }));
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                {/* <Grid item xs={3}>
                  <Typography required variant="h7">is Qty Available</Typography>
                  <Box sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    mt: 2
                  }}>
                    <Switch checked={data.isQtyAvailable}
                      onChange={
                        (event) => {
                          setData(prev => (
                            {
                              ...prev,
                              isQtyAvailable: event.target.checked
                            }
                          ))
                        }
                      } />
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Typography required variant="h7">Comment Allowed</Typography>
                  <Box sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    mt: 2
                  }}>
                    <Switch checked={data.commentAllowed}
                      onChange={
                        (event) => {
                          setData(prev => (
                            {
                              ...prev,
                              commentAllowed: event.target.checked
                            }
                          ))
                        }
                      } />
                  </Box>
                </Grid> */}
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={4}>
                                    <Typography variant="h7">Product Image</Typography>
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
                                            src={updateData?.productImage}
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

                        {/* <Grid item xs={12}>

              <Grid container
              >

                <Grid item xs={4}>
                  <Typography variant="h7">Product Image Second</Typography>
                </Grid>
                <Grid item xs={8} />

                <Grid item xs={12}
                >
                  <Box sx={{
                    width: '60%',
                    height: 100,
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 2,
                    backgroundColor: '#eee',
                    ml: '20%'
                  }}>
                    <CloudUploadOutlined style={{ fontSize: '26px', color: '#08c' }} />

                    <input type="file"  onChange={
                    async  (e) => {
                      setP2(e.currentTarget.files[0]) 
                       
                      }
                    } />
                  </Box>

                </Grid>

              </Grid>

            </Grid> */}
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                {/* <Grid item xs={4}>
              <Typography required variant="h7">Product Qty with Branch</Typography>
                  <TextField id="outlined-basic" fullWidth label="Available Qty" variant="outlined"
                    value={data.estimatePreparationTimeInMinutes}
                    onChange={(e) => setData({ ...data, estimatePreparationTimeInMinutes: e.target.value })}
                  />
                </Grid> */}
                                <Grid item xs={4}>
                                    {/* <Typography variant="h7">Product Qty with Branch</Typography> */}
                                    <DropDown
                                        title="Available Branches"
                                        list={branchesList}
                                        data={data}
                                        setData={setData}
                                        keyo={'productQtyWithBranchs'}
                                        mt={2}
                                        type="groups"
                                        notRequired={true}
                                    />
                                </Grid>

                                {/* <Grid item xs={4}>
                  <Typography required variant="h7">Suggest</Typography>
                  <Box sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    mt: 2
                  }}>
                    <Switch checked={data.isQtyAvailable}
                      onChange={
                        (event) => {
                          setData(prev => (
                            {
                              ...prev,
                              isQtyAvailable: event.target.checked
                            }
                          ))
                        }
                      } />
                  </Box>
                </Grid> */}
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            {/* <Typography
                required variant="h6">Addons</Typography> */}
                            {/* <Grid container spacing={2} mt={1} >

                <Grid item xs={3}>
                  <DropDown title="Addon Group"
                    list={addonGroupList}
                    data={data}
                    setData={setData}
                    keyo={"addonGroup"}
                    type="normal"
                  />
                </Grid> */}
                            {/* <Grid item xs={3}>
                    <DropDown title="Addons"
                  list={addonList}
                  data={data}
                  setData={setData}
                  keyo={"addon"}
                  type="groups"
                />
                        
                    </Grid> */}
                            {/* <Grid item xs={3}>

                  <Button onClick={addAddon} >
                    Add new
                  </Button>

                </Grid>

              </Grid> */}

                            <Grid item xs={4}>
                                {/* <Typography variant="h7">Product Qty with Branch</Typography> */}
                                <DropDown
                                    title="Addons Group"
                                    list={addonGroupList}
                                    data={data}
                                    setData={setData}
                                    keyo={'productGroups'}
                                    mt={2}
                                    type="groups"
                                    notRequired={true}
                                />
                            </Grid>

                            {data?.productGroups?.map((row, index) => {
                                return (
                                    <Grid container spacing={2} my={1}>
                                        <Grid item xs={3}>
                                            {/* <TextField id="outlined-basic" fullWidth label="Addon Group name" variant="outlined" 
                                value={addonGroupList?.find(obj=>obj.id==row.addonGroup)?.name}
                                editable={false} 
                                /> */}
                                            <Box border={0.8} borderRadius={1} p={1}>
                                                <Typography variant="body1">
                                                    {addonGroupList?.find((obj) => obj.id == row)?.name}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        {/* <Grid item xs={3}>
                               
                               {
                                row?.addon?.map(ob=>{
                                  return(
                                    <Typography>
                                      { addonList?.find(obj=>obj.id==ob)?.name} sd
                                    </Typography>
                                  )
                                })
                               }
                            </Grid> */}
                                        <Grid item xs={3}>
                                            <Button onClick={() => removeAddon(index)} color="error">
                                                remove
                                            </Button>
                                        </Grid>
                                    </Grid>
                                );
                            })}
                        </Grid>

                        {/* Footer */}

                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={6} />
                                <Grid container spacing={2} justifyContent="space-between">
                                    <Grid item>
                                        <Button variant="outlined" color="error" onClick={() => deleteProduct()}>
                                            Delete this product
                                        </Button>
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
                                                    Update
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

export default UpdateProduct;
