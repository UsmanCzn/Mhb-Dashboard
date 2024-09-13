import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Typography, Button, Box, FormControl, InputLabel, MenuItem, Select, Avatar } from '@mui/material';
import ConfirmationModal from '../../components/confirmation-modal';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import OfferModal from './add-offer-modal';
import offerServices from 'services/offerServices';
import LinearProgress from '@mui/material/LinearProgress';

const Offers = () => {
    const [page, setPage] = useState(0);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [offers, setOffers] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [Load, setLoad] = useState(true)
    const { brandsList } = useFetchBrandsList(reload);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
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
    // DELETE FUNCTIONS START
    const handleCancelDelete = () => {
        setSelectedOffer(null);
        setDeleteModalOpen(false);
    };

    const handleDelete = (item) => {
        setSelectedOffer(item);
        setDeleteModalOpen(true);
    };

    const handleEdit = (item) => {
        setSelectedOffer(item);
        setModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await offerServices.DeleteOffer(selectedOffer.id);
            if (response) {
                getOffersByBrandId(selectedBrand.id);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
        setDeleteModalOpen(false);
    };
    // DELETE FUNCTION END

    // HANDLE OFFER MODAL CLOSE
    const handleOfferClose = () => {
        getOffersByBrandId(brandsList[0].id);
        setselectedBrand(brandsList[0]);
    };
    // HANDLE OFFER MODAL CLOSE

    const getActionType = (action) => {
        const foundAction = actions.find((item) => item.value === action);
        return foundAction ? foundAction.label : 'Unknown';
    };

    const [selectedBrand, setselectedBrand] = useState({});
    useEffect(() => {
        if (brandsList[0]?.id) {
            setselectedBrand(brandsList[0]);
            getOffersByBrandId(brandsList[0].id);
        }
    }, [brandsList]);

    useEffect(() => {
        getOffersByBrandId(selectedBrand.id);
    }, [selectedBrand]);

    const memoizedTableRows = useMemo(() => {
        return offers.map((offer, index) => (
            <TableRow key={index}>
                <TableCell>
                   <Box display="flex" alignItems="center" gap={2}>
                        <Avatar alt="offer picture" src={offer?.offerImageUrl} />
                        {offer?.offerName}
                    </Box>
                </TableCell>
                <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                        {getActionType(offer.actionType)}
                    </Box>
                </TableCell>
                <TableCell>
                    <Box display="flex" alignItems="center">
                 
                            <DeleteIcon style={{ color: '#DD4D2B', border: 'none', padding: 0,cursor:'pointer'}}  onClick={() => handleDelete(offer)}/>
                    
                            <EditIcon  style={{ color: '#44ab38f0', border: 'none', padding: 0 ,cursor:'pointer'}} onClick={() => handleEdit(offer)}/>
                    </Box>
                </TableCell>
            </TableRow>
        ));
    }, [offers, selectedBrand]);

    const getOffersByBrandId = async (id) => {
        try {
            const response = await offerServices.getAllOffersByBrandId(id);
            if (response) {
                setLoad(false)
                setOffers(response.data.result);
                
            }
        } catch (error) {}
    };

    const headers = [
        { name: 'Offer Name', value: 'offerName' },
        { name: 'Action Type', value: 'actionType' },
        { name: 'Action', value: 'action' }
    ];

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs={'auto'}>
                            <Typography fontSize={22} fontWeight={700}>
                                Offers
                            </Typography>
                        </Grid>
                        <Box alignItems="center" sx={{display:'flex', gap:'10px'}}>
                        <Grid item xs={'auto'}>
                            <Button
                                size="small"
                                onClick={() => {
                                    setSelectedOffer(null);
                                    setModalOpen(true);
                                }}
                                variant="contained"
                                sx={{ textTransform: 'capitalize' }}
                            >
                                Create New Offer
                            </Button>
                        </Grid>
                        <Grid item xs={6} justifyContent="flex-end">
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">{'Brand'}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedBrand}
                            label={'Brand'}
                            onChange={(event) => {
                                setselectedBrand(event.target.value);
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
                        </Box>
                    </Grid>
                </Grid>
 

                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                    {Load&&<Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>}
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {headers?.map((e, index) => (
                                        <TableCell key={index}>{e.name}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>{memoizedTableRows}</TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

            <ConfirmationModal
                open={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                statement={`Are you sure you want to delete this offer?`}
            />

            <OfferModal
                modalOpen={modalOpen}
                onClose={handleOfferClose}
                setModalOpen={setModalOpen}
                setReload={setReload}
                offer={selectedOffer}
                brand = {selectedBrand}
            />
        </>
    );
};

export default Offers;
