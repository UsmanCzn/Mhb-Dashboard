import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Grid,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import ConfirmationModal from '../../components/confirmation-modal';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import OfferModal from './add-offer-modal';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import offerServices from 'services/offerServices';
import LinearProgress from '@mui/material/LinearProgress';
import { useAuth } from 'providers/authProvider';

const Offers = () => {
  const { user } = useAuth();

  const [page] = useState(0); // (unused for now)
  const [rowsPerPage] = useState(5); // (unused for now)
  const [offers, setOffers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [Load, setLoad] = useState(true);
  const { brandsList } = useFetchBrandsList(reload);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const actions = [
    { value: 0, label: 'Menu' },
    { value: 1, label: 'Category' },
    { value: 2, label: 'SubCategory' },
    { value: 3, label: 'Product' }
  ];

  // DELETE FUNCTIONS START
  const [selectedOffer, setSelectedOffer] = useState(null);
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
    if (selectedBrand?.id) getOffersByBrandId(selectedBrand.id);
  };

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

  // ✅ Guard so we don’t call API with undefined id
  useEffect(() => {
    if (selectedBrand?.id) {
      getOffersByBrandId(selectedBrand.id);
    }
  }, [selectedBrand?.id]);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);

  const handleMenuOpen = useCallback((e, offer) => {
    setSelectedOffer(offer);
    setMenuAnchorEl(e.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);

  const onEdit = useCallback(() => {
    if (selectedOffer) handleEdit(selectedOffer);
    handleMenuClose();
  }, [selectedOffer, handleEdit, handleMenuClose]);

  const onDelete = useCallback(() => {
    if (selectedOffer) handleDelete(selectedOffer);
    handleMenuClose();
  }, [selectedOffer, handleDelete, handleMenuClose]);

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
          <Box display="flex" alignItems="center" gap={2}>
            {offer?.orderValue}
          </Box>
        </TableCell>

        <TableCell align="right">
          <IconButton
            aria-label="more actions"
            aria-controls={menuOpen ? 'offer-actions-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? 'true' : undefined}
            disabled={user?.isAccessRevoked}
            onClick={(e) => handleMenuOpen(e, offer)}
            sx={{ p: 0 }}
          >
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  }, [offers, user?.isAccessRevoked, handleMenuOpen, menuOpen]);

const getOffersByBrandId = async (id) => {
  if (!id) return; // ✅ guard
  try {
    const response = await offerServices.getAllOffersByBrandId(id);
    if (response) {
      setLoad(false);
      // sort by Id ascending
      const sortedOffers = [...response.data.result].sort((a, b) => a.orderValue - b.orderValue);
      setOffers(sortedOffers);
    }
  } catch (error) {
    console.error(error);
    setLoad(false);
  }
};


  const headers = [
    { name: 'Offer Name', value: 'offerName' },
    { name: 'Action Type', value: 'actionType' },
    { name: 'Sort Order', value: 'orderValue' },
    { name: 'Action', value: 'action' }
  ];

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs="auto">
              <Typography fontSize={22} fontWeight={700}>
                Offers
              </Typography>
            </Grid>
            <Box alignItems="center" sx={{ display: 'flex', gap: '10px' }}>
              <Grid item xs="auto">
                <Button
                  size="small"
                  onClick={() => {
                    setSelectedOffer(null);
                    setModalOpen(true);
                  }}
                  disabled={user?.isAccessRevoked}
                  variant="contained"
                  sx={{ textTransform: 'capitalize' }}
                >
                  Create New Offer
                </Button>
              </Grid>
              <Grid item xs={6} justifyContent="flex-end">
                <FormControl>
                  <InputLabel id="brand-select-label">Brand</InputLabel>
                  <Select
                    labelId="brand-select-label"
                    id="brand-select"
                    value={selectedBrand}
                    label="Brand"
                    onChange={(event) => setselectedBrand(event.target.value)}
                    sx={{ minWidth: 220 }}
                  >
                    {brandsList.map((row) => (
                      <MenuItem key={row.id} value={row}>
                        {row?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            {Load && (
              <Box sx={{ width: '100%' }}>
                <LinearProgress />
              </Box>
            )}
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

      <Menu
        id="offer-actions-menu"
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disabled={user?.isAccessRevoked} onClick={onEdit}>
       
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem disabled={user?.isAccessRevoked} onClick={onDelete}>
 
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

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
        brand={selectedBrand}
      />
    </>
  );
};

export default Offers;
