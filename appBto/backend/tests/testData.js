const testData = {
  visitor: {
    email: "test@example.com",
    phone_number: "1234567890"
  },
  school: {
    name: "Test School",
    city: "Test City",
    priority: 1
  },
  tourApplication: {
    preferred_dates: [
      new Date("2024-02-01"),
      new Date("2024-02-02"),
      new Date("2024-02-03")
    ],
    type: "INSTITUTION",
    status: "PENDING"
  },
  guide: {
    status: 'ACTIVE',
    availability: true
  }
};

module.exports = { testData }; 