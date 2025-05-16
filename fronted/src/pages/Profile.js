import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
    const { user } = useAuth();

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                Profile
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Box>
                    <Typography variant="h6">Username</Typography>
                    <Typography paragraph>{user?.username}</Typography>
                    
                    <Typography variant="h6">Email</Typography>
                    <Typography paragraph>{user?.email}</Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Profile; 