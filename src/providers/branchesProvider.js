import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import branchServices from 'services/branchServices';

const BranchesContext = createContext();

const BranchesProvider = ({ children }) => {
    const [loading, setloading] = useState(false);

    const [totalRowCount, setTotalRowCount] = useState(0);
    const [branchesList, setBranchesList] = useState([]);

    const [reload, setBranchReload] = useState(false);

    const fetchBranchesList = async () => {
        setloading(true);
        await branchServices
            .getAllBranches()
            .then(
                (res) => {
                    console.log('here');

                    setBranchesList(res.data.result);
                },
                (err) => {
                    console.log(err);
                }
            )
            .finally(() => {
                setloading(false);
            });
    };

    useEffect(() => {
        fetchBranchesList();
    }, [reload]);

    const branchesContextValue = {
        branchesList: branchesList,
        fetchBranchesList,
        totalRowCount,
        loading,
        setBranchReload
    };

    return <BranchesContext.Provider value={branchesContextValue}>{children}</BranchesContext.Provider>;
};

export const useBranches = () => {
    const { branchesList, fetchBranchesList, totalRowCount, loading, setBranchReload } = useContext(BranchesContext);

    return {
        branchesList,
        fetchBranchesList,
        totalRowCount,
        loading,
        setBranchReload
    };
};

export { BranchesContext, BranchesProvider };
