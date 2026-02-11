import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Box, OutlinedInput, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, Typography, Link, ToggleButton, ToggleButtonGroup } from '@mui/material';
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

const ProductGrid = ({ reload, selectedBranch, setReload, setModalOpen, sortOrder, sortBy }) => {
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
                <Grid container spacing={2} sx={{ mt: 2 }} justify="space-between">
                    {SortedProductList?.map((item, index) => {
                        return (
                            <GridItem
                                key={index}
                                item={item}
                                brand={selectedBranch}
                                productTypes={productTypes}
                                setUpdateData={setUpdateData}
                                setUpdate={setUpdate}
                                setModalOpen={setUpdateModalOpen}
                                duplicateProduct={duplicateProduct}
                                user={user}
                            />
                        );
                    })}
                </Grid>
            ) : (
                <ProductEditableTable
                    products={productsList}
                    filteredProducts={SortedProductList}
                    productTypes={productTypes}
                    selectedBrand={selectedBranch}
                    onReload={() => setReload((prev) => !prev)}
                    addonGroupList={addonGroupList}
                />
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
