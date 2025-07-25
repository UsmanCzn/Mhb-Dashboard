import React, { useEffect, useState } from 'react';
import { Grid, Typography, Button, FormControl, InputLabel, MenuItem, TextField ,Select} from '@mui/material';
// import Select from 'react-select';
import { useSnackbar } from 'notistack';
import { useNavigate ,useParams } from 'react-router-dom';


import './create-user.css';
import userManagementService from '../../services/userManagementService';
import customerService from 'services/customerService';
import { useAuth } from 'providers/authProvider';

const CreateUser = () => {
    const { user, userRole, isAuthenticated } = useAuth();

    const [usersRoles, setUsersRoles] = useState([]);
    const [userBranches, setUserBranches] = useState(null);
    const [companies, setcompanies] = useState([]);
    const [multiSelectValues, setMultiSelectValues] = useState([]);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { id,cid } = useParams();
    // console.log(user);
    

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        password: '',
        streetAddress: '',
        email: '',
        roles: '',
        branches: [],
        companyId:"",
        isAccessRevoked:false
    });


    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        roles: '',
        branches: ''
    });


    const revokeUserAccess = async () => {
        try {
          const payload = {
            userId: +id,
            revokeAccess: !formData?.isAccessRevoked,            
            tokenToUpdate: 'UsmanCZN1234@@', // Consider moving this to a config/env if reused
          };
      
          const response = await customerService.revokeUserAccess(payload);
      
          if (response?.data?.success) {
            getUserRoles()
            enqueueSnackbar('Access revoked successfully', {
                variant: 'success'
            });
            // Optionally refetch user data or update local state
          } else {
            enqueueSnackbar(response?.data?.message || 'Failed to revoke access',{
                variant: "error"
            });
          }
        } catch (error) {
          console.error('Revoke Access Error:', error);
          toaster.error('An error occurred while revoking access');
        }
      };
      

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First Name is required';
            isValid = false;
        } else {
            newErrors.firstName = '';
        }

        // if (!formData.lastName.trim()) {
        //     newErrors.lastName = 'Last Name is required';
        //     isValid = false;
        // } else {
        //     newErrors.lastName = '';
        // }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone Number is required';
            isValid = false;
        } else {
            newErrors.phoneNumber = '';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else {
            newErrors.email = '';
        }

        if (!formData.roles) {
            newErrors.roles = 'Roles is required';
            isValid = false;
        } else {
            newErrors.roles = '';
        }
        if ( !id &&!formData.password.trim()) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else {
            newErrors.password = '';
        }

        if (formData.branches.length === 0) {
            newErrors.branches = 'Field is required';
            isValid = false;
        } else {
            newErrors.branches = '';
        }


        setErrors(newErrors);
        return isValid;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };



    const handleBranchesChange = (selectedBranches) => {
        setFormData({
            ...formData,
            branches: selectedBranches
        });
    };

    const handlePostData = async (postData) => {
        if(!id){
        try {
            const response = await userManagementService.CreateUser(postData);
            if (response) {
                setFormData({
                    firstName: '',
                    lastName: '',
                    phoneNumber: '',
                    password: '',
                    streetAddress: '',
                    email: '',
                    roles: '',
                    branches: [],
                    isAccessRevoked: false,
                });
                enqueueSnackbar('User Created Successfully', {
                    variant: 'success'
                });
                navigate(`/user-management?companyId=${cid}`);
            }
        } catch (error) {

            enqueueSnackbar(error.response.data.error.message, {
                variant: 'error'
            });
        }}else{
            try {
                
                const response = await userManagementService.UpdateUser(postData);
                if (response) {
          
                    enqueueSnackbar('User Updated Successfully', {
                        variant: 'success'
                    });
                    navigate(`/user-management?companyId=${cid}`);
                }
            } catch (error) {
                enqueueSnackbar(error.response.data.error.message, {
                    variant: 'error'
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const allotedBranchIds = formData.branches.map((value) => value);
        const postDataObject = {
            id: id ? +id :0,
            userName: formData.phoneNumber ,
            name: formData.firstName,
            surname: formData.lastName,
            password: formData.password,
            address: formData.streetAddress || null,
            emailAddress: formData.email,
            phoneNumber: formData.phoneNumber,
            roleId: +formData.roles,
            allotedIdsList: allotedBranchIds,
            companyId: +cid
        };
        console.log(formData);
        
        if (validateForm()) {
            await handlePostData(postDataObject);
        } else {
            console.log('Form validation failed');
        }
    };

    const getUserRoles = async () => {
        try {
            const response = await userManagementService.getUserRoles();
            if (response) {
                setUsersRoles(response?.data?.result);
                console.log(id,"user");
                
                if(id){
                    fetchUserData( response?.data?.result)
                }
            }
        } catch (error) {
            console.error('Error fetching user roles', error);
        }
    };

    const getDesiredBranch = async (role) => {
        try {
            let response = null;
            if (role == 3) {
                response = await userManagementService.GetAllCompaniesUM();
            } else if (role == 5) {
                response = await userManagementService.GetBrandsForCurrentUserUM();
            } else if (role == 7) {
                response = await userManagementService.GetBranchesForCurrentUserUM();
            }
            if (response) {
                setUserBranches(response.data.result);
                return response.data.result;
            }
        } catch (error) {
            console.error('Error fetching user roles', error);
        }
    };

    useEffect(() => {
        getUserRoles();
        // getCompanies()
    }, []);

    useEffect(() => {
        getDesiredBranch(formData.roles);
    }, [formData.roles]);

    useEffect(() => {
        const branches = [];
        if (userBranches) {
            userBranches.map((user) => {
                branches.push({
                    value: user?.id,
                    label: user?.name
                });
            });
        }
        setMultiSelectValues(branches);
        if (id) return;
        handleBranchesChange([]);
    }, [userBranches]);

    const fetchUserData = async (roles) => {

        if (id) {
            try {
                const response = await userManagementService.GetUserId(id);

                if (response?.data?.result) {
                    const userData = response.data.result;
                    const roleObject = roles?.find((role) => role.id === userData?.roleId);
                    if (roleObject) {
                        const responseForBranches = await getDesiredBranch(roleObject.id);
                        const alloctedBranches = userData.allotedIdsList ?? [];

                        const alloctedBranchesObj = responseForBranches.filter((item) => alloctedBranches.includes(item.id));
                        let newObjForBranches = [];
                        if (alloctedBranchesObj.length > 0) {
                            newObjForBranches = alloctedBranchesObj.map((item) => item.id);
                        }
                        setFormData({
                            firstName: userData.name,
                            lastName: userData.surname,
                            phoneNumber: userData.phoneNumber,
                            password: null,
                            streetAddress: userData.address || '',
                            email: userData.emailAddress,
                            roles: roleObject.id,
                            branches: newObjForBranches,
                            companyId: userData?.companyId,
                            isAccessRevoked: userData?.isAccessRevoked

                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2} className="userFormContainer">
                <Grid item xs={6}>
                    <div>
                        <label htmlFor="firstName">First Name:</label>
                    </div>
                    <TextField
                        fullWidth
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                    />
                    <p className="error">{errors.firstName}</p>
                </Grid>

                <Grid item xs={6}>
                    <div>
                        <label htmlFor="lastName">Last Name:</label>
                    </div>
                    <TextField fullWidth type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                    <p className="error">{errors.lastName}</p>
                </Grid>

                <Grid item xs={6}>
                    <div>
                        <label htmlFor="phoneNumber">Phone Number:</label>
                    </div>
                    <TextField
                        fullWidth
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                    />
                    <p className="error">{errors.phoneNumber}</p>
                </Grid>

                <Grid item xs={6}>
                    <div>
                        <label htmlFor="email">Email:</label>
                    </div>
                    <TextField fullWidth type="text" id="email" name="email" value={formData.email} onChange={handleInputChange} />
                    <p className="error">{errors.email}</p>
                </Grid>

                <Grid item xs={6}>
                    <div>
                        <label htmlFor="password">Password:</label>
                    </div>
                    <TextField fullWidth type="text" id="password" name="password" value={formData.password} onChange={handleInputChange} />
                    <p className="error">{errors.password}</p>
                </Grid>

                <Grid item xs={6}>
                    <div>
                        <label htmlFor="roles">Roles:</label>
                    </div>
                    <Select fullWidth id="roles" name="roles" value={formData.roles} onChange={handleInputChange}>
                        <MenuItem value="">Select a role</MenuItem>
                        {usersRoles.length > 0 &&
                            usersRoles.map((role) => (
                                <MenuItem key={role.id} value={role.id}>
                                    {role.name === 'Company_Admin'
                                        ? 'Company Admin'
                                        : role.name === 'Brand_Manager'
                                        ? 'Brand Manager'
                                        : role.name === 'Branch_User'
                                        ? 'Store User'
                                        : role.name}
                                </MenuItem>
                            ))}
                    </Select>
                    <p className="error">{errors.roles}</p>
                </Grid>
                <Grid item xs={6}>
                    <div>
                        <label htmlFor="branches">
                            {formData.roles == '3'
                                ? 'Select Companies'
                                : formData.roles == '5'
                                ? 'Select Brands'
                                : formData.roles == '7'
                                ? 'Select Stores'
                                : ' Select'}
                        </label>
                    </div>
                    <Select
                        fullWidth
                        className=""
                        id="branches"
                        name="branches"
                        value={formData.branches}
                        multiple
                        onChange={(event) => handleBranchesChange(event.target.value)}
                    >
                        <MenuItem value="">Select a Value</MenuItem>
                        {multiSelectValues.length > 0 &&
                            multiSelectValues.map((role, index) => (
                                <MenuItem key={index} value={role.value}>
                                    {role.label}
                                </MenuItem>
                            ))}
                    </Select>
                    <p className="error">{errors.branches}</p>
                </Grid>
                <Grid item xs={12} sx={{ marginBottom: '10px' }}>
                <Button size="small" disabled={user?.isAccessRevoked} type="submit" variant="contained" sx={{ marginRight: 1 }}>
                    {id ? 'Update User' : 'Add User'}
                </Button>
                {id && (
                <Button
                    size="small"
                    type="button"
                    variant="contained"
                    disabled={user?.isAccessRevoked}
                    color={formData?.isAccessRevoked ? 'success' : 'error'} // Red if active, green if deactivated
                    onClick={() => revokeUserAccess()}
                >
                    {formData?.isAccessRevoked ? 'Activate User' : 'Deactivate User'}
                </Button>
                )}
                </Grid>

            </Grid>
        </form>
    );
};

export default CreateUser;
