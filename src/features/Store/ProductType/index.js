import { Chip, Grid, Typography, Menu, MenuItem, Button,Box ,FormControl, InputLabel,Select} from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import NewProductType from 'components/store/productType/newProductType';
import EditCategory from 'features/Store/Category';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchProductTypeList } from './hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import storeServices from 'services/storeServices';
import CircleIcon from '@mui/icons-material/Circle';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import ConfirmationModal from 'components/confirmation-modal';
import { useAuth } from 'providers/authProvider';



export default function ProductType({sortOrder }) {
    const { user, userRole, isAuthenticated } = useAuth();

    const [reload, setReload] = useState(false);
    const [selectedBrand, setselectedBrand] = useState({});
    const { productTypes, setProductTypes, fetchProductTypesList, totalRowCount, loading } = useFetchProductTypeList(reload, selectedBrand);
    const [modalOpen, setModalOpen] = useState(false);
    const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false);
    const { brandsList } = useFetchBrandsList(reload);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState()
    const handleCancelDelete = () => {
        // setSelectedUserId(null);
        setDeleteModalOpen(false);
    };

    useEffect(() => {
        if (brandsList[0]?.id) {
            setselectedBrand(brandsList[0]);
        }
    }, [brandsList]);

    const groupsColumnFormater = (item) => {
        return (
            <Grid container spacing={1} direction="column">
                <Typography component="ul">
                    {item?.subTypes?.map((obj, index) => {
                        return (
                            <li key={index}>
                                <Typography variant="h6">{obj?.name}</Typography>
                            </li>
                        );
                    })}
                </Typography>
            </Grid>
        );
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const [type, setType] = useState({});
    const [update, setUpdate] = useState(false);
    const [updateData, setUpdateData] = useState({});

    const open = Boolean(anchorEl);
    const handleClick = (event, params) => {
        setType(params?.row);
        setAnchorEl(event.currentTarget);
        setUpdate(false);
    };

    const handleClickCategory = (event, params) => {
        setType(params?.row);
        setEditCategoryModalOpen(true);
        setUpdate(false);
    };

    const handleClose = (data) => {
        if (data?.name == 'Update') {
            setUpdate(true);
            setUpdateData(type);
            setModalOpen(true);
        } else if (data?.name == 'Delete') {
            setDeleteModalOpen(true);
            setSelectedCategory(type)
        }
        setAnchorEl(null);
    };
    useEffect(() => {
        if (type?.id) {
            setType((prev) => productTypes?.find((obj) => obj?.id == prev?.id));
        }
        // setType(
        //   prev=> productTypes?.find(obj=>obj?.id==type?.id)
        // )
    }, [productTypes]);

    const deleteType = async () => {
        await storeServices
            .deleteProductType(selectedCategory?.id)
            .then((res) => {
                setReload((prev) => {
                    return !prev;
                });
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });
            setDeleteModalOpen(false);
    };

    const columns = [
        {
            field: 'ids',
            headerName: ' ',
            flex: 0.1,
            headerAlign: 'left'
        },
        //   {
        //     field: "orderValue",
        //     headerName: "Order Value",
        //     flex: 0.5,
        //     headerAlign: "left",
        // },
        {
            field: 'name',
            headerName: 'Category',
            flex: 1,
            headerAlign: 'left'
        },

        {
            field: 'subTypes',
            headerName: 'Sub Categories',
            flex: 1.4,
            headerAlign: 'left',
            renderCell: (params) => groupsColumnFormater(params.row)
        },
        {
            field: 'orderValue',
            headerName: 'Sort Order',
            flex: 1,
            headerAlign: 'left'
        },

        {
            field: 'isRewardMfissisng',
            headerName: 'Action',
            sortable: false,
            flex: 0.8,
            headerAlign: 'left',

            renderCell: (params) => {
                return (
                    <Grid container direction="row" alignItems="center">
                        <Button disabled={user?.isAccessRevoked} onClick={(event) => handleClickCategory(event, params)}>Edit categories</Button>
                        <MoreVertIcon onClick={(event) => handleClick(event, params)} />
                    </Grid>
                );
            }
        }
    ];

    const options = [
        {
            name: 'Update',
            modal: true
        },
        {
            name: 'Delete',
            modal: true
        }
    ];

    return (
        <>
            <Grid item xs={12} mb={2}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={6}>
                        <Typography fontSize={22} fontWeight={700}>
                            Categories
                        </Typography>
                    </Grid>
                    <Box alignItems="center" sx={{ display: 'flex', gap: '10px' }}>
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
                                    }}
                                >
                                    {brandsList.map((row, index) => {
                                        return <MenuItem value={row}>{row?.name}</MenuItem>;
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={'auto'}>
                            <Button
                                size="small"
                                variant="contained"
                                disabled={user?.isAccessRevoked}
                                sx={{ textTransform: 'capitalize' }}
                                onClick={() => {
                                    setUpdate(false);
                                    setUpdateData({});
                                    setModalOpen(true);
                                }}
                            >
                                Add New Category
                            </Button>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
            <DataGridComponent
                rows={productTypes}
                columns={columns}
                loading={loading}
                getRowId={(row) => row.id}
                rowsPerPageOptions={[10]}
                totalRowCount={totalRowCount}
                fetchCallback={fetchProductTypesList}
            />
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button'
                }}
            >
                {options.map((row, index) => {
                    return (
                        <MenuItem disabled={user?.isAccessRevoked} key={index} onClick={() => handleClose(row)} value={row.name}>
                            {row.name}
                        </MenuItem>
                    );
                })}
            </Menu>

            <NewProductType
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                setReload={setReload}
                update={update}
                updateData={updateData}
                selectedBrand={selectedBrand}
            />
            <EditCategory
                modalOpen={editCategoryModalOpen}
                setModalOpen={setEditCategoryModalOpen}
                type={type}
                setReload={setReload}
                selectedBrand={selectedBrand}
            />
            <ConfirmationModal
                open={isDeleteModalOpen}
                onClose={handleCancelDelete}
                onConfirm={deleteType}
                statement={`Are you sure you want to delete this Category?`}
            />
        </>
    );
}
