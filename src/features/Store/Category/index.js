import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Grid,
    Button
} from '@mui/material';
import { CloudUploadOutlined, HolderOutlined } from '@ant-design/icons';
import { useSnackbar } from 'notistack';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import storeServices from 'services/storeServices';
import fileService from 'services/fileService';
import imageCompression from 'browser-image-compression';

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
    height: '80%'
};

const EditCategory = ({ modalOpen, setModalOpen, setReload, type, selectedBrand }) => {
    const { enqueueSnackbar } = useSnackbar();
    const intialValue = {
        type: '',
        name: '',
        nativeName: '',
        subTypes: [],
        orderValue: 0
    };

    const [data, setData] = useState(intialValue);
    const [p1, setP1] = useState(null);
    const [subTypeImages, setSubTypeImages] = useState({});

    useEffect(() => {
        if (type) {
            setData(prev => ({
                ...prev,
                name: '',
                nativeName: '',
                subTypes: type?.subTypes?.length
                    ? type.subTypes.sort((a, b) => {
                        if (a.orderValue == null) return 1;
                        if (b.orderValue == null) return -1;
                        return a.orderValue - b.orderValue;
                    })
                    : []
            }));
        } else {
            setData(intialValue);
        }
        setP1(null);
    }, [type]);

    const addNewSubType = async () => {
        if (!data.name) {
            enqueueSnackbar('Please add category name', { variant: 'error' });
            return;
        }
        let payload = {
            name: data.name,
            nativeName: data.nativeName,
            orderValue: +data.orderValue,
            productTypeId: type?.id
        };
        if (p1) {
            try {
        const options = {
            maxSizeMB: 0.1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        };
        const compressedFile = await imageCompression(p1, options);
                const res = await fileService.uploadProductImage(compressedFile);
                payload.imageUrl = res.data?.result;
            } catch (err) {
                console.log(err?.response?.data);
            }
        }
        await storeServices
            .createProductSubType(payload)
            .then(() => {
                setReload(prev => !prev);
                setData(prev => ({
                    ...prev,
                    name: '',
                    nativeName: '',
                    orderValue: ''
                }));
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setP1(null);
            });
    };

    // New: Save All SubTypes (bulk update)
    const saveAllSubTypes = async () => {
        if (!data.subTypes || data.subTypes.length === 0) {
            enqueueSnackbar('No subcategories to save.', { variant: 'warning' });
            return;
        }

        for (let index = 0; index < data.subTypes.length; index++) {
            const item = { ...data.subTypes[index] };
            if (!item.name) {
                enqueueSnackbar('Please add category name for all subcategories.', { variant: 'error' });
                return;
            }
            if (subTypeImages[index]) {
                try {
        const options = {
            maxSizeMB: 0.1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        };
        const compressedFile = await imageCompression(subTypeImages[index], options);
                    const res = await fileService.uploadProductImage(compressedFile);
                    item.imageUrl = res.data?.result;
                } catch (err) {
                    console.log(err?.response?.data);
                }
            }
            try {
                await storeServices.UpdateProductSubType(item);
            } catch (err) {
                enqueueSnackbar('Failed to save some subcategories.', { variant: 'error' });
                console.log(err);
            }
        }

        enqueueSnackbar('All changes saved successfully.', { variant: 'success' });
        setReload(prev => !prev);
        setSubTypeImages({});
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const srcIndex = result.source.index;
        const destIndex = result.destination.index;
        if (srcIndex === destIndex) return;

        setData((prev) => {
            const newSubTypes = [...prev.subTypes];
            const [moved] = newSubTypes.splice(srcIndex, 1);
            newSubTypes.splice(destIndex, 0, moved);
            // Update orderValue based on new position
            const updated = newSubTypes.map((item, i) => ({ ...item, orderValue: i }));
            return { ...prev, subTypes: updated };
        });

        // Also reorder subTypeImages to match
        setSubTypeImages((prev) => {
            const entries = Object.entries(prev);
            if (entries.length === 0) return prev;
            const newImages = {};
            const keys = Object.keys(prev).map(Number);
            const imageArr = [];
            for (let i = 0; i < data.subTypes.length; i++) {
                imageArr.push(prev[i] || null);
            }
            const [movedImg] = imageArr.splice(srcIndex, 1);
            imageArr.splice(destIndex, 0, movedImg);
            imageArr.forEach((img, i) => {
                if (img) newImages[i] = img;
            });
            return newImages;
        });
    };

    const deleteCategory = async (item) => {
        await storeServices
            .deleteProductSubType(item?.id)
            .then(() => setReload(prev => !prev))
            .catch((err) => {
                console.log(err);
            });
    };

return (
  <Modal
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <form>
      <Box
        sx={{
          ...style,
          width: { xs: '95%', sm: '90%', md: 1000 },
          height: '80%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          p: 0,
        }}
      >
        {/* Fixed Header */}
        <Box sx={{ p: 3, pb: 2, borderBottom: '1px solid #eee', flexShrink: 0 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Manage Subcategories
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Add a new subcategory or update existing ones below.
          </Typography>

          <Box
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            gap={1}
            mt={2}
          >
            <Typography variant="h6" fontWeight="bold">
              Category:
            </Typography>
            <Typography variant="h6" color="primary">
              {type?.name}
            </Typography>
          </Box>
        </Box>

        {/* Scrollable Content */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          <Grid container spacing={4}>
            {/* New Subcategory Form */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={2}>
                  <label htmlFor="fileInput">
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<CloudUploadOutlined />}
                      component="span"
                      size="small"
                    >
                      {p1 ? p1.name : 'Upload image'}
                    </Button>
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    hidden
                    onChange={(e) => setP1(e.currentTarget.files[0])}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Subcategory Name"
                    variant="outlined"
                    required
                    value={data.name}
                    onChange={(e) =>
                      setData({ ...data, name: e.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Subcategory Native Name"
                    variant="outlined"
                    required
                    value={data.nativeName}
                    onChange={(e) =>
                      setData({ ...data, nativeName: e.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    fullWidth
                    label="Sort Order"
                    variant="outlined"
                    value={data.orderValue}
                    onChange={(e) =>
                      setData({ ...data, orderValue: e.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={addNewSubType}
                  >
                    Add New
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {/* Subcategory List */}
            <Grid item xs={12}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="subcategories">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {data?.subTypes?.map((item, index) => {
                      const fileInputId = `fileInput${index}`;
                      const imgId = `img${index}`;

                      return (
                        <Draggable
                          key={item?.id || `sub-${index}`}
                          draggableId={String(item?.id || `sub-${index}`)}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={{
                                ...provided.draggableProps.style,
                                marginBottom: 12,
                                background: snapshot.isDragging ? '#f5f5f5' : 'transparent',
                                borderRadius: 8,
                                padding: snapshot.isDragging ? 8 : 0,
                              }}
                            >
                              <Grid container spacing={2} alignItems="center">
                                <Grid item xs="auto" {...provided.dragHandleProps}>
                                  <HolderOutlined style={{ fontSize: 20, cursor: 'grab', color: '#999' }} />
                                </Grid>

                                <Grid item xs={12} sm={2} md={1}>
                                  <label htmlFor={fileInputId}>
                                    <img
                                      id={imgId}
                                      src={
                                        subTypeImages[index]
                                          ? URL.createObjectURL(subTypeImages[index])
                                          : item?.imageUrl || selectedBrand?.logoUrl
                                      }
                                      style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 8,
                                        cursor: 'pointer',
                                        border: '1px solid #eee',
                                        objectFit: 'cover',
                                      }}
                                      alt="img"
                                    />
                                  </label>
                                  <input
                                    type="file"
                                    id={fileInputId}
                                    hidden
                                    onChange={(e) => {
                                      const newSubTypeImages = { ...subTypeImages };
                                      newSubTypeImages[index] =
                                        e.currentTarget.files[0];
                                      setSubTypeImages(newSubTypeImages);
                                    }}
                                  />
                                </Grid>

                                <Grid item xs={12} sm={3} md={2}>
                                  <TextField
                                    fullWidth
                                    label="Subcategory Name"
                                    variant="outlined"
                                    required
                                    value={item?.name}
                                    onChange={(e) => {
                                      setData((prev) => {
                                        const newSubTypes = [...prev.subTypes];
                                        newSubTypes[index].name = e.target.value;
                                        return { ...prev, subTypes: newSubTypes };
                                      });
                                    }}
                                  />
                                </Grid>

                                <Grid item xs={12} sm={3} md={2}>
                                  <TextField
                                    fullWidth
                                    label="Subcategory Native Name"
                                    variant="outlined"
                                    required
                                    value={item?.nativeName}
                                    onChange={(e) => {
                                      setData((prev) => {
                                        const newSubTypes = [...prev.subTypes];
                                        newSubTypes[index].nativeName =
                                          e.target.value;
                                        return { ...prev, subTypes: newSubTypes };
                                      });
                                    }}
                                  />
                                </Grid>

                                <Grid item xs={12} sm={3} md={2}>
                                  <TextField
                                    fullWidth
                                    label="Sort Order"
                                    variant="outlined"
                                    value={item?.orderValue}
                                    onChange={(e) => {
                                      setData((prev) => {
                                        const newSubTypes = [...prev.subTypes];
                                        newSubTypes[index].orderValue =
                                          e.target.value;
                                        return { ...prev, subTypes: newSubTypes };
                                      });
                                    }}
                                  />
                                </Grid>

                                <Grid item xs={12} sm={3} md={3}>
                                  <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    onClick={() => deleteCategory(item)}
                                  >
                                    Delete
                                  </Button>
                                </Grid>
                              </Grid>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            </Grid>
          </Grid>
        </Box>

        {/* Fixed Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid #eee',
            flexShrink: 0,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={() => setModalOpen(false)}
          >
            Close
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={saveAllSubTypes}
          >
            Save
          </Button>
        </Box>
      </Box>
    </form>
  </Modal>
);

};

export default EditCategory;
