import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const Settings = () => {
    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                Settings
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Typography>
                    Your account and application settings will be displayed here.
                </Typography>
            </Paper>
        </Container>
    );
};

export default Settings; 