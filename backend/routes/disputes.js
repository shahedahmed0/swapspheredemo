const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Dispute = require('../models/Dispute');

// Create a dispute / report
router.post('/', auth, async (req, res) => {
  try {
    const { swapId, itemId, reason, details } = req.body || {};
    if (!reason || !String(reason).trim()) {
      return res.status(400).json({ message: 'Reason is required.' });
    }
    if (!swapId && !itemId) {
      return res.status(400).json({ message: 'Provide swapId or itemId.' });
    }

    const dispute = new Dispute({
      createdBy: req.user.id,
      swapId: swapId || undefined,
      itemId: itemId || undefined,
      reason: String(reason).trim(),
      details: details ? String(details).trim() : ''
    });
    await dispute.save();
    res.status(201).json(dispute);
  } catch (err) {
    console.error('create dispute error', err);
    res.status(500).json({ message: 'Failed to create dispute.' });
  }
});

module.exports = router;
