import React, { useState, useEffect } from 'react';
import {
    Chip,
    Grid,
    Typography,
    Menu,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
    Select,
    Box,
    CircularProgress 
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useLocation, useNavigate } from 'react-router-dom';

import { useFetchAddonGroupList } from './hooks';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import { useBranches } from 'providers/branchesProvider';
import storeServices from 'services/storeServices';

import AddonTable from 'components/Addon/addonTable';

export default function AddonsGroupsStock() {
    const navigate = useNavigate();
    const location = useLocation();

    const [reload, setReload] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setselectedProduct] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const [customer, setCustomer] = useState({});
    const [update, setUpdate] = useState(false);
    const [updateData, setUpdateData] = useState({});
    const [type, setType] = useState({});
    const open = Boolean(anchorEl);

    const handleClick = (event, params) => {
        setCustomer(params);
        setType(params?.row);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (data) => {
        if (data?.name === 'Update') {
            setUpdate(true);
            setUpdateData(type);
            setModalOpen(true);
        } else if (data?.name === 'Delete') {
            deleteAddonGroup(type);
        }
        setAnchorEl(null);
    };

    const deleteAddonGroup = async (type) => {
        await storeServices
            .deleteProductAddonGroup(type?.id)
            .then((res) => {
                setReload((prev) => !prev);
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });
    };

    // BRAND AND BRANCH LOGIC START
    const [selectedBrand, setselectedBrand] = useState('');
    const [selectedBranch, setselectedBranch] = useState('');

    const { brandsList } = useFetchBrandsList(reload);
    const { branchesList } = useBranches();

    // When brands load, select the first brand
    useEffect(() => {
        if (brandsList.length > 0) {
            const initialBrand = brandsList[0];
            setselectedBrand(initialBrand);
        }
    }, [brandsList]);

    // When brand or branches change, select first matching branch
    useEffect(() => {
        const brandBranches = branchesList.filter(
            (branch) => branch.brandId === selectedBrand?.id
        );
        if (brandBranches.length > 0) {
            setselectedBranch(brandBranches[0]);
        } else {
            setselectedBranch('');
        }
    }, [selectedBrand, branchesList]);
    useEffect(()=>{

    },[selectedBranch])

    const filteredBranchesList = branchesList.filter(
        (branch) => branch.brandId === selectedBrand?.id
    );
    // BRAND AND BRANCH LOGIC END

    return (
        <>
            <Grid item xs={12} mb={2}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={6}>
                        <Typography fontSize={22} fontWeight={700}>
                            Add-Ons
                        </Typography>
                    </Grid>
                    <Box sx={{ display: 'flex', gap: '15px' }}>
                        <Grid item xs="auto">
                            <FormControl fullWidth>
                                <InputLabel id="brand-select-label">{'Brand'}</InputLabel>
                                <Select
                                    labelId="brand-select-label"
                                    id="brand-select"
                                    value={selectedBrand}
                                    label={'Brand'}
                                    onChange={(event) => {
                                        setselectedBrand(event.target.value);
                                    }}
                                >
                                    {brandsList.map((row, index) => (
                                        <MenuItem key={index} value={row}>
                                            {row?.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs="auto">
                            <FormControl fullWidth>
                                <InputLabel id="branch-select-label">{'Branch'}</InputLabel>
                                <Select
                                    labelId="branch-select-label"
                                    id="branch-select"
                                    value={selectedBranch}
                                    label={'Branch'}
                                    onChange={(event) => {
                                        setselectedBranch(event.target.value);
                                    }}
                                >
                                    {filteredBranchesList.map((row, index) => (
                                        <MenuItem key={index} value={row}>
                                            {row?.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
  {selectedBranch ? (
    <AddonTable
      selectedBrand={selectedBrand}
      selectedBranch={selectedBranch}
      reload={reload}
      setReload={setReload}
    />
  ) : (
    <Box mt={4} display="flex" justifyContent="center" alignItems="center">
    <CircularProgress />
    </Box>
  )}

        </>
    );
}
