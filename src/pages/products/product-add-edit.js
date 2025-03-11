import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import {
    TextField,
    Grid,
    Button,
    MenuItem,
    Box,
    Typography,
    Tab,
    FormControlLabel,
    InputLabel,
    FormControl,
    Switch,
    Card,
    Select
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ServiceFactory } from 'services/index';
import constants from 'helper/constants';
import { useFetchProductTypeList } from 'features/Store/ProductType/hooks/useFetchProductTypeList';
import { useFetchBranchList } from 'features/BranchesTable/hooks/useFetchBranchesList';
import storeServices from 'services/storeServices';
import fileService from 'services/fileService';
import { useFetchAddonList } from 'features/Store/Addons/hooks/useFetchAddonList';
import { useFetchAddonGroupList } from 'features/Store/AddonGroups/hooks/useFetchAddonGroupList';
import imageCompression from 'browser-image-compression';
import { useSnackbar } from 'notistack';
const ProductAddEdit = () => {
    const initialValues = {
        addon: [],
        addonGroup: '',
        addonGroups: [],
        calories: 0,
        carbo: 0,
        commentAllowed: true,
        dontMissOutProduct: false,
        estimatePreparationTimeInMinutes: 0,
        fat: 0,
        isDeliveryProduct: false,
        isEligibleForFreeItem: false,
        isFeaturedProduct: false,
        isMerchProduct: false,
        isQtyAvailable: false,
        isTopProduct: false,
        name: '',
        nativeName: '',
        newAddonGroup: '',
        pointsOfCost: 0,
        punchesForPurchase: 0,
        price: 0,
        productDescription: '',
        productDescriptionNative: '',
        productImage: null,
        productQtyWithBranchs: [],
        productTypeId: '',
        productSubTypeId: '',
        protien: 0,
        showIsOutOfStock: true,
        subTypes: [],
        type: ''
    };

    const [formValues, setFormValues] = useState(initialValues);

    // Validation schemas for each tab
    const validationSchemas = {
        basicInfo: Yup.object().shape({
            name: Yup.string().required('Product Name is required'),
            price: Yup.number().required('Price is required').moreThan(0, 'Price must be greater than 0'),
            pointsOfCost: Yup.number().required('Points of Cost is required'),
            type: Yup.number().required('Category is required'),
            productSubTypeId: Yup.number().required('Subcategory is required'),
            estimatePreparationTimeInMinutes: Yup.number().required('Estimated Time is required')
        }),
        addOns: Yup.object().shape({
            // addonGroups: Yup.array().of(
            //     Yup.object().shape({
            //         groupId: Yup.string().required('Addon Group is required')
            //     })
            // )
        }),

        branches: Yup.object().shape({
            productQtyWithBranchs: Yup.array()
                .of(
                    Yup.object().shape({
                        branchid: Yup.number().required('Branch ID is required'),
                        availabilityQty: Yup.number(),
                        availabilityQtyIn: Yup.number(),
                        isSuggest: Yup.boolean(),
                        isQtyAvailable: Yup.boolean(),
                        productId: Yup.number()
                    })
                )
                .min(1, 'At least one branch must be selected') // Ensure at least one branch is selected
        }),
        settings: Yup.object().shape({}),
        nutritions: Yup.object().shape({
            calories: Yup.number().required('Calories are required'),
            fat: Yup.number().required('Fat is required'),
            protien: Yup.number().required('Protein is required'),
            carbo: Yup.number().required('Carbohydrates are required')
        }),
        image: Yup.object().shape({
            // productImage: Yup.().required('Product image is required')
        })
    };

    const { bid, id } = useParams();
    const [tabValue, setTabValue] = useState('basicInfo');
    const [brand, setBrand] = useState({ id: bid });
    const [Product, setProduct] = useState();
    const [ProductTypes, setProductTypes] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { addonGroupList } = useFetchAddonGroupList(false, brand);
    const { productTypes, fetchProductTypesList } = useFetchProductTypeList(false, brand);

    const { branchesList } = useFetchBranchList(true);
    const filteredBranch = branchesList.filter((e) => e.brandId === +bid);
    useEffect(() => {
        if (id) {
            getProductById();
        } else {
            setProduct();
        }
    }, []);

    useEffect(() => {
        if (productTypes) {
            setProductTypes(productTypes);
        }
        if (Product) {
            // Transform API response into `initialValues`
            const transformedValues = {
                addon: [],
                addonGroup: '',
                addonGroups:
                    Product.productAddOnGroups?.map((group) => ({
                        groupId: group.productAdditionsGroupId,
                        groupName: addonGroupList.find((g) => g.id === group.productAdditionsGroupId)?.name || 'Unknown',
                        orderValue: group.orderValue,
                        posId: group.posId
                    })) || [],
                calories: Product.calories || 0,
                carbo: Product.carbo || 0,
                commentAllowed: Product.commentAllowed || false,
                dontMissOutProduct: Product.dontMissOutProduct || false,
                estimatePreparationTimeInMinutes: Product.estimatePreparationTimeInMinutes || 0,
                fat: Product.fat || 0,
                isDeliveryProduct: Product.isDeliveryProduct || false,
                isEligibleForFreeItem: Product.isEligibleForFreeItem || false,
                isFeaturedProduct: Product.isFeaturedProduct || false,
                isMerchProduct: Product.isMerchProduct || false,
                isQtyAvailable: Product.isQtyAvailable || false,
                isTopProduct: Product.isTopProduct || false,
                name: Product.name || '',
                nativeName: Product.nativeName || '',
                newAddonGroup: '',
                pointsOfCost: Product.pointsOfCost || 0,
                price: Product.price || 0,
                productDescription: Product.productDescription || '',
                productDescriptionNative: Product.productDescriptionNative || '',
                productImage: Product.productImage || null,
                productQtyWithBranchs: Product.productQtyWithBranchs || [],
                productSubTypeId: Product.productSubTypeId || '',
                punchesForPurchase: Product.punchesForPurchase || 0,
                protien: Product.protien || 0,
                showIsOutOfStock: Product.showIsOutOfStock || false,
                subTypes: productTypes.find((type) => type.id === Product.productTypeId)?.subTypes || [],
                type: Product.productTypeId || ''
            };

            // Update form values in a single call
            setFormValues((prevValues) => ({
                ...prevValues,
                ...transformedValues
            }));
        }
    }, [Product, productTypes, addonGroupList]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const deleteProduct = async () => {
        setLoading(true);
        await storeServices
            .deleteProduct(id)
            .then((res) => {
                // console.log(res?.data, "deleted");
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
                navigate(`/products?brandId=${bid}`);
            });
    };
    const getProductById = async () => {
        setLoading(true);
        try {
            const response = await storeServices.getGetProductByProductIdWithBrandQty(id);

            if (response?.data?.result) {
                const productData = response.data.result;

                // Fetch product types if not already loaded
                if (productTypes.length === 0) {
                    await fetchProductTypesList();
                }
                setLoading(false);
                // Update product state
                setProduct(productData);
            } else {
                console.error('No data returned from API');
            }
        } catch (error) {
            console.error('Failed to fetch product data:', error);
            enqueueSnackbar('Failed to fetch product details.', { variant: 'error' });
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h4">{id ? 'Edit Product' : 'Create New Product'}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Card sx={{ padding: 0, margin: '0 0' }}>
                    {loading && (
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    )}
                    <Formik
                        initialValues={formValues}
                        enableReinitialize
                        validationSchema={validationSchemas[tabValue]}
                        onSubmit={(values, { setTouched, validateForm, setSubmitting }) => {
                            validateForm().then((errors) => {
                                const requiredFields = ['name', 'price', 'pointsOfCost', 'productSubTypeId', 'type'];

                                // Find missing fields
                                const missingFields = requiredFields.filter(
                                    (field) => values[field] === undefined || values[field] === null || values[field] === ''
                                );
                                if (missingFields.length > 0) {
                                    setTouched(
                                        missingFields.reduce((acc, key) => {
                                            acc[key] = true;
                                            return acc;
                                        }, {})
                                    );
                                    // Mark all missing fields as touched
                                    missingFields.forEach((e) => {
                                        enqueueSnackbar(`Please fill required field "${e}"`, { variant: 'error' });
                                    });
                                    // Show a snackbar with a message
                                    // Mark all fields as touched if there are validation errors

                                    setSubmitting(false); // Stop form submission
                                    return;
                                }

                                // Check if the product image is missing
                                const isImageMissing = !values.productImage;

                                if (isImageMissing) {
                                    // Show appropriate error message
                                    if (isImageMissing) {
                                        enqueueSnackbar('Please add an Image', { variant: 'error' });
                                    }

                                    setSubmitting(false);
                                    return; // Stop submission
                                }
                                setLoading(true);
                                // Proceed with form submission
                                setSubmitting(true);
                                const isUpdate = !!id;
                                let updatepayload = {};
                                let payload = {
                                    productTypeId: values.type,
                                    productSubTypeId: values.productSubTypeId,
                                    orderValue: +values.orderValue,
                                    customerBranch: values.productQtyWithBranchs.map((e) => e.branchid),
                                    productDescriptionNative: values?.productDescriptionNative,
                                    productDescription: values?.productDescription,
                                    punchesForPurchase: values?.punchesForPurchase,
                                    brandId: bid,
                                    newProducts: [
                                        {
                                            name: values?.name,
                                            price: values?.price,
                                            pointsOfCost: +values?.pointsOfCost || 0,
                                            nativeName: values?.nativeName,
                                            isDeliveryProduct: values?.isDeliveryProduct,
                                            productDescriptionNative: values?.productDescriptionNative,
                                            productDescription: values?.productDescription,
                                            productGroups: values?.addonGroups?.map((group) => ({
                                                prodGroupId: group.groupId,
                                                productAddOns: []
                                            }))
                                        }
                                    ]
                                };
                                if (isUpdate) {
                                    updatepayload = {
                                        productId: isUpdate ? id : 0, // Use `id` for update or 0 for create
                                        name: values.name,
                                        nativeName: values.nativeName,
                                        productImage: typeof values.productImage === 'string' ? values.productImage : '', // Skip upload if string
                                        productSecondImage: '',
                                        productThirdImage: '',
                                        isMerchProduct: values.isMerchProduct,
                                        isDeliveryProduct: values.isDeliveryProduct,
                                        dontMissOutProduct: values.dontMissOutProduct,
                                        isFeaturedProduct: values.isFeaturedProduct,
                                        isStockProduct: values.isStockProduct,
                                        isTopProduct: values.isTopProduct,
                                        calories: values.calories,
                                        fat: values.fat,
                                        protien: values.protien,
                                        carbo: values.carbo,
                                        estimatePreparationTimeInMinutes: values.estimatePreparationTimeInMinutes,
                                        isFileRequired: values.isFileRequired,
                                        posId: 0,
                                        price: values.price,
                                        isEligibleForFreeItem: values.isEligibleForFreeItem,
                                        isQtyAvailable: values.isQtyAvailable,
                                        punchesForPurchase: values.punchesForPurchase,
                                        pointsOfCost: values.pointsOfCost,
                                        orderValue: values.orderValue,
                                        commentAllowed: values.commentAllowed,
                                        productDescription: values.productDescription,
                                        productDescriptionNative: values.productDescriptionNative,
                                        productSubTypeId: values.productSubTypeId,
                                        productTypeId: values.type,
                                        productQtyWithBranchs: values.productQtyWithBranchs.map((branch) => ({
                                            availabilityQtyIn: branch.availabilityQtyIn || 1000,
                                            availabilityQty: branch.availabilityQty || 1000,
                                            branchid: branch.branchid,
                                            isSuggest: branch.isSuggest || false,
                                            productId: branch.productId || id,
                                            isQtyAvailable: branch.isQtyAvailable || false
                                        })),
                                        productGroups: values.addonGroups.map((group) => ({
                                            productId: id,
                                            prodGroupId: group.groupId,
                                            orderValue: group.orderValue || 0
                                        }))
                                    };
                                }
                                const options = {
                                    maxSizeMB: 0.1,
                                    maxWidthOrHeight: 1920,
                                    useWebWorker: true
                                };
                                const uploadImagePromise =
                                    typeof values.productImage === 'string'
                                        ? Promise.resolve(values.productImage) // If already a string, resolve with the existing value
                                        : imageCompression(values.productImage, options) // Otherwise, compress and upload
                                              .then((compressedFile) => fileService.uploadProductImage(compressedFile))
                                              .then((uploadResponse) => uploadResponse.data?.result);

                                uploadImagePromise
                                    .then((uploadedImage) => {
                                        console.log(uploadedImage, 'uploadedImage');

                                        !isUpdate
                                            ? (payload.newProducts[0].productImage = uploadedImage)
                                            : (updatepayload.productImage = uploadedImage);
                                        return isUpdate
                                            ? storeServices.updateProduct(updatepayload) // Call update service
                                            : storeServices.createNewProduct(payload); // Call create service
                                    })
                                    .then(() => {
                                        enqueueSnackbar(isUpdate ? 'Product updated successfully!' : 'Product created successfully!', {
                                            variant: 'success'
                                        });
                                        navigate(`/products?brandId=${bid}`);
                                    })
                                    .catch((error) => {
                                        console.log(
                                            'Error during product operation:',
                                            error.response.data.error.validationErrors[0]?.message
                                        );
                                        enqueueSnackbar(
                                            error?.response?.data?.error?.validationErrors[0]?.message ||
                                                'An error occurred while saving the product.',
                                            { variant: 'error' }
                                        );
                                    })
                                    .finally(() => {
                                        setSubmitting(false);
                                        setLoading(false);
                                    });
                            });
                        }}
                    >
                        {({ values, handleChange, handleBlur, setFieldValue, errors, touched, isValid, setTouched }) => (
                            <Form>
                                <TabContext value={tabValue}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 3 }}>
                                        <TabList onChange={handleTabChange}>
                                            <Tab label="Basic Info" value="basicInfo" disabled={!id && tabValue !== 'basicInfo'} />
                                            <Tab label="Add Ons" value="addOns" disabled={!id && tabValue !== 'addOns'} />
                                            <Tab label="Stores" value="branches" disabled={!id && tabValue !== 'branches'} />
                                            {id && [
                                                <Tab key="settings" label="Settings" value="settings" />,
                                                <Tab
                                                    key="nutritions"
                                                    label="Nutritions"
                                                    value="nutritions"
                                                    disabled={!id && tabValue !== 'nutritions'}
                                                />
                                            ]}
                                            <Tab label="Image" value="image" disabled={!id && tabValue !== 'image'} />
                                        </TabList>
                                    </Box>

                                    {/* Tab Panels */}
                                    <TabPanel value="basicInfo">
                                        <Grid container spacing={3}>
                                            {/* Product Name */}
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Product Name*"
                                                    name="name"
                                                    value={values.name}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.name && Boolean(errors.name)}
                                                    helperText={touched.name && errors.name}
                                                />
                                            </Grid>

                                            {/* Product Name (Native) */}
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Product Name (Native)*"
                                                    name="nativeName"
                                                    value={values.nativeName}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.nativeName && Boolean(errors.nativeName)}
                                                    helperText={touched.nativeName && errors.nativeName}
                                                />
                                            </Grid>

                                            {/* Product Type */}
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    select
                                                    label="Product Type*"
                                                    name="type"
                                                    value={values.type}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        const selectedType = ProductTypes.find((type) => type.id === +e.target.value);
                                                        setFieldValue('productSubTypeId', '');
                                                        if (selectedType) {
                                                            setFieldValue('subTypes', selectedType.subTypes || []);
                                                        }
                                                    }}
                                                    onBlur={handleBlur}
                                                    error={touched.type && Boolean(errors.type)}
                                                    helperText={touched.type && errors.type}
                                                >
                                                    {/* Example product type options */}
                                                    {ProductTypes?.map((e) => (
                                                        <MenuItem value={e?.id}>{e?.name}</MenuItem>
                                                    ))}
                                                    {/* <MenuItem value={2}>Type 2</MenuItem> */}
                                                </TextField>
                                            </Grid>

                                            {/* Product Category */}
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    select
                                                    label="Product Category*"
                                                    name="productSubTypeId"
                                                    value={values.productSubTypeId}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.productSubTypeId && Boolean(errors.productSubTypeId)}
                                                    helperText={touched.productSubTypeId && errors.productSubTypeId}
                                                    disabled={!values.type || !values.subTypes?.length}
                                                >
                                                    {values.subTypes.map((subType) => (
                                                        <MenuItem key={subType.id} value={subType.id}>
                                                            {subType.name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>

                                            {/* Price */}
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    label="Price*"
                                                    name="price"
                                                    value={values.price}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.price && Boolean(errors.price)}
                                                    helperText={touched.price && errors.price}
                                                />
                                            </Grid>

                                            {/* Sort Order */}
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    label="Sort Order"
                                                    name="orderValue"
                                                    value={values.orderValue}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.orderValue && Boolean(errors.orderValue)}
                                                    helperText={touched.orderValue && errors.orderValue}
                                                />
                                            </Grid>

                                            {/* Punches For Purchase */}
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    label="Punches For Purchase*"
                                                    name="punchesForPurchase"
                                                    value={values.punchesForPurchase}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.punchesForPurchase && Boolean(errors.punchesForPurchase)}
                                                    helperText={touched.punchesForPurchase && errors.punchesForPurchase}
                                                />
                                            </Grid>

                                            {/* Points of Cost */}
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    label="Points of Cost"
                                                    name="pointsOfCost"
                                                    value={values.pointsOfCost}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.pointsOfCost && Boolean(errors.pointsOfCost)}
                                                    helperText={touched.pointsOfCost && errors.pointsOfCost}
                                                />
                                            </Grid>

                                            {/* Estimate Preparation Time */}
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    type="number"
                                                    label="Estimate Preparation Time"
                                                    name="estimatePreparationTimeInMinutes"
                                                    value={values.estimatePreparationTimeInMinutes}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={
                                                        touched.estimatePreparationTimeInMinutes &&
                                                        Boolean(errors.estimatePreparationTimeInMinutes)
                                                    }
                                                    helperText={
                                                        touched.estimatePreparationTimeInMinutes && errors.estimatePreparationTimeInMinutes
                                                    }
                                                />
                                            </Grid>

                                            {/* Description */}
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    label="Description"
                                                    name="productDescription"
                                                    value={values.productDescription}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.productDescription && Boolean(errors.productDescription)}
                                                    helperText={touched.productDescription && errors.productDescription}
                                                />
                                            </Grid>

                                            {/* Description (Native) */}
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    label="Description (Native)"
                                                    name="productDescriptionNative"
                                                    value={values.productDescriptionNative}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.productDescriptionNative && Boolean(errors.productDescriptionNative)}
                                                    helperText={touched.productDescriptionNative && errors.productDescriptionNative}
                                                />
                                            </Grid>

                                            {/* Navigation Button */}
                                            <Grid item xs={12} container justifyContent="flex-end">
                                                <Button
                                                    variant="contained"
                                                    sx={{ minWidth: '120px' }}
                                                    onClick={() => {
                                                        if (!validationSchemas['basicInfo'].isValidSync(values)) {
                                                            // Mark all fields in 'basicInfo' as touched

                                                            const basicInfoFields = Object.keys(validationSchemas['basicInfo'].fields);

                                                            // Mark only those fields as touched
                                                            setTouched(
                                                                basicInfoFields.reduce((acc, field) => {
                                                                    acc[field] = true;
                                                                    return acc;
                                                                }, {})
                                                            );
                                                        } else {
                                                            setTabValue('addOns');
                                                        }
                                                    }}
                                                >
                                                    Next
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>

                                    <TabPanel value="addOns">
                                        <FieldArray
                                            name="addonGroups"
                                            render={(arrayHelpers) => (
                                                <Grid container spacing={2}>
                                                    {/* Dropdown for selecting Addon Group */}
                                                    <Grid item xs={5}>
                                                        <TextField
                                                            fullWidth
                                                            select
                                                            label="Addon Group"
                                                            value={values.newAddonGroup || ''}
                                                            onChange={(e) =>
                                                                arrayHelpers.form.setFieldValue('newAddonGroup', e.target.value)
                                                            }
                                                        >
                                                            {addonGroupList.map((group) => (
                                                                <MenuItem key={group.id} value={group.id}>
                                                                    {group.name}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </Grid>

                                                    {/* Add Button */}
                                                    <Grid item xs={2} display="flex" alignItems="center">
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => {
                                                                if (values.newAddonGroup) {
                                                                    const selectedGroup = addonGroupList.find(
                                                                        (g) => g.id === values.newAddonGroup
                                                                    );
                                                                    arrayHelpers.push({
                                                                        groupId: selectedGroup.id,
                                                                        groupName: selectedGroup.name
                                                                    });
                                                                    arrayHelpers.form.setFieldValue('newAddonGroup', ''); // Reset dropdown
                                                                }
                                                            }}
                                                            disabled={!values.newAddonGroup} // Disable if no value selected
                                                        >
                                                            Add
                                                        </Button>
                                                    </Grid>

                                                    {/* Display existing addon groups */}
                                                    {values.addonGroups?.map((addonGroup, index) => (
                                                        <React.Fragment key={index}>
                                                            {/* Group Name Display */}
                                                            <Grid item xs={5}></Grid>

                                                            {/* Editable Input */}
                                                            <Grid item xs={5}>
                                                                <TextField
                                                                    fullWidth
                                                                    label="Custom Group Name"
                                                                    name={`addonGroups[${index}].groupName`}
                                                                    value={addonGroup.groupName || ''}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    readonly
                                                                />
                                                            </Grid>

                                                            {/* Remove Button */}
                                                            <Grid item xs={2} display="flex" alignItems="center">
                                                                <Button
                                                                    variant="outlined"
                                                                    color="error"
                                                                    onClick={() => arrayHelpers.remove(index)}
                                                                >
                                                                    Remove
                                                                </Button>
                                                            </Grid>
                                                        </React.Fragment>
                                                    ))}
                                                </Grid>
                                            )}
                                        />
                                        <Grid item xs={12} style={{ marginTop: '10px' }} container justifyContent="flex-end" spacing={2}>
                                            {/* Back Button */}
                                            <Box mr={2}>
                                                <Button
                                                    variant="outlined"
                                                    sx={{ minWidth: '120px' }}
                                                    onClick={() => setTabValue('basicInfo')} // Navigate to the previous tab
                                                >
                                                    Back
                                                </Button>
                                            </Box>

                                            {/* Next Button */}
                                            <Button
                                                variant="contained"
                                                sx={{ minWidth: '120px' }}
                                                onClick={() => setTabValue('branches')} // Navigate to the next tab
                                                disabled={!validationSchemas['addOns'].isValidSync(values)}
                                            >
                                                Next
                                            </Button>
                                        </Grid>
                                    </TabPanel>

                                    {/*  */}
                                    <TabPanel value="branches">
                                        <FieldArray
                                            name="productQtyWithBranchs"
                                            render={(arrayHelpers) => (
                                                <Grid container spacing={2}>
                                                    {/* Multi-Select Dropdown */}
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            fullWidth
                                                            select
                                                            label="Select Branches"
                                                            SelectProps={{
                                                                multiple: true,
                                                                value: values.productQtyWithBranchs.map((branch) => branch.branchid), // Map branch IDs
                                                                onChange: (e) => {
                                                                    const selectedBranchIds = e.target.value;
                                                                    // Transform selectedBranchIds into expected objects
                                                                    const updatedBranches = selectedBranchIds.map((id) => {
                                                                        // Check if branch already exists in the array
                                                                        const existingBranch = values.productQtyWithBranchs.find(
                                                                            (branch) => branch.branchid === id
                                                                        );
                                                                        return (
                                                                            existingBranch || {
                                                                                branchid: id,
                                                                                availabilityQty: 0,
                                                                                availabilityQtyIn: 0,
                                                                                isSuggest: false,
                                                                                productId: id, // Set your default values here
                                                                                isQtyAvailable: 0
                                                                            }
                                                                        );
                                                                    });
                                                                    arrayHelpers.form.setFieldValue(
                                                                        'productQtyWithBranchs',
                                                                        updatedBranches
                                                                    );
                                                                }
                                                            }}
                                                            onBlur={handleBlur}
                                                            error={touched.productQtyWithBranchs && Boolean(errors.productQtyWithBranchs)}
                                                            helperText={touched.productQtyWithBranchs && errors.productQtyWithBranchs}
                                                        >
                                                            {filteredBranch.map((branch) => (
                                                                <MenuItem key={branch.id} value={branch.id}>
                                                                    {branch.name}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </Grid>

                                                    {/* Validation Message */}
                                                    {touched.productQtyWithBranchs && errors.productQtyWithBranchs && (
                                                        <Grid item xs={12}>
                                                            <Typography color="error">{errors.productQtyWithBranchs}</Typography>
                                                        </Grid>
                                                    )}

                                                    <Grid
                                                        item
                                                        xs={12}
                                                        style={{ marginTop: '10px' }}
                                                        container
                                                        justifyContent="flex-end"
                                                        spacing={2}
                                                    >
                                                        {/* Back Button */}
                                                        <Box mr={2}>
                                                            <Button
                                                                variant="outlined"
                                                                sx={{ minWidth: '120px' }}
                                                                onClick={() => setTabValue('addOns')} // Navigate to the previous tab
                                                            >
                                                                Back
                                                            </Button>
                                                        </Box>

                                                        {/* Next Button */}
                                                        <Button
                                                            variant="contained"
                                                            sx={{ minWidth: '120px' }}
                                                            onClick={() => setTabValue(id ? 'settings' : 'image')} // Navigate to the next tab
                                                            disabled={!validationSchemas['branches'].isValidSync(values)}
                                                        >
                                                            Next
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            )}
                                        />
                                    </TabPanel>

                                    <TabPanel value="settings">
                                        <Grid container spacing={3}>
                                            {/* Delivery Product */}
                                            <Grid item xs={4}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            name="isDeliveryProduct"
                                                            checked={values.isDeliveryProduct}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                    }
                                                    label="Delivery Product"
                                                />
                                            </Grid>

                                            {/* Eligible for Free Drinks */}
                                            <Grid item xs={4}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            name="isEligibleForFreeItem"
                                                            checked={values.isEligibleForFreeItem}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                    }
                                                    label="Eligible for Free Drinks"
                                                />
                                            </Grid>

                                            {/* Product Image Delete */}
                                            {/* <Grid item xs={4}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            name="isProductImageDeleted"
                                                            checked={values.isProductImageDeleted}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                    }
                                                    label="Product Image Delete"
                                                />
                                            </Grid> */}

                                            {/* Quantity Available */}
                                            {/* <Grid item xs={4}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            name="isQtyAvailable"
                                                            checked={values.isQtyAvailable}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                    }
                                                    label="Quantity Available"
                                                />
                                            </Grid> */}

                                            {/* Comment Allowed */}
                                            <Grid item xs={4}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            name="commentAllowed"
                                                            checked={values.commentAllowed}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                    }
                                                    label="Comment Allowed"
                                                />
                                            </Grid>

                                            {/* To Selling */}
                                            <Grid item xs={4}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            name="isTopProduct"
                                                            checked={values.isTopProduct}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                    }
                                                    label="Top Selling"
                                                />
                                            </Grid>

                                            {/* Featured Product */}
                                            <Grid item xs={4}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            name="isFeaturedProduct"
                                                            checked={values.isFeaturedProduct}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                    }
                                                    label="Featured"
                                                />
                                            </Grid>

                                            {/* Don't Miss Out */}
                                            <Grid item xs={4}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            name="dontMissOutProduct"
                                                            checked={values.dontMissOutProduct}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                        />
                                                    }
                                                    label="Don't Miss Out"
                                                />
                                            </Grid>

                                            {/* Navigation Button */}
                                            <Grid item xs={12} container justifyContent="flex-end" spacing={2}>
                                                {/* Back Button */}
                                                <Box mr={2}>
                                                    <Button
                                                        variant="outlined"
                                                        sx={{ minWidth: '120px' }}
                                                        onClick={() => setTabValue('branches')} // Navigate to the previous tab
                                                    >
                                                        Back
                                                    </Button>
                                                </Box>

                                                {/* Next Button */}
                                                <Button
                                                    variant="contained"
                                                    sx={{ minWidth: '120px' }}
                                                    onClick={() => setTabValue('nutritions')} // Navigate to the next tab
                                                >
                                                    Next
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                    <TabPanel value="nutritions">
                                        <Grid container spacing={3}>
                                            {/* Calories */}
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Calories"
                                                    name="calories"
                                                    value={values.calories}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.calories && Boolean(errors.calories)}
                                                    helperText={touched.calories && errors.calories}
                                                />
                                            </Grid>

                                            {/* Protein */}
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Protein"
                                                    name="protien"
                                                    value={values.protien}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.protien && Boolean(errors.protien)}
                                                    helperText={touched.protien && errors.protien}
                                                />
                                            </Grid>

                                            {/* Fat */}
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Fat"
                                                    name="fat"
                                                    value={values.fat}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.fat && Boolean(errors.fat)}
                                                    helperText={touched.fat && errors.fat}
                                                />
                                            </Grid>

                                            {/* Carbohydrates */}
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Carbs"
                                                    name="carbo"
                                                    value={values.carbo}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.carbo && Boolean(errors.carbo)}
                                                    helperText={touched.carbo && errors.carbo}
                                                />
                                            </Grid>

                                            {/* Navigation Buttons */}
                                            <Grid item xs={12} container justifyContent="flex-end" spacing={2}>
                                                <Grid item>
                                                    <Button
                                                        variant="outlined"
                                                        sx={{ minWidth: '120px' }}
                                                        onClick={() => setTabValue('settings')} // Navigate to the previous tab
                                                    >
                                                        Back
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        variant="contained"
                                                        sx={{ minWidth: '120px' }}
                                                        onClick={() => setTabValue('image')} // Navigate to the next tab
                                                    >
                                                        Next
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>
                                    <TabPanel value="image">
                                        <Grid container spacing={3}>
                                            {/* File Upload Area */}
                                            <Grid item xs={12}>
                                                <Box
                                                    sx={{
                                                        border: '1px dashed #ccc',
                                                        borderRadius: '4px',
                                                        padding: 4,
                                                        textAlign: 'center',
                                                        backgroundColor: '#f9f9f9'
                                                    }}
                                                >
                                                    {Product && <img width={100} src={Product?.productImage} alt="Product" />}
                                                    <Typography variant="body1" gutterBottom>
                                                        Click to upload
                                                    </Typography>
                                                    <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                                                        Choose File
                                                        <input
                                                            type="file"
                                                            hidden
                                                            name="productImage"
                                                            onChange={(event) => {
                                                                const file = event.target.files[0];
                                                                setFieldValue('productImage', file); // Formik's setFieldValue
                                                            }}
                                                        />
                                                    </Button>
                                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                                        {values.productImage ? values.productImage.name : 'No file chosen'}
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            {/* Navigation Buttons */}
                                            <Grid item xs={12} container alignItems="center" justifyContent="space-between">
                                                {/* Delete Product Button */}
                                                {id && (
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => {
                                                            // Handle delete logic here
                                                            deleteProduct();
                                                        }}
                                                    >
                                                        Delete This Product
                                                    </Button>
                                                )}
                                                {/* Back and Save Buttons */}
                                                <Box>
                                                    <Button
                                                        variant="outlined"
                                                        sx={{ minWidth: '120px', marginRight: 2 }}
                                                        onClick={() => setTabValue(id ? 'nutritions' : 'branches')} // Navigate to the previous tab
                                                    >
                                                        Back
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        sx={{ minWidth: '120px' }}
                                                        type="submit" // Submit button for form submission
                                                    >
                                                        Save
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </TabPanel>

                                    {/* Repeat for other tabs */}
                                </TabContext>
                            </Form>
                        )}
                    </Formik>
                </Card>
            </Grid>
        </Grid>
    );
};

export default ProductAddEdit;
