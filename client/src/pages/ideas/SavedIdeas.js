import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import TodayIcon from '@mui/icons-material/Today';

import { getIdeas, updateIdea, deleteIdea } from '../../redux/ideasSlice';
import { setNotification } from '../../redux/uiSlice';

const SavedIdeas = () => {
  const dispatch = useDispatch();
  const { savedIdeas, loading } = useSelector((state) => state.ideas);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedTab, setSelectedTab] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ideaToDelete, setIdeaToDelete] = useState(null);

  useEffect(() => {
    dispatch(getIdeas());
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleToggleFavorite = (idea) => {
    dispatch(updateIdea({
      id: idea._id,
      ideaData: { isFavorite: !idea.isFavorite }
    }))
      .unwrap()
      .then(() => {
        dispatch(setNotification({
          message: idea.isFavorite ? 'Removed from favorites' : 'Added to favorites',
          type: 'success',
        }));
      })
      .catch(() => {
        dispatch(setNotification({
          message: 'Failed to update favorite status',
          type: 'error',
        }));
      });
  };

  const handleDeleteClick = (idea) => {
    setIdeaToDelete(idea);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (ideaToDelete) {
      dispatch(deleteIdea(ideaToDelete._id))
        .unwrap()
        .then(() => {
          dispatch(setNotification({
            message: 'Idea deleted successfully',
            type: 'success',
          }));
          setDeleteDialogOpen(false);
        })
        .catch(() => {
          dispatch(setNotification({
            message: 'Failed to delete idea',
            type: 'error',
          }));
        });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setIdeaToDelete(null);
  };

  // Filter and sort ideas based on user selections
  const filteredIdeas = savedIdeas.filter(idea => {
    // Text search
    const matchesSearch = searchTerm === '' || 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Content type filter
    const matchesContentType = filter === 'all' || idea.contentType === filter;
    
    // Tab filter
    const matchesTab = 
      (selectedTab === 'all') ||
      (selectedTab === 'favorites' && idea.isFavorite) ||
      (selectedTab === 'scheduled' && idea.scheduledDate);
    
    return matchesSearch && matchesContentType && matchesTab;
  });

  // Sort ideas
  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOrder === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortOrder === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Saved Ideas
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage and organize your saved content ideas.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              id="search"
              placeholder="Search ideas..."
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4} md={2.5}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="filter-label">Type</InputLabel>
              <Select
                labelId="filter-label"
                id="filter"
                value={filter}
                onChange={handleFilterChange}
                label="Type"
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="blog">Blog Posts</MenuItem>
                <MenuItem value="video">Videos</MenuItem>
                <MenuItem value="social">Social Media</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4} md={2.5}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                id="sort"
                value={sortOrder}
                onChange={handleSortChange}
                label="Sort By"
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="alphabetical">Alphabetical</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
              {filteredIdeas.length} {filteredIdeas.length === 1 ? 'idea' : 'ideas'} found
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab value="all" label="All Ideas" />
          <Tab value="favorites" label="Favorites" />
          <Tab value="scheduled" label="Scheduled" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : sortedIdeas.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No ideas found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {searchTerm || filter !== 'all' || selectedTab !== 'all' ?
              'Try changing your search or filter settings.' :
              'Generate some ideas to get started!'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {sortedIdeas.map((idea) => (
            <Grid item xs={12} sm={6} md={4} key={idea._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h2" noWrap sx={{ maxWidth: '80%' }}>
                      {idea.title}
                    </Typography>
                    <Chip 
                      label={idea.contentType}
                      size="small"
                      color={idea.contentType === 'blog' ? 'primary' : idea.contentType === 'video' ? 'secondary' : 'default'}
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 60, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {idea.description}
                  </Typography>
                  
                  {idea.keywords && idea.keywords.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {idea.keywords.slice(0, 3).map((keyword, idx) => (
                        <Chip 
                          key={idx} 
                          label={keyword} 
                          size="small" 
                          variant="outlined" 
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                      {idea.keywords.length > 3 && (
                        <Chip 
                          label={`+${idea.keywords.length - 3}`} 
                          size="small" 
                          variant="outlined" 
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  )}
                  
                  {idea.scheduledDate && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TodayIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        Scheduled: {new Date(idea.scheduledDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <IconButton 
                      onClick={() => handleToggleFavorite(idea)}
                      color={idea.isFavorite ? 'primary' : 'default'}
                      size="small"
                    >
                      {idea.isFavorite ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </Box>
                  <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    size="small"
                    onClick={() => handleDeleteClick(idea)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Delete Idea</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{ideaToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SavedIdeas;