import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Button,
    Grid,
    Divider,
    Dialog,
    DialogContent,
    DialogActions,
    IconButton,
    Rating,
    CircularProgress,
    Container
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BarChart, Bar, PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { QRCodeCanvas } from 'qrcode.react';

const ManagerPage = () => {
    const { bankName } = useParams();
    const navigate = useNavigate();
    const [branchData, setBranchData] = useState([]);
    const [feedbackData, setFeedbackData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [overallRating, setOverallRating] = useState(0);
    const [positiveReviews, setPositiveReviews] = useState(0);
    const [negativeReviews, setNegativeReviews] = useState(0);
    const [dailyReviewCounts, setDailyReviewCounts] = useState([]);
    const [qrModalOpen, setQrModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const branchResponse = await fetch(`http://192.168.43.148:8080/branchbybank?bankName=${bankName}`);
                const feedbackResponse = await fetch(`http://192.168.43.148:8080/feedbackbybank?bankName=${bankName}`);
                
                const branches = await branchResponse.json();
                const feedbacks = await feedbackResponse.json();
        
                setBranchData(Array.isArray(branches) ? branches : []);
                if (Array.isArray(feedbacks)) {
                    setFeedbackData(feedbacks);
                    calculateMetrics(feedbacks);
                    prepareDailyReviewCounts(feedbacks);
                } else {
                    setFeedbackData([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [bankName]);

    const calculateMetrics = (feedbacks) => {
        const ratings = feedbacks.map(feedback => feedback.avgReview);
        const avgRating = (ratings.reduce((acc, val) => acc + val, 0) / ratings.length).toFixed(2);
        
        setOverallRating(avgRating);
        setPositiveReviews(feedbacks.filter(feedback => feedback.avgReview >= 2.5).length);
        setNegativeReviews(feedbacks.filter(feedback => feedback.avgReview < 2.5).length);
    };

    const prepareDailyReviewCounts = (feedbacks) => {
        const counts = feedbacks.reduce((acc, feedback) => {
            const date = new Date(feedback.date).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        setDailyReviewCounts(Object.entries(counts).map(([date, count]) => ({ date, count })));
    };

    const renderFeedbackMetrics = () => (
        <Box mt={3}>
            <Typography variant="h6" gutterBottom>Feedback Metrics</Typography>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={[
                            { name: 'Positive Reviews', value: positiveReviews },
                            { name: 'Negative Reviews', value: negativeReviews }
                        ]}
                        cx="50%" cy="50%" outerRadius={80}
                    >
                        <Cell fill="#4caf50" />
                        <Cell fill="#f44336" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
            <Typography variant="subtitle1">Overall Rating: {overallRating} / 5</Typography>
        </Box>
    );

    const renderBranchDetails = () => (
        <Box mt={3}>
            <Typography variant="h6">Branch Details</Typography>
            {branchData.map((branch, index) => (
                <Paper key={index} sx={{ padding: 2, marginY: 2 }} elevation={3}>
                    <Typography variant="subtitle1"><strong>{branch.branch_name}</strong></Typography>
                    <Typography>Address: {branch.address}</Typography>
                    <Typography>IFSC Code: {branch.ifsc_code}</Typography>
                    <Typography>Bank Name: {branch.bank_name}</Typography>
                </Paper>
            ))}
        </Box>
    );

    const renderDailyReviewChart = () => (
        <Box mt={3}>
            <Typography variant="h6">Daily Review Counts</Typography>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyReviewCounts}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );

    const openQrModal = () => setQrModalOpen(true);
    const closeQrModal = () => setQrModalOpen(false);

    const renderUserReviews = () => (
        <Box mt={3}>
            <Typography variant="h6">User Reviews</Typography>
            {feedbackData.map((feedback, index) => (
                <Paper key={index} sx={{ padding: 2, marginY: 1 }} elevation={1}>
                    <Typography variant="subtitle2"><strong>Name:</strong> {feedback.name}</Typography>
                    <Typography variant="subtitle2"><strong>Email:</strong> {feedback.email}</Typography>
                    <Rating value={feedback.avgReview} readOnly precision={0.5} />
                </Paper>
            ))}
        </Box>
    );
    const createReport = async () => {
        try {
            const response = await fetch(`http://192.168.43.148:8080/createReport?bankName=${bankName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/pdf',
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${bankName}_report.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                console.error('Failed to create report');
            }
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };


    return (
        <Container maxWidth="lg" sx={{ padding: 4 }}>
            {loading ? (
                <Box display="flex" justifyContent="center" mt={5}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" gutterBottom>{bankName} Branches</Typography>
                        <Divider />

                        {renderBranchDetails()}

                        <Box mt={4}>
                            <Typography variant="h5">Overall Bank Rating</Typography>
                            <Typography>Rating: {overallRating} / 5</Typography>
                            <Typography>Positive Reviews: {positiveReviews}</Typography>
                            <Typography>Negative Reviews: {negativeReviews}</Typography>
                        </Box>

                        {renderFeedbackMetrics()}
                        {renderDailyReviewChart()}

                        <Grid container spacing={2} justifyContent="center" mt={4}>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={openQrModal}
                                >
                                    View QR Code
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => navigate(`/${bankName}/feedbackform`)}
                                >
                                    Give Feedback
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={createReport}
                                >
                                    Generate Report
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        {renderUserReviews()}
                    </Grid>
                </Grid>
            )}

            <Dialog open={qrModalOpen} onClose={closeQrModal}>
                <DialogActions>
                    <IconButton onClick={closeQrModal} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </DialogActions>
                <DialogContent>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <QRCodeCanvas
                            value={`http://192.168.43.148:3000/${bankName}/feedbackform`}
                            size={200}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="Q"
                            includeMargin={true}
                        />
                    </Box>
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default ManagerPage;
