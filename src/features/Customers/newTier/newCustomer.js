import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  TextField,
  Button,
  Modal,
  Box,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import tiersService from 'services/tiersService';

const NewCustomer = ({
  modal,
  setModal,
  setReload,
  selectedBrand,
  editItem,
  groupList,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  console.log(groupList,"group  List");
  const initialValue ={
    brandId: selectedBrand?.id,
    name: '',
    nativeName: '',
    id: 0,
    groupType: groupList.some((e) => e?.type === 'DefaultBrandGroup') ? 3 : 1,
  }
  const [data, setData] = useState(initialValue);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (editItem !== undefined) {
      setData((prev) => ({
        ...prev,
        name: editItem.name,
        nativeName: editItem.nativeName,
        groupType: editItem.type === 'DefaultBrandGroup' ? 1 : 3,
        id: editItem.id,
      }));
      setIsEditing(true);
    } else {
      setData((prev) => ({
        ...prev,
        
        name: '',
        nativeName: '',
      }));
      setIsEditing(false);
    }
    // eslint-disable-next-line
  }, [editItem, groupList]);

  const createNewTier = async () => {
    let payload = {
      ...data,
      brandId: selectedBrand?.id,
    };

    try {
      if (isEditing) {
        await tiersService.updateCustomerGroup(payload);
      } else {
        await tiersService.createNewCustomerGroup(payload);
      }
      setData(initialValue);
      setModal(false);
      setReload((prev) => !prev);
    } catch (err) {
      if (err?.response?.data?.error?.validationErrors?.length > 0) {
        enqueueSnackbar(err?.response?.data?.error?.validationErrors[0]?.message, {
          variant: 'error',
        });
      } else {
        enqueueSnackbar(err?.response?.data?.error?.message, {
          variant: 'error',
        });
      }
    }
  };

  return (
    <Modal
      open={modal}
      onClose={() => setModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Grid container spacing={4} mb={2}>
          <Grid item xs={12}>
            <Typography required variant="h5">
              Create New Customer Group
            </Typography>
          </Grid>
        </Grid>

        {/* Group Type Switch */}
        <Grid item xs={12} mb={2}>
            { !data?.id &&
          <FormControlLabel
            control={
              <Switch
                // checked={data.groupType === 3}
                onChange={(e) =>
                  setData({
                    ...data,
                    groupType: e.target.checked ? 1 : 3,
                  })
                }
                name="groupTypeSwitch"
                color="primary"
              />
            }
            label={data.groupType === 3 ? 'Dont add new customers' : 'Add new customers'}
          />}
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h7">Group Name</Typography>
            <TextField
              id="outlined-basic"
              fullWidth
              label="Group Name"
              variant="outlined"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              sx={{ mt: 2 }}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h7">Group Name (Native language)</Typography>
            <TextField
              id="outlined-basic"
              fullWidth
              label="Group Name (native language)"
              variant="outlined"
              value={data.nativeName}
              onChange={(e) => setData({ ...data, nativeName: e.target.value })}
              sx={{ mt: 2 }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={8} />
              <Grid container spacing={2} justifyContent="flex-end">
                <Grid item>
                  <Button variant="outlined" onClick={() => {setModal(false);setData(initialValue)}}>
                    Cancel
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" onClick={createNewTier}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default NewCustomer;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
  overflow: 'scroll',
};
