import Message from '../models/Message.js';

// chatId is always two sorted user IDs: `uid1_uid2`
export const makeChatId = (a, b) => [a, b].sort().join('_');

export const getChatHistory = async (req, res) => {
  try {
    const { chatId } = req.params;
    const msgs = await Message.find({ chatId })
      .sort('createdAt')
      .populate('sender', 'name avatar');
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyChats = async (req, res) => {
  try {
    const uid = req.user._id.toString();
    const msgs = await Message.aggregate([
      { $match: { chatId: { $regex: uid } } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$chatId', lastMessage: { $first: '$$ROOT' } } },
      { $sort: { 'lastMessage.createdAt': -1 } },
    ]);
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
