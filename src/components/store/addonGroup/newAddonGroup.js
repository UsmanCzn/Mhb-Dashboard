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
    FormLabel,
    
} from '@mui/material/index';
import DropDown from 'components/dropdown';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CloudUploadOutlined } from '@ant-design/icons';
import { ServiceFactory } from 'services/index';
import constants from 'helper/constants';
import storeServices from 'services/storeServices';

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
    overflow: 'scroll'
};

const NewAddonGroup = ({ modalOpen, setModalOpen, setReload, update, updateData, selectedBrand, selectedProduct, closeMenu }) => {
    const [data, setData] = useState({
        name: '',
        nativeName: '',
        orderValue: 0,
        allowMultiple: false,
        isRequired: false,
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
                allowMultiple: updateData?.allowMultiple,
                isRequired: updateData?.isRequired,
                maxMultipleValue: updateData?.maxMultipleValue
            });
        } else {
            setData({
                name: '',
                nativeName: '',
                orderValue: 0,
                allowMultiple: false,
                isRequired: false,
                maxMultipleValue: 0
            });
        }
    }, [update, updateData]);

    const createNewType = async (event) => {
        event.preventDefault();

        let payload = {
            ...data,
            brandId: selectedBrand?.id,
            productId: selectedProduct?.id
        };
        // console.log(payload, "wooking");

        await storeServices
            .createProductAdditionGroup(payload)
            .then((res) => {
                console.log(res?.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setReload((prev) => !prev);
                setModalOpen(false);
                setData({
                    name: '',
                    nativeName: '',
                    orderValue: 0,
                    allowMultiple: false,
                    isRequired: false,
                    maxMultipleValue: 0
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

        await storeServices
            .updateProductAdditionGroup(payload, selectedBrand?.id)
            .then((res) => {
                closeMenu();
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
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
                            <Typography variant="h4"> {update ? 'Edit Add-on Group' : 'Create new Add-on Group'} </Typography>
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
                                    <TextField
                                        id="outlined-basic"
                                        fullWidth
                                        label="Add-on Group Name"
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
                                        label="Add-on Group Native Name"
                                        variant="outlined"
                                        value={data.nativeName}
                                        onChange={(e) => setData({ ...data, nativeName: e.target.value })}
                                    />
                                </Grid>
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
                                {data.allowMultiple && (
                                    <Grid item xs={4}>
                                        <TextField
                                            id="outlined-basic"
                                            fullWidth
                                            label="Max Value"
                                            variant="outlined"
                                            value={data.maxMultipleValue}
                                            onChange={(e) => setData({ ...data, maxMultipleValue: e.target.value })}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>

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
                                    checked={data.allowMultiple}
                                    onChange={(event) => {
                                        setData({
                                            ...data,
                                            allowMultiple: event.target.checked
                                        });
                                    }}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography required variant="h7">
                                Required
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
                                    checked={data.isRequired}
                                    onChange={(event) => {
                                        setData({
                                            ...data,
                                            isRequired: event.target.checked
                                        });
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
                                            {update ? 'Edit Add-on Group' : 'Create new Add-on Group'}
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

export default NewAddonGroup;
