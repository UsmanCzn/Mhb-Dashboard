import React, { useEffect, useState } from "react";
import {
    Grid, Box, Typography, ButtonBase, Button,CircularProgress


} from "@mui/material/index";
import { useFetchAddonGroupList } from "features/Store/AddonGroups/hooks/useFetchAddonGroupList";
import { useFetchAddonList } from "features/Store/Addons/hooks/useFetchAddonList";
import AddonItem from "components/Addon/addonItem";
import NewAddonGroup from 'components/store/addonGroup/newAddonGroup';

import NewAddon from 'components/store/addon/newAddon';
import storeServices from "services/storeServices";



const AddonTable = ({
    reload,
    selectedBrand,
    setReload
}) => {

    const { addonGroupList,loading:gLoading } = useFetchAddonGroupList(reload,selectedBrand) 
    const [selectedGroup, setSelectedGroup] = useState(null)
    const { addonList,loading } = useFetchAddonList(reload,selectedGroup?.id,selectedBrand)
 
    const [modalOpen,setModalOpen]=useState(false)
    const [modalOpenA,setModalOpenA]=useState(false)
 
    const [update, setUpdate] =  useState(false);
    const [updateA, setUpdateA] =  useState(false);
    const [updateData, setUpdateData] =  useState({});
    const [updateDataA, setUpdateDataA] =  useState({});

    function handleClick(e) {
        setSelectedGroup(e)
    }

    useEffect(
        () => {
            setSelectedGroup(addonGroupList[0])
        }, [addonGroupList]
    )

     
    const deleteAddonGroup =async  ()=>{
        await storeServices.deleteProductAddonGroup(selectedGroup?.id)
    
        .then((res) => {
          // console.log(res?.data, "deleted");
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setReload(prev => !prev) 
        })
      }


    return (

        <Box sx={{
            border: '1px solid lightGrey',
            borderRadius: 2,
            px: 2,
            py: 4
        }}
            boxShadow={1}
        >
            <Grid container   >



                <Grid item xs={3}>
                    <Grid container
                        mt={0} xs={12} justifyContent="space-between">

                        <Typography variant="h5" fontSize={17}
                            sx={{
                                px: 0,
                                mt: 0
                            }}
                        >
                            Group
                        </Typography>
                        <Button
                        onClick={
                            ()=>{
                                setUpdate(false) 
                                setModalOpen(true)
                            }
                        }
                        >
                            Create Group
                        </Button>

                    </Grid>
                    {
                            gLoading?
                            <Box sx={{  width: '100%', display: 'flex',justifyContent:'center' }}>
      <CircularProgress />
    </Box>
                            :
                    <Box sx={{
                        width: '100%',
                        px: 2,
                        py: 2,
                        borderRadius: 2,
                        border: 1,
                        mt: 2,
                        borderColor: "lightGrey"
                    }}
                        boxShadow={1}

                    >
                        {
                            addonGroupList?.map((item) => {
                                return (
                                    <Box sx={{
                                        height: 45,
                                        backgroundColor: selectedGroup?.id == item?.id ? "primary.lighter" : null,
                                        px: 2,
                                        borderRight: selectedGroup?.id == item?.id ? '2px solid #69c0ff' : null,
                                    }}
                                        display="flex"
                                        alignItems="center"
                                    >
                                        <ButtonBase sx={{
                                            width: "100%",
                                            height: '100%',
                                        }}
                                            onClick={() => handleClick(item)}>
                                            <Typography variant="h6" fontSize={14}
                                                sx={{
                                                    textAlign: "left",
                                                    width: '100%'
                                                }}
                                            >{item?.name}</Typography>
                                        </ButtonBase>
                                    </Box>

                                )
                            })

                        }

                    </Box>
}
                </Grid>


                <Grid item xs={9}>
                    <Box sx={{
                        width: '100%',
                        mx: 2,
                        py: 2,
                    }}
                    >

                        <Grid container spacing={2} xs={12} justifyContent="space-between">

                            <Typography variant="h5" fontSize={17}
                                sx={{
                                    px: 4
                                }}
                            >
                                Addons
                            </Typography>
                            <Button
                             onClick={
                                ()=>{
                                    setUpdateA(false)
                                    setModalOpenA(true)
                                }
                            }
                            >
                                Add new Addon
                            </Button>

                        </Grid>
                        <Grid container spacing={2} xs={12} px={2} justifyContent="space-between" mt={2}>

                        <Button variant="outlined" onClick={() =>{
                            setUpdate(true)
                            setUpdateData(selectedGroup)
                            setModalOpen(true)
                        }}>Edit this Addon Group</Button>

<Button variant="outlined" color="error" onClick={() => deleteAddonGroup()}>Delete this Addon Group</Button>


</Grid>

                        {
                             <Grid container spacing={2} xs={12} mt={1} px={2} justifyContent="space-between" >
<Grid item> 
                             <Typography variant="h6" fontSize={17}
                           
                             >
                                ID : {selectedGroup?.id}
                             </Typography>
                             </Grid>
                            <Grid item> 
                             <Typography variant="h6" fontSize={17}
                           
                             >
                                Allow Multiple : {selectedGroup?.allowMultiple?"YES":"NO"}
                             </Typography>
                             </Grid>
                            <Grid item> 
                             <Typography variant="h6" fontSize={17}
                           
                             >
                                IS Required : {selectedGroup?.isRequired?"YES":"NO"}
                             </Typography>
                             </Grid>

                            {/* <Grid item> 
                            <Button variant="outlined" color="error" onClick={() => deleteAddonGroup()}>Delete this Addon Group</Button>

                                </Grid> */}
 
                         </Grid>
                        }
                        {
                            loading?
                            <Box sx={{  width: '100%', display: 'flex',justifyContent:'center' }}>
      <CircularProgress />
    </Box>
                            :
                        <Grid container spacing={2} justifyContents="space-between" >

                            {
                                addonList?.map(
                                    (item) => {
                                        return (

                                            <AddonItem item={item} addonGroupList={addonGroupList} brand={selectedBrand}
                                            setModalOpen={setModalOpenA} 
                                            setUpdate={setUpdateA} setUpdateData={setUpdateDataA}
                                            />
                                        )
                                    }
                                )
                            }

                        </Grid>
                        }
                    </Box>
                </Grid>

            </Grid>

            <NewAddonGroup  modalOpen={modalOpen} setModalOpen={setModalOpen} 
       setReload={setReload}  
       selectedBrand={selectedBrand} 
       update={update} updateData={updateData} 
       />

<NewAddon  modalOpen={modalOpenA} setModalOpen={setModalOpenA} 
       setReload={setReload}  
       selectedBrand={selectedBrand} 
       update={updateA} updateData={updateDataA} 
       addonGroupList={addonGroupList}
       />

        </Box>


    )
}

export default AddonTable