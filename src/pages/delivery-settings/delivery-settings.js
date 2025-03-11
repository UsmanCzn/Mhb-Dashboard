import React, { useState, useEffect } from 'react';
import {
    Box,
    Switch,
    TextField,
    Button,
    Collapse,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    LinearProgress
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import { useBranches } from 'providers/branchesProvider';
import branchService from 'services/branchServices';

// Example configuration array
const sections = [
    {
        id: 'verdi',
        title: 'Verdi',
        fields: [
            { name: 'serverUrl', label: 'Server URL', type: 'text' },
            { name: 'serverTokenId', label: 'Server Token ID', type: 'text' }
        ],
        initialValues: { serverUrl: '', serverTokenId: '' }
    }
    // {
    //     id: 'armada',
    //     title: 'Armada',
    //     fields: [
    //         { name: 'serverIp', label: 'Server IP', type: 'text' },
    //         { name: 'apiKey', label: 'API Key', type: 'text' }
    //     ],
    //     initialValues: { serverIp: '', apiKey: '' }
    // }
];

const DynamicCollapsibleFormsWithCards = () => {
    const [toggles, setToggles] = useState(sections.reduce((acc, section) => ({ ...acc, [section.id]: false }), {}));
    const [loading, setLoading] = useState(sections.reduce((acc, section) => ({ ...acc, [section.id]: false }), {}));
    const [disabled, setDisabled] = useState(sections.reduce((acc, section) => ({ ...acc, [section.id]: true }), {}));
    const [selectedBrand, setselectedBrand] = useState('');
    const [selectedBranch, setselectedBranch] = useState('');
    const [filteredBranches, setFilteredBranches] = useState([]);
    const [reload, setReload] = useState(false);
    const { brandsList } = useFetchBrandsList(reload);
    const { branchesList, setBranchReload } = useBranches();
    const handleToggle = (id) => {
        setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
        console.log(toggles);
    };

    useEffect(() => {
        // Check if brandsList has at least one item and selectedBrand is not set
        if (brandsList.length > 0) {
            const initialBrand = brandsList[0];
            setselectedBrand(initialBrand);
            const branchesForSelectedBrand = branchesList.filter((branch) => branch.brandId === initialBrand.id);

            setFilteredBranches(branchesForSelectedBrand);

            if (branchesForSelectedBrand.length > 0) {
                setselectedBranch(branchesForSelectedBrand[0]);
                onBranchChange(branchesForSelectedBrand[0]);
                // sections[0].id == ;
            }
        }
    }, [brandsList, branchesList]);

    useEffect(() => {
        console.log('dsfdsf', reload);
        setBranchReload((prev) => !prev);
    }, [reload]);

    const changeFilteredBranches = (brand) => {
        const branchesForSelectedBrand = branchesList.filter((branch) => branch.brandId === brand.id);

        setFilteredBranches(branchesForSelectedBrand);
        if (branchesForSelectedBrand.length > 0) {
            setselectedBranch(branchesForSelectedBrand[0]);
            onBranchChange(branchesForSelectedBrand[0]);
        }
    };

    const updateBranch = async (id, values) => {
        setLoading((prev) => ({ ...prev, [id]: true }));

        console.log(values);
        let payload = { ...selectedBranch, deliverySystemServerUrl: values?.serverUrl, deliverySystemToken: values?.serverTokenId };

        await branchService
            .editBranch(payload)
            .then((res) => {
                setLoading((prev) => ({ ...prev, [id]: false }));
                // setReload((prev) => !prev);
            })
            .catch((err) => {
                console.log(err.response.data);
            })
            .finally(() => {
                setLoading((prev) => ({ ...prev, [id]: false }));
                // setModalOpen(false)
                // setReload(prev=>!prev)
            });
    };

    const onBranchChange = (branch) => {
        if (branch.isDelivery) {
            setToggles({ ...toggles, verdi: true });
            setDisabled({ ...disabled, verdi: false });
        } else {
            setToggles({ ...toggles, verdi: false });
            setDisabled({ ...disabled, verdi: true });
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between" sx={{ marginBottom: '14px' }}>
                    <Grid item xs={6}>
                        <Typography fontSize={22} fontWeight={700}>
                            Delivery Settings
                        </Typography>
                    </Grid>
                    <Grid item xs={'auto'}>
                        <Box sx={{ display: 'flex', gap: '15px' }}>
                            <Grid item xs="auto">
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">{'Brand'}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={selectedBrand}
                                        label={'Brand'}
                                        onChange={(event) => {
                                            setselectedBrand(event.target.value);
                                            changeFilteredBranches(event.target.value);
                                        }}
                                    >
                                        {brandsList.map((row, index) => {
                                            return (
                                                <MenuItem key={index} value={row}>
                                                    {row?.name}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs="auto">
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">{'Branch'}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={selectedBranch}
                                        label={'Branch'}
                                        onChange={(event) => {
                                            onBranchChange(event.target.value);
                                            setselectedBranch(event.target.value);
                                        }}
                                    >
                                        {filteredBranches.map((row, index) => {
                                            return (
                                                <MenuItem key={index} value={row}>
                                                    {row?.name}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Box>
                        {/* <Button size="small" variant="contained" 
            sx={{ textTransform: 'capitalize' }} >
                            Add New loyalty
            </Button>  */}
                    </Grid>
                    {/* <Grid item xs={6}>
            <TableControl type="Customer"/>
        </Grid> */}
                </Grid>
                <Box sx={{ width: '100%' }}>
                    {sections.map((section) => (
                        <Card key={section.id} sx={{ marginBottom: 4, boxShadow: 3 }}>
                            {loading[section.id] && <LinearProgress />}
                            <CardHeader
                                action={
                                    <Switch
                                        disabled={disabled[section.id]}
                                        checked={toggles[section.id]}
                                        onChange={() => handleToggle(section.id)}
                                    />
                                }
                                title={section.title}
                            />
                            <Collapse in={toggles[section.id]}>
                                <CardContent>
                                    <Formik
                                        initialValues={{
                                            serverUrl: selectedBranch?.deliverySystemServerUrl || '',
                                            serverTokenId: selectedBranch?.deliverySystemToken || ''
                                        }}
                                        enableReinitialize
                                        onSubmit={(values) => {
                                            console.log(`${section.title} Values:`, values);
                                            updateBranch(section.id, values);
                                        }}
                                    >
                                        {({ handleSubmit }) => (
                                            <Form onSubmit={handleSubmit}>
                                                <Grid container spacing={2}>
                                                    {section.fields.map((field) => (
                                                        <Grid item xs={6}>
                                                            <Field
                                                                key={field.name}
                                                                name={field.name}
                                                                as={TextField}
                                                                label={field.label}
                                                                variant="outlined"
                                                                fullWidth
                                                                type={field.type}
                                                            />
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                                <Grid item xs={12} sx={{ marginTop: '10px', display: 'flex', justifyContent: 'end' }}>
                                                    <Button variant="contained" color="primary" type="submit">
                                                        Update {section.title}
                                                    </Button>
                                                </Grid>
                                            </Form>
                                        )}
                                    </Formik>
                                </CardContent>
                            </Collapse>
                        </Card>
                    ))}
                </Box>
            </Grid>
        </Grid>
    );
};

export default DynamicCollapsibleFormsWithCards;
