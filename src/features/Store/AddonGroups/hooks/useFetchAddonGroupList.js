import constants from "helper/constants";
import { useCallback, useEffect, useState } from "react"; 
import { ServiceFactory } from "services/index";
import storeServices from "services/storeServices";

export function useFetchAddonGroupList(
    reload, 
    selectedBrand

){

    const [loading, setloading] = useState(false);

    const [totalRowCount, setTotalRowCount] = useState(0);

    const [addonGroupList, setaddonGroupList] = useState([]);
  

    const fetchAddonGroupList = useCallback(
      (selectedBrand) => {
          
        console.log(selectedBrand,"selectedBrand");
        setloading(true); 
        storeServices.getProductAdditionGroupList(selectedBrand?.id)
        .then(
            (res)=>{
                console.log(res.data.result);
                
                setaddonGroupList(res.data.result);   

                // console.log(res.data.result,"res.data.result");
                // setTotalRowCount(res.data?.pages);
            },
            (err)=>{}
        )
        .finally(()=>{
            setloading(false);
        });
      },
      [selectedBrand],
    );

    useEffect(() => {
        fetchAddonGroupList(selectedBrand);
    }, [fetchAddonGroupList,reload,selectedBrand]);

    return {
        addonGroupList: addonGroupList || [],
        fetchAddonGroupList,
        totalRowCount,
        loading, 
    };
}