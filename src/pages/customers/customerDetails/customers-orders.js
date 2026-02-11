import React, { useState, useEffect, useCallback } from 'react';
import DataGridComponent from 'components/DataGridComponent';
import { useParams } from 'react-router-dom';
import { Grid, Typography, Menu, MenuItem } from '@mui/material';
import customerService from 'services/customerService';
import moment from 'moment';
import { useFetchBrandsList } from 'features/BrandsTable/hooks/useFetchBrandsList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OrderDetail from 'components/orders/OrderDetails';
const CustomerOrders = ({ user }) => {

    const [statustypes, setStatusTypes] = useState([
        { id: 1, title: 'Open' },
        { id: 3, title: 'Accepted' },
        { id: 4, title: 'Ready' },
        { id: 2, title: 'Closed' },
        { id: 5, title: 'Rejected' }
    ]);
    const [state, setState] = useState({
        loading: false,
        data: [],
        totalCount: 0
    });
    const { cid } = useParams();
    const { brandsList } = useFetchBrandsList(true);
    const [selectedBrand, setSelectedBrand] = useState({});
    const [page, setPage] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [data, setData] = useState({});
    const open = Boolean(anchorEl);

    const handleClick = (event, params) => {

        setData({ ...params?.row, ...user });
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (data) => {
        if (data.modal && data?.name == 'Open/Print') {
            setModalOpen(true);
        }

        setAnchorEl(null);
    };
    const options = [
        {
            name: 'Open/Print',
            modal: true
        }
    ];
    useEffect(() => {
        if (brandsList.length > 0) {
            setSelectedBrand(brandsList[0]);
        }
    }, [brandsList]);

    const getCustomerOrders = useCallback(
        async (pageNo) => {
            if (!selectedBrand.id) return;

            setState((prev) => ({ ...prev, loading: true }));
            try {
                const data = {
                    brandIds: brandsList.map((e) => e.id),
                    UserId: cid,
                    skip: pageNo * 10,
                    take: 10
                };
                const response = await customerService.getCustomerOrdersByBrand(data);
                if (response) {
                    setState((prev) => ({
                        ...prev,
                        data: response.data.result?.orderHistoryItems || [],
                        totalCount: response.data.result?.itemsLeft || 0,
                        loading: false
                    }));
                }
            } catch (error) {
                setState({ data: [], totalCount: 0, loading: false });
            }
        },
        [brandsList, cid, selectedBrand.id]
    );

    useEffect(() => {
        getCustomerOrders(page);
    }, [selectedBrand, page, getCustomerOrders]);

const columns = [
  {
    field: 'branchName',
    headerName: 'For Branch',
    headerAlign: 'left',
    align: 'left',
    flex: 1,
    minWidth: 180
  },
  {
    field: 'deliverySystem',
    headerName: 'Type',
    headerAlign: 'left',
    align: 'left',
    flex: 1,
    minWidth: 140
  },
  {
    field: 'orderNumber',
    headerName: 'Order Number',
    headerAlign: 'left',
    align: 'left',
    flex: 1,
    minWidth: 160
  },
  {
    field: 'status',
    headerName: 'Status',
    headerAlign: 'left',
    align: 'left',
    flex: 0.5,
    minWidth: 120
  },
  {
    field: 'isPaid',
    headerName: 'Is Paid',
    headerAlign: 'left',
    align: 'left',
    flex: 0.5,
    minWidth: 100,
    renderCell: (params) => (
      <Typography>{params?.row?.isPaid ? 'Yes' : 'No'}</Typography>
    )
  },
  {
    field: 'date',
    headerName: 'Date',
    headerAlign: 'left',
    align: 'left',
    flex: 1.2,
    minWidth: 200,
    renderCell: (params) => (
      <Typography>
        {moment(params?.row?.date).format('DD-MMM-YYYY hh:mm a')}
      </Typography>
    )
  },
  {
    field: 'isHiddven',
    headerName: 'Order Details',
    headerAlign: 'left',
    align: 'left',
    flex: 1.5,
    minWidth: 300,
    renderCell: (params) => (
      <Grid container direction="column">
        <Typography
          component="div"
          sx={{
            '& ul': { m: 0, p: 0 },
            '& li': { ml: '-1em' }
          }}
        >
          <ul>
            {params?.row?.products?.map((obj, index) => (
              <li key={index}>
                <Typography variant="body2">
                  {`${obj?.name} x ${obj?.quantity}`}
                </Typography>
              </li>
            ))}
          </ul>
        </Typography>
      </Grid>
    )
  },
  {
    field: 'action',
    headerName: 'Actions',
    sortable: false,
    headerAlign: 'left',
    align: 'left',
    flex: 0.6,
    minWidth: 90,
    renderCell: (params) => (
      <MoreVertIcon
        sx={{ cursor: 'pointer' }}
        onClick={(event) => handleClick(event, params)}
      />
    )
  }
];


    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item xs="auto">
                        <Typography fontSize={26} fontWeight={600}></Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <DataGridComponent
                    rows={state.data}
                    columns={columns}
                    loading={state.loading}
                    getRowId={(row) => row.id}
                    rowsPerPageOptions={[10]}
                    totalRowCount={state.totalCount}
                    fetchCallback={(newPage) => setPage(newPage)}
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
                            <MenuItem key={index} onClick={() => handleClose(row)} value={row.name}>
                                {row.name}
                            </MenuItem>
                        );
                    })}
                </Menu>
            </Grid>
            <OrderDetail modalOpen={modalOpen} setModalOpen={setModalOpen} setReload={setReload} data={data} statustypes={statustypes} location='customer-order' />
        </Grid>
    );
};

export default CustomerOrders;
