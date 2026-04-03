import React, { useState, useCallback, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Switch,
  Button,
  Box,
  FormControlLabel,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  OutlinedInput,
  InputLabel,
  FormControl,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useSnackbar } from 'notistack';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import storeServices from 'services/storeServices';
import fileService from 'services/fileService';
import imageCompression from 'browser-image-compression';
import { useFetchAddonGroupList } from 'features/Store/AddonGroups/hooks/useFetchAddonGroupList';

const ProductEditableTable = ({ 
  products = [], 
  productTypes = [], 
  selectedBrand,
  onReload,
  filteredProducts = null,
  addonGroupList = [],
  isDragEnabled = false,
  onReorder
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const { enqueueSnackbar } = useSnackbar();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [imageUploadingForId, setImageUploadingForId] = useState(null);

  // Use filtered products if provided, otherwise use all products
  const displayProducts = useMemo(() => {
    return filteredProducts || products;
  }, [filteredProducts, products]);

  const getSubTypes = useCallback((productTypeId) => {
    const type = productTypes.find((t) => t.id === productTypeId);
    return type?.subTypes || [];
  }, [productTypes]);

  const handleEdit = useCallback((product) => {
    setEditingId(product.id);
    setEditData({ 
      ...product,
      productAddOnGroups: product.productAddOnGroups || []
    });
  }, []);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setEditData({});
  }, []);

  const handleInputChange = useCallback((e, field) => {
    const { value, type, checked } = e.target;
    setEditData((prev) => ({
      ...prev,
      [field]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleImageUpload = useCallback(async (event, product) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUploadingForId(product.id);
    try {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };

      const compressedFile = await imageCompression(file, options);
      const uploadResponse = await fileService.uploadProductImage(compressedFile);
      const uploadedImageUrl = uploadResponse.data?.result;

      if (uploadedImageUrl) {
        setEditData((prev) => ({
          ...prev,
          productImage: uploadedImageUrl
        }));
        enqueueSnackbar('Image uploaded successfully', { variant: 'success' });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      enqueueSnackbar('Failed to upload image', { variant: 'error' });
    } finally {
      setImageUploadingForId(null);
    }
  }, [enqueueSnackbar]);

  const handleSave = useCallback(async (product) => {
    setLoading(true);
    try {
      // Transform addonGroups to productGroups format
      const productGroups = editData.productAddOnGroups?.map((group) => ({
        productId: editData.id || product.id,
        prodGroupId: group.productAdditionsGroupId,
        orderValue: group.orderValue || 0
      })) || [];

      const payload = {
        ...product,
        ...editData,
        productId: editData.id || product.id,
        brandId: selectedBrand?.id,
        isFeaturedProduct: editData.isFeaturedProduct ?? product.isFeaturedProduct ?? false,
        isTopProduct: editData.isTopProduct ?? product.isTopProduct ?? false,
        isDeliveryProduct: editData.isDeliveryProduct ?? product.isDeliveryProduct ?? false,
        isEligibleForFreeItems: editData.isEligibleForFreeItems ?? product.isEligibleForFreeItems ?? false,
        isCommentAllowed: editData.isCommentAllowed ?? product.isCommentAllowed ?? false,
        isDontMissOut: editData.isDontMissOut ?? product.isDontMissOut ?? false,
        productGroups: productGroups
      };

      await storeServices.updateProduct(payload);
      enqueueSnackbar('Product updated successfully', { variant: 'success' });
      setEditingId(null);
      setEditData({});
      onReload();
    } catch (error) {
      console.error('Error updating product:', error);
      enqueueSnackbar('Failed to update product', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [editData, selectedBrand, onReload, enqueueSnackbar]);

  const handleDeleteClick = useCallback((product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!productToDelete) return;

    setLoading(true);
    try {
      await storeServices.deleteProduct(productToDelete.id);
      enqueueSnackbar('Product deleted successfully', { variant: 'success' });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      onReload();
    } catch (error) {
      console.error('Error deleting product:', error);
      enqueueSnackbar('Failed to delete product', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [productToDelete, onReload, enqueueSnackbar]);

  const isEditing = (productId) => editingId === productId;

  return (
    <>
      <Box
        sx={{
          height: 'calc(100vh - 349px)',
          overflowX: 'hidden',
          overflowY: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <TableContainer 
          component={Paper} 
          sx={{ 
            mt: 2, 
            boxShadow: 2,
            flex: 1,
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            overflowY: 'auto',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px'
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#555'
              }
            },
            // prevent table cells from forcing horizontal overflow
            '& table': {
              width: '100%'
            },
            '& th, & td': {
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere'
            }
          }}
        >
        <Table stickyHeader aria-label="products table" sx={{ width: '100%', minWidth: 700, tableLayout: 'auto' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              {isDragEnabled && (
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : isTablet ? '0.8rem' : '0.9rem', padding: isMobile ? '4px' : '8px', minWidth: '40px', width: '40px' }}>
                  #
                </TableCell>
              )}
              {!isMobile && (
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : isTablet ? '0.8rem' : '0.9rem', padding: isMobile ? '4px' : '8px', minWidth: '120px' }}>
                  Image
                </TableCell>
              )}
              <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : isTablet ? '0.8rem' : '0.9rem', padding: isMobile ? '4px' : '8px', minWidth: '120px' }}>
                Name
              </TableCell>
              {!isMobile && (
                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : isTablet ? '0.8rem' : '0.9rem', padding: isMobile ? '4px' : '8px', minWidth: '120px' }}>
                  Native Name
                </TableCell>
              )}
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : isTablet ? '0.8rem' : '0.9rem', padding: isMobile ? '4px' : '8px', minWidth: '120px' }}>
                Type
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : isTablet ? '0.8rem' : '0.9rem', padding: isMobile ? '4px' : '8px', minWidth: '130px' }}>
                Category
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : isTablet ? '0.8rem' : '0.9rem', padding: isMobile ? '4px' : '8px', minWidth: '80px' }}>
                Price
              </TableCell>
              {!isMobile && (
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : isTablet ? '0.8rem' : '0.9rem', padding: isMobile ? '4px' : '8px', minWidth: '80px' }}>
                  Points
                </TableCell>
              )}
              {!isTablet && (
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : isTablet ? '0.8rem' : '0.9rem', padding: isMobile ? '4px' : '8px', minWidth: '80px' }}>
                  Stamps
                </TableCell>
              )}
              {!isTablet && (
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : isTablet ? '0.8rem' : '0.9rem', padding: isMobile ? '4px' : '8px', minWidth: '80px' }}>
                  Prep Time
                </TableCell>
              )}
              {!isTablet && (
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : isTablet ? '0.8rem' : '0.9rem', padding: isMobile ? '4px' : '8px', minWidth: '120px' }}>
                  Punch Type
                </TableCell>
              )}
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : isTablet ? '0.8rem' : '0.9rem', padding: isMobile ? '4px' : '8px', minWidth: '90px' }}>
                Featured
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : isTablet ? '0.8rem' : '0.9rem', padding: isMobile ? '4px' : '8px', minWidth: '90px' }}>
                Top
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : isTablet ? '0.8rem' : '0.9rem', padding: isMobile ? '4px' : '8px', minWidth: '90px' }}>
                Delivery
              </TableCell>
              {!isTablet && (
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : isTablet ? '0.8rem' : '0.9rem', padding: isMobile ? '4px' : '8px', minWidth: '90px' }}>
                  Free Items
                </TableCell>
              )}
              {!isTablet && (
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : isTablet ? '0.8rem' : '0.9rem', padding: isMobile ? '4px' : '8px', minWidth: '90px' }}>
                  Comment
                </TableCell>
              )}
              {!isTablet && (
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : isTablet ? '0.8rem' : '0.9rem', padding: isMobile ? '4px' : '8px' }}>
                  Don't Miss Out
                </TableCell>
              )}
              {isDesktop && (
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.9rem', padding: '8px' }}>
                  Addon Groups
                </TableCell>
              )}
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.7rem' : isTablet ? '0.8rem' : '0.9rem', padding: isMobile ? '4px' : '8px' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <DragDropContext onDragEnd={(result) => {
            if (!result.destination || !isDragEnabled || !onReorder) return;
            if (result.source.index === result.destination.index) return;
            onReorder(result.source.index, result.destination.index);
          }}>
            <Droppable droppableId="products-table">
              {(droppableProvided) => (
          <TableBody ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
            {displayProducts.map((product, productIndex) => (
              <Draggable
                key={String(product.id)}
                draggableId={String(product.id)}
                index={productIndex}
                isDragDisabled={!isDragEnabled || isEditing(product.id)}
              >
                {(draggableProvided, snapshot) => (
              <TableRow
                ref={draggableProvided.innerRef}
                {...draggableProvided.draggableProps}
                sx={{
                  backgroundColor: snapshot.isDragging ? '#e3f2fd' : isEditing(product.id) ? '#f0f7ff' : 'white',
                  '&:hover': { backgroundColor: isEditing(product.id) ? '#f0f7ff' : '#fafafa' },
                  ...(snapshot.isDragging ? { display: 'table', width: '100%' } : {})
                }}
              >

                {/* Drag Handle */}
                {isDragEnabled && (
                  <TableCell align="center" sx={{ padding: '4px', width: '40px' }} {...draggableProvided.dragHandleProps}>
                    <DragIndicatorIcon sx={{ color: '#999', cursor: 'grab', fontSize: 20 }} />
                  </TableCell>
                )}

                {/* Product Image */}
                {!isMobile && (
                  <TableCell align="center" sx={{ padding: isMobile ? '4px' : '8px' }}>
                    {isEditing(product.id) ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                        {editData.productImage && (
                          <img
                            src={editData.productImage}
                            alt="product"
                            style={{ width: isMobile ? 30 : 50, height: isMobile ? 30 : 50, borderRadius: 4, objectFit: 'cover' }}
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          id={`image-upload-${product.id}`}
                          onChange={(e) => handleImageUpload(e, product)}
                        />
                        <label htmlFor={`image-upload-${product.id}`}>
                          <Button
                            component="span"
                            size={isMobile ? 'small' : 'small'}
                            startIcon={
                              imageUploadingForId === product.id ? (
                                <CircularProgress size={16} />
                              ) : (
                                <CloudUploadIcon />
                              )
                            }
                            disabled={imageUploadingForId === product.id}
                          >
                            Upload
                          </Button>
                        </label>
                      </Box>
                    ) : (
                      <img
                        src={product.productImage}
                        alt="product"
                        style={{ width: isMobile ? 30 : 50, height: isMobile ? 30 : 50, borderRadius: 4, objectFit: 'cover' }}
                      />
                    )}
                  </TableCell>
                )}


                {/* Product Name */}
                <TableCell align="left" sx={{ padding: isMobile ? '4px' : '8px', fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                  {isEditing(product.id) ? (
                    <TextField
                      size="small"
                      value={editData.name || ''}
                      onChange={(e) => handleInputChange(e, 'name')}
                      fullWidth
                      variant="outlined"
                      inputProps={{ style: { fontSize: isMobile ? '0.75rem' : 'inherit' } }}
                    />
                  ) : (
                    product.name
                  )}
                </TableCell>

                {/* Native Name */}
                {!isMobile && (
                  <TableCell align="left" sx={{ padding: isMobile ? '4px' : '8px', fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                    {isEditing(product.id) ? (
                      <TextField
                        size="small"
                        value={editData.nativeName || ''}
                        onChange={(e) => handleInputChange(e, 'nativeName')}
                        fullWidth
                        variant="outlined"
                        inputProps={{ style: { fontSize: isMobile ? '0.75rem' : 'inherit' } }}
                      />
                    ) : (
                      product.nativeName || '-'
                    )}
                  </TableCell>
                )}

                {/* Product Type */}
                <TableCell align="center" sx={{ padding: isMobile ? '4px' : '8px', minWidth: isMobile ? '70px' : '100px', fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                  {isEditing(product.id) ? (
                    <Select
                      size="small"
                      value={editData.productTypeId || ''}
                      onChange={(e) => {
                        handleInputChange(e, 'productTypeId');
                        setEditData((prev) => ({
                          ...prev,
                          productSubTypeId: ''
                        }));
                      }}
                      fullWidth
                      variant="outlined"
                    >
                      {productTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    productTypes.find((t) => t.id === product.productTypeId)?.name || '-'
                  )}
                </TableCell>

                {/* Category */}
                <TableCell align="center" sx={{ padding: isMobile ? '4px' : '8px', minWidth: isMobile ? '70px' : '100px', fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                  {isEditing(product.id) ? (
                    <Select
                      size="small"
                      value={editData.productSubTypeId || ''}
                      onChange={(e) => handleInputChange(e, 'productSubTypeId')}
                      fullWidth
                      variant="outlined"
                      disabled={!editData.productTypeId}
                    >
                      {getSubTypes(editData.productTypeId).map((subType) => (
                        <MenuItem key={subType.id} value={subType.id}>
                          {subType.name}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    getSubTypes(product.productTypeId).find((s) => s.id === product.productSubTypeId)?.name || '-'
                  )}
                </TableCell>

                {/* Price */}
                <TableCell align="right" sx={{ minWidth: '100px', padding: isMobile ? '4px' : '8px', fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                  {isEditing(product.id) ? (
                    <TextField
                      size="small"
                      type="number"
                      value={editData.price || 0}
                      onChange={(e) => handleInputChange(e, 'price')}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    `${product.price.toFixed(selectedBrand?.currencyDecimals ||2)} ${selectedBrand?.currency || 'KD'}`
                  )}
                </TableCell>

                {/* Points of Cost */}
                {!isMobile && (
                  <TableCell align="right" sx={{ padding: isMobile ? '4px' : '8px', fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                    {isEditing(product.id) ? (
                      <TextField
                        size="small"
                        type="number"
                        value={editData.pointsOfCost || 0}
                        onChange={(e) => handleInputChange(e, 'pointsOfCost')}
                        fullWidth
                        variant="outlined"
                        inputProps={{ style: { fontSize: isMobile ? '0.75rem' : 'inherit' } }}
                      />
                    ) : (
                      product.pointsOfCost
                    )}
                  </TableCell>
                )}

                {/* Stamps For Purchase */}
                {!isTablet && (
                  <TableCell align="center" sx={{ padding: isMobile ? '4px' : '8px', fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                    {isEditing(product.id) ? (
                      <TextField
                        size="small"
                        type="number"
                        value={editData.punchesForPurchase || 0}
                        onChange={(e) => handleInputChange(e, 'punchesForPurchase')}
                        fullWidth
                        variant="outlined"
                        inputProps={{ style: { fontSize: isMobile ? '0.75rem' : 'inherit' } }}
                      />
                    ) : (
                      product.punchesForPurchase
                    )}
                  </TableCell>
                )}

                {/* Prep Time */}
                {!isTablet && (
                  <TableCell align="center" sx={{ padding: isMobile ? '4px' : '8px', fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                    {isEditing(product.id) ? (
                      <TextField
                        size="small"
                        type="number"
                        value={editData.estimatePreparationTimeInMinutes || 0}
                        onChange={(e) => handleInputChange(e, 'estimatePreparationTimeInMinutes')}
                        fullWidth
                        variant="outlined"
                        inputProps={{ style: { fontSize: isMobile ? '0.75rem' : 'inherit' } }}
                      />
                    ) : (
                      `${product.estimatePreparationTimeInMinutes}`
                    )}
                  </TableCell>
                )}

                {/* Punch Type */}
                {!isTablet && (
                  <TableCell align="center" sx={{ padding: isMobile ? '4px' : '8px', fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                    {isEditing(product.id) ? (
                      <Select
                        size="small"
                        value={editData.punchesType || 0}
                        onChange={(e) => handleInputChange(e, 'punchesType')}
                        fullWidth
                        variant="outlined"
                      >
                        <MenuItem value={0}>Regular</MenuItem>
                        <MenuItem value={1}>FreeFood</MenuItem>
                        <MenuItem value={2}>SpecialItem</MenuItem>
                        <MenuItem value={3}>SpecialProduct</MenuItem>
                        <MenuItem value={4}>Speical1</MenuItem>
                        <MenuItem value={5}>Speical2</MenuItem>
                        <MenuItem value={6}>Speical3</MenuItem>
                        <MenuItem value={7}>Speical4</MenuItem>
                        <MenuItem value={8}>Acai_Bowl</MenuItem>
                        <MenuItem value={9}>Matcha</MenuItem>
                        <MenuItem value={10}>Drinks</MenuItem>
                      </Select>
                    ) : (
                      ['Regular', 'FreeFood', 'SpecialItem', 'SpecialProduct', 'Speical1', 'Speical2', 'Speical3', 'Speical4', 'Acai_Bowl', 'Matcha', 'Drinks'][product.punchesType] || '-'
                    )}
                  </TableCell>
                )}

                {/* Featured */}
                <TableCell align="center" sx={{ padding: isMobile ? '4px' : '8px' }}>
                  {isEditing(product.id) ? (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editData.isFeaturedProduct || false}
                          onChange={(e) => handleInputChange(e, 'isFeaturedProduct')}
                          size={isMobile ? 'small' : 'small'}
                        />
                      }
                      label=""
                    />
                  ) : (
                    <Switch
                      checked={product.isFeaturedProduct || false}
                      disabled
                      size={isMobile ? 'small' : 'small'}
                    />
                  )}
                </TableCell>

                {/* Top Selling */}
                <TableCell align="center" sx={{ padding: isMobile ? '4px' : '8px' }}>
                  {isEditing(product.id) ? (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editData.isTopProduct || false}
                          onChange={(e) => handleInputChange(e, 'isTopProduct')}
                          size={isMobile ? 'small' : 'small'}
                        />
                      }
                      label=""
                    />
                  ) : (
                    <Switch
                      checked={product.isTopProduct || false}
                      disabled
                      size={isMobile ? 'small' : 'small'}
                    />
                  )}
                </TableCell>

                {/* Delivery */}
                <TableCell align="center" sx={{ padding: isMobile ? '4px' : '8px' }}>
                  {isEditing(product.id) ? (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editData.isDeliveryProduct || false}
                          onChange={(e) => handleInputChange(e, 'isDeliveryProduct')}
                          size={isMobile ? 'small' : 'small'}
                        />
                      }
                      label=""
                    />
                  ) : (
                    <Switch
                      checked={product.isDeliveryProduct || false}
                      disabled
                      size={isMobile ? 'small' : 'small'}
                    />
                  )}
                </TableCell>

                {/* Eligible for Free Items */}
                {!isTablet && (
                  <TableCell align="center" sx={{ padding: isMobile ? '4px' : '8px' }}>
                    {isEditing(product.id) ? (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={editData.isEligibleForFreeItem || false}
                            onChange={(e) => handleInputChange(e, 'isEligibleForFreeItem')}
                            size={isMobile ? 'small' : 'small'}
                          />
                        }
                        label=""
                      />
                    ) : (
                      <Switch
                        checked={product.isEligibleForFreeItem || false}
                        disabled
                        size={isMobile ? 'small' : 'small'}
                      />
                    )}
                  </TableCell>
                )}

                {/* Comment Allowed */}
                {!isTablet && (
                  <TableCell align="center" sx={{ padding: isMobile ? '4px' : '8px' }}>
                    {isEditing(product.id) ? (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={editData.commentAllowed || false}
                            onChange={(e) => handleInputChange(e, 'commentAllowed')}
                            size={isMobile ? 'small' : 'small'}
                          />
                        }
                        label=""
                      />
                    ) : (
                      <Switch
                        checked={product.commentAllowed || false}
                        disabled
                        size={isMobile ? 'small' : 'small'}
                      />
                    )}
                  </TableCell>
                )}

                {/* Don't Miss Out */}
                {!isTablet && (
                  <TableCell align="center" sx={{ padding: isMobile ? '4px' : '8px' }}>
                    {isEditing(product.id) ? (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={editData.dontMissOutProduct || false}
                            onChange={(e) => handleInputChange(e, 'dontMissOutProduct')}
                            size={isMobile ? 'small' : 'small'}
                          />
                        }
                        label=""
                      />
                    ) : (
                      <Switch
                        checked={product.dontMissOutProduct || false}
                        disabled
                        size={isMobile ? 'small' : 'small'}
                      />
                    )}
                  </TableCell>
                )}

                {/* Addon Groups Multi-Select */}
                {isDesktop && (
                  <TableCell align="center" sx={{ padding: isMobile ? '4px' : '8px', fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                    {isEditing(product.id) ? (
                      <FormControl fullWidth size="small">
                        <Select
                          multiple
                          value={
                            (editData.productAddOnGroups || []).map((g) => g.productAdditionsGroupId) || []
                          }
                          onChange={(e) => {
                            const selectedIds = e.target.value;
                            const newGroups = selectedIds.map((id) => {
                              const existing = (editData.productAddOnGroups || []).find(
                                (g) => g.productAdditionsGroupId === id
                              );
                              return existing || {
                                productAdditionsGroupId: id,
                                orderValue: 0,
                                posId: null
                              };
                            });
                            setEditData((prev) => ({
                              ...prev,
                              productAddOnGroups: newGroups
                            }));
                          }}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((id) => (
                                <Chip
                                  key={id}
                                  label={addonGroupList.find((g) => g.id === id)?.name || id}
                                  size="small"
                                />
                              ))}
                            </Box>
                          )}
                        >
                          {addonGroupList.map((group) => (
                            <MenuItem key={group.id} value={group.id}>
                              {group.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                        {product.productAddOnGroups?.map((group) => {
                          const groupName = addonGroupList.find((g) => g.id === group.productAdditionsGroupId)?.name;
                          return (
                            <Chip
                              key={group.productAdditionsGroupId}
                              label={groupName || group.productAdditionsGroupId}
                              size="small"
                            />
                          );
                        })}
                      </Box>
                    )}
                  </TableCell>
                )}

   
                {/* Actions */}
                <TableCell align="center" sx={{ padding: isMobile ? '4px' : '8px' }}>
                  <Box sx={{ display: 'flex', gap: isMobile ? '2px' : 0.5, justifyContent: 'center', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                    {isEditing(product.id) ? (
                      <>
                        <Tooltip title="Save">
                          <span>
                            <IconButton
                              size={isMobile ? 'small' : 'small'}
                              onClick={() => handleSave(product)}
                              disabled={loading}
                              color="success"
                            >
                              {loading ? <CircularProgress size={20} /> : <SaveIcon fontSize={isMobile ? 'small' : 'small'} />}
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton
                            size={isMobile ? 'small' : 'small'}
                            onClick={handleCancel}
                            disabled={loading}
                            color="error"
                          >
                            <CancelIcon fontSize={isMobile ? 'small' : 'small'} />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title="Edit">
                          <IconButton
                            size={isMobile ? 'small' : 'small'}
                            onClick={() => handleEdit(product)}
                            color="primary"
                          >
                            <EditIcon fontSize={isMobile ? 'small' : 'small'} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size={isMobile ? 'small' : 'small'}
                            onClick={() => handleDeleteClick(product)}
                            color="error"
                          >
                            <DeleteIcon fontSize={isMobile ? 'small' : 'small'} />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !loading && setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </>
  );
};

export default ProductEditableTable;
