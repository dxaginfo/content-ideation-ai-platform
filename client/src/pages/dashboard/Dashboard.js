import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  CardActions,
  Chip,
  CircularProgress,
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { getIdeas } from '../../redux/ideasSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { savedIdeas, loading } = useSelector((state) => state.ideas);

  useEffect(() => {
    dispatch(getIdeas());
  }, [dispatch]);

  const blogCount = savedIdeas.filter(idea => idea.contentType === 'blog').length;
  const videoCount = savedIdeas.filter(idea => idea.contentType === 'video').length;
  const socialCount = savedIdeas.filter(idea => idea.contentType === 'social').length;
  
  const scheduledIdeas = savedIdeas.filter(idea => idea.scheduledDate).slice(0, 3);
  const recentIdeas = [...savedIdeas].sort((a, b) => (
    new Date(b.createdAt) - new Date(a.createdAt)
  )).slice(0, 5);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back{user?.name ? `, ${user.name}` : ''}! Here's an overview of your content ideas.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Quick Generate
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Need fresh content ideas? Generate new ideas for your content strategy.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                variant="contained" 
                startIcon={<CreateIcon />}
                onClick={() => navigate('/generate')}
                fullWidth
              >
                Generate Ideas
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Your Ideas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Manage and view all your saved content ideas in one place.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                variant="outlined" 
                startIcon={<BookmarkIcon />}
                onClick={() => navigate('/saved')}
                fullWidth
              >
                View Saved Ideas
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Content Calendar
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Plan and schedule your content with the interactive calendar.
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                variant="outlined" 
                startIcon={<CalendarMonthIcon />}
                onClick={() => navigate('/calendar')}
                fullWidth
              >
                Open Calendar
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Recent Ideas
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress />
                </Box>
              ) : recentIdeas.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No ideas saved yet. Generate some new ideas to get started!
                </Typography>
              ) : (
                recentIdeas.map((idea, index) => (
                  <React.Fragment key={idea._id || index}>
                    {index > 0 && <Divider sx={{ my: 2 }} />}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1">{idea.title}</Typography>
                        <Chip 
                          label={idea.contentType}
                          size="small"
                          color={idea.contentType === 'blog' ? 'primary' : idea.contentType === 'video' ? 'secondary' : 'default'}
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {idea.description.length > 100 ? `${idea.description.substring(0, 100)}...` : idea.description}
                      </Typography>
                    </Box>
                  </React.Fragment>
                ))
              )}
              
              {recentIdeas.length > 0 && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button variant="text" onClick={() => navigate('/saved')}>
                    View All Ideas
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Ideas by Type
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary.main">{blogCount}</Typography>
                    <Typography variant="body2" color="text.secondary">Blog Posts</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="secondary.main">{videoCount}</Typography>
                    <Typography variant="body2" color="text.secondary">Videos</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">{socialCount}</Typography>
                    <Typography variant="body2" color="text.secondary">Social Posts</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Upcoming Content
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : scheduledIdeas.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No scheduled content. Plan your content on the calendar!
                </Typography>
              ) : (
                scheduledIdeas.map((idea, index) => (
                  <React.Fragment key={idea._id || index}>
                    {index > 0 && <Divider sx={{ my: 1.5 }} />}
                    <Box sx={{ py: 0.5 }}>
                      <Typography variant="subtitle2">{idea.title}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(idea.scheduledDate).toLocaleDateString()}
                        </Typography>
                        <Chip 
                          label={idea.contentType}
                          size="small"
                          color={idea.contentType === 'blog' ? 'primary' : idea.contentType === 'video' ? 'secondary' : 'default'}
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.6rem' }}
                        />
                      </Box>
                    </Box>
                  </React.Fragment>
                ))
              )}
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button 
                  variant="text" 
                  size="small" 
                  onClick={() => navigate('/calendar')}
                >
                  View Calendar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;