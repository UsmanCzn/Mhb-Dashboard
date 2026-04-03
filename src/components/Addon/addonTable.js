import React, { useEffect, useState } from "react";
import { Grid, Box, Typography, ButtonBase, Button, CircularProgress, Menu, MenuItem, Divider, Chip } from '@mui/material/index';
import { useFetchAddonGroupList } from 'features/Store/AddonGroups/hooks/useFetchAddonGroupList';
import { useFetchAddonList } from 'features/Store/Addons/hooks/useFetchAddonList';
import AddonItem from 'components/Addon/addonItem';
import NewAddonGroup from 'components/store/addonGroup/newAddonGroup';
import { useAuth } from 'providers/authProvider';
import NewAddon from 'components/store/addon/newAddon';
import storeServices from 'services/storeServices';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useSnackbar } from 'notistack';



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
    const { enqueueSnackbar } = useSnackbar();

    // DnD state for groups
    const [sortedGroups, setSortedGroups] = useState([]);
    const [groupOrderDirty, setGroupOrderDirty] = useState(false);
    const [savingGroupOrder, setSavingGroupOrder] = useState(false);

    // DnD state for addons
    const [sortedAddons, setSortedAddons] = useState([]);
    const [addonOrderDirty, setAddonOrderDirty] = useState(false);
    const [savingAddonOrder, setSavingAddonOrder] = useState(false);

    // Sync groups from API
    useEffect(() => {
        setSortedGroups([...addonGroupList].sort((a, b) => (a.orderValue ?? 0) - (b.orderValue ?? 0)));
        setGroupOrderDirty(false);
    }, [addonGroupList]);

    // Sync addons from API
    useEffect(() => {
        setSortedAddons([...addonList].sort((a, b) => (a.orderValue ?? 0) - (b.orderValue ?? 0)));
        setAddonOrderDirty(false);
    }, [addonList]);

    const handleGroupDragEnd = (result) => {
        if (!result.destination) return;
        const srcIndex = result.source.index;
        const destIndex = result.destination.index;
        if (srcIndex === destIndex) return;
        setSortedGroups((prev) => {
            const updated = [...prev];
            const [moved] = updated.splice(srcIndex, 1);
            updated.splice(destIndex, 0, moved);
            return updated.map((item, i) => ({ ...item, orderValue: i }));
        });
        setGroupOrderDirty(true);
    };

    const handleAddonDragEnd = (result) => {
        if (!result.destination) return;
        const srcIndex = result.source.index;
        const destIndex = result.destination.index;
        if (srcIndex === destIndex) return;
        setSortedAddons((prev) => {
            const updated = [...prev];
            const [moved] = updated.splice(srcIndex, 1);
            updated.splice(destIndex, 0, moved);
            return updated.map((item, i) => ({ ...item, orderValue: i }));
        });
        setAddonOrderDirty(true);
    };

    const handleSaveGroupOrder = async () => {
        setSavingGroupOrder(true);
        try {
            for (const group of sortedGroups) {
                await storeServices.updateProductAdditionGroup(group, selectedBrand?.id);
            }
            enqueueSnackbar('Group order saved successfully', { variant: 'success' });
            setGroupOrderDirty(false);
            setReload((prev) => !prev);
        } catch (error) {
            console.error('Error saving group order:', error);
            enqueueSnackbar('Failed to save group order', { variant: 'error' });
        } finally {
            setSavingGroupOrder(false);
        }
    };

    const handleCancelGroupOrder = () => {
        setSortedGroups([...addonGroupList].sort((a, b) => (a.orderValue ?? 0) - (b.orderValue ?? 0)));
        setGroupOrderDirty(false);
    };

    const handleSaveAddonOrder = async () => {
        setSavingAddonOrder(true);
        try {
            for (const addon of sortedAddons) {
                await storeServices.updateProductAddition(addon, selectedBrand?.id);
            }
            enqueueSnackbar('Add-on order saved successfully', { variant: 'success' });
            setAddonOrderDirty(false);
            setAddsonReload((prev) => !prev);
        } catch (error) {
            console.error('Error saving addon order:', error);
            enqueueSnackbar('Failed to save add-on order', { variant: 'error' });
        } finally {
            setSavingAddonOrder(false);
        }
    };

    const handleCancelAddonOrder = () => {
        setSortedAddons([...addonList].sort((a, b) => (a.orderValue ?? 0) - (b.orderValue ?? 0)));
        setAddonOrderDirty(false);
    };

    const canDrag = user && user?.roleId !== 7 && !selectedBranch;
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

            <DragDropContext onDragEnd={handleGroupDragEnd}>
              <Droppable droppableId="addon-groups">
                {(droppableProvided) => (
                  <Box
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                    sx={{
                      maxHeight: { xs: 'auto', md: 'calc(100vh - 320px)' },
                      overflowY: 'auto',
                    }}
                  >
                    {sortedGroups?.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={String(item.id)}
                        index={index}
                        isDragDisabled={!canDrag}
                      >
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            sx={{
                              height: 45,
                              backgroundColor: snapshot.isDragging
                                ? '#e3f2fd'
                                : selectedGroup?.id === item?.id
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
                            {canDrag && (
                              <Box
                                {...provided.dragHandleProps}
                                sx={{ display: 'flex', alignItems: 'center', pl: 1, cursor: 'grab', color: 'text.secondary' }}
                              >
                                <DragIndicatorIcon fontSize="small" />
                              </Box>
                            )}
                            <ButtonBase
                              sx={{ width: '100%', height: '100%' }}
                              onClick={() => handleClick(item)}
                            >
                              <Typography
                                fontSize={14}
                                sx={{ textAlign: 'left', px: canDrag ? 1 : 2, flexGrow: 1 }}
                              >
                                {item?.name}
                              </Typography>
                              <Typography
                                fontSize={12}
                                sx={{ color: 'text.secondary', px: 1, whiteSpace: 'nowrap' }}
                              >
                                #{item?.orderValue ?? '-'}
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
                        )}
                      </Draggable>
                    ))}
                    {droppableProvided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>

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
            <DragDropContext onDragEnd={handleAddonDragEnd}>
              <Droppable droppableId="addons" direction="horizontal">
                {(droppableProvided) => (
                  <Grid
                    container
                    spacing={2}
                    mt={1}
                    px={2}
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                  >
                    {sortedAddons?.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={String(item.id)}
                        index={index}
                        isDragDisabled={!canDrag}
                      >
                        {(provided, snapshot) => (
                          <Grid
                            item
                            xs={6}
                            sm={4}
                            md={4}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              opacity: snapshot.isDragging ? 0.8 : 1,
                              cursor: canDrag ? 'grab' : 'default',
                            }}
                          >
                            <AddonItem
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
                              isDragging={snapshot.isDragging}
                            />
                          </Grid>
                        )}
                      </Draggable>
                    ))}
                    {droppableProvided.placeholder}
                  </Grid>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </Box>
      </Grid>
    </Grid>

    {/* Save/Cancel Order Bar */}
    {(groupOrderDirty || addonOrderDirty) && (
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
          label={groupOrderDirty ? 'Group order changed' : 'Add-on order changed'}
          size="small"
          color="info"
          variant="outlined"
        />
        {groupOrderDirty && (
          <>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCancelGroupOrder}
              disabled={savingGroupOrder}
            >
              Cancel Groups
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveGroupOrder}
              disabled={savingGroupOrder}
              startIcon={savingGroupOrder ? <CircularProgress size={16} /> : null}
            >
              {savingGroupOrder ? 'Saving...' : 'Save Group Order'}
            </Button>
          </>
        )}
        {addonOrderDirty && (
          <>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCancelAddonOrder}
              disabled={savingAddonOrder}
            >
              Cancel Add-ons
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveAddonOrder}
              disabled={savingAddonOrder}
              startIcon={savingAddonOrder ? <CircularProgress size={16} /> : null}
            >
              {savingAddonOrder ? 'Saving...' : 'Save Add-on Order'}
            </Button>
          </>
        )}
      </Box>
    )}

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