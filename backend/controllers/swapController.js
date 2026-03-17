const SwapRequest = require('../models/SwapRequest');
const Item = require('../models/Item');
const User = require('../models/User');
const Review = require('../models/Review');


exports.createSwapRequest = async (req, res) => {
  try {
    const { receiverId, offeredItemId, requestedItemId } = req.body;
    const requesterId = req.user && req.user.id;

    if (!requesterId) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!receiverId || !offeredItemId || !requestedItemId) {
      return res.status(400).json({ error: 'Missing required swap fields.' });
    }

    const newSwap = new SwapRequest({
      requester: requesterId,
      receiver: receiverId,
      offeredItem: offeredItemId,
      requestedItem: requestedItemId
    });

    await newSwap.save();
    res.status(201).json({ message: 'Swap request sent successfully!', swap: newSwap });
  } catch (error) {
    console.error('createSwapRequest error', error);
    res.status(500).json({ error: 'Failed to initiate swap.' });
  }
};


exports.getUserSwaps = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const incomingRequests = await SwapRequest.find({ receiver: userId, status: 'Pending' }).
    populate('requester', 'username hobbyNiche karmaPoints rating reviewCount').
    populate('offeredItem requestedItem', 'title imageUrl');

    const history = await SwapRequest.find({
      $or: [{ requester: userId }, { receiver: userId }],
      status: { $in: ['Accepted', 'Completed'] }
    }).populate('requester receiver offeredItem requestedItem');

    res.status(200).json({ incomingRequests, history });
  } catch (error) {
    console.error('getUserSwaps error', error);
    res.status(500).json({ error: 'Failed to fetch swap data.' });
  }
};


exports.acceptSwap = async (req, res) => {
  try {
    const swapId = req.params.id;
    const userId = req.user && req.user.id;

    const swap = await SwapRequest.findById(swapId);
    if (!swap) return res.status(404).json({ error: 'Swap not found.' });


    if (swap.receiver.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to accept this swap.' });
    }

    if (swap.status !== 'Pending') {
      return res.status(400).json({ error: 'Swap is not pending.' });
    }

    swap.status = 'Accepted';
    await swap.save();

    await Item.updateMany(
      { _id: { $in: [swap.offeredItem, swap.requestedItem] } },
      { $set: { isAvailable: false, availability: 'Private Collection' } }
    );

    await SwapRequest.updateMany(
      {
        _id: { $ne: swapId },
        $or: [
        { offeredItem: { $in: [swap.offeredItem, swap.requestedItem] } },
        { requestedItem: { $in: [swap.offeredItem, swap.requestedItem] } }],

        status: 'Pending'
      },
      { $set: { status: 'Rejected' } }
    );

    res.status(200).json({ message: 'Swap accepted and items updated!', swap });
  } catch (error) {
    console.error('acceptSwap error', error);
    res.status(500).json({ error: 'Failed to accept swap.' });
  }
};


exports.leaveReview = async (req, res) => {
  try {
    const { swapId, revieweeId, rating, comment } = req.body;
    const reviewerId = req.user && req.user.id;

    if (!reviewerId) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!swapId || !revieweeId || !rating) {
      return res.status(400).json({ error: 'Missing required review fields.' });
    }

    const swap = await SwapRequest.findById(swapId);
    if (!swap) {
      return res.status(404).json({ error: 'Swap not found.' });
    }

    if (
    swap.requester.toString() !== reviewerId &&
    swap.receiver.toString() !== reviewerId)
    {
      return res.status(403).json({ error: 'You were not part of this swap.' });
    }

    const review = new Review({
      swap: swapId,
      reviewer: reviewerId,
      reviewee: revieweeId,
      rating,
      comment
    });
    await review.save();

    const reviewee = await User.findById(revieweeId);
    if (!reviewee) {
      return res.status(404).json({ error: 'User to review not found.' });
    }

    let karmaChange = 0;
    if (rating >= 4) karmaChange = 10;
    if (rating <= 2) karmaChange = -5;

    reviewee.karmaPoints += karmaChange;
    reviewee.reviewCount += 1;
    const previousTotal = reviewee.rating * (reviewee.reviewCount - 1);
    reviewee.rating = (previousTotal + rating) / reviewee.reviewCount;

    await reviewee.save();

    await SwapRequest.findByIdAndUpdate(swapId, { status: 'Completed' });

    res.
    status(201).
    json({ message: 'Review posted and Karma updated!', review });
  } catch (error) {
    console.error('leaveReview error', error);
    res.status(500).json({ error: 'Failed to post review.' });
  }
};
