import React, { useContext, useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useBranches } from '../../../providers/branchesProvider';
import ReCAPTCHA from "react-google-recaptcha";
import { useSnackbar } from 'notistack';


// material-ui
import {
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    FormHelperText,
    Grid,
    Link,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import FirebaseSocial from './FirebaseSocial';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { ServiceFactory } from 'services/index';
import { useAuth } from 'providers/authProvider';

const AuthLogin = () => {
    const recaptcha = useRef();
    const { user } = useAuth();
    const [checked, setChecked] = React.useState(false);
    const [ErrorState, setErrorState] = useState(false);
    const userServices = ServiceFactory.get('users');
    const [showPassword, setShowPassword] = React.useState(false);
    const { setToken } = useAuth();
    const [loading, setloading] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const { fetchBranchesList } = useBranches();

    const login = async (event, values) => {
        event.preventDefault();
        // const captchaValue = recaptcha.current.getValue();
        // if(captchaValue){
        setloading(true);
        await userServices
            .login({
                userNameOrEmailAddress: values.email,
                password: values.password,
                rememberClient: true,
                companyId: 0
            })
            .then((res) => {
                // console.log(JSON.stringify(res));
                setToken(res.data?.result?.accessToken, res.data?.result?.userId);
                fetchBranchesList();
                // console.log(res?.data?.result, 'login');
            })
            .catch((err) => {
                console.log(err);
                setErrorState(true);
            })
            .finally(() => {
                setloading(false);
            });
        // }
        //     else{
        //         enqueueSnackbar("Please verify the Captcha", {
        //             variant: 'error',
        //           });
        //     }
    };

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    // login(values)
                    // try {
                    //     setStatus({ success: false });
                    //     setSubmitting(false);
                    // } catch (err) {
                    //     setStatus({ success: false });
                    //     setErrors({ submit: err.message });
                    //     setSubmitting(false);
                    // }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={(event) => login(event, values)}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="email-login">Email Address</InputLabel>
                                    <OutlinedInput
                                        id="email-login"
                                        required
                                        type="email"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Enter email address"
                                        fullWidth
                                        error={Boolean(touched.email && errors.email)}
                                    />
                                    {touched.email && errors.email && (
                                        <FormHelperText error id="standard-weight-helper-text-email-login">
                                            {errors.email}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="password-login">Password</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        required
                                        error={Boolean(touched.password && errors.password)}
                                        id="-password-login"
                                        type={showPassword ? 'text' : 'password'}
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                    size="large"
                                                >
                                                    {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        placeholder="Enter password"
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                    {ErrorState && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {'Invalid email or Password'}
                                        </FormHelperText>
                                    )}
                                </Stack>
                            </Grid>

                            <Grid item xs={12} sx={{ mt: -1 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={checked}
                                                onChange={(event) => setChecked(event.target.checked)}
                                                name="checked"
                                                color="primary"
                                                size="small"
                                            />
                                        }
                                        label={<Typography variant="h6">Keep me sign in</Typography>}
                                    />
                                </Stack>
                            </Grid>
                            {errors.submit && (
                                <Grid item xs={12}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Grid>
                            )}

                     
                            <Grid item xs={12}>
                                <AnimateButton>
                                    {/* <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        loading={loading}
                                    > 
                                        Login
                                    </Button> */}
                                    <LoadingButton
                                        disableElevation
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        loading={loading}
                                    >
                                        Login
                                    </LoadingButton>
                                </AnimateButton>
                            </Grid>
                            {/* <Grid item xs={12} sx={{ mt: 1 }}>
                            <ReCAPTCHA ref={recaptcha} sitekey="6LfVJsspAAAAAHcqt58f-tezRDN2iGkAavZxbhM_" />
                            </Grid> */}
                        </Grid>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthLogin;
