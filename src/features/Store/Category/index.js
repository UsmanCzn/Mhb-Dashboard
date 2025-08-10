import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Grid,
    Button
} from '@mui/material';
import { CloudUploadOutlined } from '@ant-design/icons';
import { useSnackbar } from 'notistack';
import storeServices from 'services/storeServices';
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

const EditCategory = ({ modalOpen, setModalOpen, setReload, type, selectedBrand }) => {
    const { enqueueSnackbar } = useSnackbar();
    const intialValue = {
        type: '',
        name: '',
        nativeName: '',
        subTypes: [],
        orderValue: 0
    };

    const [data, setData] = useState(intialValue);
    const [p1, setP1] = useState(null);
    const [subTypeImages, setSubTypeImages] = useState({});

    useEffect(() => {
        if (type) {
            setData(prev => ({
                ...prev,
                name: '',
                nativeName: '',
                subTypes: type?.subTypes?.length
                    ? type.subTypes.sort((a, b) => {
                        if (a.orderValue == null) return 1;
                        if (b.orderValue == null) return -1;
                        return a.orderValue - b.orderValue;
                    })
                    : []
            }));
        } else {
            setData(intialValue);
        }
        setP1(null);
    }, [type]);

    const addNewSubType = async () => {
        if (!data.name) {
            enqueueSnackbar('Please add category name', { variant: 'error' });
            return;
        }
        let payload = {
            name: data.name,
            nativeName: data.nativeName,
            orderValue: +data.orderValue,
            productTypeId: type?.id
        };
        if (p1) {
            try {
                const res = await fileService.uploadProductImage(p1);
                payload.imageUrl = res.data?.result;
            } catch (err) {
                console.log(err?.response?.data);
            }
        }
        await storeServices
            .createProductSubType(payload)
            .then(() => {
                setReload(prev => !prev);
                setData(prev => ({
                    ...prev,
                    name: '',
                    nativeName: '',
                    orderValue: ''
                }));
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setP1(null);
            });
    };

    // New: Save All SubTypes (bulk update)
    const saveAllSubTypes = async () => {
        if (!data.subTypes || data.subTypes.length === 0) {
            enqueueSnackbar('No subcategories to save.', { variant: 'warning' });
            return;
        }

        for (let index = 0; index < data.subTypes.length; index++) {
            const item = { ...data.subTypes[index] };
            if (!item.name) {
                enqueueSnackbar('Please add category name for all subcategories.', { variant: 'error' });
                return;
            }
            if (subTypeImages[index]) {
                try {
                    const res = await fileService.uploadProductImage(subTypeImages[index]);
                    item.imageUrl = res.data?.result;
                } catch (err) {
                    console.log(err?.response?.data);
                }
            }
            try {
                await storeServices.UpdateProductSubType(item);
            } catch (err) {
                enqueueSnackbar('Failed to save some subcategories.', { variant: 'error' });
                console.log(err);
            }
        }

        enqueueSnackbar('All changes saved successfully.', { variant: 'success' });
        setReload(prev => !prev);
        setSubTypeImages({});
    };

    const deleteCategory = async (item) => {
        await storeServices
            .deleteProductSubType(item?.id)
            .then(() => setReload(prev => !prev))
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <form>
                <Box sx={style}>
                    <Grid container spacing={4}>
                        {/* Heading */}
                        <Grid item xs={12}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                Manage Subcategories
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                Add a new subcategory or update existing ones below.
                            </Typography>
                            <Box display="flex" alignItems="center" mt={2}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mr: 1 }}>
                                    Category:
                                </Typography>
                                <Typography variant="h6" color="primary">
                                    {type?.name}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* New Subcategory Form */}
                        <Grid item xs={12}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={2}>
                                    <label htmlFor="fileInput">
                                        <Button
                                            variant="outlined"
                                            startIcon={<CloudUploadOutlined />}
                                            component="span"
                                            size="small"
                                            sx={{ width: '100%' }}
                                        >
                                            {p1 ? p1.name : 'Upload image'}
                                        </Button>
                                    </label>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        hidden
                                        onChange={(e) => setP1(e.currentTarget.files[0])}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        fullWidth
                                        label="Subcategory Name"
                                        variant="outlined"
                                        required
                                        value={data.name}
                                        onChange={e => setData({ ...data, name: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        fullWidth
                                        label="Subcategory Native Name"
                                        variant="outlined"
                                        required
                                        value={data.nativeName}
                                        onChange={e => setData({ ...data, nativeName: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        fullWidth
                                        label="Sort Order"
                                        variant="outlined"
                                        value={data.orderValue}
                                        onChange={e => setData({ ...data, orderValue: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={addNewSubType}
                                    >
                                        Add New
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Subcategory List */}
                        {data?.subTypes?.map((item, index) => {
                            const fileInputId = `fileInput${index}`;
                            const imgId = `img${index}`;
                            return (
                                <Grid item xs={12} key={item?.id || index}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={2}>
                                            <label htmlFor={fileInputId}>
                                                <img
                                                    id={imgId}
                                                    src={
                                                        subTypeImages[index]
                                                            ? URL.createObjectURL(subTypeImages[index])
                                                            : (item?.imageUrl || selectedBrand?.logoUrl)
                                                    }
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: 8,
                                                        cursor: 'pointer',
                                                        border: '1px solid #eee',
                                                        objectFit: 'cover'
                                                    }}
                                                    alt="img"
                                                />
                                            </label>
                                            <input
                                                type="file"
                                                id={fileInputId}
                                                hidden
                                                onChange={(e) => {
                                                    const newSubTypeImages = { ...subTypeImages };
                                                    newSubTypeImages[index] = e.currentTarget.files[0];
                                                    setSubTypeImages(newSubTypeImages);
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <TextField
                                                fullWidth
                                                label="Subcategory Name"
                                                variant="outlined"
                                                required
                                                value={item?.name}
                                                onChange={e => {
                                                    setData(prev => {
                                                        const newSubTypes = [...prev.subTypes];
                                                        newSubTypes[index].name = e.target.value;
                                                        return { ...prev, subTypes: newSubTypes };
                                                    });
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <TextField
                                                fullWidth
                                                label="Subcategory Native Name"
                                                variant="outlined"
                                                required
                                                value={item?.nativeName}
                                                onChange={e => {
                                                    setData(prev => {
                                                        const newSubTypes = [...prev.subTypes];
                                                        newSubTypes[index].nativeName = e.target.value;
                                                        return { ...prev, subTypes: newSubTypes };
                                                    });
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <TextField
                                                fullWidth
                                                label="Sort Order"
                                                variant="outlined"
                                                value={item?.orderValue}
                                                onChange={e => {
                                                    setData(prev => {
                                                        const newSubTypes = [...prev.subTypes];
                                                        newSubTypes[index].orderValue = e.target.value;
                                                        return { ...prev, subTypes: newSubTypes };
                                                    });
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => deleteCategory(item)}
                                            >
                                                Delete
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            );
                        })}

                        {/* Footer */}
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                                <Button variant="outlined" onClick={() => setModalOpen(false)}>
                                    Close
                                </Button>
                                <Button variant="contained" color="primary" onClick={saveAllSubTypes}>
                                    Save
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </Modal>
    );
};

export default EditCategory;
