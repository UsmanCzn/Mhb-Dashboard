import React, { useEffect, useState } from "react";
import { Grid, Box, Typography, ButtonBase, Button, CircularProgress, Menu, MenuItem, Divider } from '@mui/material/index';
import { useFetchAddonGroupList } from 'features/Store/AddonGroups/hooks/useFetchAddonGroupList';
import { useFetchAddonList } from 'features/Store/Addons/hooks/useFetchAddonList';
import AddonItem from 'components/Addon/addonItem';
import NewAddonGroup from 'components/store/addonGroup/newAddonGroup';
import { useAuth } from 'providers/authProvider';
import NewAddon from 'components/store/addon/newAddon';
import storeServices from 'services/storeServices';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { BorderBottom } from '../../../node_modules/@mui/icons-material/index';



const AddonTable = ({ reload, selectedBrand, setReload,selectedBranch=null }) => {
    
    const { addonGroupList, loading: gLoading } = useFetchAddonGroupList(reload, selectedBrand);
    const [AddsonReload, setAddsonReload] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const { addonList, loading } = useFetchAddonList(AddsonReload, selectedGroup?.id, selectedBrand);
    useEffect(() => {
        setAddsonReload((prev)=> !prev)
    }, [selectedBranch]);
    const [anchorEl, setAnchorEl] = useState(null);
    const { user } = useAuth();
    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const closeMenu = () => {
        setAnchorEl(null);
    };

    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenA, setModalOpenA] = useState(false);

    const [update, setUpdate] = useState(false);
    const [updateA, setUpdateA] = useState(false);
    const [updateData, setUpdateData] = useState({});
    const [updateDataA, setUpdateDataA] = useState({});

    function handleClick(e) {
        setSelectedGroup(e);
    }

    useEffect(() => {
        setSelectedGroup(addonGroupList[0] ?? 0);
    }, [addonGroupList]);



    const deleteAddonGroup = async () => {
        await storeServices
            .deleteProductAddonGroup(selectedGroup?.id)

            .then((res) => {
                closeMenu();
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setReload((prev) => !prev);
            });
    };

    return (
        <Box
            sx={{
                border: '1px solid lightGrey',
                borderRadius: 2,
                px: 2,
                py: 4
            }}
            boxShadow={1}
        >
            <Grid container>
                <Grid item xs={4}>
                    {gLoading ? (
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                width: '100%',

                                py: 2,
                                borderRadius: 2,
                                border: 1,
                                mt: 2,
                                borderColor: 'lightGrey'
                            }}
                            boxShadow={1}
                        >
                            <Grid container mb={1} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
                                <Typography
                                    variant="h1"
                                    fontSize={18}
                                    sx={{
                                        px: 0,
                                        mt: 0
                                    }}
                                >
                                    Groups
                                </Typography>
                                {user && user?.roleId!==7 && !selectedBranch && 
                                <Button
                                    variant="contained"
                                    disabled={user?.isAccessRevoked}
                                    onClick={() => {
                                        setUpdate(false);
                                        setModalOpen(true);
                                    }}
                                >
                                    Create Group
                                </Button>}
                            </Grid>
                            <Divider
                                sx={{
                                    borderColor: 'lightGrey', // Set your desired color
                                    borderWidth: '1px' // Increase the width to make it bolder
                                }}
                            />
                            <Box
                                sx={{
                                    maxHeight: 'calc(100vh - 320px)', // Set the max height for scrolling
                                    overflowY: 'auto'
                                }}
                            >
                                {addonGroupList?.map((item, index) => {
                                    return (
                                        <Box
                                            sx={{
                                                height: 45,
                                                backgroundColor: selectedGroup?.id == item?.id ? 'primary.lighter' : null,
                                                borderRight: selectedGroup?.id == item?.id ? '2px solid #69c0ff' : null
                                            }}
                                            display="flex"
                                            alignItems="center"
                                            key={index}
                                        >
                                            <ButtonBase
                                                display="flex"
                                                justifyContent="space-between"
                                                sx={{
                                                    width: '100%',
                                                    height: '100%'
                                                }}
                                                onClick={() => handleClick(item)}
                                            >
                                                <Typography
                                                    variant="h5"
                                                    fontSize={14}
                                                    sx={{
                                                        textAlign: 'left',
                                                        width: '100%',
                                                        px: 2
                                                    }}
                                                >
                                                    {item?.name}
                                                </Typography>
                                               {user && user?.roleId!==7 && !selectedBranch && <MoreVertIcon onClick={openMenu} fontSize="small" />}
                                            </ButtonBase>
                                        </Box>
                                    );
                                })}
                            </Box>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                                <MenuItem
                                disabled={user?.isAccessRevoked}
                                    onClick={() => {
                                        setUpdate(true);
                                        setUpdateData(selectedGroup);
                                        setModalOpen(true);
                                        closeMenu();
                                    }}
                                >
                                    Edit
                                </MenuItem>
                                <MenuItem 
                                disabled={user?.isAccessRevoked}
                                onClick={() => deleteAddonGroup()}>Delete</MenuItem>
                            </Menu>
                        </Box>
                    )}
                </Grid>

                <Grid item xs={7.5}>
                    <Box
                        sx={{
                            width: '100%',
                            mx: 2,
                            py: 2,
                            borderRadius: 2,
                            border: 1,
                            mt: 2,
                            borderColor: 'lightGrey'
                        }}
                    >
                        <Grid
                            container
                            spacing={2}
                            sx={{
                                px: 2,
                                py: 2
                            }}
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Typography
                                variant="h2"
                                fontSize={18}
                                sx={{
                                    px: 2
                                }}
                            >
                                Add-On's
                            </Typography>
                            {user && user?.roleId!==7 && !selectedBranch &&
                            <Button
                                variant="contained"
                                disabled={user?.isAccessRevoked}
                                onClick={() => {
                                    setUpdateA(false);
                                    setModalOpenA(true);
                                }}
                            >
                                Add new Add-On's
                            </Button>}
                        </Grid>
                        <Divider
                            sx={{
                                borderColor: 'lightGrey', // Set your desired color
                                borderWidth: '1px' // Increase the width to make it bolder
                            }}
                        />

                        {/* <Grid container spacing={2} px={2} justifyContent="space-between" mt={2}>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setUpdate(true);
                                    setUpdateData(selectedGroup);
                                    setModalOpen(true);
                                }}
                            >
                                Edit this Addon Group
                            </Button>

                            <Button variant="outlined" color="error" onClick={() => deleteAddonGroup()}>
                                Delete this Addon Group
                            </Button>
                        </Grid> */}

                        {
                            <Grid container spacing={2} mt={1} px={2} gap={10}>
                                <Grid item>
                                    <Typography variant="h2" fontSize={17}>
                                        ID : {selectedGroup?.id}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h2" fontSize={17}>
                                        Allow Multiple : {selectedGroup?.allowMultiple ? 'YES' : 'NO'}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h2" fontSize={17}>
                                        IS Required : {selectedGroup?.isRequired ? 'YES' : 'NO'}
                                    </Typography>
                                </Grid>

                                {/* <Grid item> 
                            <Button variant="outlined" color="error" onClick={() => deleteAddonGroup()}>Delete this Addon Group</Button>

                                </Grid> */}
                            </Grid>
                        }
                        {loading ? (
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Grid container spacing={2} justifyContents="space-between">
                                {addonList?.map((item, index) => {
                                    return (
                                        <AddonItem
                                            item={item}
                                            key={index}
                                            user={user}
                                            selectedBranch={selectedBranch}
                                            addonGroupList={addonGroupList}
                                            brand={selectedBrand}
                                            setModalOpen={setModalOpenA}
                                            setUpdate={setUpdateA}
                                            setUpdateData={setUpdateDataA}
                                            modalOpenA={modalOpenA}
                                            setAddsonReload={setAddsonReload}
                                        />
                                    );
                                })}
                            </Grid>
                        )}
                    </Box>
                </Grid>
            </Grid>

            <NewAddonGroup
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                setReload={setReload}
                selectedBrand={selectedBrand}
                update={update}
                updateData={updateData}
                closeMenu={closeMenu}
            />

            <NewAddon
                modalOpen={modalOpenA}
                setModalOpen={setModalOpenA}
                setReload={setReload}
                selectedBrand={selectedBrand}
                update={updateA}
                updateData={updateDataA}
                addonGroupList={addonGroupList}
                setAddsonReload={setAddsonReload}
            />
        </Box>
    );
};

export default AddonTable