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
        setReload((prev) => !prev);
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
  if (!addonGroupList?.length) {
    setSelectedGroup(null);
    return;
  }

  // Try to keep the previously selected group
  const updatedSelectedGroup = addonGroupList.find(
    (g) => g.id === selectedGroup?.id
  );

  if (updatedSelectedGroup) {
    setSelectedGroup(updatedSelectedGroup);
  } else {
    // Fallback if deleted or not found
    setSelectedGroup(addonGroupList[0]);
  }
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
      px: { xs: 1, sm: 2 },
      py: 4,
    }}
    boxShadow={1}
  >
    <Grid container spacing={2}>
      {/* LEFT: GROUPS */}
      <Grid item xs={12} md={4}>
        {gLoading ? (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              py: 4,
            }}
          >
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
              borderColor: 'lightGrey',
            }}
            boxShadow={1}
          >
            <Grid
              container
              mb={1}
              sx={{ px: 2 }}
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography fontSize={18} fontWeight={600}>
                Groups
              </Typography>

              {user && user?.roleId !== 7 && !selectedBranch && (
                <Button
                  size="small"
                  variant="contained"
                  disabled={user?.isAccessRevoked}
                  onClick={() => {
                    setUpdate(false);
                    setModalOpen(true);
                  }}
                >
                  Create Group
                </Button>
              )}
            </Grid>

            <Divider sx={{ borderColor: 'lightGrey', borderWidth: 1 }} />

            <Box
              sx={{
                maxHeight: { xs: 'auto', md: 'calc(100vh - 320px)' },
                overflowY: 'auto',
              }}
            >
              {addonGroupList?.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    height: 45,
                    backgroundColor:
                      selectedGroup?.id === item?.id
                        ? 'primary.lighter'
                        : 'transparent',
                    borderRight:
                      selectedGroup?.id === item?.id
                        ? '2px solid #69c0ff'
                        : 'none',
                  }}
                  display="flex"
                  alignItems="center"
                >
                  <ButtonBase
                    sx={{ width: '100%', height: '100%' }}
                    onClick={() => handleClick(item)}
                  >
                    <Typography
                      fontSize={14}
                      sx={{ textAlign: 'left', px: 2, flexGrow: 1 }}
                    >
                      {item?.name}
                    </Typography>

                    {user &&
                      user?.roleId !== 7 &&
                      !selectedBranch && (
                        <MoreVertIcon
                          fontSize="small"
                          onClick={openMenu}
                        />
                      )}
                  </ButtonBase>
                </Box>
              ))}
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={closeMenu}
            >
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
                onClick={() => deleteAddonGroup()}
              >
                Delete
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Grid>

      {/* RIGHT: ADDONS */}
      <Grid item xs={12} md={8}>
        <Box
          sx={{
            width: '100%',
            py: 2,
            borderRadius: 2,
            border: 1,
            mt: 2,
            borderColor: 'lightGrey',
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{ px: 2, py: 2 }}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography fontSize={18} fontWeight={600}>
              Add-On&apos;s
            </Typography>

            {user && user?.roleId !== 7 && !selectedBranch && (
              <Button
                size="small"
                variant="contained"
                disabled={user?.isAccessRevoked}
                onClick={() => {
                  setUpdateA(false);
                  setModalOpenA(true);
                }}
              >
                Add new Add-On&apos;s
              </Button>
            )}
          </Grid>

          <Divider sx={{ borderColor: 'lightGrey', borderWidth: 1 }} />

          {/* GROUP INFO */}
          <Grid
            container
            spacing={2}
            mt={1}
            px={2}
            sx={{ flexWrap: 'wrap' }}
          >
            <Grid item xs={12} sm={4}>
              <Typography fontSize={16}>
                ID: {selectedGroup?.id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography fontSize={16}>
                Allow Multiple:{' '}
                {selectedGroup?.allowMultiple ? 'YES' : 'NO'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography fontSize={16}>
                Is Required:{' '}
                {selectedGroup?.isRequired ? 'YES' : 'NO'}
              </Typography>
            </Grid>
          </Grid>

          {/* ADDONS LIST */}
          {loading ? (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                py: 4,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2} mt={1} px={2}>
              {addonList?.map((item, index) => (
                <AddonItem
                  key={index}
                  item={item}
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
              ))}
            </Grid>
          )}
        </Box>
      </Grid>
    </Grid>

    {/* MODALS */}
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
      selectedGroup={selectedGroup}
      updateData={updateDataA}
      addonGroupList={addonGroupList}
      setAddsonReload={setAddsonReload}
    />
  </Box>
);

};

export default AddonTable