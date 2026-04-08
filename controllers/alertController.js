const Alert = require('../models/alert');

const getActiveAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ status: 'active' })
      .populate('sectionId', 'name location')
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const resolveAlert = async (req, res) => {
  const { alertId } = req.params;
  try {
    const updatedAlert = await Alert.findByIdAndUpdate(
      alertId,
      { status: 'resolved' },
      { returnDocument: 'after' },
    );

    if (!updatedAlert) {
      return res.status(404).json({
        error: `Not Found: No alert found with ID ${alertId}`,
      });
    }

    res.json({ message: 'Alert resolved', alert: updatedAlert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getActiveAlerts,
  resolveAlert,
};
