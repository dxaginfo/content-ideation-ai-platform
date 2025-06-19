const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Idea = require('../models/Idea');
const generateIdeas = require('../services/openai');

// @route   POST api/ideas/generate
// @desc    Generate content ideas using AI
// @access  Private
router.post(
  '/generate',
  [
    auth,
    [
      check('contentType', 'Content type is required').not().isEmpty(),
      check('contentType', 'Content type must be blog, video, or social').isIn(['blog', 'video', 'social']),
      check('topic', 'Topic is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { contentType, topic, audience, tone, count } = req.body;

    try {
      const ideas = await generateIdeas(contentType, topic, audience, tone, count || 5);
      res.json(ideas);
    } catch (err) {
      console.error('Error generating ideas:', err);
      res.status(500).json({ msg: 'Failed to generate ideas' });
    }
  }
);

// @route   POST api/ideas
// @desc    Save a content idea
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('contentType', 'Content type is required').isIn(['blog', 'video', 'social'])
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, contentType, category, keywords, scheduledDate } = req.body;

      const newIdea = new Idea({
        user: req.user.id,
        title,
        description,
        contentType,
        category,
        keywords,
        scheduledDate
      });

      const idea = await newIdea.save();
      res.json(idea);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/ideas
// @desc    Get all ideas for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const ideas = await Idea.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/ideas/:id
// @desc    Get idea by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ msg: 'Idea not found' });
    }

    // Check user
    if (idea.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(idea);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Idea not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/ideas/:id
// @desc    Update an idea
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ msg: 'Idea not found' });
    }

    // Check user
    if (idea.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Update fields
    const { title, description, contentType, category, keywords, isFavorite, scheduledDate } = req.body;
    if (title) idea.title = title;
    if (description) idea.description = description;
    if (contentType) idea.contentType = contentType;
    if (category) idea.category = category;
    if (keywords) idea.keywords = keywords;
    if (isFavorite !== undefined) idea.isFavorite = isFavorite;
    if (scheduledDate !== undefined) idea.scheduledDate = scheduledDate;

    await idea.save();
    res.json(idea);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Idea not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/ideas/:id
// @desc    Delete an idea
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ msg: 'Idea not found' });
    }

    // Check user
    if (idea.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await idea.deleteOne();
    res.json({ msg: 'Idea removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Idea not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;