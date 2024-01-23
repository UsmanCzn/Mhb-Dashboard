import { Chip, Grid, Typography, Menu, MenuItem, Button } from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchProductsList } from './hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NewProductType from 'components/store/productType/newProductType';
import NewProduct from 'components/store/products/newProduct';
import UpdateProduct from 'components/store/products/updateProduct';
import storeServices from 'services/storeServices';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { GridCellEditStopReasons } from '@mui/x-data-grid';

import Snackbar from '@mui/material/Snackbar';
import { useFetchProductTypeList } from '../ProductType/hooks/useFetchProductTypeList';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Products({ selectedBrand }) {
    const navigate = useNavigate();

    const location = useLocation();

    const [reload, setReload] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const { productsList, fetchProductsList, totalRowCount, loading } = useFetchProductsList(reload, selectedBrand);
    const { productTypes } = useFetchProductTypeList(true, selectedBrand);
    const [snackbar, setSnackbar] = React.useState(null);

    const activeColumnFormater = (item) => {
        return (
            <img
                alt="img"
                src={item?.productImage}
                style={{
                    width: 40,
                    height: 40
                }}
            />
        );
    };
    const nameColumnFormater = (item) => {
        return <Typography variant="h6">{item?.name + ' ' + item?.surname}</Typography>;
    };
    const groupsColumnFormater = (item) => {
        return (
            <Grid container spacing={1}>
                {item?.customerGroups?.map((obj) => {
                    return (
                        <Grid item xs="auto">
                            {' '}
                            <Typography variant="h6" px={2} mr={1} border={0.6} borderRadius={1}>
                                {obj}
                            </Typography>
                        </Grid>
                    );
                })}
            </Grid>
        );
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const [customer, setCustomer] = useState({});

    const [update, setUpdate] = useState(false);
    const [updateData, setUpdateData] = useState({});
    const [type, setType] = useState({});
    const mutateRow = useFakeMutation();
    const open = Boolean(anchorEl);
    const handleCloseSnackbar = () => setSnackbar(null);
    const handleClick = (event, params) => {
        setCustomer(params);
        setType(params?.row);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (data) => {
        if (data?.name == 'Update') {
            setUpdateModalOpen(true);
            setUpdate(true);
            setUpdateData(type);
        } else if (data?.name == 'Delete') {
            setDeleteOpen(true);
            // deleteProduct(type)
        }
        setAnchorEl(null);
    };

    const deleteProduct = async (type) => {
        await storeServices
            .deleteProduct(type?.id)
            .then((res) => {
                setDeleteOpen(false);
                setReload((prev) => {
                    return !prev;
                });
            })
            .catch((err) => {
                console.log(err?.response?.data);
            });
    };

    const handleProcessRowUpdateError = React.useCallback((error) => {
        setSnackbar({ children: error.message, severity: 'error' });
    }, []);
    const updateOrderValue = async (payload) => {
        await storeServices
            .updateProduct({ ...payload, productId: payload.id, orderValue: parseInt(payload.orderValue) })

            .then((res) => {
                console.log(res?.data, 'updateddddddd');
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setReload((prev) => !prev);
                setModalOpen(false);
            });
    };

    const columns = [
        {
            field: 'productImage',
            headerName: 'Image',
            headerAlign: 'left',
            renderCell: (params) => activeColumnFormater(params.row)
        },
        {
            field: 'id',
            headerName: 'ID',
            headerAlign: 'left'
        },
        {
            field: 'orderValue',
            headerName: 'Order Value',
            headerAlign: 'left',
            editable: true,
            preProcessEditCellProps: (params) => {
                if (params?.hasChanged) {
                    // updateOrderValue(params?.row,parseInt(params?.props?.value))
                }

                return { ...params.props };
            }

            // valueSetter: ( params) => {
            //   console.log(params,"after zero edited");
            //   return { ...params.row };
            // },
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 0.7,
            headerAlign: 'left'
        },
        {
            field: 'Product Type',
            headerName: 'Product Type',
            flex: 0.7,

            headerAlign: 'left',
            renderCell: (params) => {
                return (
                    <Typography>
                        {
                            productTypes.find((element) => {
                                return element?.subTypes.some((elemento) => elemento?.id == params?.row?.productSubTypeId);
                            })?.name
                        }
                    </Typography>
                );
            }
        },
        {
            field: 'Product category',
            headerName: 'Category',
            flex: 0.7,
            headerAlign: 'left',
            renderCell: (params) => {
                // return product.items.some((item) => {
                //   //^^^^^^
                //       return item.name === 'milk';
                //     });
                // console.log( ,"productTypes");

                return (
                    <Typography>
                        {
                            productTypes
                                .find((element) => {
                                    return element?.subTypes.some((elemento) => elemento?.id == params?.row?.productSubTypeId);
                                })
                                ?.subTypes?.find((obj) => obj?.id == params?.row?.productSubTypeId)?.name
                        }
                    </Typography>
                );
            }
        },
        {
            field: 'isQtyAvailable',
            headerName: 'is Qty Available',
            headerAlign: 'left'
        },

        {
            field: 'price',
            headerName: 'Price',
            headerAlign: 'left'
        },
        {
            field: 'isRewardMfissisng',
            headerName: 'Action',
            sortable: false,
            headerAlign: 'left',

            renderCell: (params) => {
                return <MoreVertIcon onClick={(event) => handleClick(event, params)} />;
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
    const processRowUpdate = React.useCallback(
        async (newRow) => {
            // Make the HTTP request to save in the backend
            console.log(newRow);
            updateOrderValue(newRow);
            // const response = await mutateRow(newRow);
            setSnackbar({ children: 'Order Value successfully saved', severity: 'success' });
            return newRow;
        },
        [mutateRow]
    );

    return (
        <>
            <Grid item xs={12} mb={2}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs={6}>
                        <Typography variant="h4">Products</Typography>
                    </Grid>
                    <Grid item xs={'auto'}>
                        <Button
                            size="small"
                            variant="contained"
                            sx={{ textTransform: 'capitalize' }}
                            onClick={() => {
                                setModalOpen(true);
                            }}
                        >
                            Add New Product
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <DataGridComponent
                rows={productsList}
                columns={columns}
                loading={loading}
                getRowId={(row) => row.id}
                rowsPerPageOptions={[10]}
                totalRowCount={totalRowCount}
                fetchCallback={fetchProductsList}
                rowReordering={true}
                processRowUpdate={processRowUpdate}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'orderValue', sort: 'asc' }]
                    }
                }}
                onProcessRowUpdateError={handleProcessRowUpdateError}
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

            <NewProduct modalOpen={modalOpen} setModalOpen={setModalOpen} setReload={setReload} selectedBrand={selectedBrand} />
            <UpdateProduct
                modalOpen={updateModalOpen}
                setModalOpen={setUpdateModalOpen}
                setReload={setReload}
                selectedBrand={selectedBrand}
                update={update}
                updateData={updateData}
            />
            <Dialog
                open={deleteOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => {
                    setDeleteOpen(false);
                }}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{'Delete Confirmation?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">Are you sure you want to delete this product</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
                    <Button onClick={() => deleteProduct(type)}>Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

const useFakeMutation = () => {
    return React.useCallback(
        (user) =>
            new Promise((resolve, reject) =>
                setTimeout(() => {
                    if (user.orderValue?.trim() === '') {
                        reject(new Error("Error while saving orderValue: order Value can't be empty."));
                    } else {
                        resolve({ ...user, orderValue: user.orderValue?.toUpperCase() });
                    }
                }, 200)
            ),
        []
    );
};
