import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    TextField,
    MenuItem,
    IconButton,
    Alert,
    Divider,
    InputAdornment,
    CircularProgress,
    Snackbar,
    Select,
    FormControl,
    InputLabel,
    Checkbox,
    ListItemText,
    OutlinedInput
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import SearchIcon from '@mui/icons-material/Search';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/animations.css';
import '../styles/Map.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { collection, addDoc, serverTimestamp, getDocs, query, limit, connectFirestoreEmulator } from 'firebase/firestore';
import { db, storage, checkDatabaseConnection } from '../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { uploadToCloudinary } from '../cloudinary';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const emergencyTypes = [
    { value: 'medical', label: 'Medical Emergency' },
    { value: 'police', label: 'Police Emergency' },
    { value: 'fire', label: 'Fire Emergency' }
];

// Search control component
function SearchControl({ setPosition }) {
    const map = useMap();
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = async () => {
        if (!searchValue) return;

        try {
            // Using Nominatim OpenStreetMap search API
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchValue)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };
                setPosition(newPos);
                map.flyTo(newPos, 16);
            }
        } catch (error) {
            console.error("Error searching location:", error);
        }
    };

    return (
        <div className="search-control" style={{
            position: 'absolute',
            top: '10px',
            left: '50px',
            zIndex: 1000,
            width: 'calc(100% - 120px)',
            maxWidth: '400px'
        }}>
            <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }} elevation={3}>
                <InputAdornment position="start" sx={{ ml: 1 }}>
                    <SearchIcon />
                </InputAdornment>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search for a place..."
                    variant="standard"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                    InputProps={{ disableUnderline: true }}
                    sx={{ ml: 1, flex: 1 }}
                />
                <Button
                    onClick={handleSearch}
                    variant="text"
                    size="small"
                >
                    Search
                </Button>
            </Paper>
        </div>
    );
}

// Component to handle map click events and current location
function LocationMarker({ setPosition, position }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        }
    });

    const getCurrentLocation = () => {
        map.locate();
        map.on('locationfound', function (e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, 15);
        });
    };

    return (
        <>
            <SearchControl setPosition={setPosition} />
            <div className="map-controls" style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1000
            }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={getCurrentLocation}
                    startIcon={<MyLocationIcon />}
                    size="small"
                >
                    My Location
                </Button>
            </div>
            <div className="pin-instruction">
                Click anywhere on the map to set the emergency location
            </div>
            {position && (
                <Marker position={position}>
                    <Popup>
                        <div className="popup-content">
                            <p className="popup-location">Selected location</p>
                            <p className="popup-coordinates">
                                Lat: {position.lat.toFixed(6)}<br />
                                Lng: {position.lng.toFixed(6)}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            )}
        </>
    );
}

const reportBg = 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=1500&q=80';

const validateDatabaseConnection = async (retries = 3) => {
    let lastError = null;

    for (let i = 0; i < retries; i++) {
        try {
            // Try to access the collection
            const testRef = collection(db, 'emergencyReports');
            const testQuery = query(testRef, limit(1));
            await getDocs(testQuery);
            return true;
        } catch (error) {
            console.error(`Database connection attempt ${i + 1}/${retries} failed:`, error);
            lastError = error;

            // Wait before retrying (exponential backoff)
            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            }
        }
    }

    // All retries failed
    throw lastError || new Error('Unable to connect to database after multiple attempts');
};

const EmergencyReport = () => {
    const [formData, setFormData] = useState({
        name: '',
        emergencyType: [], // Changed to array for multiple selections
        location: '',
        description: '',
        contactNumber: ''
    });
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [position, setPosition] = useState(null);
    const [initialPosition, setInitialPosition] = useState([20.5937, 78.9629]);
    const [locationAddress, setLocationAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isDatabaseConnected, setIsDatabaseConnected] = useState(true);
    const [networkStatus, setNetworkStatus] = useState(navigator.onLine);
    const mapRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get user's current location when component mounts
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setInitialPosition([latitude, longitude]);
            },
            (error) => {
                console.error("Error getting location:", error);
            }
        );
    }, []);

    useEffect(() => {
        if (position) {
            // First update the coordinates
            const locationString = `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
            setFormData(prev => ({
                ...prev,
                location: locationString
            }));

            // Then try to get the address
            fetchReverseGeocode(position);
        }
    }, [position]);

    const fetchReverseGeocode = async (position) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();

            if (data && data.display_name) {
                setLocationAddress(data.display_name);
            }
        } catch (error) {
            console.error("Error fetching address:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'emergencyType') {
            // Handle array of selected values for emergency types
            setFormData(prev => ({
                ...prev,
                [name]: typeof value === 'string' ? value.split(',') : value
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
        const maxSize = 20 * 1024 * 1024; // 20MB max size

        if (totalSize > maxSize) {
            setError('Total file size should not exceed 20MB');
            return;
        }

        if (selectedFiles.length + files.length > 3) {
            setError('You can only upload up to 3 files');
            return;
        }

        const invalidFiles = selectedFiles.filter(file => {
            const fileType = file.type.toLowerCase();
            const fileName = file.name.toLowerCase();
            // Check both MIME type and file extension for PDFs
            const isPDF = fileType === 'application/pdf' || fileName.endsWith('.pdf');
            const isImage = fileType.startsWith('image/');
            const isDoc = fileType === 'application/msword' ||
                fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                fileName.endsWith('.doc') ||
                fileName.endsWith('.docx');

            return !(isPDF || isImage || isDoc);
        });

        if (invalidFiles.length > 0) {
            setError('Only PDF, images, and Word documents are allowed');
            return;
        }

        setFiles(prev => [...prev, ...selectedFiles]);
        setError('');
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        let mounted = true;
        let connectionChecker;

        const checkConnection = async () => {
            try {
                if (!mounted) return;

                setIsSubmitting(true);
                const isConnected = await validateDatabaseConnection();

                if (mounted) {
                    setIsDatabaseConnected(isConnected);
                    setError(isConnected ? '' : 'Unable to connect to the emergency response system. Please check your internet connection and try again.');
                }
            } catch (err) {
                if (mounted) {
                    console.error('Connection error:', err);
                    setIsDatabaseConnected(false);
                    setError('Unable to establish connection to emergency services. Please try again later.');
                }
            } finally {
                if (mounted) {
                    setIsSubmitting(false);
                }
            }
        };

        // Initial check
        checkConnection();

        // Set up periodic connection check (every 30 seconds)
        connectionChecker = setInterval(checkConnection, 30000);

        // Add network status listener
        const handleOnline = () => {
            if (mounted) {
                setError('');
                checkConnection();
            }
        };

        const handleOffline = () => {
            if (mounted) {
                setIsDatabaseConnected(false);
                setError('No internet connection. Please check your network and try again.');
            }
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            mounted = false;
            clearInterval(connectionChecker);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Update validation in handleSubmit
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            if (!isDatabaseConnected) {
                throw new Error('No connection to emergency response system');
            }

            // Validate required fields
            const requiredFields = {
                name: 'Full Name',
                emergencyType: 'Emergency Type',
                description: 'Description',
                contactNumber: 'Contact Number'
            };

            for (const [field, label] of Object.entries(requiredFields)) {
                if (field === 'emergencyType') {
                    if (!formData[field] || formData[field].length === 0) {
                        setError(`${label} is required`);
                        setIsSubmitting(false);
                        return;
                    }
                } else if (!formData[field].trim()) {
                    setError(`${label} is required`);
                    setIsSubmitting(false);
                    return;
                }
            }

            // Upload files to Cloudinary if any
            const uploadedFileURLs = [];

            if (files.length > 0) {
                try {
                    for (const file of files) {
                        const uploadResult = await uploadToCloudinary(file);
                        if (!uploadResult || !uploadResult.url) {
                            throw new Error('Failed to get upload URL');
                        }

                        uploadedFileURLs.push({
                            name: file.name,
                            url: uploadResult.url,
                            public_id: uploadResult.public_id,
                            type: file.type,
                            size: file.size,
                            format: uploadResult.format
                        });
                    }
                } catch (uploadError) {
                    console.error('Error uploading files:', uploadError);
                    setError('Failed to upload files. Please try again or proceed without attachments.');
                    setIsSubmitting(false);
                    return;
                }
            }

            // Prepare report data
            const reportData = {
                id: `ER${Date.now()}`,
                ...formData,
                coordinates: {
                    lat: position.lat,
                    lng: position.lng
                },
                address: locationAddress,
                status: 'pending',
                timestamp: serverTimestamp(),
                attachments: uploadedFileURLs,
                fileCount: files.length,
                submittedAt: new Date().toISOString()
            };

            // Add to Firestore
            const emergencyReportsRef = collection(db, 'emergencyReports');
            const docRef = await addDoc(emergencyReportsRef, reportData);

            setSubmitSuccess(true);
            // Reset form
            setFormData({
                name: '',
                emergencyType: [],
                location: '',
                description: '',
                contactNumber: ''
            });
            setFiles([]);
            setPosition(null);

            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err) {
            console.error('Error submitting report:', err);
            let errorMessage = 'Failed to submit report. Please try again.';

            if (!isDatabaseConnected) {
                errorMessage = 'Unable to connect to the emergency response system. Please check your internet connection and try again.';
            }

            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.7)), url(${reportBg}) center/cover no-repeat`,
            pt: 10,
            pb: 6,
        }}>
            <Container maxWidth="md">
                <Paper elevation={5} sx={{ p: { xs: 2, md: 5 }, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.97)' }} data-aos="fade-up">
                    <Typography variant="h4" align="center" gutterBottom color="primary.dark" data-aos="fade-down">
                        Report an Emergency
                    </Typography>
                    <Typography variant="body1" align="center" sx={{ mb: 4 }}>
                        Please provide accurate information for immediate assistance
                    </Typography>

                    {!networkStatus && (
                        <Alert
                            severity="warning"
                            sx={{ mb: 2 }}
                        >
                            You are currently offline. Emergency reports will be saved locally and submitted when you're back online.
                        </Alert>
                    )}

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            name="name"
                            label="Full Name"
                            required
                            fullWidth
                            margin="normal"
                            value={formData.name}
                            onChange={handleInputChange}
                        />

                        <FormControl fullWidth margin="normal" required>
                            <InputLabel>Emergency Type</InputLabel>
                            <Select
                                multiple
                                name="emergencyType"
                                value={formData.emergencyType}
                                onChange={handleInputChange}
                                input={<OutlinedInput label="Emergency Type" />}
                                renderValue={(selected) => selected.map(value => emergencyTypes.find(option => option.value === value)?.label).join(', ')}
                            >
                                {emergencyTypes.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        <Checkbox checked={formData.emergencyType.indexOf(option.value) > -1} />
                                        <ListItemText primary={option.label} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, display: 'flex', alignItems: 'center' }}>
                            <LocationOnIcon color="error" sx={{ mr: 1 }} />
                            Pin Your Location on the Map
                        </Typography>

                        <Box sx={{ height: 400, width: '100%', mb: 2, border: '1px solid #ddd', borderRadius: 1, overflow: 'hidden' }}>
                            <MapContainer
                                center={initialPosition}
                                zoom={13}
                                style={{ height: '100%', width: '100%' }}
                                ref={mapRef}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <LocationMarker setPosition={setPosition} position={position} />
                            </MapContainer>
                        </Box>

                        <TextField
                            name="location"
                            label="Location Coordinates"
                            required
                            fullWidth
                            margin="normal"
                            value={formData.location}
                            onChange={handleInputChange}
                            InputProps={{
                                startAdornment: position && <LocationOnIcon color="error" />,
                                readOnly: !!position,
                            }}
                            helperText={position ? "Location selected from map" : "Click on the map to select a location or enter coordinates manually"}
                        />

                        {locationAddress && (
                            <TextField
                                label="Address"
                                fullWidth
                                margin="normal"
                                value={locationAddress}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="filled"
                                size="small"
                            />
                        )}

                        <TextField
                            name="description"
                            label="Description"
                            required
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            placeholder="Describe the emergency situation"
                            value={formData.description}
                            onChange={handleInputChange}
                        />

                        <TextField
                            name="contactNumber"
                            label="Contact Number"
                            required
                            fullWidth
                            margin="normal"
                            type="tel"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                        />

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                            Additional Evidence (Optional)
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                            <input
                                accept=".pdf,image/*,.doc,.docx"
                                style={{ display: 'none' }}
                                id="file-upload"
                                type="file"
                                multiple
                                onChange={handleFileChange}
                            />
                            <label htmlFor="file-upload">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<CloudUploadIcon />}
                                    sx={{ mb: 2 }}
                                >
                                    Upload Evidence/Documents
                                </Button>
                            </label>
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            {files.map((file, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 1,
                                        p: 1,
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 1
                                    }}
                                >
                                    <Typography sx={{ flexGrow: 1 }}>
                                        {file.name}
                                    </Typography>
                                    <IconButton
                                        onClick={() => removeFile(index)}
                                        size="small"
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            color="error"
                            size="large"
                            fullWidth
                            sx={{ mt: 3 }}
                            className="button-pulse"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Submit Emergency Report'
                            )}
                        </Button>
                    </form>
                </Paper>
            </Container>
            <Snackbar
                open={submitSuccess}
                autoHideDuration={2000}
                message="Emergency report submitted successfully"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Box>
    );
};

export default EmergencyReport;