import Bought from '../Models/Bought.js';

export const createBoughtRecord = async (req, res) => {
  try {
    const { items, coins } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items must be a non-empty array.' });
    }
    if (typeof coins !== 'object' || coins === null) {
      return res.status(400).json({ error: 'Coins object is required.' });
    }

    const sanitizedItems = items.map(item => {
      const { productId, qty, name, price, image = '', image_url } = item;
      return { productId, qty, name, price, image, image_url };
    });

    const serverCost = sanitizedItems.reduce((sum, it) => sum + it.price * it.qty, 0);

    const record = new Bought({
      items: sanitizedItems,
      coins: {
        totalGecko: coins.totalGecko || 0,
        totalCanopy: coins.totalCanopy || 0
      },
      cost: serverCost
    });

    const saved = await record.save();
    return res.status(201).json({
      message: 'Purchase recorded successfully',
      record: saved
    });

  } catch (err) {
    console.error('🔥 Error creating purchase record:', err);
    return res.status(500).json({ error: err.message || 'Server error while recording purchase.' });
  }
};

export const getFullBoughtList = async (req, res) => {
  try {
    const records = await Bought.find({}, {
      'items.productId': 1,
      'items.qty': 1,
      'coins.totalGecko': 1,
      'coins.totalCanopy': 1,
      _id: 0
    }).lean();

    const fullList = records.flatMap(rec =>
      rec.items.map(item => ({
        productId: item.productId,
        qty: item.qty,
        totalGecko: rec.coins.totalGecko,
        totalCanopy: rec.coins.totalCanopy
      }))
    );

    return res.status(200).json(fullList);
  } catch (err) {
    console.error('🔥 Error fetching full bought list:', err);
    return res.status(500).json({ error: err.message || 'Server error.' });
  }
};
