const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const Item = require('../models/Item');
const User = require('../models/User');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


router.get('/', async (req, res) => {
  try {
    const { search, category, availability, location } = req.query;

    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (availability === 'available') {
      filter.isAvailable = true;
    } else if (availability === 'private') {
      filter.isAvailable = false;
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    let query = Item.find(filter);

    if (search) {

      query = Item.find({
        ...filter,
        $text: { $search: search }
      });
    }

    const items = await query.sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('Failed to fetch items', err);
    res.status(500).json({ message: 'Failed to fetch items' });
  }
});


router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, condition, category, availability, tags, location } = req.body;

    const ownerId = req.user && req.user.id ? req.user.id : req.body.ownerId;

    const itemData = {
      title,
      description,
      condition,
      category,
      ownerId
    };


    if (availability) {
      itemData.availability = availability;
      itemData.isAvailable = availability === 'Available for Swap';
    } else {
      itemData.availability = 'Available for Swap';
      itemData.isAvailable = true;
    }


    if (typeof tags === 'string') {
      itemData.tags = tags.
      split(',').
      map((t) => t.trim()).
      filter((t) => t.length > 0);
    } else if (Array.isArray(tags)) {
      itemData.tags = tags;
    }

    if (location) {
      itemData.location = location;
    }

    if (req.file) {
      itemData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const newItem = new Item(itemData);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error('item creation error', err);
    res.status(500).json({ message: 'Failed to create listing' });
  }
});


router.patch('/:id/toggle-availability', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }


    if (item.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    item.isAvailable = !item.isAvailable;
    item.availability = item.isAvailable ? 'Available for Swap' : 'Private Collection';

    await item.save();
    res.json(item);
  } catch (err) {
    console.error('toggle availability error', err);
    res.status(500).json({ message: 'Failed to toggle availability' });
  }
});


router.post('/wishlist/:itemId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const itemId = req.params.itemId;

    if (!user.wishlist.some((id) => id.toString() === itemId)) {
      user.wishlist.push(itemId);
      await user.save();
    }

    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    console.error('add to wishlist error', err);
    res.status(500).json({ message: 'Failed to update wishlist' });
  }
});


router.delete('/wishlist/:itemId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const itemId = req.params.itemId;
    user.wishlist = user.wishlist.filter((id) => id.toString() !== itemId);
    await user.save();

    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    console.error('remove from wishlist error', err);
    res.status(500).json({ message: 'Failed to update wishlist' });
  }
});


router.get('/wishlist/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.wishlist || []);
  } catch (err) {
    console.error('get wishlist error', err);
    res.status(500).json({ message: 'Failed to load wishlist' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error('Failed to fetch item', err);
    res.status(400).json({ message: 'Invalid item id' });
  }
});

module.exports = router;
