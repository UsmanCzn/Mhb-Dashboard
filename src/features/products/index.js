import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Box, OutlinedInput, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, Typography, Link, ToggleButton, ToggleButtonGroup, Chip } from '@mui/material';
import { useFetchProductsList } from 'features/Store/Products/hooks/useFetchProductsList';
import GridItem from 'components/products/gridItem';
import { useFetchProductTypeList } from 'features/Store/ProductType/hooks/useFetchProductTypeList';
import { useFetchAddonGroupList } from 'features/Store/AddonGroups/hooks/useFetchAddonGroupList';
import UpdateProduct from 'components/store/products/updateProduct';
import ProductEditableTable from './ProductEditableTable';
import storeServices from 'services/storeServices';
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import { useAuth } from 'providers/authProvider';
import { useSnackbar } from 'notistack';
import GridViewIcon from '@mui/icons-material/GridView';
import TableChartIcon from '@mui/icons-material/TableChart';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const ProductGrid = ({ reload, selectedBranch, setReload, setModalOpen }) => {
    const { user, userRole, isAuthenticated } = useAuth();

    const { productsList, loading, setProductsList } = useFetchProductsList(reload, selectedBranch);
    const { productTypes } = useFetchProductTypeList(true, selectedBranch);
    const { addonGroupList } = useFetchAddonGroupList(false, selectedBranch);
    const navigate = useNavigate();
    const [category, setCategory] = useState();
    const [subCategory, setSubCategory] = useState();
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    const [sortBy, setSortBy] = useState('orderValue');
    const [sortOrder, setSortOrder] = useState(0); // 0 = ascending, 1 = descending
    const [searchText, setSearchText] = useState('');
    const [orderDirty, setOrderDirty] = useState(false);
    const [savingOrder, setSavingOrder] = useState(false);

    const [update, setUpdate] = useState(false);
    const [updateData, setUpdateData] = useState({});
    const [SortedProductList, setSortedProductList] = useState([]);
    const reset = useMemo(() => {
        setSubCategory();
        setCategory();
    }, [selectedBranch]);

const subTypes = useMemo(() => {
  const temp = productTypes.find((e) => e.id === category?.id);
  return temp
    ? [...temp.subTypes].sort((a, b) => a.orderValue - b.orderValue) // ✅ ascending by id
    : [];
}, [category, productTypes]);


    const sortByProperty = (array, propertyName, sortOrder = 0) => {
        return array.sort((a, b) => {
            const aValue = a[propertyName];
            const bValue = b[propertyName];

            if (sortOrder === 0) {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else if (sortOrder === 1) {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }

            return 0;
        });
    };

    const searchProducts = (search) => {
        setSearchText(search);
        const searchNameLower = search.toLowerCase();

        // Filter based on search term, category, and subcategory
        let result = productsList.filter((item) => item.name.toLowerCase().includes(searchNameLower));

        if (category && subCategory !== undefined) {
            if (subCategory !== 0) {
                result = result.filter((item) => item.productTypeId === category?.id && item.productSubTypeId === subCategory);
            } else {
                result = result.filter((item) => item.productTypeId === category?.id);
            }
        }

        setSortedProductList(result);
    };

    const filterByCategory = useMemo(() => {
        if (category && subCategory !== undefined) {
            if (subCategory !== 0) {
                const result = productsList.filter((item) => item.productTypeId === category?.id && item.productSubTypeId === subCategory);
                setSortedProductList(result);
            } else {
                setSortedProductList(productsList);
            }
        } else if (category) {
            const result = productsList.filter((item) => item.productTypeId === category?.id);
            setSortedProductList(result);
        } else {
            setSortedProductList([]);
        }
    }, [category, subCategory]);

    const handleSubCategoryChange = (event) => {
        const selectedValue = event.target.value;

        // Check if "All SubCategories" is selected based on id (id: 0)

        setSubCategory(selectedValue);
    };
    const duplicateProduct = (item) => {
        storeServices
            .DuplicateProducts({
                productId: item.id
            })
            .then((response) => {
                setReload((prev) => !prev);
            })
            .catch((error) => {
                console.error('Error duplicating product:', error);
            });
    };

    useEffect(() => {
        const temp = sortByProperty(productsList, sortBy, sortOrder);
        setSortedProductList([...temp]);

        return () => {};
    }, [sortOrder, sortBy, productsList]);

    // Drag is enabled with no filters/search active, sorted by orderValue ascending
    const isFiltered = !!category || !!searchText;
    const isDragEnabled = !isFiltered && sortBy === 'orderValue' && sortOrder === 0;

    const handleReorder = (srcIndex, destIndex) => {
        setSortedProductList((prev) => {
            const updated = [...prev];
            const [moved] = updated.splice(srcIndex, 1);
            updated.splice(destIndex, 0, moved);
            return updated.map((item, i) => ({ ...item, orderValue: i }));
        });
        setOrderDirty(true);
    };

    const handleCancelOrder = () => {
        const temp = sortByProperty([...productsList], sortBy, sortOrder);
        setSortedProductList([...temp]);
        setOrderDirty(false);
    };

    const handleSaveOrder = async () => {
        setSavingOrder(true);
        try {
            for (const product of SortedProductList) {
                await storeServices.updateProduct({
                    ...product,
                    productId: product.id,
                    brandId: selectedBranch?.id,
                    productGroups: product.productAddOnGroups?.map((g) => ({
                        productId: product.id,
                        prodGroupId: g.productAdditionsGroupId,
                        orderValue: g.orderValue || 0
                    })) || []
                });
            }
            enqueueSnackbar('Product order saved successfully', { variant: 'success' });
            setOrderDirty(false);
            setReload((prev) => !prev);
        } catch (error) {
            console.error('Error saving order:', error);
            enqueueSnackbar('Failed to save product order', { variant: 'error' });
        } finally {
            setSavingOrder(false);
        }
    };

    const handleFileUpload = async (file) => {
      try {
        const formData = new FormData();
        formData.append('file', file); // 👈 MUST be "file"

        await storeServices.bulkUploadProduct(
          selectedBranch.id,
          formData
        );
        enqueueSnackbar('File uploaded successfully', { variant: 'success' });
        setReload((prev) => !prev);

      } catch (error) {
        console.error('Upload failed:', error);
        enqueueSnackbar('File upload failed. Please try again.', { variant: 'error' });
      }
    };



    return (
        <Box
            sx={{
                // backgroundColor:"white",
                border: '1px solid lightGrey',
                borderRadius: 2,
                px: 2,
                py: 4
            }}
            boxShadow={2}
        >
        <Box
          sx={{
            px: 2,
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            alignItems: { md: 'center' },
            justifyContent: 'space-between'
          }}
        >
          {/* Filters */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              flex: 1
            }}
          >
            <OutlinedInput
              placeholder="Search by Product name"
              onChange={(e) => searchProducts(e.target.value)}
              sx={{ width: { xs: '100%', sm: 260 } }}
            />

            <FormControl sx={{ width: { xs: '100%', sm: 160 } }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                {productTypes.map((row, index) => (
                  <MenuItem key={index} value={row}>
                    {row?.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ width: { xs: '100%', sm: 180 } }}>
              <InputLabel>SubCategory</InputLabel>
              <Select
                value={subCategory}
                label="SubCategory"
                onChange={handleSubCategoryChange}
              >
                {subTypes?.length > 0 && (
                  <MenuItem value={0}>All SubCategories</MenuItem>
                )}
                {subTypes?.map((row) => (
                  <MenuItem key={row.id} value={row.id}>
                    {row.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ width: { xs: '100%', sm: 140 } }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="orderValue">Order Value</MenuItem>
                <MenuItem value="name">Name</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ width: { xs: '100%', sm: 140 } }}>
              <InputLabel>Order</InputLabel>
              <Select
                value={sortOrder}
                label="Order"
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <MenuItem value={0}>Ascending</MenuItem>
                <MenuItem value={1}>Descending</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Actions */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'stretch', md: 'flex-end' },
              gap: 0.5
            }}
          >
            {/* View Toggle */}
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(event, newMode) => {
                  if (newMode !== null) {
                    setViewMode(newMode);
                  }
                }}
                size="small"
              >
                <ToggleButton value="grid" aria-label="grid view">
                  <GridViewIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="table" aria-label="table view">
                  <TableChartIcon fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Buttons Row */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                disabled={user?.isAccessRevoked}
                sx={{ textTransform: 'capitalize' }}
                onClick={() => navigate(`/addEditProduct/${selectedBranch.id}`)}
              >
                Add new Product
              </Button>

              <Button
                component="label"
                size="small"
                variant="outlined"
                disabled={user?.isAccessRevoked}
                sx={{ textTransform: 'capitalize' }}
              >
                Upload file
                <input
                  hidden
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    // ✅ Validate CSV only
                    const isCsv =
                      file.type === 'text/csv' ||
                      file.name.toLowerCase().endsWith('.csv');

                    if (!isCsv) {
                      alert('Only CSV files are allowed');
                      e.target.value = ''; // reset input
                      return;
                    }

                    // ✅ Valid CSV file
                    console.log('CSV file uploaded:', file);
                    handleFileUpload(file);
                  }}
                />
              </Button>
            </Box>

            {/* Sample Download */}
            <Link
              href={encodeURI('/Product Bulk Sample.csv')}
              download
              underline="hover"
              sx={{
                fontSize: '0.75rem',
                cursor: 'pointer',
                color: 'primary.main',
                textDecoration: 'underline',
                textAlign: { xs: 'left', md: 'right' }
              }}
            >
              Download sample file
            </Link>
          </Box>
        </Box>

            {loading ? (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : viewMode === 'grid' ? (
                <DragDropContext onDragEnd={(result) => {
                    if (!result.destination || !isDragEnabled) return;
                    if (result.source.index === result.destination.index) return;
                    handleReorder(result.source.index, result.destination.index);
                }}>
                    <Droppable droppableId="product-grid" direction="horizontal">
                        {(droppableProvided) => (
                            <Grid
                                container
                                spacing={2}
                                sx={{ mt: 2 }}
                                ref={droppableProvided.innerRef}
                                {...droppableProvided.droppableProps}
                            >
                                {SortedProductList?.map((item, index) => (
                                    <Draggable
                                        key={String(item.id)}
                                        draggableId={String(item.id)}
                                        index={index}
                                        isDragDisabled={!isDragEnabled}
                                    >
                                        {(draggableProvided, snapshot) => (
                                            <GridItem
                                                ref={draggableProvided.innerRef}
                                                {...draggableProvided.draggableProps}
                                                {...draggableProvided.dragHandleProps}
                                                isDragging={snapshot.isDragging}
                                                item={item}
                                                brand={selectedBranch}
                                                productTypes={productTypes}
                                                setUpdateData={setUpdateData}
                                                setUpdate={setUpdate}
                                                setModalOpen={setUpdateModalOpen}
                                                duplicateProduct={duplicateProduct}
                                                user={user}
                                            />
                                        )}
                                    </Draggable>
                                ))}
                                {droppableProvided.placeholder}
                            </Grid>
                        )}
                    </Droppable>
                </DragDropContext>
            ) : (
                <ProductEditableTable
                    products={productsList}
                    filteredProducts={SortedProductList}
                    productTypes={productTypes}
                    selectedBrand={selectedBranch}
                    onReload={() => setReload((prev) => !prev)}
                    addonGroupList={addonGroupList}
                    isDragEnabled={isDragEnabled}
                    onReorder={handleReorder}
                />
            )}

            {/* Save Order Button - Fixed at bottom */}
            {isDragEnabled && orderDirty && (
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
                        label="Drag items to reorder, then save"
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

            {/* <UpdateProduct
                modalOpen={updateModalOpen}
                setModalOpen={setUpdateModalOpen}
                setReload={setReload}
                selectedBrand={selectedBranch}
                update={update}
                updateData={updateData}
            /> */}
        </Box>
    );
};

export default ProductGrid;
