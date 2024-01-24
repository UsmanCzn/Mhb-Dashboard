import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import './create-user.css';
import userManagementService from '../../services/userManagementService';
import {useNavigate, useParams} from 'react-router-dom';
import {useSnackbar} from "notistack";

const UpdateUser = ({ match }) => {
    const { id } = useParams();

    const [usersRoles, setUsersRoles] = useState([]);
    const [userBranches, setUserBranches] = useState(null);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [multiSelectValues, setMultiSelectValues] = useState([]);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        password: '',
        streetAddress: '',
        email: '',
        roles: '',
        branches: []
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

    const handlePostData = async (postData) => {
        try {
            const response = await userManagementService.UpdateUser(postData);
            if (response) {
                console.log('User updated:', response);
                enqueueSnackbar('User Updated Successfully', {
                    variant: 'success'
                });
                navigate('/user-management');
            }
        } catch (error) {
            console.error('Error updating user', error);
            enqueueSnackbar(error.response.data.error.message, {
                variant: 'error'
            });
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

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last Name is required';
            isValid = false;
        } else {
            newErrors.lastName = '';
        }

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

        if (!formData.roles.trim()) {
            newErrors.roles = 'Roles is required';
            isValid = false;
        } else {
            newErrors.roles = '';
        }

        if (formData.branches.length === 0) {
            newErrors.branches = 'Branches is required';
            isValid = false;
        } else {
            newErrors.branches = '';
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const allotedBranchIds = (formData.branches || []).map((item) => item.value);

        const postDataObject = {
            id: parseInt(id),
            userName: formData.firstName + ' ' + formData.lastName,
            name: formData.firstName,
            surname: formData.lastName,
            password: formData.password || '',
            address: formData.streetAddress || null,
            emailAddress: formData.email,
            phoneNumber: formData.phoneNumber,
            roleId: parseInt(formData.roles),
            allotedIdsList: allotedBranchIds,
        };

        if (validateForm()) {
            await handlePostData(postDataObject);
            navigate('/user-management');
        } else {
            console.log('Form validation failed');
        }
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

    const getUserRoles = async () => {
        try {
            const response = await userManagementService.getUserRoles();
            if (response) {
                setUsersRoles(response?.data?.result);
            }
        } catch (error) {
            console.error('Error fetching user roles', error);
        }
    };

    useEffect(() => {
        getUserRoles();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (id && usersRoles.length > 0) {
                try {
                    const response = await userManagementService.GetUserId(id);

                    if (response?.data?.result) {
                        const userData = response.data.result;

                        const roleObject = usersRoles?.find(role => role.id === userData?.roleId);

                        if (roleObject) {
                            const responseForBranches = await getDesiredBranch(roleObject.id);
                            const alloctedBranches = userData.allotedIdsList;

                            const alloctedBranchesObj = responseForBranches.filter((item) =>
                                alloctedBranches.includes(item.id)
                            );
                            let newObjForBranches = [];
                            if(alloctedBranchesObj.length>0){
                                newObjForBranches = alloctedBranchesObj?.map((item) => ({
                                    value: item.id,
                                    label: item.name,
                                }));
                            }
                            setFormData({
                                firstName: userData.name,
                                lastName: userData.surname,
                                phoneNumber: userData.phoneNumber,
                                password: '',
                                streetAddress: userData.address || '',
                                email: userData.emailAddress,
                                roles: roleObject.name,
                                branches: newObjForBranches,
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user data', error);
                }
            }
        };

        fetchUserData();
    }, [id, usersRoles]);

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
        handleBranchesChange([]);
    }, [userBranches]);

    return (
        <form onSubmit={handleSubmit}>
            <div className="userFormContainer">
                <div className="userNameContainer">
                    <div className="userNameChild">
                        <div>
                            <label htmlFor="firstName">First Name:</label>
                        </div>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                        <p className="error">{errors.firstName}</p>
                    </div>
                    <div className="userLastNameChild">
                        <div>
                            <label htmlFor="lastName">Last Name:</label>
                        </div>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                        <p className="error">{errors.lastName}</p>
                    </div>
                </div>
                <div className="userPhoneContainer">
                    <div className="userPhoneChild">
                        <div>
                            <label htmlFor="phoneNumber">Phone Number:</label>
                        </div>
                        <input type="text" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
                        <p className="error">{errors.phoneNumber}</p>
                    </div>
                    <div className="userAddressChild">
                        <div>
                            <label htmlFor="streetAddress">Street Address:</label>
                        </div>
                        <input
                            type="text"
                            id="streetAddress"
                            name="streetAddress"
                            value={formData.streetAddress}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="userEmailContainer">
                    <div className="userEmailChild">
                        <div>
                            <label htmlFor="email">Email:</label>
                        </div>
                        <input type="text" id="email" name="email" value={formData.email} onChange={handleInputChange} />
                        <p className="error">{errors.email}</p>
                    </div>
                    <div className="userRolesChild">
                        <div>
                            <label htmlFor="roles">Roles:</label>
                        </div>
                        <select id="roles" name="roles" value={formData.roles} onChange={handleInputChange}>
                            <option value="">Select a role</option>
                            {usersRoles.length > 0 &&
                                usersRoles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name === 'Company_Admin'
                                            ? 'Company Admin'
                                            : role.name === 'Brand_Manager'
                                            ? 'Brand Manager'
                                            : role.name === 'Branch_User'
                                            ? 'Branch User'
                                            : role.name}
                                    </option>
                                ))}
                        </select>
                        <p className="error">{errors.roles}</p>
                    </div>
                </div>
                <div className="userPasswordContainer">
                    <div className="userBranchSelectChild">
                        <div>
                            <label htmlFor="branches">
                                {formData.roles === 'Company_Admin'
                                    ? 'Companies'
                                    : formData.roles === 'Brand_Manager'
                                    ? ' Brands'
                                    : formData.roles === 'Branch_User'
                                    ? 'Branches'
                                    : ' Select'}
                            </label>
                        </div>
                        <Select
                            className="multiSelectUserBranches"
                            id="branches"
                            name="branches"
                            options={multiSelectValues || null}
                            isMulti
                            value={ formData.branches }
                            onChange={handleBranchesChange}
                        />
                        <p className="error">{errors.branches}</p>
                    </div>
                    <div className="userPasswordChild">
                        <div>
                            <label htmlFor="email">Password:</label>
                        </div>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} />
                        <p className="error">{errors.password}</p>
                    </div>
                </div>
                <button type="submit">Add User</button>
            </div>
        </form>
    );
};

export default UpdateUser;
