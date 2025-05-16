import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    IconButton,
    Box,
    CircularProgress,
    Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { habits } from '../services/api';

const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
];

const Dashboard = () => {
    const [userHabits, setUserHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [newHabit, setNewHabit] = useState({
        title: '',
        description: '',
        frequency: 'daily',
        target_count: 1,
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchHabits();
    }, []);

    const fetchHabits = async () => {
        try {
            setLoading(true);
            const response = await habits.getAll();
            setUserHabits(response || []);
            setError('');
        } catch (err) {
            console.error('Error fetching habits:', err);
            setError('Failed to fetch habits. Please try again later.');
            setUserHabits([]);
        } finally {
            setLoading(false);
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNewHabit({
            title: '',
            description: '',
            frequency: 'daily',
            target_count: 1,
        });
    };

    const handleChange = (e) => {
        setNewHabit({
            ...newHabit,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        try {
            await habits.create(newHabit);
            handleClose();
            fetchHabits();
            setError('');
        } catch (err) {
            console.error('Error creating habit:', err);
            setError('Failed to create habit. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await habits.delete(id);
            fetchHabits();
            setError('');
        } catch (err) {
            console.error('Error deleting habit:', err);
            setError('Failed to delete habit. Please try again.');
        }
    };

    const handleHabitClick = (id) => {
        navigate(`/habits/${id}`);
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Your Habits
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleClickOpen}
                >
                    Add Habit
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {Array.isArray(userHabits) && userHabits.length > 0 ? (
                    userHabits.map((habit) => (
                        <Grid item xs={12} sm={6} md={4} key={habit.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    cursor: 'pointer',
                                }}
                            >
                                <CardContent
                                    sx={{ flexGrow: 1 }}
                                    onClick={() => handleHabitClick(habit.id)}
                                >
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {habit.title}
                                    </Typography>
                                    <Typography>{habit.description}</Typography>
                                    <Typography color="textSecondary">
                                        {habit.frequency} - Target: {habit.target_count}
                                    </Typography>
                                </CardContent>
                                <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(habit.id);
                                        }}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="body1" color="textSecondary" align="center">
                            No habits found. Click the "Add Habit" button to create your first habit!
                        </Typography>
                    </Grid>
                )}
            </Grid>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Habit</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label="Title"
                        type="text"
                        fullWidth
                        value={newHabit.title}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={newHabit.description}
                        onChange={handleChange}
                    />
                    <TextField
                        select
                        margin="dense"
                        name="frequency"
                        label="Frequency"
                        fullWidth
                        value={newHabit.frequency}
                        onChange={handleChange}
                    >
                        {frequencies.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        margin="dense"
                        name="target_count"
                        label="Target Count"
                        type="number"
                        fullWidth
                        value={newHabit.target_count}
                        onChange={handleChange}
                        inputProps={{ min: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Dashboard; 