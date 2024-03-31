import React, { useEffect, useState } from 'react';
import { Grid, Typography, TextField, Button, Alert, Modal, Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material';

import Counter from 'components/companies/counter';
import FormControl from '@mui/material/FormControl';
import DropDown from 'components/dropdown';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import MenuItem from '@mui/material/MenuItem';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ServiceFactory } from 'services/index';
import rewardService from 'services/rewardService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Select from '@mui/material/Select';
import { useSnackbar } from 'notistack';
import tiersService from 'services/tiersService';

const NewLevel = ({ modal, setModal, setReload, selectedBrand, editItem, subtype, tiersList, isEditing }) => {
    const customerService = ServiceFactory.get('customer');
    const [data, setData] = useState({
        brandId: selectedBrand?.id,
        name: '',
        nativeName: '',
        bottomLimit: '',
        topLimit: 0,
        punchesForFreeItems: 0
    });

    const [group, setGorupValue] = React.useState('');

    const handleChange = (event) => {
        setGorupValue(event.target.value);
    };

    const [selectedValues, setSelectedValues] = useState([]);

    // Function to handle checkbox changes
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        if (checked) {
            setSelectedValues((prevValues) => [...prevValues, name]);
        } else {
            setSelectedValues((prevValues) => prevValues.filter((value) => value !== name));
        }
    };

    // Function to get the comma-separated string of selected values
    const getSelectedValuesString = () => {
        return selectedValues.join(', ');
    };

    useEffect(() => {}, [editItem]);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [err, setErr] = useState('');

    useEffect(() => {
        if (isEditing) {
            setSelectedValues(editItem.subItemsAllowedToRedeem.map((item) => item.toString()));
            tiersList.map((item, index) => {
                if (index === 0) {
                    setGorupValue(editItem?.customerGroupId);
                }
            });
        } else {
            setSelectedValues([]);
            tiersList.map((item, index) => {
                if (index === 0) {
                    setGorupValue(item.id);
                }
            });
        }
    }, [setModal]);

    const createNewTier = async () => {
        if (isEditing) {
            let payload = {
                brandId: selectedBrand?.id,
                id: editItem.id,
                branchId: 0,
                customerGroupId: group,
                subItemsAllowedToRedeem: selectedValues
            };
            await tiersService
                .updateLevel(payload)
                .then((res) => {
                    setModal(false);
                    setReload((prev) => !prev);
                })
                .catch((err) => {
                    console.log(err?.response?.data);
                    if (err?.response?.data?.error?.validationErrors?.length > 0) {
                        enqueueSnackbar(err?.response?.data?.error?.validationErrors[0]?.message, {
                            variant: 'error'
                        });
                    } else {
                        enqueueSnackbar(err?.response?.data?.error?.message, {
                            variant: 'error'
                        });
                    }
                });
        } else {
            let payload = {
                brandId: selectedBrand?.id,
                id: 0,
                branchId: 0,
                customerGroupId: group,
                subItemsAllowedToRedeem: selectedValues
            };
            await tiersService
                .createLevel(payload)
                .then((res) => {
                    setModal(false);
                    setReload((prev) => !prev);
                })
                .catch((err) => {
                    console.log(err?.response?.data);
                    if (err?.response?.data?.error?.validationErrors?.length > 0) {
                        enqueueSnackbar(err?.response?.data?.error?.validationErrors[0]?.message, {
                            variant: 'error'
                        });
                    } else {
                        enqueueSnackbar(err?.response?.data?.error?.message, {
                            variant: 'error'
                        });
                    }
                });
        }
    };

    return (
        <Modal open={modal} onClose={() => setModal(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>
                <Grid container spacing={4} mb={2}>
                    <Grid item xs={12}>
                        <Typography required variant="h5">
                            {'Create New Level'}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Group</InputLabel>
                        <NativeSelect
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={group}
                            label="Group"
                            inputProps={{
                                name: 'age',
                                id: 'uncontrolled-native'
                            }}
                            defaultValue={0}
                            onChange={handleChange}
                        >
                            {tiersList.map((item, index) => (
                                <option key={index} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </NativeSelect>
                    </FormControl>
                </Grid>

                <Box my={4}>
                    <Grid item xs={12}>
                        <Typography variant="h7">Select Sub Items</Typography>
                        <FormGroup>
                            <Grid container>
                                {subtype?.map((item) => (
                                    <Grid key={item.id} item>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedValues.includes(item.id.toString())}
                                                    onChange={handleCheckboxChange}
                                                    name={item.id.toString()} // Use the 'id' property as the name to uniquely identify the checkbox
                                                    value={item.id.toString()} // Use the 'id' property as the checkbox value
                                                />
                                            }
                                            label={item.name} // Use the 'name' property as the checkbox label
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </FormGroup>
                    </Grid>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={8} />
                            <Grid container spacing={2} justifyContent="flex-end">
                                <Grid item>
                                    <Button variant="outlined" onClick={() => setModal(false)}>
                                        Cancel
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button primay variant="contained" onClick={createNewTier}>
                                        Save
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default NewLevel;
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
