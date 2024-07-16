import { Chip, Grid, Typography, Menu, MenuItem, Button } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import NewProductType from 'components/store/productType/newProductType';
import EditCategory from 'features/Store/Category';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchProductTypeList } from './hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import storeServices from 'services/storeServices';
import CircleIcon from '@mui/icons-material/Circle';
export default function ProductType({ selectedBrand, sortOrder }) {

    const [reload, setReload] = useState(false);
    const { productTypes, setProductTypes, fetchProductTypesList, totalRowCount, loading } = useFetchProductTypeList(reload, selectedBrand);
    const [modalOpen, setModalOpen] = useState(false);
    const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false);

    const groupsColumnFormater = (item) => {
        return (
            <Grid container spacing={1} direction="column">
                <Typography component="ul">
                    {item?.subTypes?.map((obj) => {
                        return (
                            <li>
                                <Typography variant="h6">{obj?.name}</Typography>
                            </li>
                        );
                    })}
                </Typography>
            </Grid>
        );
    };

    const sortProductTypes = () => {
        const temp = [...productTypes];
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
            deleteType(type);
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

    const deleteType = async (type) => {
        await storeServices
            .deleteProductType(type?.id)
            .then((res) => {
                setReload((prev) => {
                    return !prev;
                });
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });
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
                        <Button onClick={(event) => handleClickCategory(event, params)}>Edit categories</Button>
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
                        <Typography variant="h4" fontSize={24}>
                            Categories
                        </Typography>
                    </Grid>
                    <Grid item xs={'auto'}>
                        <Button
                            size="small"
                            variant="contained"
                            sx={{ textTransform: 'capitalize' }}
                            onClick={() => {
                                setUpdate(false);
                                setUpdateData({});
                                setModalOpen(true);
                            }}
                        >
                            Add New Product Type
                        </Button>
                    </Grid>
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
                        <MenuItem onClick={() => handleClose(row)} value={row.name}>
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
        </>
    );
}
