import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Grid,
    LinearProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { habits } from '../services/api';

const HabitDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [habit, setHabit] = useState(null);
    const [stats, setStats] = useState(null);
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchHabitDetails();
    }, [id]);

    const fetchHabitDetails = async () => {
        try {
            const [habitResponse, statsResponse] = await Promise.all([
                habits.getOne(id),
                habits.getStats(id)
            ]);
            setHabit(habitResponse.data);
            setStats(statsResponse.data);
        } catch (error) {
            setError('Failed to fetch habit details');
        }
    };

    const handleComplete = async () => {
        try {
            await habits.complete(id, notes);
            setNotes('');
            fetchHabitDetails();
        } catch (error) {
            setError('Failed to log completion');
        }
    };

    if (!habit) {
        return <LinearProgress />;
    }

    const progress = stats ? (stats.completion_count / habit.target_count) * 100 : 0;

    return (
        <Container>
            <Box sx={{ mb: 4 }}>
                <Button onClick={() => navigate('/')} variant="outlined">
                    Back to Dashboard
                </Button>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4" gutterBottom>
                                {habit.title}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {habit.description}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                Frequency: {habit.frequency}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                Target: {habit.target_count} times
                            </Typography>
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h6" gutterBottom>
                                    Progress
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={Math.min(progress, 100)}
                                    sx={{ height: 10, borderRadius: 5 }}
                                />
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {stats?.completion_count || 0} out of {habit.target_count} completed
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Log Completion
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                label="Notes (optional)"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleComplete}
                            >
                                Complete
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default HabitDetail; 