import {
    Avatar,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import { useFetchAppsList } from './hooks/useFetchAppsList';
import moment from 'moment';
import DefaultImage from '../../assets/images/users/default-image.png';
import { useAuth } from 'providers/authProvider';

export default function AppsTable({ reload, setUpdate, setUpdateData, setModalOpen }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { appsList, loading } = useFetchAppsList({ reload });

    const activeColumnFormater = (item) => {
        return (
            <img
                alt="img"
                src={item?.logoUrl || DefaultImage}
                onError={(e) => {
                e.currentTarget.onerror = null; // prevent infinite loop
                e.currentTarget.src = DefaultImage;
            }}
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 6,
                    objectFit: 'cover'
                }}
            />
        );
    };
    const nameColumnFormater = (item) => {
        return <Typography variant="h6">{item?.name + ' '}</Typography>;
    };
    const dateFormater = (item) => {
        const hasDate = item?.endSubscriptionDate;
        return <Typography variant="h6">{hasDate ? moment(hasDate.toString()).format('DD-MMM-YYYY') : '--'}</Typography>;
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const [customer, setCustomer] = useState({});
    const [viewMode, setViewMode] = useState('table');

    const open = Boolean(anchorEl);
    const handleClick = (event, params) => {
        setCustomer(params?.row);
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const handleOptionClick = (data) => {
        if (data?.name === 'Edit App') {
            navigate('/addEditCompany/' + customer.id);

            // const dateObj = new Date(customer.endSubscriptionDate);

            // Extract day, month, and year from the Date object
            // const day = dateObj.getDate().toString().padStart(2, '0');
            // const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Note: January is 0, so we add 1
            // const year = dateObj.getFullYear();

            // Create the formatted date string in "dd/mm/yyyy" format
            // const formattedDate = `${month}/${day}/${year}`;
            // const updatedObject = {
            //     ...customer,
            //     formattedEndSubscriptionDate: formattedDate
            // };
            // setUpdateData(updatedObject);
            // setUpdate(true);
            // setModalOpen(true);
        }
        closeMenu();
    };

const columns = [
  {
    field: 'logo',
    headerName: 'Logo',
    flex: 0.5,
    minWidth: 90,
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    renderCell: (params) => activeColumnFormater(params.row),
  },
  {
    field: 'name',
    headerName: 'Company Name',
    flex: 1.6,
    minWidth: 220,
    headerAlign: 'left',
    align: 'left',
    renderCell: (params) => nameColumnFormater(params.row),
  },
  {
    field: 'category',
    headerName: 'Category',
    flex: 1.2,
    minWidth: 180,
    headerAlign: 'left',
    align: 'left',
    renderCell: (params) => (
      <span
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={params?.row?.categoryName}
      >
        {params?.row?.categoryName || '--'}
      </span>
    ),
  },
  {
    field: 'endSubscriptionDate',
    headerName: 'End Subscription Date',
    flex: 1.1,
    minWidth: 170,
    headerAlign: 'left',
    align: 'left',
    renderCell: (params) => dateFormater(params.row),
  },
  {
    field: 'actions',
    headerName: 'Action',
    sortable: false,
    flex: 0.4,
    minWidth: 80,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => (
      <MoreVertIcon
        sx={{ cursor: 'pointer' }}
        onClick={(event) => handleClick(event, params)}
      />
    ),
  },
];


    const options = [
        {
            name: 'Edit App',
            modal: true
        }
    ];

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    size="small"
                    onChange={(event, newMode) => {
                        if (newMode !== null) {
                            setViewMode(newMode);
                        }
                    }}
                >
                    <ToggleButton value="grid" aria-label="grid view">
                        <GridViewIcon fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="table" aria-label="table view">
                        <TableRowsIcon fontSize="small" />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {loading ? (
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : viewMode === 'table' ? (
                <DataGridComponent
                    rows={appsList}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row.id}
                    rowsPerPageOptions={[10]}
                    totalRowCount={appsList?.length ?? 0}
                    pSize={10}
                    pMode={'client'}
                />
            ) : (
                <Grid container spacing={2}>
                    {(appsList || []).map((item) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Avatar src={item?.logoUrl || DefaultImage} alt={item?.name} variant="rounded" sx={{ width: 52, height: 52 }} />
                                        <IconButton
                                            size="small"
                                            disabled={user?.isAccessRevoked}
                                            onClick={(event) => handleClick(event, { row: item })}
                                        >
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    </Box>

                                    <Typography variant="subtitle1" fontWeight={700} noWrap>
                                        {item?.name || '--'}
                                    </Typography>

                                    <Stack spacing={0.5} sx={{ mt: 1.5 }}>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            Category: {item?.categoryName || '--'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            End Subscription: {item?.endSubscriptionDate ? moment(item.endSubscriptionDate.toString()).format('DD-MMM-YYYY') : '--'}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {!loading && (appsList || []).length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    No companies found.
                </Typography>
            )}

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={closeMenu}
                MenuListProps={{
                    'aria-labelledby': 'basic-button'
                }}
            >
                {options.map((row, index) => {
                    return (
                        <MenuItem disabled={user?.isAccessRevoked} key={index} onClick={() => handleOptionClick(row)} value={row.name}>
                            {row.name}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
}
