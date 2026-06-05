const axios = require("axios");

const API_URL =
  "http://4.224.186.213/evaluation-service/notifications";

function placementWeight(position) {
  const map = {
    top: 100,
    middle: 50,
    bottom: 10
  };

  return map[position?.toLowerCase()] || 20;
}

function typeWeight(type) {
  const map = {
    result: 100,
    event: 50
  };

  return map[type?.toLowerCase()] || 20;
}

function recencyWeight(timestamp) {
  const ageHours =
    (Date.now() - new Date(timestamp).getTime()) /
    (1000 * 60 * 60);

  return Math.max(0, 100 - ageHours);
}

function calculatePriority(notification) {
  const placement =
    placementWeight(notification.placement);

  const type =
    typeWeight(notification.type);

  const recency =
    recencyWeight(notification.timestamp);

  return (
    placement * 0.5 +
    type * 0.3 +
    recency * 0.2
  );
}

async function getTop10Notifications() {
  try {
    const response = await axios.get(API_URL);

    const notifications =
      response.data.notifications || [];

    const unreadNotifications =
      notifications.filter(
        (n) => !n.read
      );

    unreadNotifications.forEach((n) => {
      n.priorityScore =
        calculatePriority(n);
    });

    unreadNotifications.sort(
      (a, b) =>
        b.priorityScore -
        a.priorityScore
    );

    const top10 =
      unreadNotifications.slice(0, 10);

    console.table(
      top10.map((n) => ({
        id: n.id,
        type: n.type,
        placement: n.placement,
        priority: n.priorityScore.toFixed(2)
      }))
    );
  } catch (error) {
    console.error(
      "Error fetching notifications:",
      error.message
    );
  }
}

getTop10Notifications();