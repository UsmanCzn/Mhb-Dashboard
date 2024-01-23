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
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [data, setData] = useState({
        type: '',
        name: '',
        nativeName: '',
        subTypes: [],
        orderValue: 0
    });

    const [countries, setCountries] = useState([]);
    const [groups, setGroups] = useState([]);
    const [p1, setP1] = useState(null);
    const [p2, setP2] = useState(null);
    const [subTypeImages, setSubTypeImages] = useState({}); // Initialize an empty object

    useEffect(() => {
        setData({
            ...data,
            type: type?.name,
            subTypes: type?.subTypes
        });
    }, [type]);

    const addNewSubType = async () => {
        if (data?.name == '') {
            enqueueSnackbar('Please add category name', {
                variant: 'error'
            });

            return;
        }
        let payload = {
            name: data.name,
            nativeName: data.nativeName,
            orderValue: data.orderValue,
            productTypeId: type?.id
        };
        await fileService
            .uploadProductImage(p1)
            .then((res) => {
                payload.imageUrl = res.data?.result;
            })
            .catch((err) => {
                console.log(err.response.data);
            });
        await storeServices
            .createProductSubType(payload)
            .then((res) => {
                setReload((prev) => {
                    return !prev;
                });
                setData({
                    name: '',
                    nativeName: '',
                    orderValue: ''
                });
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setP1(null);
            });
    };
    const updateSubType = async (item, index) => {
        if (item?.name == '') {
            enqueueSnackbar('Please add category name', {
                variant: 'error'
            });

            return;
        }

        if (subTypeImages[index]) {
            await fileService
                .uploadProductImage(subTypeImages[index])
                .then((res) => {
                    item.imageUrl = res.data?.result;
                })
                .catch((err) => {
                    console.log(err.response.data);
                })
                .finally(() => {
                    // Clear the image state for this item
                    const newSubTypeImages = { ...subTypeImages };
                    delete newSubTypeImages[index];
                    setSubTypeImages(newSubTypeImages);
                });
        }

        await storeServices
            .UpdateProductSubType(item)
            .then((res) => {
                setReload((prev) => {
                    return !prev;
                });
                enqueueSnackbar('Saved Successfully');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteCategory = async (item) => {
        await storeServices
            .deleteProductSubType(item?.id)
            .then((res) => {
                setReload((prev) => {
                    return !prev;
                });
            })
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
                        <Grid item>
                            <Typography variant="h4">Edit Categories</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={6}>
                                    <Typography variant="h5">Product Type : {data?.type}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={2}>
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => {
                                            document.getElementById('fileInput').click();
                                        }}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                document.getElementById('fileInput').click();
                                            }
                                        }}
                                        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}
                                    >
                                        <CloudUploadOutlined
                                            style={{ fontSize: '26px', color: '#08c', marginRight: 4, cursor: 'pointer' }}
                                        />
                                        {p1 ? <p>{p1.name}</p> : 'Upload image'}
                                    </div>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        style={{ display: 'none' }} // Hide the input
                                        onChange={async (e) => {
                                            setP1(e.currentTarget.files[0]);
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Category Name"
                                        variant="outlined"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData({ ...data, name: e.target.value })}
                                    />
                                </Grid>

                                <Grid item xs={3}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Category Native Name"
                                        variant="outlined"
                                        required
                                        value={data.nativeName}
                                        onChange={(e) => setData({ ...data, nativeName: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Order Value"
                                        variant="outlined"
                                        value={data.orderValue}
                                        onChange={(e) => setData({ ...data, orderValue: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button onClick={addNewSubType}>Add new</Button>
                                </Grid>
                            </Grid>
                        </Grid>

                        {data?.subTypes?.map((item, index) => {
                            console.log(item, 'category');
                            const fileInputId = `fileInput${index}`;
                            const imgId = `img${index}`;
                            return (
                                <Grid item xs={12} key={item?.id}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={2}>
                                            <label htmlFor={fileInputId}>
                                                {subTypeImages[index] ? (
                                                    <img
                                                        id={imgId}
                                                        src={URL.createObjectURL(subTypeImages[index])}
                                                        style={{ width: 40, height: 40, cursor: 'pointer' }}
                                                        alt="img"
                                                    />
                                                ) : (
                                                    <img
                                                        id={imgId}
                                                        src={item?.imageUrl}
                                                        style={{ width: 40, height: 40, cursor: 'pointer' }}
                                                        alt="img"
                                                    />
                                                )}
                                            </label>
                                            <input
                                                type="file"
                                                id={fileInputId}
                                                style={{ display: 'none' }}
                                                onChange={async (e) => {
                                                    const newSubTypeImages = { ...subTypeImages };
                                                    newSubTypeImages[index] = e.currentTarget.files[0];
                                                    setSubTypeImages(newSubTypeImages);
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={2}>
                                            <TextField
                                                id="outlined-basic"
                                                fullWidth
                                                label="Category Name"
                                                variant="outlined"
                                                required
                                                value={item?.name}
                                                onChange={(e) => {
                                                    setData((prev) => {
                                                        prev.subTypes[index].name = e.target.value;
                                                        return { ...prev };
                                                    });
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <TextField
                                                id="outlined-basic"
                                                fullWidth
                                                label="Category Native Name"
                                                variant="outlined"
                                                required
                                                value={item?.name}
                                                onChange={(e) => {
                                                    setData((prev) => {
                                                        prev.subTypes[index].nativeName = e.target.value;
                                                        return { ...prev };
                                                    });
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <TextField
                                                id="outlined-basic"
                                                fullWidth
                                                label="Order Value"
                                                variant="outlined"
                                                value={item?.orderValue}
                                                onChange={(e) => {
                                                    setData((prev) => {
                                                        prev.subTypes[index].orderValue = e.target.value;
                                                        return { ...prev };
                                                    });
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Button onClick={() => updateSubType(item, index)}>save</Button>
                                            <Button onClick={() => deleteCategory(item)} color="error">
                                                delete
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            );
                        })}

                        {/* Footer */}

                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={8} />
                                <Grid container spacing={2} justifyContent="flex-end">
                                    <Grid item>
                                        <Button variant="outlined" onClick={() => setModalOpen(false)}>
                                            Close
                                        </Button>
                                    </Grid>
                                    {/* <Grid item>
                  <Button primay variant="contained" type="Submit" >Save</Button>
                </Grid> */}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </Modal>
    );
};

export default EditCategory;
