import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import UploadFile from 'components/Upload-File/upload-file';
import storeServices from 'services/storeServices';
import branchServices from 'services/branchServices';
import {
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
    FormLabel,
    InputLabel,
    MenuItem,
    Select
} from '@mui/material/index';
import LinearProgress from '@mui/material/LinearProgress';
import fileService from 'services/fileService';
import offerServices from 'services/offerServices';
import imageCompression from 'browser-image-compression';
import { IMAGE_COMPRESSION_MAX_SIZE_MB } from 'helper/constants';

const OfferModal = ({ modalOpen, setModalOpen, onClose, offer = null, brand }) => {
    const [Image, setImage] = useState(null);
    const [ViewImage, setViewImage] = useState(null);
    const [actionItems, setActionItems] = useState([]);
    const [branchOptions, setBranchOptions] = useState([]);
    const intialData = {
        id: 0,
        brandId: 0,
        branchId: 0,
        offerName: '',
        orderValue:0,
        offerImageUrl: '',
        actionType: 0,
        actionId: 0
    };
    const [Offer, setOffer] = useState(intialData);
    const [load, setload] = useState(false);
    const actions = [
        {
            value: 0,
            label: 'Menu'
        },
        {
            value: 1,
            label: 'Category'
        },
        {
            value: 2,
            label: 'SubCategory'
        },
        {
            value: 3,
            label: 'Product'
        }
    ];

    const nameError = () => {
        if (Offer.offerName) {
            return false;
        } else {
            return true;
        }
    };

    const handleClose = () => {
        onClose(brand.id);
        setModalOpen(false);
        setOffer(intialData);
    };

    const getAllBranchesByBrandId = async (brandId) => {
        try {
            const response = await branchServices.getAllBranches();
            const filteredBranches = (response?.data?.result || []).filter(
                (branchItem) => Number(branchItem?.brandId) === Number(brandId)
            );

            setActionItems(
                filteredBranches.map((branchItem) => ({
                    id: branchItem?.id,
                    name: branchItem?.name || branchItem?.branchName
                }))
            );
        } catch (error) {
            setActionItems([]);
        }
    };

    const getBranchOptionsByBrandId = async (brandId) => {
        try {
            const response = await branchServices.getAllBranches();
            const filteredBranches = (response?.data?.result || []).filter(
                (branchItem) => Number(branchItem?.brandId) === Number(brandId)
            );

            setBranchOptions(
                filteredBranches.map((branchItem) => ({
                    id: branchItem?.id,
                    name: branchItem?.name || branchItem?.branchName
                }))
            );
        } catch (error) {
            setBranchOptions([]);
        }
    };

    const getMenuActions = async (action, id) => {
        const selectedBrandId = id || brand?.id;

        if (action === 0) {
            await getAllBranchesByBrandId(selectedBrandId);
            return;
        }

        if (action === 1 || action === 2) {
            try {
                const response = await storeServices.getProductTypes(selectedBrandId);
                if (response) {
                    switch (action) {
                        case 1:
                            setActionItems(response.data.result);
                            break;
                        case 2:
                            setActionItems(getAllSubTypes(response.data.result));
                            break;
                        default:
                            setActionItems([]);
                    }
                }
            } catch (error) {}
        } else if (action === 3) {
            getAllProductsByBrandId(selectedBrandId);
        } else {
            setActionItems([]);
        }
    };

    useEffect(() => {
        if (offer) {
            const temp = { ...offer };
            setOffer({ ...offer });
            setViewImage(temp.offerImageUrl);
            getMenuActions(offer.actionType, offer.brandId);
        } else {
            setOffer({ ...intialData, brandId: brand?.id || 0, branchId: 0 });
            setViewImage(null);
            getMenuActions(0, brand?.id);
        }
    }, [offer, brand?.id]);
    useEffect(() => {
        console.log(Offer,"Offer");
        
    }, [Offer]);

    useEffect(() => {
        if (modalOpen && Offer?.actionType === 0) {
            getMenuActions(0, brand?.id || Offer.brandId);
        }
    }, [modalOpen, brand?.id]);

    useEffect(() => {
        if (modalOpen && brand?.id) {
            getBranchOptionsByBrandId(brand.id);
        }
    }, [modalOpen, brand?.id]);

    const getAllSubTypes = (items) => {
        let allSubTypes = [];

        items.forEach((item) => {
            if (item.hasOwnProperty('subTypes')) {
                allSubTypes = allSubTypes.concat(item.subTypes);
            }
        });

        return allSubTypes;
    };
    const getAllProductsByBrandId = async (brandId) => {
        try {
            const response = await storeServices.getProductNameandIdByBrandid(brandId);
            if (response) {
                const products = response.data.result.map((product) => {
                    return {
                        id: product.productId,
                        ...product
                    };
                });

                setActionItems(products);
            }
        } catch (error) {
            setActionItems([]);
        }
    };
    const submitForm = async () => {
        setload(true);
        if (!offer) {
            try {
                setload(true);
                const options = {
                    maxSizeMB: IMAGE_COMPRESSION_MAX_SIZE_MB,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                };
                const compressedFile = await imageCompression(Image, options);
                
                const uploadRes = await fileService.uploadProductImage(compressedFile);
                const payload = {
                    id: 0,
                    brandId: brand.id,
                    branchId: Offer.branchId,
                    offerName: Offer.offerName,
                    offerImageUrl: uploadRes.data?.result,
                    actionType: Offer.actionType,
                    actionId: Offer.actionType === 0 ? Offer.branchId : Offer.actionId,
                    orderValue: Offer.orderValue
                };

                await offerServices.CreateOffer(payload);

                setImage(null);
                setload(false);
                setOffer({
                    id: 0,
                    brandId: 0,
                    branchId: 0,
                    offerName: '',
                    offerImageUrl: '',
                    actionType: 0,
                    actionId: 0,
                    orderValue:0,
                });
                handleClose();
            } catch (err) {
                console.error(err);
            }
        } else {
            if (Image) {
                                const options = {
                    maxSizeMB: IMAGE_COMPRESSION_MAX_SIZE_MB,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                };
                const compressedFile = await imageCompression(Image, options);
                const uploadRes = await fileService.uploadProductImage(compressedFile);
                const payload = {
                    ...offer,
                    brandId: brand.id,
                    branchId: Offer.branchId,
                    offerName: Offer.offerName,
                    offerImageUrl: uploadRes.data?.result,
                    actionType: Offer.actionType,
                    actionId: Offer.actionType === 0 ? Offer.branchId : Offer.actionId,
                    orderValue:Offer.orderValue
                };
                await offerServices.UpdateOffer(payload);
                setImage(null);
                setload(false);
                handleClose();
            } else {
                const payload = {
                    ...offer,
                    brandId: Offer.brandId,
                    branchId: Offer.branchId,
                    offerName: Offer.offerName,
                    offerImageUrl: Offer.offerImageUrl,
                    actionType: Offer.actionType,
                    actionId: Offer.actionType === 0 ? Offer.branchId : Offer.actionId,
                    orderValue: Offer.orderValue
                };
                await offerServices.UpdateOffer(payload);
                setImage(null);
                setload(false);
                handleClose();
            }
        }
    };

    return (
        <>
            <Dialog
                open={modalOpen}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        submitForm();
                    }
                }}
            >
                {load && (
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>
                )}
                <DialogTitle>
                    <Typography fontSize={22} fontWeight={700}>
                        {!offer ? 'Create Offer' : 'Update Offer'}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <UploadFile Image={ViewImage} setImage={setImage} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                margin="dense"
                                id="name"
                                name="Name"
                                error={nameError()}
                                label="Name"
                                type="text"
                                onChange={(event) => setOffer({ ...Offer, offerName: event.target.value })}
                                value={Offer.offerName}
                                variant="outlined"
                            />
                        </Grid>
                        {/* <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">{'Brand'}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={Offer.brandId}
                                    sx={{ marginTop: 1,minWidth: 150}}
                                    label={'Brand'}
                                    onChange={(event) => {
                                        setOffer({  ...Offer,brandId: event.target.value, });
                                    }}
                                >
                                    {brandsList.map((row, index) => {
                                        return (
                                            <MenuItem key={index} value={row.id}>
                                                {row?.name}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid> */}
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="offer-branch-select-label">{'Branch'}</InputLabel>
                                <Select
                                    labelId="offer-branch-select-label"
                                    id="offer-branch-select"
                                    value={Offer?.branchId ?? 0}
                                    label={'Branch'}
                                    onChange={(event) => {
                                        setOffer({
                                            ...Offer,
                                            branchId: event.target.value,
                                            actionId: Offer?.actionType === 0 ? event.target.value : Offer.actionId
                                        });
                                    }}
                                >
                                    <MenuItem value={0}>All Branches</MenuItem>
                                    {branchOptions.map((row, index) => {
                                        return (
                                            <MenuItem key={index} value={row.id}>
                                                {row?.name}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">{'Action'}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={Offer?.actionType}
                                    label={'Action'}
                                    onChange={(event) => {
                                        setOffer({
                                            ...Offer,
                                            actionType: event.target.value,
                                            actionId: event.target.value === 0 ? Offer.branchId : 0
                                        });
                                        getMenuActions(event.target.value, brand?.id || Offer.brandId);
                                    }}
                                >
                                    {actions.map((row, index) => {
                                        return (
                                            <MenuItem key={index} value={row.value}>
                                                {row?.label}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        {Offer?.actionType !== 0 && (
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">{'Action Items'}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={Offer?.actionId}
                                        label={'Action Item'}
                                        onChange={(event) => {
                                            setOffer({ ...Offer, actionId: event.target.value });
                                        }}
                                    >
                                        {actionItems.map((row, index) => {
                                            return (
                                                <MenuItem key={index} value={row.id}>
                                                    {row?.name || row?.branchName}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
                        <Grid item xs={6}>
    <TextField
        fullWidth
        required
        margin="dense"
        id="sortOrder"
        name="Sort Order"
        label="Sort Order"
        type="number"
        inputProps={{ min: 1 }}
        onChange={(event) => setOffer({ ...Offer, orderValue: +event.target.value })}
        value={Offer.orderValue}
        variant="outlined"
    />
</Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OfferModal;
