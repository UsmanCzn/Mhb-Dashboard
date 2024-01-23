import { useCallback, useEffect, useState } from "react"; 
import { ServiceFactory } from "services/index";

export function useFetchBranchUsers(branchId){

    const [loading, setloading] = useState(false);

    const [totalRowCount, setTotalRowCount] = useState(0);

    const [usersList, setUsersList] = useState([]);

    const branchServices=ServiceFactory.get("branch")

    const fetchUsersList = useCallback(
      (pageNo) => {
        
        setloading(true);
           
        branchServices.GetBranchUsersByBranchId(branchId)
        .then(
            (res)=>{
      
                setUsersList(res.data.result);  

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
        fetchUsersList(0);
    }, [fetchUsersList]);

    return {
        usersList: usersList || [],
        fetchUsersList,
        totalRowCount,
        loading, 
    };
}