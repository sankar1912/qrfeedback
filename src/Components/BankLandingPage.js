import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Paper,
  CircularProgress,
  CardContent,
  Card,
  CardActions,
} from '@mui/material';
import { AccountBalance, Feedback as FeedbackIcon, QrCode as QrCodeIcon } from '@mui/icons-material';
import { QRCodeCanvas } from 'qrcode.react';

import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [banks, setBanks] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState([]); // New state for filtered results
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankName, setBankName] = useState(''); // New state for bank name search
  const [loading, setLoading] = useState(false);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [qrBankId, setQrBankId] = useState(null);  // Track which bank's QR code to display
  const navigate = useNavigate();

  // Fetch states from the server
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('http://192.168.43.148:8080/states');
        if (!response.ok) throw new Error('Failed to fetch states');
        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };
    fetchStates();
  }, []);

  // Fetch districts when a state is selected
  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedState) {
        setDistrictLoading(true);
        try {
          const query = `http://192.168.43.148:8080/districts/${selectedState}`;
          const response = await fetch(query);
          if (!response.ok) throw new Error('Failed to fetch districts');
          const data = await response.json();
          setDistricts(data);
        } catch (error) {
          console.error('Error fetching districts:', error);
        } finally {
          setDistrictLoading(false);
        }
      } else {
        setDistricts([]);
        setSelectedDistrict('');
      }
    };
    fetchDistricts();
  }, [selectedState]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://192.168.43.148:8080/banks?district=${selectedDistrict}&ifsc=${ifscCode}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      );
      if (!response.ok) throw new Error('Failed to fetch banks');
      const data = await response.json();
      setBanks(data);
      // Filter the banks based on the bank name
      setFilteredBanks(data.filter(bank => bank.bankName.toLowerCase().includes(bankName.toLowerCase())));
    } catch (error) {
      console.error('Error fetching banks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Bank Feedback System
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel id="state-label">Select State</InputLabel>
          <Select
            labelId="state-label"
            value={selectedState || ''}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedDistrict('');
            }}
          >
            <MenuItem value="">
              <em>Select a state</em>
            </MenuItem>
            {states.map((state) => (
              <MenuItem key={state.id} value={state.stateName}>
                {state.stateName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" disabled={!selectedState || districtLoading}>
          <InputLabel id="district-label">Select District</InputLabel>
          <Select
            labelId="district-label"
            value={selectedDistrict || ''}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <MenuItem value="">
              <em>Select a district</em>
            </MenuItem>
            {districts.map((district) => (
              <MenuItem key={district.id} value={district.districtName}>
                {district.districtName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {districtLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={20} />
          </Box>
        )}

        <TextField
          fullWidth
          label="IFSC Code (optional)"
          value={ifscCode}
          onChange={(e) => setIfscCode(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Bank Name"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          margin="normal"
        />

        <Button variant="contained" onClick={handleSearch} fullWidth sx={{ mt: 2 }}>
          Search Banks
        </Button>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}

        <Typography variant="h5" gutterBottom align="center" sx={{ mt: 4 }}>
          Available Banks
        </Typography>

        {filteredBanks.length > 0 ? (
          filteredBanks.map((bank) => (
            <Card key={bank.id} sx={{ mb: 2, borderRadius: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AccountBalance fontSize="large" color="primary" />
                  <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                    {bank.bankName}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  IFSC Code: {bank.ifscCode}
                </Typography>
              </CardContent>
              <CardActions>
                <Box display="flex" justifyContent="space-between" width="100%">
                  <Button
                    variant="outlined"
                    startIcon={<FeedbackIcon />}
                    size="small"
                    sx={{ color: 'primary.main', borderColor: 'primary.main' }}
                    onClick={() => navigate(`/${bank.bankName}/feedbackform`, { state: { selectedDistrict, ifscCode } })}
                  >
                    Give Feedback
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<QrCodeIcon />}
                    size="small"
                    sx={{ color: 'primary.main', borderColor: 'primary.main' }}
                    onClick={() => setQrBankId(bank.id === qrBankId ? null : bank.id)}
                  >
                    Get QR
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ color: 'primary.main', borderColor: 'primary.main' }}
                    onClick={() => navigate(`/${bank.bankName}`)}
                  >
                    Visit Site
                  </Button>
                </Box>
              </CardActions>
              {qrBankId === bank.id && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <QRCodeCanvas value={`http://192.168.43.148:3000/${bank.bankName}/feedbackform`} size={128} />
                </Box>
              )}
            </Card>
          ))
        ) : (
          !loading && <Typography align="center">No banks found.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default LandingPage;
