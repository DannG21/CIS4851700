import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const Statistics = () => {
    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                Statistics
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Typography>
                    Your habit statistics will be displayed here.
                </Typography>
            </Paper>
        </Container>
    );
};

export default Statistics; 