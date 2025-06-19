import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

import { generateIdeas, saveIdea, clearGeneratedIdeas } from '../../redux/ideasSlice';
import { setNotification } from '../../redux/uiSlice';

const GenerateIdeas = () => {
  const dispatch = useDispatch();
  const { generatedIdeas, generating, loading, error } = useSelector((state) => state.ideas);
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    contentType: 'blog',
    topic: '',
    audience: user?.targetAudience || '',
    tone: 'professional',
    count: 5,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(generateIdeas(formData));
  };

  const handleSaveIdea = (idea) => {
    const ideaData = {
      title: idea.title,
      description: idea.description,
      contentType: formData.contentType,
      keywords: idea.keywords || [],
    };
    
    dispatch(saveIdea(ideaData))
      .unwrap()
      .then(() => {
        dispatch(setNotification({
          message: 'Idea saved successfully!',
          type: 'success',
        }));
      })
      .catch(() => {
        dispatch(setNotification({
          message: 'Failed to save idea. Please try again.',
          type: 'error',
        }));
      });
  };

  const handleClearIdeas = () => {
    dispatch(clearGeneratedIdeas());
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Generate Content Ideas
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Use AI to create fresh content ideas for your blog, videos, and social media.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5} lg={4}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Idea Generator
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="content-type-label">Content Type</InputLabel>
                <Select
                  labelId="content-type-label"
                  id="contentType"
                  name="contentType"
                  value={formData.contentType}
                  onChange={handleChange}
                  label="Content Type"
                  required
                >
                  <MenuItem value="blog">Blog Post</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="social">Social Media</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="topic"
                label="Topic or Subject"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g., Digital Marketing, Healthy Recipes"
              />
              
              <TextField
                margin="normal"
                fullWidth
                id="audience"
                label="Target Audience"
                name="audience"
                value={formData.audience}
                onChange={handleChange}
                placeholder="e.g., Small Business Owners, Fitness Enthusiasts"
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel id="tone-label">Tone</InputLabel>
                <Select
                  labelId="tone-label"
                  id="tone"
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  label="Tone"
                >
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="friendly">Friendly</MenuItem>
                  <MenuItem value="humorous">Humorous</MenuItem>
                  <MenuItem value="informative">Informative</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth margin="normal">
                <InputLabel id="count-label">Number of Ideas</InputLabel>
                <Select
                  labelId="count-label"
                  id="count"
                  name="count"
                  value={formData.count}
                  onChange={handleChange}
                  label="Number of Ideas"
                >
                  <MenuItem value={3}>3 Ideas</MenuItem>
                  <MenuItem value={5}>5 Ideas</MenuItem>
                  <MenuItem value={10}>10 Ideas</MenuItem>
                </Select>
              </FormControl>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                startIcon={<LightbulbIcon />}
                sx={{ mt: 3, mb: 2, py: 1.2 }}
                disabled={generating}
              >
                {generating ? <CircularProgress size={24} /> : 'Generate Ideas'}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7} lg={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Generated Ideas
            </Typography>
            {generatedIdeas.length > 0 && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleClearIdeas}
              >
                Clear Ideas
              </Button>
            )}
          </Box>
          
          {generating ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Generating creative content ideas...
              </Typography>
            </Box>
          ) : generatedIdeas.length === 0 ? (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 5, 
                borderRadius: 2, 
                bgcolor: 'background.default', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <CreateIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No Ideas Generated Yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mb: 3 }}>
                Fill out the form on the left and click "Generate Ideas" to get started. 
                Our AI will create content ideas based on your topic and preferences.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {generatedIdeas.map((idea, index) => (
                <Grid item xs={12} key={index}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {idea.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {idea.description}
                      </Typography>
                      
                      {idea.keywords && idea.keywords.length > 0 && (
                        <Box sx={{ mb: 1 }}>
                          <Divider sx={{ mb: 2 }} />
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            Keywords:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {idea.keywords.map((keyword, idx) => (
                              <Chip key={idx} label={keyword} size="small" variant="outlined" />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<BookmarkIcon />}
                        onClick={() => handleSaveIdea(idea)}
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={20} /> : 'Save Idea'}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default GenerateIdeas;