// ==========================================
// LIBRARY MANAGEMENT SYSTEM - NOTIFICATIONS
// ==========================================

const createNotification = (type, message) => {
  return {
    type,
    message,
    createdAt: new Date()
  };
};

module.exports = {
  createNotification
};