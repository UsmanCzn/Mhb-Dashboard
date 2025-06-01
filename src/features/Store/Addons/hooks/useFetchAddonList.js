import constants from "helper/constants";
import { useCallback, useEffect, useState } from "react"; 
import { ServiceFactory } from "services/index";
import storeServices from "services/storeServices";

export function     useFetchAddonList(
    reload,
    groupId,
    brand,
    
){

    const [loading, setloading] = useState(false);

    const [totalRowCount, setTotalRowCount] = useState(0);

    const [addonList, setaddonList] = useState([]);
 
 
    const fetchAddonList = useCallback(
      (groupId,brand) => {
          
        setloading(true); 
        storeServices.getProductAdditionList(groupId,brand?.id)
        .then(
            (res)=>{
                setaddonList(res.data.result);     
            } 
        )
        .catch((err)=>{
            console.log(err,"err getting product addition list");
        })
        .finally(()=>{
            setloading(false);
        });
      },
      [],
    );

    useEffect(() => {
        fetchAddonList(groupId,brand);
    }, [fetchAddonList,reload,groupId,brand]);

    return {
        addonList: addonList || [],
        fetchAddonList,
        totalRowCount,
        loading, 
    };
}