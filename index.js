const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Collection = require("./models/Collection");

const duration = async (duration) => {
  let match = {};
  const currentYear = new Date().getFullYear();
  const firstDateOfCurrentYear = new Date(currentYear, 0, 1);
  const lastDateOfCurrentYear = new Date(currentYear, 11, 31);

  switch ((duration, (date = new Date()))) {
    case "day":
      var currentDate = new Date();
      match = {
        viewDate: currentDate,
      };
      break;

    case "week":
      var curr = new Date();
      var first = curr.getDate() - curr.getDay();
      var last = first + 6;

      var firstday = new Date(curr.setDate(first));
      var lastday = new Date(curr.setDate(last));
      match = {
        viewDate: {
          $gte: firstday,
          $lte: lastday,
        },
      };
      break;

    case "month":
      const currentMonth = new Date().getMonth();
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
      match = {
        viewDate: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
      };
      break;

    case "custom":
      var currentDate = date;
      match = {
        viewDate: currentDate,
      };
      break;

    default:
      match = {
        created_at: {
          $gt: firstDateOfCurrentYear,
          $lte: lastDateOfCurrentYear,
        },
      };
      break;
  }

  return match;
};

(async (durationType, productId) => {
  try {
    const durationMatch = duration(durationType);

    const match = {
      $match: { productId: productId, durationMatch },
    };

    const getTotalUsers = await Collection.aggregate([
      match,
      {
        $group: {
          _id: "$userId",
          count: { $sum: 1 },
        },
      },
      // Sum all occurrences and count distinct
      {
        $group: {
          _id: {
            _id: "$_id",
          },
          totalUsers: { $sum: "$count" },
          totalDistinctUser: { $sum: 1 },
        },
      },

      //sort
      {
        $sort: {
          totalUsers: -1,
        },
      },
    ]);
    console.log(getTotalUsers);
  } catch (error) {
    console.log(error);
  }
})("day", "61e9173afc13ae5870000141");

/** Create mongoose connect **/
// DB Config
const db = "mongodb://localhost/test";

// Connect to Mongo
mongoose
  .connect(db, {
    useNewUrlParser: true,
  }) // Adding new mongo url parser
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.listen(2525, () => {
  console.log("server is listening");
});
