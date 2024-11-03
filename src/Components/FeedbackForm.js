import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Paper,
    Grow,
    Rating,
    MenuItem,
    Select,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from '@mui/icons-material'; 
const feedbackQuestions = [
    "How would you rate the quality of service?",
    "How satisfied are you with the product selection?",
    "How would you rate the staff's knowledge?",
    // Add other questions as needed...
];

const Feedback = ({ open, onClose }) => {
    const [Filename, setfilename] = useState('');
    const { state } = useLocation();
    const { selectedDistrict } = state || {};
    const [chatLog, setChatLog] = useState([
        { text: "Hi! I'm HelpBot. Welcome! Feel free to give your review or raise a query.", sender: 'bot' },
    ]);
    const [showOptions, setShowOptions] = useState(false);
    const [ratingVisible, setRatingVisible] = useState(false);
    const [queryFieldsVisible, setQueryFieldsVisible] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userRatings, setUserRatings] = useState(Array(feedbackQuestions.length).fill(null));
    const [userRating, setUserRating] = useState(null);

    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        bankName: selectedDistrict || '',
    });
    const [showUserInfo, setShowUserInfo] = useState(false);

    const [queryData, setQueryData] = useState({
        date: '',
        state: '',
        district: '',
        bankName: '',
        branch: '',
        description: '',
        contact: '',
        email: '',
    });

    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [banks, setBanks] = useState([]);
    const [branches, setBranches] = useState([]);

    const navigate = useNavigate(); // Hook for navigation
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                setShowOptions(true);
            }, 1500);
        }
        fetchStates();
    }, [open]);

    useEffect(() => {
        if (queryData.state) fetchDistricts(queryData.state);
    }, [queryData.state]);

    useEffect(() => {
        if (queryData.district) fetchBanks(queryData.district);
    }, [queryData.district]);

    const fetchStates = async () => {
        try {
            const response = await fetch("http://192.168.43.148:8080/states");
            const data = await response.json();
            setStates(data);
        } catch (error) {
            console.error("Error fetching states:", error);
        }
    };

    const fetchDistricts = async (stateName) => {
        try {
            const response = await fetch(`http://192.168.43.148:8080/districts/${stateName}`);
            const data = await response.json();
            setDistricts(data);
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    const fetchBanks = async (districtName) => {
        try {
            const response = await fetch(`http://192.168.43.148:8080/banks?district=${districtName}`);
            const data = await response.json();
            setBanks(data);
        } catch (error) {
            console.error("Error fetching banks:", error);
 }
    };

    const fetchBranches = async (bankName) => {
        try {
            const response = await fetch(`http://192.168.43.148:8080/branchbybank?bankName=${bankName}`);
            const data = await response.json();
            setBranches(data);
        } catch (error) {
            console.error("Error fetching branches:", error);
        }
    };

    const handleUserInfoChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        if (name === 'bankName') {
            fetchBranches(value);
        }
    };

    const handleRatingSubmit = () => {
        const updatedRatings = [...userRatings];
        updatedRatings[currentQuestionIndex] = userRating;
        setUserRatings(updatedRatings);

        setChatLog((prevChatLog) => [
            ...prevChatLog,
            { text: `${userRating} star(s) for ${feedbackQuestions[currentQuestionIndex]}`, sender: 'user' },
        ]);

        if (currentQuestionIndex < feedbackQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setRatingVisible(false);
            setChatLog((prevChatLog) => [
                ...prevChatLog,
                { text: "Thank you for your feedback! Please provide your name and email to complete the process.", sender: 'bot' },
            ]);
            setShowUserInfo(true);
            setUserRating(null);
        }
    };

    const handleUserInfoSubmit = () => {
        const totalRating = userRatings.reduce((acc, val) => acc + (val || 0), 0);
        const avgReview = (totalRating / userRatings.length).toFixed(2);
        const userFeedback = avgReview < 2.5 ? "The user experience is worse" : "The user experience is good";
        const feedbackData = {
            name: userInfo.name,
            email: userInfo.email,
            userFeedback,
            avgReview,
            bankName: userInfo.bankName,
        };
        console.log(feedbackData);

        fetch("http://192.168.43.148:8080/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(feedbackData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Feedback submitted:", data);
                setChatLog((prevChatLog) => [
                    ...prevChatLog,
                    { text: "Your feedback has been submitted successfully!", sender: 'bot' },
                ]);
                setShowUserInfo(false);
                setUserInfo({ name: '', email: '', bankName: selectedDistrict || '' });
                setUserRatings(Array(feedbackQuestions.length).fill(null));
                setCurrentQuestionIndex(0);
            })
            .catch((error) => console.error("Error:", error));
    };

    const handleGiveFeedback = () => {
        setChatLog((prevChatLog) => [
            ...prevChatLog,
            { text: "Please rate your experience from 1 to 5 stars:", sender: 'bot' },
        ]);
        setRatingVisible(true);
        setShowOptions(false);
    };

    const handleRaiseQuery = () => {
        setChatLog((prevChatLog) => [
            ...prevChatLog,
            { text: "Please provide the following details for your query:", sender: 'bot' },
        ]);
        setQueryFieldsVisible(true);
        setShowOptions(false);
    };

    const handleQueryDataChange = (e) => {
        const { name, value } = e.target;
        setQueryData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleQuerySubmit = () => {
        const queryPayload = {
            ...queryData,
            refNo: generateRefNo(),
            Filename: Filename,
        };
        console.log(queryPayload);

        fetch("http://192.168.43.148:8080/submitquery", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(queryPayload),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Query submitted:", data);
                setChatLog((prevChatLog) => [
                    ...prevChatLog,
                    { text: `Your query has been submitted successfully. Reference Number: ${queryPayload.refNo}`, sender: 'bot' },
                ]);
                setQueryFieldsVisible(false);
                setQueryData({
                    date: '',
                    state: '',
                    district: '',
                    bankName: '',
                    branch: '',
                    description: '',
                    contact: '',
                    email: '',
                });
                setSuccessMessage(` Query submitted successfully! Reference Number: ${queryPayload.refNo}`);
                setTimeout(() => {
                    navigate(`/${queryData.bankName}`); // Navigate to the bank page
                }, 2000); // Wait for 2 seconds before navigating
            })
            .catch((error) => console.error("Error:", error));
    };

    const generateRefNo = () => {
        return `REF${Math.floor(Math.random() * 1000000)}`;
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    overflowY: 'auto',
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: '#f5f5f5',
                    mx: 'auto',
                    my: '10%',
                    width: '90%',
                    maxWidth: '600px',
                    boxShadow: 3,
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 10,
                        top: 10,
                        color: '#1976d2',
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: '#1976d2' }}>
                    Give Feedback / Raise Query
                </Typography>
                <Paper
                    elevation={3}
                    sx={{
                        mt: 2,
                        padding: 2,
                        borderRadius: 2,
                        maxHeight: '200px', // Set a maximum height for the chat log
                        overflowY: 'auto',  // Enable vertical scrolling
                        backgroundColor: '#ffffff', // Light background color for contrast
                        border: '1px solid #ccc', // Optional: Add border for clarity
                    }}
                >
                    {chatLog.map((chat, index) => (
                        <Box key={index} sx={{ mb: 1, textAlign: chat.sender === 'bot' ? 'left' : 'right' }}>
                            <Typography variant="body1" sx={{
                                display: 'inline-block',
                                backgroundColor: chat.sender === 'bot' ? '#e0e0e0' : '#1976d2',
                                color: chat.sender === 'bot' ? 'black' : 'white',
                                borderRadius: 10,
                                padding: 1,
                                maxWidth: '70%',
                            }}>
                                {chat.text}
                            </Typography>
                        </Box>
                    ))}
                    {successMessage && (
                        <Box sx={{ mb: 1, textAlign: 'center' }}>
                            <CheckCircle sx={{ fontSize: 24, color: 'green' }} />
                            <Typography variant="body1" sx={{ color: 'green' }}>
                                {successMessage}
                            </Typography>
                        </Box>
                    )}
                </Paper>
                {showOptions && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                        <Button
                            variant="contained"
                            onClick={handleGiveFeedback}
                            sx={{
                                backgroundColor: '#1976d2',
                                '&:hover': {
                                    backgroundColor: '#115293',
                                },
                            }}
                        >
                            Give Feedback
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleRaiseQuery}
                            sx={{
                                backgroundColor: '#1976d2',
                                '&:hover': {
                                    backgroundColor: '#115293',
                                },
                            }}
                        >
                            Raise Query
                        </Button>
                    </Box>
                )}
                {ratingVisible && (
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
                        <Typography variant="body1">{feedbackQuestions[currentQuestionIndex]}</Typography>
                        <Rating
                            value={userRating}
                            onChange={(event, newValue) => {
                                setUserRating(newValue);
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleRatingSubmit}
                            sx={{
                                mt: 1,
                                backgroundColor: '#1976d2',
                                '&:hover': {
                                    backgroundColor: '#115293',
                                },
                            }}
                        >
                            Submit Rating
                        </Button>
                    </Box>
                )}
                {showUserInfo && (
                    <Box sx={{ mt: 2, overflowY: 'auto' }}>
                        <TextField
                            label="Name"
                            name="name"
                            value={userInfo.name}
                            onChange={handleUserInfoChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={userInfo.email}
                            onChange={handleUserInfoChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <TextField
                        label="Bank"
                            value={userInfo.bankName}
                            name="bankName"
                            onChange={handleUserInfoChange}
                            displayEmpty
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                           

                        <Button
                            variant="contained"
                            onClick={handleUserInfoSubmit}
                            sx={{
                                backgroundColor: '#1976d2',
                                '&:hover': {
                                    backgroundColor: '#115293',
                                },
                            }}
                        >
                            Submit
                        </Button>
                    </Box>
                )}
                {queryFieldsVisible && (
                    <Box sx={{ mt: 2 }}>
                        <Paper
                            elevation={3}
                            sx={{
                                padding: 2,
                                borderRadius: 2,
                                maxHeight: '400px', // Set a maximum height for the query fields container
                                overflowY: 'auto',  // Enable vertical scrolling
                                backgroundColor: '#f9f9f9', // Light background color for contrast
                                border: '1px solid #ccc', // Optional: Add border for clarity
                            }}
                        >
                            <TextField
                                label="Date"
                                type="date"
                                name="date"
                                value={queryData.date}
                                onChange={handleQueryDataChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <Select
                                value={queryData.state}
                                onChange={(e) => {
                                    handleQueryDataChange(e);
                                    fetchDistricts(e.target.value);
                                }}
                                name="state"
                                fullWidth
                                displayEmpty
                                sx={{ mb: 1 }}
                            >
                                <MenuItem value="" disabled>Select State</MenuItem>
                                {states.map((state) => (
                                    <MenuItem key={state.id} value={state.stateName}>
                                        {state.stateName} {/* Make sure to use the correct property */}
                                    </MenuItem>
                                ))}
                            </Select>

                            <Select
                                value={queryData.district}
                                onChange={handleQueryDataChange}
                                name="district"
                                fullWidth
                                displayEmpty
                                sx={{ mb: 1 }}
                            >
                                <MenuItem value="" disabled>Select District</MenuItem>
                                {districts.map((district) => (
                                    <MenuItem key={district.id} value={district.districtName}>
                                        {district.districtName} {/* Make sure to use the correct property */}
                                    </MenuItem>
                                ))}
                            </Select>

                            <Select
                                value={queryData.bankName}
                                onChange={(e) => {
                                    handleQueryDataChange(e);
                                    fetchBranches(e.target.value);
                                }}
                                name="bankName"
                                fullWidth
                                displayEmpty
                                sx={{ mb: 1 }}
                            >
                                <MenuItem value="" disabled>Select Bank</MenuItem>
                                {banks.map((bank) => (
                                    <MenuItem key={bank.id} value={bank.bankName}>
                                        {bank.bankName} {/* Make sure to use the correct property */}
                                    </MenuItem>
                                ))}
                            </Select>

                            <Select
                                value={queryData.branch}
                                onChange={handleQueryDataChange}
                                name="branch"
                                fullWidth
                                displayEmpty
                                sx={{ mb: 1 }}
                            >
                                <MenuItem value="" disabled>Select Branch</MenuItem>
                                {Array.isArray(branches) && branches.map((branch) => (
                                    <MenuItem key={branch.id} value={branch.branchName}>
                                        {branch.branchName} {/* Make sure to use the correct property */}
                                    </MenuItem>
                                ))}
                            </Select>

                            <TextField
                                label="Bank Name"
                                name="bankName"
                                value={queryData.bankName}
                                onChange={handleQueryDataChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Branch"
                                name="branch"
                                value={queryData.branch}
                                onChange={handleQueryDataChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                value={queryData.description}
                                onChange={handleQueryDataChange}
                                fullWidth
                                multiline
                                rows={4}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Contact"
                                name="contact"
                                value={queryData.contact}
                                onChange={handleQueryDataChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={queryData.email}
                                onChange={handleQueryDataChange}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="File"
                                name="Filename"
                                type="file"
                                fullWidth
                                sx={{ mb: 2 }}
                                InputLabelProps={{ shrink: true }} // To ensure the label displays correctly
                                onChange={(e) => {
                                    setfilename(e.target.files[0].name);
                                    console.log(e.target.files[0]); // Access the selected file
                                }}
                            />

                            <Button
                                variant="contained"
                                onClick={handleQuerySubmit}
                                sx={{
                                    backgroundColor: '#1976d2',
                                    '&:hover': {
                                        backgroundColor: '#115293',
                                    },
                                }}
                            >
                                Submit Query
                            </Button>
                        </Paper>
                    </Box>
                )}
            </Box>
        </Modal>
    );
};

export default Feedback;