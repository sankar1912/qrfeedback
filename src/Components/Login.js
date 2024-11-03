import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Modal,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import celebrationAnimation from './Celebrate.json'; // Adjust the path as necessary

const Login = () => {
    const [managerID, setManagerID] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const navigate = useNavigate();
    const [user, setUser ] = useState(null);    
    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!managerID || !password) {
            setError('Please enter both Manager ID and Password');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://192.168.43.148:8080/login', {
                managerId: managerID,
                password: password,
            });
            setUser (response.data);
            console.log(response.data)
            if (response.status === 200) {
                setShowCelebration(true); // Show celebration animation
                setTimeout(() => {
                    navigate(`/${response.data.managerId}/${response.data.bankName}`); // Redirect to the bank name page after 3 seconds
                }, 3000); // Adjust time based on animation length
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data || 'Invalid Manager ID or Password');
            } else {
                setError('An error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const termsAndConditionsMessage = `
        This system is intended for authorized bank personnel only. 
        Misuse of this system may result in disciplinary action, 
        including termination of employment and legal consequences. 
        By logging in, you agree to use this system solely for 
        legitimate banking operations and to maintain the confidentiality 
        of all data accessed. Any unauthorized access or disclosure of 
        information is strictly prohibited and may lead to severe penalties. 
        Please ensure that you log out after your session and do not share 
        your credentials with anyone. If you have any questions regarding 
        the appropriate use of this system, please contact your supervisor. 
        Thank you for your cooperation.
    `;

    return (
        <Modal open={true} onClose={() => {}}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 3,
                        borderRadius: 2,
                        width: 400,
                    }}
                >
                    <Typography variant="h5" component="h2" sx={{ mb: 2, textAlign: 'center' }}>
                        Bank Login
                    </Typography>
                    {error && (
                        <Typography variant="body2" color="error" sx={{ mb: 2, textAlign: 'center' }}>
                            {error}
                        </Typography>
                    )}
                    <form onSubmit={handleLogin}>
                        <TextField
                            label="Enter Manager ID"
                            variant="outlined"
                            fullWidth
                            value={managerID}
                            onChange={(e) => setManagerID(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                        </Button>
                    </form>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Tooltip title={termsAndConditionsMessage} arrow>
                            <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                                Terms & Conditions
                            </Typography>
                        </Tooltip>
                    </Box>
                    {showCelebration && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Lottie animationData={celebrationAnimation} loop={false} />
                        </Box>
                    )}
                </Paper>
            </Box>
        </Modal>
    );
};

export default Login;