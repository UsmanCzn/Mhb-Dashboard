import { useCallback, useEffect, useState } from "react"; 
import { ServiceFactory } from "services/index";

export function useFetchBranchList({reload}){
    const [loading, setloading] = useState(false);

    const [totalRowCount, setTotalRowCount] = useState(0);

    const [branchesList, setBranchesList] = useState([]);

    const branchServices=ServiceFactory.get("branch")

    const fetchBranchesList = useCallback(
      (pageNo) => {
        
        setloading(true);
           
        branchServices.getAllBranches()
        .then(
            (res)=>{
      
               setBranchesList(res.data.result); 

                // setTotalRowCount(res.data?.pages);
            },
            (err)=>{}
        )
        .finally(()=>{
            setloading(false);
        });
      },
      [],
    );

    useEffect(() => {
        fetchBranchesList(0);
    }, [fetchBranchesList,reload]);

    return {
        branchesList: branchesList || [],
        fetchBranchesList,
        totalRowCount,
        loading, 
    };
}

