import React, { useState } from 'react';
// 1. IMPORT your api client instead of axios
import api from './apiClient'; 
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, Grid,
    IconButton, InputAdornment, TextField, Typography
} from '@mui/material';
import { Visibility, VisibilityOff} from '@mui/icons-material';

// 2. DELETE the API_BASE_URL line from here. 
// It is now managed inside apiClient.js

export default function LoginPage() {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 3. USE api.post instead of axios.post
            // Just use '/login/' because apiClient handles the base URL
            const response = await api.post('/login/', {
                username: emailOrUsername,
                password: password,
            });

            // Store JWT tokens in localStorage
            // The apiClient will now find these and attach them to future requests
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);

            navigate('/dashboard');
            console.log("Login Successful, User:", response.data.user);
        } catch (err) {
            // Check for specific backend error messages
            const errorMessage = err.response?.data?.detail || 'Invalid email/username or password.';
            setError(errorMessage);
            console.error(err);
        }
    };
    

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const themeColors = {
        background: '#1a1a2e',
        card: '#24243e',
        primaryText: '#ffffff',
        secondaryText: '#b3b3cc',
        accent: '#9a67ff',
        inputBackground: '#1f1f36',
        inputBorder: '#4e4e6a',
        buttonHover: '#b388ff',
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: themeColors.background,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
        }}>
            <Grid container sx={{
                maxWidth: '1000px',
                width: '100%',
                backgroundColor: themeColors.card,
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
            }}>
                {/* Right Side: Login Form */}
                <Grid item xs={12} md={6} sx={{ margin: 'auto', p: 6 }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: themeColors.primaryText, mb: 1 }}>
                        Welcome back
                    </Typography>
                    <Typography sx={{ color: themeColors.secondaryText, mb: 4 }}>
                        Don't have an account? <span onClick={() => navigate('/signup')} style={{ color: themeColors.accent, textDecoration: 'none', cursor: 'pointer' }}>Sign up</span>
                    </Typography>

                    <form onSubmit={handleLogin}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    placeholder="Email or Username"
                                    variant="outlined"
                                    value={emailOrUsername}
                                    onChange={(e) => setEmailOrUsername(e.target.value)}
                                    sx={inputStyles(themeColors)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    variant="outlined"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    sx={inputStyles(themeColors)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                    sx={{ color: themeColors.secondaryText }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>

                        {error && (
                            <Typography sx={{ color: 'red', mt: 2 }}>{error}</Typography>
                        )}

                        <Box sx={{ mt: 3 }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    py: 1.5,
                                    backgroundColor: themeColors.accent,
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    '&:hover': { backgroundColor: themeColors.buttonHover },
                                }}
                            >
                                Log in
                            </Button>
                        </Box>
                    </form>
                </Grid>
            </Grid>
        </Box>
    );
}

const inputStyles = (colors) => ({
    '& .MuiOutlinedInput-root': {
        backgroundColor: colors.inputBackground,
        color: colors.primaryText,
        borderRadius: '8px',
        '& fieldset': { borderColor: colors.inputBorder },
        '&:hover fieldset': { borderColor: colors.accent },
        '&.Mui-focused fieldset': { borderColor: colors.accent },
    },
    '& .MuiInputBase-input::placeholder': {
        color: colors.secondaryText,
        opacity: 1,
    },
});