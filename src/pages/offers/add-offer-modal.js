import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import UploadFile from 'components/Upload-File/upload-file';
import storeServices from 'services/storeServices';
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
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import LinearProgress from '@mui/material/LinearProgress';
import fileService from 'services/fileService';
import offerServices from 'services/offerServices';

const OfferModal = ({ modalOpen, setModalOpen, onClose, offer = null, brand }) => {
    const [Image, setImage] = useState(null);
    const [ViewImage, setViewImage] = useState(null);
    const [actionItems, setActionItems] = useState([]);
    const intialData = {
        id: 0,
        brandId: 0,
        branchId: 0,
        offerName: '',
        offerImageUrl: '',
        actionType: 0,
        actionId: 0
    };
    const [Offer, setOffer] = useState(intialData);
    const [load, setload] = useState(false);
    const { brandsList } = useFetchBrandsList(false);
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
        onClose();
        setModalOpen(false);
        setOffer(intialData);
    };

    const getMenuActions = async (action, id) => {
        if (action === 1 || action === 2) {
            try {
                const response = await storeServices.getProductTypes(brand.id);
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
            getAllProductsByBrandId(brand.id);
        } else {
            setActionItems([]);
        }
    };

    useEffect(() => {
        if (brandsList[0]?.id) {
            setOffer({ ...Offer, brandId: brandsList[0].id });
        }
    }, [brandsList]);

    useEffect(() => {
        if (offer) {
            const temp = { ...offer };
            setOffer({ ...offer });
            setViewImage(temp.offerImageUrl);
            getMenuActions(offer.actionType, offer.brandId);
        } else {
            setOffer({ ...intialData });
            setViewImage(null);
        }
    }, [offer]);
    useEffect(() => {}, [Offer]);

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
                const uploadRes = await fileService.uploadProductImage(Image);
                const payload = {
                    id: 0,
                    brandId: brand.id,
                    branchId: 0,
                    offerName: Offer.offerName,
                    offerImageUrl: uploadRes.data?.result,
                    actionType: Offer.actionType,
                    actionId: Offer.actionId
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
                    actionId: 0
                });
                handleClose();
            } catch (err) {
                console.error(err);
            }
        } else {
            if (Image) {
                const uploadRes = await fileService.uploadProductImage(Image);
                const payload = {
                    ...offer,
                    brandId: brand.id,
                    offerName: Offer.offerName,
                    offerImageUrl: uploadRes.data?.result,
                    actionType: Offer.actionType,
                    actionId: Offer.actionId
                };
                await offerServices.UpdateOffer(payload);
                setImage(null);
                setload(false);
                handleClose();
            } else {
                const payload = {
                    ...offer,
                    brandId: Offer.brandId,
                    offerName: Offer.offerName,
                    offerImageUrl: Offer.offerImageUrl,
                    actionType: Offer.actionType,
                    actionId: Offer.actionId
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
                                <InputLabel id="demo-simple-select-label">{'Action'}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={Offer?.actionType}
                                    label={'Action'}
                                    onChange={(event) => {
                                        setOffer({ ...Offer, actionType: event.target.value });
                                        getMenuActions(event.target.value, Offer.brandId);
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
                                                {row?.name}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
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
