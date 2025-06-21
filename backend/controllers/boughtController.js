// Controllers/boughtController.js
import Bought from '../Models/Bought.js';

/**
 * POST /api/bought
 * body: { items, coins }
 */
export const createBoughtRecord = async (req, res) => {
  try {
    const { items, coins } = req.body;

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items must be a non-empty array.' });
    }
    // Validate coins object
    if (typeof coins !== 'object' || coins === null) {
      return res.status(400).json({ error: 'Coins object is required.' });
    }

    // Sanitize and enforce allowed fields on items
    const sanitizedItems = items.map(item => {
      const { productId, qty, name, price, image = '' } = item;
      return { productId, qty, name, price, image };
    });

    // Recalculate total cost on server for security
    const serverCost = sanitizedItems.reduce((sum, it) => sum + it.price * it.qty, 0);

    // Build and save the purchase record
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
    // Fetch all records
    const records = await Bought.find({}, {
      'items.productId': 1,
      'items.qty': 1,
      'coins.totalGecko': 1,
      'coins.totalCanopy': 1,
      _id: 0
    }).lean();

    // Flatten items with associated coins
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
