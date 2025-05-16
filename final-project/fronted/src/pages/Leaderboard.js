import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const Leaderboard = () => {
    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                Leaderboard
            </Typography>
            <Paper sx={{ p: 3 }}>
                <Typography>
                    The habit tracking leaderboard will be displayed here.
                </Typography>
            </Paper>
        </Container>
    );
};

export default Leaderboard; 