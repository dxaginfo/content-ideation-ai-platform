import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Generate ideas
export const generateIdeas = createAsyncThunk(
  'ideas/generate',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/ideas/generate', formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.msg);
    }
  }
);

// Get all ideas
export const getIdeas = createAsyncThunk(
  'ideas/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/ideas');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.msg);
    }
  }
);

// Save idea
export const saveIdea = createAsyncThunk(
  'ideas/save',
  async (ideaData, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/ideas', ideaData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.msg);
    }
  }
);

// Update idea
export const updateIdea = createAsyncThunk(
  'ideas/update',
  async ({ id, ideaData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/ideas/${id}`, ideaData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.msg);
    }
  }
);

// Delete idea
export const deleteIdea = createAsyncThunk(
  'ideas/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/ideas/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data.msg);
    }
  }
);

const initialState = {
  generatedIdeas: [],
  savedIdeas: [],
  currentIdea: null,
  loading: false,
  generating: false,
  error: null,
};

const ideasSlice = createSlice({
  name: 'ideas',
  initialState,
  reducers: {
    clearGeneratedIdeas: (state) => {
      state.generatedIdeas = [];
    },
    setCurrentIdea: (state, action) => {
      state.currentIdea = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateIdeas.pending, (state) => {
        state.generating = true;
        state.error = null;
      })
      .addCase(generateIdeas.fulfilled, (state, action) => {
        state.generating = false;
        state.generatedIdeas = action.payload;
      })
      .addCase(generateIdeas.rejected, (state, action) => {
        state.generating = false;
        state.error = action.payload || 'Failed to generate ideas';
      })
      .addCase(getIdeas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIdeas.fulfilled, (state, action) => {
        state.loading = false;
        state.savedIdeas = action.payload;
      })
      .addCase(getIdeas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch ideas';
      })
      .addCase(saveIdea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveIdea.fulfilled, (state, action) => {
        state.loading = false;
        state.savedIdeas = [action.payload, ...state.savedIdeas];
      })
      .addCase(saveIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to save idea';
      })
      .addCase(updateIdea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIdea.fulfilled, (state, action) => {
        state.loading = false;
        state.savedIdeas = state.savedIdeas.map((idea) =>
          idea._id === action.payload._id ? action.payload : idea
        );
        if (state.currentIdea && state.currentIdea._id === action.payload._id) {
          state.currentIdea = action.payload;
        }
      })
      .addCase(updateIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update idea';
      })
      .addCase(deleteIdea.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIdea.fulfilled, (state, action) => {
        state.loading = false;
        state.savedIdeas = state.savedIdeas.filter(
          (idea) => idea._id !== action.payload
        );
        if (state.currentIdea && state.currentIdea._id === action.payload) {
          state.currentIdea = null;
        }
      })
      .addCase(deleteIdea.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete idea';
      });
  },
});

export const { clearGeneratedIdeas, setCurrentIdea, clearError } = ideasSlice.actions;

export default ideasSlice.reducer;