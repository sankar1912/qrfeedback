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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation } from 'react-router-dom';

const feedbackQuestions = [
    "How would you rate the quality of service?",
    "How satisfied are you with the product selection?",
    "How would you rate the staff's knowledge?",
    // Add other questions as needed...
];

const Feedback = ({ open, onClose }) => {
    const { state } = useLocation();
    const { selectedDistrict, ifscCode } = state || {};
    const [chatLog, setChatLog] = useState([
        { text: "Hi! I'm HelpBot. Welcome! Feel free to give your review or raise a query.", sender: 'bot' },
    ]);
    const [showOptions, setShowOptions] = useState(false);
    const [ratingVisible, setRatingVisible] = useState(false);
    const [queryFieldsVisible, setQueryFieldsVisible] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userRatings, setUserRatings] = useState(Array(feedbackQuestions.length).fill(null));
    const [userRating, setUserRating] = useState(null);

    // New state for collecting user's name, email, and bank name
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        bankName: selectedDistrict || '', // Default bank name from props
    });
    const [showUserInfo, setShowUserInfo] = useState(false); // Controls visibility of user info form

    // State for query data
    const [queryData, setQueryData] = useState({
        date: '',
        place: '',
        branch: '',
        experienceDocument: null,
        description: '',
        contact: '',
        email: '',
    });

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                setShowOptions(true);
            }, 1500);
        }
    }, [open]);

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
            setShowUserInfo(true); // Show the user info form
            setUserRating(null); // Reset user rating for next question
        }
    };

    const handleUserInfoChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUserInfoSubmit = () => {
        const totalRating = userRatings.reduce((acc, val) => acc + (val || 0), 0);
        const avgReview = (totalRating / userRatings.length).toFixed(2); // Average rating

        const feedbackData = {
            name: userInfo.name,
            email: userInfo.email,
            avgReview,
            bankName: userInfo.bankName, // Use bank name from user input
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
                // Reset states after submission
                setChatLog((prevChatLog) => [
                    ...prevChatLog,
                    { text: "Your feedback has been submitted successfully!", sender: 'bot' },
                ]);
                setShowUserInfo(false); // Hide user info form after submission
                setUserInfo({ name: '', email: '', bankName: selectedDistrict || '' }); // Reset user info
                setUserRatings(Array(feedbackQuestions.length).fill(null)); // Reset ratings
                setCurrentQuestionIndex(0); // Reset question index
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
        const formData = new FormData();
        Object.keys(queryData).forEach((key) => {
            formData.append(key, queryData[key]);
        });

        fetch("http://192.168.43.148:8080/query", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Query submitted:", data);
                setChatLog((prevChatLog) => [
                    ...prevChatLog,
                    { text: "Your query has been submitted successfully.", sender: 'bot' },
                ]);
            })
            .catch((error) => console.error("Error:", error));

        setQueryFieldsVisible(false);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    mx: 'auto',
                    my: '10%',
                    width: '90%',
                    maxWidth: '600px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    position: 'relative',
                }}
            >
                <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <CloseIcon />
                </IconButton>

                <Typography variant="h6" gutterBottom>
                    HelpBot Feedback
                </Typography>

                <Paper sx={{ maxHeight: '300px', overflowY: 'auto', p: 2, mb: 2 }}>
                    {chatLog.map((msg, index) => (
                        <Typography
                            key={index}
                            align={msg.sender === 'user' ? 'right' : 'left'}
                            sx={{
                                backgroundColor: msg.sender === 'user' ? '#e0f7fa' : '#f1f8e9',
                                p: 1,
                                borderRadius: 2,
                                my: 1,
                            }}
                        >
                            {msg.text}
                        </Typography>
                    ))}
                </Paper>

                {showOptions && (
                    <Grow in={showOptions}>
                        <Box sx={{ mb: 2 }}>
                            <Button variant="outlined" onClick={handleGiveFeedback} fullWidth sx={{ mb: 1 }}>
                                Give Feedback
                            </Button>
                            <Button variant="outlined" onClick={handleRaiseQuery} fullWidth sx={{ mb: 1 }}>
                                Raise a Query
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setChatLog((prevChatLog) => [
                                        ...prevChatLog,
                                        { text: "Please share your review:", sender: 'bot' },
                                    ]);
                                }}
                                fullWidth
                            >
                                Give a Review
                            </Button>
                        </Box>
                    </Grow>
                )}

                {ratingVisible && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body1">{feedbackQuestions[currentQuestionIndex]}</Typography>
                        <Rating
                            name="user-rating"
                            value={userRating}
                            onChange={(event, newValue) => {
                                setUserRating(newValue);
                            }}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleRatingSubmit}
                            fullWidth
                            disabled={userRating === null}
                        >
                            Submit Rating
                        </Button>
                    </Box>
                )}

                {showUserInfo && (
                    <Box sx={{ mb: 2 }}>
                        <TextField name="name" label="Your Name" fullWidth onChange={handleUserInfoChange} sx={{ mb: 2 }} />
                        <TextField name="email" label="Email" type="email" fullWidth onChange={handleUserInfoChange} sx={{ mb: 2 }} />
                        <TextField
                            name="bankName"
                            label="Bank Name"
                            value={userInfo.bankName}
                            onChange={handleUserInfoChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                        <Button variant="contained" onClick={handleUserInfoSubmit} fullWidth>
                            Submit Feedback
                        </Button>
                    </Box>
                )}

                {queryFieldsVisible && (
                    <Box sx={{ mb: 2 }}>
                        <TextField name="date" label="Date" type="date" fullWidth onChange={handleQueryDataChange} sx={{ mb: 2 }} />
                        <TextField name="place" label="Place" fullWidth onChange={handleQueryDataChange} sx={{ mb: 2 }} />
                        <TextField name="branch" label="Branch" fullWidth onChange={handleQueryDataChange} sx={{ mb: 2 }} />
                        <TextField name="bankName" label="Bank Name" value={queryData.bankName} fullWidth readOnly />
                        <input type="file" onChange={(e) => setQueryData({ ...queryData, experienceDocument: e.target.files[0] })} style={{ marginBottom: '16px' }} />
                        <TextField name="description" label="Description" multiline rows={4} fullWidth onChange={handleQueryDataChange} sx={{ mb: 2 }} />
                        <TextField name="contact" label="Contact Number" fullWidth onChange={handleQueryDataChange} sx={{ mb: 2 }} />
                        <TextField name="email" label="Email" type="email" fullWidth onChange={handleQueryDataChange} sx={{ mb: 2 }} />
                        <Button variant="contained" onClick={handleQuerySubmit} fullWidth>
                            Submit Query
                        </Button>
                    </Box>
                )}
            </Box>
        </Modal>
    );
};

export default Feedback;
