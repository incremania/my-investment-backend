
console.log('lllllllllllllllllllllllllllllllll');
const cron = require("node-cron");
const User = require('../models/UserModel')


const calculateProfit = (user) => {
  // Calculate profit based on user's plan and total investment
  let roiPercent;
  switch (user.plan.toLowerCase()) {
    case "basic":
      roiPercent = 7;
      break;
    case "regular":
      roiPercent = 10;
      break;
    case "silver":
      roiPercent = 12;
      break;
    case "gold":
      roiPercent = 14;
      break;
    default:
      // Handle invalid plan
      return;
  }

  const initialInvestment = user.totalInvest || 0; // Assuming user has a totalInvest property
  const dailyProfit = (initialInvestment * roiPercent) / 100;

  // Update user's profit
  user.profit = dailyProfit;
};

// Function to update profit for all users with active plans
const updateAllUserProfits = async () => {
  try {
    const users = await User.find({ plan: { $ne: "N/A" } }); // Find users with active plans

    // Iterate through each user and calculate/update profit
    users.forEach(async (user) => {
      calculateProfit(user);
      await user.save(); // Save the updated user
    });

    console.log("Profit updated for all users with active plans.");
  } catch (error) {
    console.error("Error updating user profits:", error);
  }
};

// Schedule the task to run every 24 hours


// cron.schedule("0 0 * * *", () => {
//   updateAllUserProfits();
// });


cron.schedule("*/1 * * * *", () => {
    console.log('hello world');
  updateAllUserProfits();
});

function runTask() {
    console.log('hello ');
  updateAllUserProfits();
  setTimeout(runTask, 3000); // 30 seconds in milliseconds
}

runTask(); // Start the task

console.log('kkkkkkkkkkk');

setInterval(() => {
    console.log('hello world');
}, 3000);