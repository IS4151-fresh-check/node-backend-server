const mongoose = require('mongoose');
const Alert = require('../models/alert');

/** GET /api/alert — only documents with status exactly `active`. */
const getActiveAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ status: { $eq: 'active' } })
      .populate('sectionId', 'name location')
      .sort({ createdAt: -1, _id: -1 })
      .lean();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const resolveAlert = async (req, res) => {
  const { alertId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(alertId)) {
    return res.status(400).json({
      error: 'Invalid alert id',
      message: `Not a valid alert id: ${alertId}`,
    });
  }
  try {
    const updatedAlert = await Alert.findOneAndUpdate(
      { _id: alertId, status: 'active' },
      { status: 'resolved' },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedAlert) {
      return res.status(404).json({
        error: 'Not found',
        message: `No active alert found with id ${alertId}`,
      });
    }

    res.status(200).json({
      message: 'Alert marked resolved',
      alert: updatedAlert,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getActiveAlerts,
  resolveAlert,
};
