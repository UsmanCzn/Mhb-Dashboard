import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
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
    Select,
    List,
    ListItemButton,
    Paper,
    IconButton,
    CircularProgress,
    Menu
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import EastIcon from '@mui/icons-material/East';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import branchServices from 'services/branchServices';
import fileService from 'services/fileService';
import { ServiceFactory } from 'services/index';
import { useSnackbar } from 'notistack';
import BranchTimings from '../../../pages/branch/branchTimings/index';
import { useAuth } from 'providers/authProvider';
import StoreCopy from '../copyMenu/copyMenu';
import BranchTableInsertModal from './branch-table-insert-modal';
import BranchTableEditModal from './branch-table-edit-modal';
import ConfirmationModal from 'components/confirmation-modal';
import DataGridComponent from 'components/DataGridComponent';
import imageCompression from 'browser-image-compression';
import { QRCodeCanvas } from 'qrcode.react';
import { IMAGE_COMPRESSION_MAX_SIZE_MB } from 'helper/constants';

const AddEditBranch = () => {
    const theme = useTheme();
    const brandService = ServiceFactory.get('brands');
    const [tabValue, setTabValue] = useState('1');
    const [brands, setBrands] = useState([]);
    const [brand, setBrand] = useState();
    const [p1, setP1] = useState(null);
    const { id } = useParams();
    const [branch, setBranch] = useState({});
    const [loading, setloading] = useState(false);
    const navigate = useNavigate();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { user, userRole, isAuthenticated } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [deliveryAreas, setDeliveryAreas] = useState([]);
    const [selectedDeliveryAreas, setSelectedDeliveryAreas] = useState([]);
    const [loadingDeliveryAreas, setLoadingDeliveryAreas] = useState(false);
    const [updatingAreaId, setUpdatingAreaId] = useState(null);
    const [selectedBrandIdForAreas, setSelectedBrandIdForAreas] = useState(null);
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    const [isEditTableModalOpen, setIsEditTableModalOpen] = useState(false);
    const [isDeleteTableModalOpen, setIsDeleteTableModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [tableActionAnchorEl, setTableActionAnchorEl] = useState(null);
    const [branchTables, setBranchTables] = useState([]);
    const [loadingBranchTables, setLoadingBranchTables] = useState(false);
    const tableQrRef = useRef(null);
    const isTableOrderingEnabled = Boolean(brand?.menuOrdering);

    const downloadQRCode = (ref, filename = 'qr-code.png') => {
        const canvas = ref;
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
        }
    };

    const selectedTableQrUrl = useMemo(() => {
        if (!selectedTable?.id || !brand?.id || !brand?.name) {
            return '';
        }

        const sanitizedBrandName = (brand?.name || '').replace(/\s/g, '');
        const branchName = (selectedTable?.branchName || branch?.name || '').replace(/\s/g, '');

        return `https://menu.avorewards.com/menu/${sanitizedBrandName}/${brand.id}?branch=${branchName}&branchId=${selectedTable.branchId}&tableId=${selectedTable.id}`;
    }, [brand, branch, selectedTable]);

    const handleOpenTableActions = useCallback((event, table) => {
        setTableActionAnchorEl(event.currentTarget);
        setSelectedTable(table);
    }, []);

    const handleCloseTableActions = useCallback(() => {
        setTableActionAnchorEl(null);
    }, []);

    const getBranchTables = useCallback(async () => {
        const currentBranchId = Number(id);
        if (!Number.isFinite(currentBranchId) || currentBranchId <= 0) {
            setBranchTables([]);
            return;
        }

        try {
            setLoadingBranchTables(true);
            const response = await branchServices.getAllBranchTablesByBranchId(currentBranchId);
            const rows = response?.data?.result || response?.data || [];
            setBranchTables(Array.isArray(rows) ? rows : []);
        } catch (error) {
            setBranchTables([]);
            enqueueSnackbar('Failed to load branch tables', { variant: 'error' });
        } finally {
            setLoadingBranchTables(false);
        }
    }, [enqueueSnackbar, id]);

    const handleOpenEditTableModal = useCallback(() => {
        if (!selectedTable) {
            return;
        }
        setIsEditTableModalOpen(true);
        setTableActionAnchorEl(null);
    }, [selectedTable]);

    const handleRequestDeleteTable = useCallback(() => {
        if (!selectedTable?.id) {
            return;
        }
        setTableActionAnchorEl(null);
        setIsDeleteTableModalOpen(true);
    }, [selectedTable]);

    const handleDownloadTableQrCode = useCallback(() => {
        if (!selectedTable?.id || !selectedTableQrUrl) {
            enqueueSnackbar('Missing table QR data', { variant: 'error' });
            return;
        }

        downloadQRCode(tableQrRef.current, `table-${selectedTable.id}-qr-code.png`);
        setTableActionAnchorEl(null);
    }, [enqueueSnackbar, selectedTable, selectedTableQrUrl]);

    const handleDeleteTable = useCallback(async () => {
        if (!selectedTable?.id) {
            return;
        }

        try {
            await branchServices.deleteBranchTable(selectedTable.id);
            enqueueSnackbar('Table deleted successfully', { variant: 'success' });
            setIsDeleteTableModalOpen(false);
            setTableActionAnchorEl(null);
            setSelectedTable(null);
            getBranchTables();
        } catch (error) {
            const errorMessage =
                error?.response?.data?.error?.validationErrors?.[0]?.message ||
                error?.response?.data?.error?.message ||
                'Failed to delete table';
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    }, [enqueueSnackbar, getBranchTables, selectedTable]);

    const branchTableColumns = useMemo(
        () => [
            { field: 'name', headerName: 'Table Name', flex: 1.2, minWidth: 180 },
            { field: 'branchName', headerName: 'Branch Name', flex: 1, minWidth: 170 },
            {
                field: 'isAvailable',
                headerName: 'Available',
                flex: 0.7,
                minWidth: 120,
                valueFormatter: ({ value }) => (value ? 'Yes' : 'No')
            },
            {
                field: 'isHidden',
                headerName: 'Hidden',
                flex: 0.7,
                minWidth: 110,
                valueFormatter: ({ value }) => (value ? 'Yes' : 'No')
            },
            { field: 'noOfSeats', headerName: 'Seats', flex: 0.6, minWidth: 100 },
            { field: 'noOfChildSeats', headerName: 'Child Seats', flex: 0.8, minWidth: 120 },
            {
                field: 'actions',
                headerName: 'Action',
                sortable: false,
                filterable: false,
                flex: 0.6,
                minWidth: 90,
                renderCell: (params) => (
                    <IconButton size="small" onClick={(event) => handleOpenTableActions(event, params.row)}>
                        <MoreVertIcon fontSize="small" />
                    </IconButton>
                )
            }
        ],
        [handleOpenTableActions]
    );

    const sortByAreaName = (areas) =>
        [...areas].sort((a, b) =>
            (a.areaName || '').trim().toLowerCase().localeCompare((b.areaName || '').trim().toLowerCase())
        );

    const flattenDeliveryAreas = (regions = [], currentBranchId = null) =>
        regions.flatMap((region) =>
            (region.children || []).flatMap((child) => {
                if (child?.isHidden === true) {
                    return [];
                }

                const branchAllotments = (child.children || []).filter(
                    (node) => node?.type === 'BranchAlloted' && Number(node?.branchId) === currentBranchId
                );
                const hasVisibleBranchAllotment = branchAllotments.some((node) => node?.isHidden === false);
                const currentMapping =
                    branchAllotments.find((node) => node?.isHidden === false) || branchAllotments[0] || null;
                const mappedDeliveryFee = currentMapping?.deliveryFee ?? currentMapping?.delvieryFee ?? 0;
                const mappedZoneTwo = currentMapping?.IsZoneTwoArea ?? currentMapping?.isZoneTwoArea ?? false;

                return [{
                    regionId: region.id,
                    regionName: region.name,
                    regionNativeName: region.nativeName,
                    regionType: region.type,
                    regionIsHidden: region.isHidden,
                    areaId: child.id,
                    areaName: child.name,
                    areaNativeName: child.nativeName,
                    areaType: child.type,
                    areaIsHidden: currentBranchId ? !hasVisibleBranchAllotment : child.isHidden,
                    deliveryFee: Number(mappedDeliveryFee) || 0,
                    isZoneTwoArea: Boolean(mappedZoneTwo)
                }];
            })
        );

    const filteredDeliveryAreas = useMemo(() => {
        const normalizedTerm = (searchTerm || '').toLowerCase();
        return deliveryAreas.filter((area) => (area.areaName || '').toLowerCase().includes(normalizedTerm));
    }, [deliveryAreas, searchTerm]);

    const getDeliveryAreas = useCallback(async (brandId) => {
        if (!brandId) {
            setDeliveryAreas([]);
            setSelectedDeliveryAreas([]);
            return;
        }

        setLoadingDeliveryAreas(true);
        try {
            const res = await branchServices.getDeliveryAreasTreeByBrandId(brandId);
            const currentBranchId = Number(id);
            const flattened = flattenDeliveryAreas(
                res?.data?.result || [],
                Number.isFinite(currentBranchId) && currentBranchId > 0 ? currentBranchId : null
            );

            setDeliveryAreas(sortByAreaName(flattened.filter((area) => area.areaIsHidden)));
            setSelectedDeliveryAreas(flattened.filter((area) => !area.areaIsHidden));
        } catch (error) {
            enqueueSnackbar('Failed to load delivery areas', { variant: 'error' });
        } finally {
            setLoadingDeliveryAreas(false);
        }
    }, [enqueueSnackbar, id]);

    const getSelectDeliveryAreas = async (area, isHidden = false) => {
        const currentBranchId = Number(id);
        if (!selectedBrandIdForAreas || !Number.isFinite(currentBranchId) || currentBranchId <= 0) {
            return;
        }

        setUpdatingAreaId(area.areaId);
        try {
            await branchServices.createOrUpdateDeliveryAreaBranchMapping({
                areaId: area.areaId,
                branchId: currentBranchId,
                isHidden
            });
        } finally {
            setUpdatingAreaId(null);
        }
    };

    const handleSelectedAreaFieldChange = useCallback((areaId, key, value) => {
        setSelectedDeliveryAreas((prev) =>
            prev.map((item) => {
                if (item.areaId !== areaId) {
                    return item;
                }

                return {
                    ...item,
                    [key]: value
                };
            })
        );
    }, []);

    const updateAreaExtraSettings = async (area) => {
        const currentBranchId = Number(id);
        if (!selectedBrandIdForAreas || !Number.isFinite(currentBranchId) || currentBranchId <= 0) {
            return;
        }

        setUpdatingAreaId(area.areaId);
        try {
            await branchServices.createOrUpdateDeliveryAreaBranchMapping({
                areaId: area.areaId,
                branchId: currentBranchId,
                isHidden: false,
                deliveryFee: Number(area.deliveryFee) || 0,
                isZoneTwoArea: Boolean(area.isZoneTwoArea)
            });
            enqueueSnackbar('Delivery area updated successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to update delivery area', { variant: 'error' });
        } finally {
            setUpdatingAreaId(null);
        }
    };

    const addArea = async (area) => {
        if (selectedDeliveryAreas.some((item) => item.areaId === area.areaId)) {
            return;
        }

        const previousDeliveryAreas = deliveryAreas;
        const previousSelectedAreas = selectedDeliveryAreas;

        setSelectedDeliveryAreas((prev) => [
            ...prev,
            {
                ...area,
                deliveryFee: Number(area.deliveryFee) || 0,
                isZoneTwoArea: Boolean(area.isZoneTwoArea)
            }
        ]);
        setDeliveryAreas((prev) => prev.filter((item) => item.areaId !== area.areaId));

        try {
            await getSelectDeliveryAreas(area, false);
        } catch (error) {
            setDeliveryAreas(previousDeliveryAreas);
            setSelectedDeliveryAreas(previousSelectedAreas);
            enqueueSnackbar('Failed to update delivery area', { variant: 'error' });
        }
    };

    const removeArea = async (area) => {
        const selectedIndex = selectedDeliveryAreas.findIndex((item) => item.areaId === area.areaId);
        if (selectedIndex === -1) {
            return;
        }

        const previousDeliveryAreas = deliveryAreas;
        const previousSelectedAreas = selectedDeliveryAreas;

        setSelectedDeliveryAreas((prev) => prev.filter((item) => item.areaId !== area.areaId));
        setDeliveryAreas((prev) => sortByAreaName([...prev, area]));

        try {
            await getSelectDeliveryAreas(area, true);
        } catch (error) {
            setDeliveryAreas(previousDeliveryAreas);
            setSelectedDeliveryAreas(previousSelectedAreas);
            enqueueSnackbar('Failed to update delivery area', { variant: 'error' });
        }
    };


const handleNext = async (validateForm, setTouched, values) => {
    const errors = await validateForm();

    // 🛑 SPECIAL RULE FOR SETTINGS TAB (Tab 3)
    if (tabValue === "3" && !requiresAtLeastOne(values)) {
        enqueueSnackbar(
            "Please select at least one service option: Pickup, Car Service, or Drive Thru",
            { variant: "error" }
        );
        return;
    }

    if (Object.keys(errors).length === 0) {
        setTabValue((prev) => (parseInt(prev, 10) + 1).toString());
    } else {
        setTouched(errors);
    }
};


    const handleBackChange = () => {
        setTabValue((prev) => (parseInt(prev, 10) - 1).toString()); // Move to the previous tab
    };

    const getBranch = async () => {
        setloading(true);
        try {
            const res = await branchServices.getBranchById(id);
            const branch = res?.data?.result;

            if (id) {
                setloading(false);
                setInitialValues((prev) => ({
                    ...branch,
                    acceptTime: branch?.acceptTime || 0,
                    branchAddress: branch?.branchAddress || '',
                    branchPhoneNumber: branch?.branchPhoneNumber || '',
                    branchTimingsString: branch?.branchTimingsString || '',
                    branchTimingsStringNative: branch?.branchTimingsStringNative || '',
                    brandId: branch?.brandId || '',
                    closeTime: branch?.closeTime || '',
                    deliveryDistance: branch?.deliveryDistance || '',
                    DeliveryDistanceKM: branch?.deliveryDistanceKM,
                    deliveryFee: branch?.deliveryFee || '',
                    DeliveryFee: branch?.deliveryFee,
                    isCarService: branch?.isCarService || false,
                    isDriveThru: branch?.isDriveThru || false,
                    isDelivery: branch?.isDelivery || false,
                    isPickup: branch?.isPickup || false,
                    logoUrl: branch?.logoUrl || '',
                    latitude: branch?.latitude || '',
                    longitude: branch?.longitude || '',
                    arrivalArea: branch?.arrivalArea || 0,
                    name: branch?.name || '',
                    nativeBranchAddress: branch?.nativeBranchAddress || '',
                    nativeName: branch?.nativeName || '',
                    openTime: branch?.openTime || 0,
                    readyTime: branch?.readyTime || 0,
                    usedDeliverySystem: branch?.usedDeliverySystem || 1, // Patch the values dynamically
                    foodicsId: branch?.foodicsId || '',
                    odooId: branch?.odooId || '',
                    timeAllowedToCancelOrder: branch?.timeAllowedToCancelOrder ?? 0,
                    fastTrackOrderPrice: branch?.fastTrackOrderPrice ?? 0,
                    minimumOrderValueForDeliveryOrder: branch?.minimumOrderValueForDeliveryOrder ?? 0,
                    allowZoneTwoAreasForDeliveryOrders: branch?.allowZoneTwoAreasForDeliveryOrders ?? false
                }));
                setBranch(branch);
            }
        } catch (err) {
            console.error(err.response);
        }
    };
    const getBrands = async () => {
    try {
        const { data } = await brandService.getAllBrands();
        const list = data?.result ?? [];

        setBrands(list);

    } catch (err) {
        console.error('[getBrands] failed:', err);
    }
    };
    // --- Require at least one service selection ---
    const requiresAtLeastOne = (values) => {
        return values.isPickup || values.isCarService || values.isDriveThru;
    };



    useEffect(() => {
        getBrands();
        if (id) {
            getBranch();
        }
    }, [id]);

    useEffect(() => {
            if(branch){
            
            const found = brands.find(b => b.id === branch.brandId);
            
            if (found) setBrand(found);
            }
    }, [brands,branch])

    useEffect(() => {
        if (branch?.brandId) {
            setSelectedBrandIdForAreas(branch.brandId);
        }
    }, [branch]);

    useEffect(() => {
        if (!isTableOrderingEnabled && tabValue === '8') {
            setTabValue('1');
        }
    }, [isTableOrderingEnabled, tabValue]);

    useEffect(() => {
        getDeliveryAreas(selectedBrandIdForAreas);
    }, [getDeliveryAreas, selectedBrandIdForAreas]);

    useEffect(() => {
        if (id && isTableOrderingEnabled && tabValue === '8') {
            getBranchTables();
        }
    }, [getBranchTables, id, isTableOrderingEnabled, tabValue]);
    

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const [initialValues, setInitialValues] = useState({
        acceptTime: 0,
        branchAddress: '',
        branchPhoneNumber: '',
        branchTimingsString: '',
        branchTimingsStringNative: '',
        brandId: '',
        closeTime: '',
        deliveryDistance: '',
        DeliveryDistanceKM: 0,
        deliveryFee: 0,
        DeliveryFee: 0,
        isCarService: false,
        isDriveThru: false,
        isDelivery: false,
        isPickup: true,
        logoUrl: '',
        latitude: 0,
        longitude: 0,
        arrivalArea: 0,
        name: '',
        nativeBranchAddress: '',
        nativeName: '',
        openTime: '',
        readyTime: 0,
        usedDeliverySystem: 1,
        foodicsId: '',
        odooId: '',
        timeAllowedToCancelOrder: 0,
        fastTrackOrderPrice: 0,
        minimumOrderValueForDeliveryOrder: 0,
        allowZoneTwoAreasForDeliveryOrders: false
    });
    const validationSchemas = {
        1: Yup.object().shape({
            name: Yup.string().required('Store Name is required'),
            // nativeName: Yup.string().required('Store Name (Native) is required'),
            brandId: Yup.string().required('Brand is required'),
            // branchPhoneNumber: Yup.number().required('Phone Number is required'),
            acceptTime: Yup.number().required('Accept Time is required').min(0),
            readyTime: Yup.number().required('Ready Time is required').min(0)
        }),
        2: Yup.object().shape({
            openTime: Yup.string().required('Opening Time is required'),
            closeTime: Yup.string().required('Closing Time is required')
            // .test('is-after-openTime', 'Closing Time must be after Opening Time', function (closeTime) {
            //     const { openTime } = this.parent;
            //     if (!openTime || !closeTime) return true; // Skip validation if either is missing

            //     return openTime < closeTime; // Ensure openTime is before closeTime
            // })
            // branchTimingsString: Yup.string().required('Working hours text is required'),
            // branchTimingsStringNative: Yup.string().required('Working hours text (Native) is required')
        }),
        3: Yup.object().shape({
            isPickup: Yup.boolean(),
            isCarService: Yup.boolean(),
            isDriveThru: Yup.boolean(),
            isDelivery: Yup.boolean(),
            DeliveryDistanceKM: Yup.number().when('isDelivery', {
                is: true,
                then: Yup.number().required('Delivery Distance is required')
            }),
            DeliveryFee: Yup.number().when('isDelivery', {
                is: true,
                then: Yup.number().required('Delivery Fee is required')
            }),
            usedDeliverySystem: Yup.number().when('isDelivery', {
                is: true,
                then: Yup.number().required('Delivery System is required')
            }),
            timeAllowedToCancelOrder: Yup.number().min(0, 'Cannot be negative'),
            fastTrackOrderPrice: Yup.number().min(0, 'Cannot be negative'),
            minimumOrderValueForDeliveryOrder: Yup.number().min(0, 'Cannot be negative'),
            allowZoneTwoAreasForDeliveryOrders: Yup.boolean()
        }),
        4: Yup.object().shape({
            // branchAddress: Yup.string().required('Address is required'),
            // nativeBranchAddress: Yup.string().required('Native Address is required'),
            latitude: Yup.number()
                .typeError('Latitude must be a decimal number')
                .required('Latitude is required')
                .test('is-decimal', 'Latitude must be in decimal format', (value) => /^\-?\d+(\.\d+)?$/.test(value?.toString())),
            longitude: Yup.number()
                .typeError('Longitude must be a decimal number')
                .required('Longitude is required')
                .test('is-decimal', 'Longitude must be in decimal format', (value) => /^\-?\d+(\.\d+)?$/.test(value?.toString())),
            arrivalArea: Yup.number().min(0, 'Cannot be negative')
        }),
        5: Yup.object().shape({
            // Add validation rules for the "Logo" tab if needed
        })
    };
    const formatDecimal = (value) => {
        const temp = +value || 0;
        if (typeof temp === 'number') {
            // Check if the value includes a decimal point
            return temp % 1 === 0 ? `${temp.toFixed(2)}` : `${temp}`;
        }
        return temp; // Return as-is if not a number
    };
    const handleSubmit = async (values) => {
        let payload = {
            ...branch,
            ...values,
            deliveryFee: values?.DeliveryFee,
            deliveryDistanceKM: values?.DeliveryDistanceKM,
            timeAllowedToCancelOrder: Number(values?.timeAllowedToCancelOrder) || 0,
            fastTrackOrderPrice: Number(values?.fastTrackOrderPrice) || 0,
            minimumOrderValueForDeliveryOrder: Number(values?.minimumOrderValueForDeliveryOrder) || 0,
            allowZoneTwoAreasForDeliveryOrders: Boolean(values?.allowZoneTwoAreasForDeliveryOrders),
            odooId: values?.odooId || '',
            foodicsId: values?.foodicsId || '',
            latitude: formatDecimal(values?.latitude),
            longitude: formatDecimal(values?.longitude)
        };
    
        setloading(true);
    
        // Use the compression+upload utility here
        let logoUrl;
        try {
            logoUrl = await handleBranchLogoUpload(p1, fileService);
        } catch (err) {
            console.error(err);
            enqueueSnackbar('Image upload failed', { variant: 'error' });
            setloading(false);
            return;
        }

        if (!requiresAtLeastOne(values)) {
        enqueueSnackbar(
        "Please select at least one service option (Pickup, Car Service, Drive Thru)",
        { variant: "error" }
        );
           setloading(false);
        return;
        }
        // If creating and no image, show error
        if (!id && !logoUrl) {
            enqueueSnackbar('Please Upload Image', { variant: 'error' });
            setloading(false);
            return;
        }
    
        // Only set if logoUrl exists
        if (logoUrl) {
            payload.logoUrl = logoUrl;
        }
    
        try {
            if (id) {
                await branchServices.editBranch(payload);
                console.log('Branch updated successfully');
            } else {
                await branchServices.createBranch(payload);
                console.log('Branch created successfully');
                enqueueSnackbar('Branch created successfully', { variant: 'success' });
            }
            setloading(false);
            navigate(`/locations?brandId=${initialValues.brandId}`);
        } catch (error) {
            const errorMessage =
                error.response?.data?.error?.validationErrors?.[0]?.message ||
                error.response?.data?.error?.message ||
                'An error occurred';
            enqueueSnackbar(errorMessage, { variant: 'error' });
            setloading(false);
        }
    };
    
    

    const handleBranchLogoUpload = async (logoFile, fileService) => {
        if (typeof logoFile === 'string') {
            return logoFile;
        }
        if (!logoFile) {
            return undefined;
        }

        const options = {
            maxSizeMB: IMAGE_COMPRESSION_MAX_SIZE_MB,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        };

        // Compress and upload
        const compressedFile = await imageCompression(logoFile, options);
        const response = await fileService.uploadBranchLogo(compressedFile);
        return response.data?.result;
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography
                variant="h4"
                sx={{ fontSize: { xs: '1.25rem', sm: '1.75rem' } }}
                >
                {id ? 'Edit Store' : 'Create New Store'}
                </Typography>

            </Grid>
            <Grid item xs={12}>
                <Card sx={{ padding: 0, margin: '3px 0' }}>
                    {loading && (
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    )}
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchemas[tabValue]}
                        enableReinitialize
                        onSubmit={handleSubmit}
                    >
                        {({ values, handleChange, handleBlur, errors, touched, setFieldValue, validateForm, setTouched, isValid }) => {
                            <pre>{JSON.stringify(errors, null, 2)}</pre>;
                            return (
                                <Form>
                                    <TabContext value={tabValue}>
                                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                                            <TabList onChange={handleTabChange}
                                             variant="scrollable"
                                                scrollButtons="auto"
                                            >
                                                <Tab
                                                    label="Basic Info"
                                                    value="1"
                                                    // disabled={id ? tabValue !== '1' && tabValue !== '6' : tabValue !== '1'}
                                                    disabled={!id && tabValue !== '1'}
                                                />
                                                <Tab label="Timings" value="2" disabled={!id && tabValue !== '2'} />
                                                <Tab label="Settings" value="3" disabled={!id && tabValue !== '3'} />
                                                <Tab label="Address" value="4" disabled={!id && tabValue !== '4'} />
                                                <Tab label="Logo" value="5" disabled={!id && tabValue !== '5'} />
                                                {id && <Tab label="Branch Schedule" value="6" disabled={false} />}
                                                {id && <Tab label="Copy Menu" value="7" disabled={false} />}
                                                {id && isTableOrderingEnabled && <Tab label="Table Ordering" value="8" disabled={false} />}
                                            </TabList>
                                        </Box>

                                        {/* Tab 1: Basic Info */}
                                        <TabPanel value="1">
                                            <Grid container spacing={3}>
                                                <Grid item container justifyContent="flex-end" xs={12}>
                                                    <Button
                                                        variant="contained"
                                                        sx={{ minWidth: '120px' }}
                                                        onClick={() => handleNext(validateForm, setTouched)}
                                                        // disabled={!validationSchemas[1].isValidSync(values)} // Disable if the current tab's validation fails
                                                    >
                                                        Next
                                                    </Button>
                                                </Grid>
                                               <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Store Name"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="name"
                                                        value={values.name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.name && Boolean(errors.name)}
                                                        helperText={touched.name && errors.name}
                                                    />
                                                </Grid>
                                               <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Store Name (Native)"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="nativeName"
                                                        value={values.nativeName}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.nativeName && Boolean(errors.nativeName)}
                                                        helperText={touched.nativeName && errors.nativeName}
                                                    />
                                                </Grid>
                                               <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        select
                                                        label="Select Brand"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="brandId"
                                                        value={values.brandId}
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            const selectedBrandId = Number(e.target.value);
                                                            setSelectedBrandIdForAreas(selectedBrandId);
                                                            setBrand(brands.find((item) => item.id === selectedBrandId) || null);
                                                        }}
                                                        onBlur={handleBlur}
                                                        error={touched.brandId && Boolean(errors.brandId)}
                                                        helperText={touched.brandId && errors.brandId}
                                                    >
                                                        {brands.map((brand) => (
                                                            <MenuItem key={brand.id} value={brand.id}>
                                                                {brand.name}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                               <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Phone Number"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="branchPhoneNumber"
                                                        value={values.branchPhoneNumber}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.branchPhoneNumber && Boolean(errors.branchPhoneNumber)}
                                                        helperText={touched.branchPhoneNumber && errors.branchPhoneNumber}
                                                    />
                                                </Grid>
                                               <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Avg Order Accept Time In Minutes"
                                                        fullWidth
                                                        variant="outlined"
                                                        type="number"
                                                        name="acceptTime"
                                                        value={values.acceptTime}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.acceptTime && Boolean(errors.acceptTime)}
                                                        helperText={touched.acceptTime && errors.acceptTime}
                                                    />
                                                </Grid>
                                               <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Avg Order Ready Time In Minutes"
                                                        fullWidth
                                                        variant="outlined"
                                                        type="number"
                                                        name="readyTime"
                                                        value={values.readyTime}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.readyTime && Boolean(errors.readyTime)}
                                                        helperText={touched.readyTime && errors.readyTime}
                                                    />
                                                </Grid>
                                               { brand && brand?.enableFoodics && 
                                                <Grid item xs={12} sm={6}>
                                                    <FormControl fullWidth>
                                                        <TextField
                                                            label="Foodics Branch Id"
                                                            fullWidth
                                                            variant="outlined"
                                                            type="text"
                                                            name="foodicsId"
                                                            value={values.foodicsId}
                                                            onChange={handleChange}
                                                            error={touched.foodicsId && Boolean(errors.foodicsId)}
                                                            helperText={touched.foodicsId && errors.foodicsId}
                                                            size="small"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                }
                                               <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Odoo Branch Id"
                                                        fullWidth
                                                        variant="outlined"
                                                        type="text"
                                                        name="odooId"
                                                        value={values.odooId}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.odooId && Boolean(errors.odooId)}
                                                        helperText={touched.odooId && errors.odooId}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </TabPanel>

                                        {/* Tab 2: Timings */}
                                        <TabPanel value="2">
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} container justifyContent="space-between" alignItems="center" spacing={2}>
                                                    <Grid item>
                                                        <Button
                                                            type="button"
                                                            variant="outlined"
                                                            color="secondary"
                                                            onClick={() => handleBackChange(validateForm, setTouched, isValid)}
                                                            disabled={tabValue === 0} // Disable Back button on the first tab
                                                            sx={{ minWidth: '120px' }} // Consistent button size
                                                        >
                                                            Back
                                                        </Button>
                                                    </Grid>
                                                    <Grid item>
                                                        <Button
                                                            type="button"
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => handleNext(validateForm, setTouched, isValid)}
                                                            disabled={!isValid && tabValue < validationSchemas.length - 1} // Allow submission on the last tab
                                                            sx={{ minWidth: '120px' }} // Consistent button size
                                                        >
                                                            {tabValue === validationSchemas.length - 1 ? 'Submit' : 'Next'}{' '}
                                                            {/* Dynamically change label */}
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                               <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Opening Time"
                                                        fullWidth
                                                        type="time"
                                                        variant="outlined"
                                                        name="openTime"
                                                        value={values.openTime}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.openTime && Boolean(errors.openTime)}
                                                        helperText={touched.openTime && errors.openTime}
                                                    />
                                                </Grid>
                                               <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Closing Time"
                                                        fullWidth
                                                        type="time"
                                                        variant="outlined"
                                                        name="closeTime"
                                                        value={values.closeTime}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.closeTime && Boolean(errors.closeTime)}
                                                        helperText={touched.closeTime && errors.closeTime}
                                                    />
                                                </Grid>
                                               <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Working hours Text"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="branchTimingsString"
                                                        value={values.branchTimingsString}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.branchTimingsString && Boolean(errors.branchTimingsString)}
                                                        helperText={touched.branchTimingsString && errors.branchTimingsString}
                                                    />
                                                </Grid>

                                                {/* Branch Timings String Native */}
                                               <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Working Hours Text (Native)"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="branchTimingsStringNative"
                                                        value={values.branchTimingsStringNative}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={
                                                            touched.branchTimingsStringNative && Boolean(errors.branchTimingsStringNative)
                                                        }
                                                        helperText={touched.branchTimingsStringNative && errors.branchTimingsStringNative}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </TabPanel>

                                        {/* Tab 3: Settings */}
                                        <TabPanel value="3">
                                            <Grid container spacing={2}>
                                                {/* Navigation Buttons */}
                                                <Grid item xs={12} container alignItems="center" justifyContent="space-between" spacing={1}>
                                                    <Grid item>
                                                        <Button
                                                            type="button"
                                                            variant="outlined"
                                                            color="secondary"
                                                            onClick={() => handleBackChange(validateForm, setTouched, isValid)}
                                                            disabled={tabValue === 3}
                                                            sx={{ minWidth: '100px', padding: '4px 8px' }}
                                                        >
                                                            Back
                                                        </Button>
                                                    </Grid>
                                                    <Grid item>
                                                    <Button
                                                        type="button"
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={async () => {
                                                            const errors = await validateForm();
                                                            if (!requiresAtLeastOne(values)) {
                                                                enqueueSnackbar(
                                                                    "Please select at least one service option (Pickup, Car Service, Drive Thru)",
                                                                    { variant: "error" }
                                                                );
                                                                return;
                                                            }

                                                            if (Object.keys(errors).length === 0) {
                                                                handleNext(validateForm, setTouched, values);
                                                            } else {
                                                                setTouched(errors);
                                                            }
                                                        }}
                                                        sx={{ minWidth: "100px", padding: "4px 8px" }}
                                                    >
                                                        Next
                                                    </Button>

                                                    </Grid>
                                                </Grid>
                                                {/* Horizontal Toggles */}
                                                <Grid item xs={12}>
                                                    <Box
                                                    display="flex"
                                                    flexWrap="wrap"
                                                    gap={2}
                                                    alignItems="center"
                                                    >

                                                        {/* Enable Pickup */}
                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    name="isPickup"
                                                                    checked={values.isPickup}
                                                                    onChange={(e) => setFieldValue('isPickup', e.target.checked)}
                                                                    size="small"
                                                                />
                                                            }
                                                            label="Enable Pickup"
                                                        />
                                                        {/* Enable Car Service */}
                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    name="isCarService"
                                                                    checked={values.isCarService}
                                                                    onChange={(e) => setFieldValue('isCarService', e.target.checked)}
                                                                    size="small"
                                                                />
                                                            }
                                                            label="Enable Car Service"
                                                        />
                                                        {/* Enable Drive Thru */}
                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    name="isDriveThru"
                                                                    checked={values.isDriveThru}
                                                                    onChange={(e) => setFieldValue('isDriveThru', e.target.checked)}
                                                                    size="small"
                                                                />
                                                            }
                                                            label="Enable Drive Thru"
                                                        />
                                                        {/* Enable Delivery */}
                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    name="isDelivery"
                                                                    checked={values.isDelivery}
                                                                    onChange={(e) => setFieldValue('isDelivery', e.target.checked)}
                                                                    size="small"
                                                                />
                                                            }
                                                            label="Enable Delivery"
                                                        />
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Time Allowed To Cancel Order (Minutes)"
                                                        fullWidth
                                                        variant="outlined"
                                                        type="number"
                                                        name="timeAllowedToCancelOrder"
                                                        value={values.timeAllowedToCancelOrder}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={
                                                            touched.timeAllowedToCancelOrder &&
                                                            Boolean(errors.timeAllowedToCancelOrder)
                                                        }
                                                        helperText={
                                                            touched.timeAllowedToCancelOrder && errors.timeAllowedToCancelOrder
                                                        }
                                                        size="small"
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Fast Track Order Price"
                                                        fullWidth
                                                        variant="outlined"
                                                        type="number"
                                                        name="fastTrackOrderPrice"
                                                        value={values.fastTrackOrderPrice}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.fastTrackOrderPrice && Boolean(errors.fastTrackOrderPrice)}
                                                        helperText={touched.fastTrackOrderPrice && errors.fastTrackOrderPrice}
                                                        size="small"
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Minimum Order Value For Delivery"
                                                        fullWidth
                                                        variant="outlined"
                                                        type="number"
                                                        name="minimumOrderValueForDeliveryOrder"
                                                        value={values.minimumOrderValueForDeliveryOrder}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={
                                                            touched.minimumOrderValueForDeliveryOrder &&
                                                            Boolean(errors.minimumOrderValueForDeliveryOrder)
                                                        }
                                                        helperText={
                                                            touched.minimumOrderValueForDeliveryOrder &&
                                                            errors.minimumOrderValueForDeliveryOrder
                                                        }
                                                        size="small"
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                name="allowZoneTwoAreasForDeliveryOrders"
                                                                checked={Boolean(values.allowZoneTwoAreasForDeliveryOrders)}
                                                                onChange={(e) =>
                                                                    setFieldValue('allowZoneTwoAreasForDeliveryOrders', e.target.checked)
                                                                }
                                                                size="small"
                                                            />
                                                        }
                                                        label="Allow Zone Two Areas For Delivery Orders"
                                                    />
                                                </Grid>

                                                {values.isDelivery && (
                                                    <>
                                                        {/* Delivery Distance KM */}
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Delivery Distance (KM)"
                                                                fullWidth
                                                                variant="outlined"
                                                                type="number"
                                                                name="DeliveryDistanceKM"
                                                                value={values.DeliveryDistanceKM}
                                                                onChange={handleChange}
                                                                error={touched.DeliveryDistanceKM && Boolean(errors.DeliveryDistanceKM)}
                                                                helperText={touched.DeliveryDistanceKM && errors.DeliveryDistanceKM}
                                                                size="small"
                                                            />
                                                        </Grid>

                                                        {/* Delivery Fee */}
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField
                                                                label="Delivery Fee"
                                                                fullWidth
                                                                variant="outlined"
                                                                type="number"
                                                                name="DeliveryFee"
                                                                value={values.DeliveryFee}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                error={touched.DeliveryFee && Boolean(errors.DeliveryFee)}
                                                                helperText={touched.DeliveryFee && errors.DeliveryFee}
                                                                size="small"
                                                            />
                                                        </Grid>

                                                        {/* Used Delivery System */}
                                                        <Grid item xs={12} sm={6}>
                                                            <FormControl fullWidth>
                                                                <InputLabel id="used-delivery-system-label" size="small">
                                                                    Used Delivery System
                                                                </InputLabel>
                                                                <Select
                                                                    labelId="used-delivery-system-label"
                                                                    id="used-delivery-system-select"
                                                                    value={values.usedDeliverySystem}
                                                                    onBlur={handleBlur}
                                                                    onChange={(e) => setFieldValue('usedDeliverySystem', e.target.value)}
                                                                    size="small"
                                                                >
                                                                    <MenuItem value={1}>Verdi</MenuItem>
                                                                    {/* Add more options as needed */}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>

                                                        <Grid item xs={12}>
                                                            <Grid container spacing={2} alignItems="stretch">
                                                                <Grid item xs={12} md={5.5}>
                                                                    <Paper variant="outlined" sx={{ height: '100%' }}>
                                                                        <Box sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText, p: 1.25 }}>
                                                                            <Typography align="center">Excluded Areas</Typography>
                                                                        </Box>
                                                                        <Box sx={{ p: 1.5 }}>
                                                                            <TextField
                                                                                fullWidth
                                                                                size="small"
                                                                                placeholder="Search Delivery Area"
                                                                                value={searchTerm}
                                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                                sx={{ mb: 1.5 }}
                                                                            />
                                                                            <List sx={{ maxHeight: 303, overflowY: 'auto', p: 0 }}>
                                                                                {loadingDeliveryAreas ? (
                                                                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                                                                                        <CircularProgress size={20} />
                                                                                    </Box>
                                                                                ) : (
                                                                                    filteredDeliveryAreas.map((area) => (
                                                                                        <ListItemButton
                                                                                            key={area.areaId}
                                                                                            onClick={() => addArea(area)}
                                                                                            disabled={updatingAreaId === area.areaId}
                                                                                            divider
                                                                                        >
                                                                                            <Typography variant="body2">{area.areaName}</Typography>
                                                                                        </ListItemButton>
                                                                                    ))
                                                                                )}
                                                                            </List>
                                                                        </Box>
                                                                    </Paper>
                                                                </Grid>

                                                                <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                    <EastIcon fontSize="large" />
                                                                </Grid>

                                                                <Grid item xs={12} md={5.5}>
                                                                    <Paper variant="outlined" sx={{ height: '100%' }}>
                                                                        <Box sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText, p: 1.25 }}>
                                                                            <Typography align="center">All Delivery Areas</Typography>
                                                                        </Box>
                                                                        <Box sx={{ p: 1.5 }}>
                                                                            <List sx={{ maxHeight: 303, overflowY: 'auto', p: 0 }}>
                                                                                {selectedDeliveryAreas.map((area, index) => (
                                                                                    <Box
                                                                                        key={area.areaId}
                                                                                        sx={{
                                                                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                                                                            py: 1,
                                                                                            display: 'flex',
                                                                                            flexDirection: 'column',
                                                                                            gap: 1
                                                                                        }}
                                                                                    >
                                                                                        <Box
                                                                                            sx={{
                                                                                                display: 'flex',
                                                                                                justifyContent: 'space-between',
                                                                                                alignItems: 'center'
                                                                                            }}
                                                                                        >
                                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                                <Box
                                                                                                    sx={{
                                                                                                        width: 24,
                                                                                                        height: 24,
                                                                                                        borderRadius: '50%',
                                                                                                        bgcolor: theme.palette.primary.main,
                                                                                                        color: theme.palette.primary.contrastText,
                                                                                                        display: 'flex',
                                                                                                        alignItems: 'center',
                                                                                                        justifyContent: 'center',
                                                                                                        fontSize: '0.75rem'
                                                                                                    }}
                                                                                                >
                                                                                                    {index + 1}
                                                                                                </Box>
                                                                                                <Typography variant="body2">{area.areaName}</Typography>
                                                                                            </Box>

                                                                                            <IconButton
                                                                                                size="small"
                                                                                                onClick={() => removeArea(area)}
                                                                                                disabled={updatingAreaId === area.areaId}
                                                                                            >
                                                                                                <CloseIcon fontSize="small" />
                                                                                            </IconButton>
                                                                                        </Box>

                                                                                        <Grid container spacing={1} alignItems="center">
                                                                                            <Grid item xs={12} sm={4}>
                                                                                                <TextField
                                                                                                    fullWidth
                                                                                                    size="small"
                                                                                                    type="number"
                                                                                                    label="Delivery Fee"
                                                                                                    value={area.deliveryFee ?? 0}
                                                                                                    onChange={(event) =>
                                                                                                        handleSelectedAreaFieldChange(
                                                                                                            area.areaId,
                                                                                                            'deliveryFee',
                                                                                                            event.target.value
                                                                                                        )
                                                                                                    }
                                                                                                    inputProps={{ min: 0 }}
                                                                                                    disabled={updatingAreaId === area.areaId}
                                                                                                />
                                                                                            </Grid>
                                                                                            <Grid item xs={12} sm={4}>
                                                                                                <FormControlLabel
                                                                                                    control={
                                                                                                        <Switch
                                                                                                            checked={Boolean(area.isZoneTwoArea)}
                                                                                                            onChange={(event) =>
                                                                                                                handleSelectedAreaFieldChange(
                                                                                                                    area.areaId,
                                                                                                                    'isZoneTwoArea',
                                                                                                                    event.target.checked
                                                                                                                )
                                                                                                            }
                                                                                                            disabled={updatingAreaId === area.areaId}
                                                                                                        />
                                                                                                    }
                                                                                                    label="Zone Two"
                                                                                                />
                                                                                            </Grid>
                                                                                            <Grid item xs={12} sm={4}>
                                                                                                <Button
                                                                                                    fullWidth
                                                                                                    variant="contained"
                                                                                                    onClick={() => updateAreaExtraSettings(area)}
                                                                                                    disabled={updatingAreaId === area.areaId}
                                                                                                    startIcon={
                                                                                                        updatingAreaId === area.areaId ? (
                                                                                                            <CircularProgress size={16} color="inherit" />
                                                                                                        ) : null
                                                                                                    }
                                                                                                >
                                                                                                    {updatingAreaId === area.areaId ? 'Updating...' : 'Update'}
                                                                                                </Button>
                                                                                            </Grid>
                                                                                        </Grid>
                                                                                    </Box>
                                                                                ))}
                                                                            </List>
                                                                        </Box>
                                                                    </Paper>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                )}
                                            </Grid>
                                        </TabPanel>

                                        {/* Tab 4: Address */}
                                        <TabPanel value="4">
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} container justifyContent="space-between" alignItems="center" spacing={2}>
                                                    <Grid item>
                                                        <Button
                                                            type="button"
                                                            variant="outlined"
                                                            color="secondary"
                                                            onClick={() => handleBackChange(validateForm, setTouched, isValid)}
                                                            disabled={tabValue === 0} // Disable Back button on the first tab
                                                            sx={{ minWidth: '120px' }} // Consistent button size
                                                        >
                                                            Back
                                                        </Button>
                                                    </Grid>
                                                    <Grid item>
                                                        <Button
                                                            type="button"
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => handleNext(validateForm, setTouched, isValid)}
                                                            disabled={!isValid && tabValue < validationSchemas.length - 1} // Allow submission on the last tab
                                                            sx={{ minWidth: '120px' }} // Consistent button size
                                                        >
                                                            {tabValue === validationSchemas.length - 1 ? 'Submit' : 'Next'}{' '}
                                                            {/* Dynamically change label */}
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                               <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Address"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="branchAddress"
                                                        value={values.branchAddress}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.branchAddress && Boolean(errors.branchAddress)}
                                                        helperText={touched.branchAddress && errors.branchAddress}
                                                    />
                                                </Grid>
                                               <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Native Address"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="nativeBranchAddress"
                                                        value={values.nativeBranchAddress}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.nativeBranchAddress && Boolean(errors.nativeBranchAddress)}
                                                        helperText={touched.nativeBranchAddress && errors.nativeBranchAddress}
                                                    />
                                                </Grid>

                                               <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Latitude"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="latitude"
                                                        value={values.latitude}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.latitude && Boolean(errors.latitude)}
                                                        helperText={touched.latitude && errors.latitude}
                                                    />
                                                </Grid>
                                               <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Longitude"
                                                        fullWidth
                                                        variant="outlined"
                                                        name="longitude"
                                                        value={values.longitude}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.longitude && Boolean(errors.longitude)}
                                                        helperText={touched.longitude && errors.longitude}
                                                    />
                                                </Grid>
                                               <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="Arrival Area (Meters)"
                                                        fullWidth
                                                        variant="outlined"
                                                        type="number"
                                                        name="arrivalArea"
                                                        value={values.arrivalArea}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        error={touched.arrivalArea && Boolean(errors.arrivalArea)}
                                                        helperText={touched.arrivalArea && errors.arrivalArea}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </TabPanel>

                                        {/* Tab 5: Logo */}
                                        <TabPanel value="5">
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} container justifyContent="space-between" alignItems="center" gap={2}>
                                                    <Grid item>
                                                        <Button
                                                            type="button"
                                                            variant="outlined"
                                                            color="secondary"
                                                            onClick={() => handleBackChange(validateForm, setTouched, isValid)}
                                                            disabled={tabValue === 0} // Disable Back button on the first tab
                                                            sx={{ minWidth: '120px' }} // Consistent button size
                                                        >
                                                            Back
                                                        </Button>
                                                    </Grid>
                                                    <Button
                                                        disabled={user?.isAccessRevoked}
                                                        variant="contained"
                                                        sx={{ minWidth: '120px' }}
                                                        type="submit"
                                                    >
                                                        Save
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography>Upload Logo</Typography>
                                                    <Box
                                                        sx={{
                                                            width: '100%',
                                                            height: 200,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            backgroundColor: '#f0f0f0',
                                                            border: '1px dashed #ccc'
                                                        }}
                                                    >
                                                        {id && branch.logoUrl && (
                                                            <img
                                                                src={branch.logoUrl}
                                                                alt="Logo"
                                                                style={{ maxWidth: '100px', maxHeight: '100%' }}
                                                            />
                                                        )}
                                                        <input
                                                            type="file"
                                                            onChange={(e) => setP1(e.target.files[0])}
                                                            style={{ marginTop: 16 }}
                                                        />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </TabPanel>

                                        {/* Tab 6: Branch Schedule */}
                                        <TabPanel value="6">
                                            <BranchTimings />
                                        </TabPanel>
                                        <TabPanel value="7">
                                            <StoreCopy />
                                        </TabPanel>
                                        <TabPanel value="8">
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                                <Button
                                                    variant="contained"
                                               
                                                    onClick={() => setIsTableModalOpen(true)}
                                                >
                                                    Add Table
                                                </Button>
                                            </Box>
                                            <DataGridComponent
                                                rows={branchTables}
                                                columns={branchTableColumns}
                                                loading={loadingBranchTables}
                                                getRowId={(row) => row.id}
                                                rowsPerPageOptions={[10]}
                                                totalRowCount={branchTables?.length ?? 0}
                                                onRowClick={() => {}}
                                                pSize={10}
                                                pMode={'client'}
                                            />
                                        </TabPanel>
                                        <BranchTableInsertModal
                                            open={isTableModalOpen}
                                            onClose={() => setIsTableModalOpen(false)}
                                            branchId={Number(id)}
                                            branchName={values?.name || branch?.name || ''}
                                            onCreated={getBranchTables}
                                        />
                                        <BranchTableEditModal
                                            open={isEditTableModalOpen}
                                            onClose={() => {
                                                setIsEditTableModalOpen(false);
                                                setSelectedTable(null);
                                            }}
                                            tableData={selectedTable}
                                            onUpdated={getBranchTables}
                                        />
                                        <Menu
                                            anchorEl={tableActionAnchorEl}
                                            open={Boolean(tableActionAnchorEl)}
                                            onClose={handleCloseTableActions}
                                        >
                                            <MenuItem onClick={handleOpenEditTableModal}>Edit</MenuItem>
                                            <MenuItem onClick={handleDownloadTableQrCode}>Download QR Code</MenuItem>
                                            <MenuItem onClick={handleRequestDeleteTable}>Delete</MenuItem>
                                        </Menu>
                                        <Box sx={{ display: 'none' }}>
                                            {selectedTableQrUrl && <QRCodeCanvas ref={tableQrRef} value={selectedTableQrUrl} size={256} />}
                                        </Box>
                                        <ConfirmationModal
                                            open={isDeleteTableModalOpen}
                                            onClose={() => setIsDeleteTableModalOpen(false)}
                                            onConfirm={handleDeleteTable}
                                            statement="Are you sure you want to delete this table?"
                                        />
                                    </TabContext>
                                </Form>
                            );
                        }}
                    </Formik>
                </Card>
            </Grid>
        </Grid>
    );
};

export default AddEditBranch;
