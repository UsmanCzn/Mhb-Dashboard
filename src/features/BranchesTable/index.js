import {
    Box,
    CircularProgress,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    Switch,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material';
import DataGridComponent from 'components/DataGridComponent';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchBranchList } from './hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import Tooltip from '@mui/material/Tooltip';
import branchServices from 'services/branchServices';
import { useAuth } from 'providers/authProvider';

const label = { inputProps: { 'aria-label': 'Size switch demo' } };
const DEFAULT_LOGO = 'https://syyve.blob.core.windows.net/users-avatar/default-user.png';

export default function BranchTable({ type, reload, setModalOpen, setUpdate, setUpdateData, bid }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { branchesList, fetchBranchesList, loading } = useFetchBranchList({ reload });
    const filteredBranchList =
        bid === 'all' || !bid ? branchesList : branchesList.filter((e) => String(e.brandId) === String(bid));

    const [anchorEl, setAnchorEl] = useState(null);
    const [branch, setBranch] = useState({});
    const [viewMode, setViewMode] = useState('grid');

    const open = Boolean(anchorEl);
    const handleClick = (event, params) => {
        setBranch(params?.row);
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const handleOptionClick = (data) => {
        if (!data.modal && data.route) {
            navigate(`${location.pathname}/${branch?.id}/${data.route}`);
        } else if (data?.name === 'Edit Location') {
            navigate(`/locationAddEdit/${branch?.id}/${bid}`);
        }
        closeMenu();
    };

    const activeColumnFormater = (item) => {
        return (
            <img
                alt="logo"
                src={item.logoUrl || DEFAULT_LOGO}
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 6,
                    objectFit: 'cover'
                }}
            />
        );
    };

    const hideBranch = async (event, data) => {
        const tempData = { ...data, ishide: event.target.checked };
        try {
            const res = await branchServices.editBranch(tempData);
            if (res) {
                fetchBranchesList();
            }
        } catch (err) {}
    };
    const branchSwitch = async (event, data) => {
        const tempData = { ...data, isBusy: event.target.checked };
        try {
            const res = await branchServices.editBranch(tempData);
            if (res) {
                fetchBranchesList();
            }
        } catch (err) {}
    };

    const columns = [
    {
        field: 'navme',
        headerName: 'Image',
        minWidth: 80,
        flex: 0.6,
        headerAlign: 'center',
        align: 'center',
        sortable: false,
        renderCell: (params) => activeColumnFormater(params.row),
    },
    {
        field: 'isBusy',
        headerName: 'Is Busy',
        minWidth: 120,
        flex: 0.8,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
        <Switch
            {...label}
            disabled={user?.isAccessRevoked}
            checked={params.row.isBusy}
            onChange={(event) => branchSwitch(event, params.row)}
            size="small"
        />
        ),
    },
    {
        field: 'ishide',
        headerName: 'Is Hidden',
        minWidth: 120,
        flex: 0.8,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => (
        <Switch
            {...label}
            disabled={user?.isAccessRevoked}
            checked={params.row.ishide}
            onChange={(event) => hideBranch(event, params.row)}
            size="small"
        />
        ),
    },
    {
        field: 'name',
        headerName: 'Store Name',
        minWidth: 180,
        flex: 1.2,
        headerAlign: 'left',
        align: 'left',
    },
    {
        field: 'brand',
        headerName: 'Brand',
        minWidth: 150,
        flex: 1,
        headerAlign: 'left',
        align: 'left',
    },
    {
        field: 'branchAddress',
        headerName: 'Address',
        minWidth: 220,
        flex: 1.5,
        headerAlign: 'left',
        align: 'left',
    },
    // {
    //     field: 'emailAddress',
    //     headerName: 'Email',
    //     minWidth: 200,
    //     flex: 1.3,
    //     headerAlign: 'left',
    //     align: 'left',
    // },
    {
        field: 'isRewardMissisng',
        headerName: 'Action',
        sortable: false,
        minWidth: 80,
        flex: 0.5,
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
            name: 'Edit Location',
            modal: true
        }
        // {
        //   name:"Create Branch User",
        //   modal:true,
        // },
        // {
        //   name:"Reward programs",
        //   modal:false,
        //   route:"branchRewardProgram"
        // },
        // {
        //     name: 'Store Timings',
        //     modal: false,
        //     route: 'branchTimings'
        // },
        // {
        //   name:"Branch Users",
        //   modal:false,
        //   route:"branchUsers"
        // },
        // {
        //   name:"Branch Paddle",
        //   modal:false,
        //   route:"branchPaddle"
        // }
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
                    rows={filteredBranchList}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row.id}
                    rowsPerPageOptions={[10]}
                    totalRowCount={filteredBranchList?.length ?? 0}
                    onRowClick={() => {}}
                    pSize={10}
                    pMode={'client'}
                />
            ) : (
                <Grid container spacing={2}>
                    {(filteredBranchList || []).map((item) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                            <Box
                                sx={{
                                    bgcolor: '#fff',
                                    borderRadius: 3,
                                    border: '1px solid #eee',
                                    overflow: 'hidden',
                                    minHeight: 320,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    p: 2
                                }}
                            >
                                <IconButton
                                    size="small"
                                    disabled={user?.isAccessRevoked}
                                    onClick={(event) => handleClick(event, { row: item })}
                                    sx={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}
                                >
                                    <MoreVertIcon fontSize="small" />
                                </IconButton>

                                <Box
                                    sx={{
                                        width: '100%',
                                        height: 140,
                                        mb: 2,
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        bgcolor: '#f9f9f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <img
                                        src={item.logoUrl || DEFAULT_LOGO}
                                        alt={item.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        loading="lazy"
                                    />
                                </Box>

                                <Typography variant="subtitle1" fontWeight={700} noWrap>
                                    {item.name || '-'}
                                </Typography>

                                <Stack spacing={0.75} sx={{ mt: 1.5 }}>
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        Brand: {item.brand || '-'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Address: {item.branchAddress || '-'}
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Is Busy
                                        </Typography>
                                        <Switch
                                            {...label}
                                            disabled={user?.isAccessRevoked}
                                            checked={!!item.isBusy}
                                            onChange={(event) => branchSwitch(event, item)}
                                            size="small"
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Is Hidden
                                        </Typography>
                                        <Switch
                                            {...label}
                                            disabled={user?.isAccessRevoked}
                                            checked={!!item.ishide}
                                            onChange={(event) => hideBranch(event, item)}
                                            size="small"
                                        />
                                    </Box>
                                </Stack>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}

            {!loading && (filteredBranchList || []).length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    No stores found.
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
