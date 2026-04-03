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
  ListItemText,
  Chip,
  CircularProgress
} from '@mui/material';
import ConfirmationModal from '../../components/confirmation-modal';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import OfferModal from './add-offer-modal';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import offerServices from 'services/offerServices';
import LinearProgress from '@mui/material/LinearProgress';
import { useAuth } from 'providers/authProvider';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useSnackbar } from 'notistack';

const Offers = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [page] = useState(0); // (unused for now)
  const [rowsPerPage] = useState(5); // (unused for now)
  const [offers, setOffers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [Load, setLoad] = useState(true);
  const { brandsList } = useFetchBrandsList(reload);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // DnD state
  const [orderDirty, setOrderDirty] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

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
  // DnD handlers
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const srcIndex = result.source.index;
    const destIndex = result.destination.index;
    if (srcIndex === destIndex) return;
    setOffers((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(srcIndex, 1);
      updated.splice(destIndex, 0, moved);
      return updated.map((item, i) => ({ ...item, orderValue: i }));
    });
    setOrderDirty(true);
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    try {
      for (const offer of offers) {
        await offerServices.UpdateOffer(offer);
      }
      enqueueSnackbar('Offer order saved successfully', { variant: 'success' });
      setOrderDirty(false);
    } catch (error) {
      console.error('Error saving offer order:', error);
      enqueueSnackbar('Failed to save offer order', { variant: 'error' });
    } finally {
      setSavingOrder(false);
    }
  };

  const handleCancelOrder = () => {
    if (selectedBrand?.id) getOffersByBrandId(selectedBrand.id);
    setOrderDirty(false);
  };
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
      <Draggable key={offer.id} draggableId={String(offer.id)} index={index}>
        {(provided, snapshot) => (
      <TableRow
        ref={provided.innerRef}
        {...provided.draggableProps}
        sx={{
          backgroundColor: snapshot.isDragging ? '#e3f2fd' : 'inherit',
          ...(snapshot.isDragging && { display: 'table', width: '100%' }),
        }}
      >
        <TableCell sx={{ width: 40, p: 0, pl: 1 }}>
          <Box {...provided.dragHandleProps} sx={{ display: 'flex', alignItems: 'center', cursor: 'grab', color: 'text.secondary' }}>
            <DragIndicatorIcon fontSize="small" />
          </Box>
        </TableCell>
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
        )}
      </Draggable>
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
    { name: '', value: 'drag' },
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
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="offers-table">
                  {(provided) => (
                    <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                      {memoizedTableRows}
                      {provided.placeholder}
                    </TableBody>
                  )}
                </Droppable>
              </DragDropContext>
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

      {/* Save/Cancel Order Bar */}
      {orderDirty && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            backgroundColor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.15)',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 1,
            px: 3,
            py: 1.5,
          }}
        >
          <Chip
            label="Drag rows to reorder, then save"
            size="small"
            color="info"
            variant="outlined"
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCancelOrder}
            disabled={savingOrder}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveOrder}
            disabled={savingOrder}
            startIcon={savingOrder ? <CircularProgress size={16} /> : null}
          >
            {savingOrder ? 'Saving...' : 'Save Order'}
          </Button>
        </Box>
      )}
    </>
  );
};

export default Offers;
