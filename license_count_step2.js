#!/usr/local/bin/node

// Go trough hipchat export and calculate license price
// Step 2 script - Compute
// /!\ pricing mechanism takes principles of max possible activated user
//     and benefits from credit. No user deactivation in progress
//     it also suppose, that user are actives as soon as they are joining


var fs = require('fs');
Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}
Number.prototype.space = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = " " + s;}
  return s;
}


var slack_monthly_license = 12;


// Is it really going faster than String and Date objects manpulationto to achieve comparison ?
function assess_start_date(start, date_string) {
  var splited = date_string.split('-');
  var ymd = [parseInt(splited[0]), parseInt(splited[1]), parseInt(splited[2])];
  if (ymd[0] < start[0]) {
    return ymd;
  } else if (ymd[0] > start[0]) {
    return start;
  } else {
    if (ymd[1] < start[1]) {
      return ymd;
    } else if (ymd[1] > start[1]) {
      return start;
    } else {
      if (ymd[2] < start[2]) {
        return ymd;
      } else {
        return start;
      }
    }
  }
}

function parse(content) {
  content = "[" + content.slice(0, -2) + "]";
  punchcard = JSON.parse(content);
  var users = {};
  var now = new Date();
  var start_date = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
  var activity_user = {};
  punchcard.forEach(entry => {
    start_date = assess_start_date(start_date, entry.ts);
    if (typeof(activity_user[entry.ts]) !== 'object') {
      activity_user[entry.ts] = {};
    }
    activity_user[entry.ts][entry.sender] = true;
    users[entry.sender] = true;
  });
  console.log("User count : " + Object.keys(users).length);
  return {"start_date": start_date, "activity_user": activity_user };
}

function timespread(parsed_content) {
  var tick = new Date(parsed_content.start_date);
  var today = new Date();
  var activity_time = {}
  var first_loop = true;
  while (tick < today) {
    var strtick = tick.toISOString().split("T")[0];
    var before_tick = new Date(tick);
    before_tick.setDate(tick.getDate() - 1);
    var strbefore_tick = before_tick.toISOString().split("T")[0];
    activity_time[strtick] = {};
    if (!first_loop) {
      for (var user_id in activity_time[strbefore_tick]) {
        activity_time[strtick][user_id] = activity_time[strbefore_tick][user_id] - 1;
      }
    } else {
      first_loop = false;
    }
    var punchard = parsed_content.activity_user[strtick];
    if (punchard) {
      for (var user_id in punchard) {
        activity_time[strtick][user_id] = 15;
      }
    }
    tick.setDate(tick.getDate() + 1);
  }
  return activity_time;
}

// I know, suboptimal, should been done in timespred. 
// Did it anyway for readability sake. And also to timeframe.
function price(activity_time, start_time, end_time)  {
  var tick = new Date(start_time);
  var today = new Date(end_time);
  var month_accounts = {};
  var outstanding = 0;
  while (tick < today) {
    var strtick = tick.toISOString().split("T")[0];
    var month = tick.getFullYear() + (tick.getMonth() + 1).pad(2);
    var user_count = 0;
    if (!month_accounts[month]) {
      month_accounts[month] = {};
    }
    for (var user_id in activity_time[strtick]) {
      if (activity_time[strtick][user_id] > 0) {
        if (!month_accounts[month][user_id]) {
          month_accounts[month][user_id] = 1;
        } else {
          month_accounts[month][user_id] = month_accounts[month][user_id] + 1;
        }
        user_count = user_count + 1;
      } else {
        if (!month_accounts[month][user_id]) {
          month_accounts[month][user_id] = 0;
        } 
      }
    }
    tick.setDate(tick.getDate() + 1);
  }
  total_amount = 0;
  total_deduction = 0;
  for (var month_key in month_accounts) {
    month_count = new Date(month_key.substring(0 ,4), month_key.substring(4, 6), 0).getDate();
    month_amount = 0;
    month_deduction = 0;
    for (var user in month_accounts[month_key]) {
      if (month_accounts[month_key][user] == month_count) {
        month_amount = month_amount + slack_monthly_license;
      } else {
        month_amount = month_amount + slack_monthly_license;
        if (month_accounts[month_key][user] == 0) {
          month_deduction = month_deduction + slack_monthly_license;
        } else {
          month_deduction = month_deduction + parseInt(slack_monthly_license * (month_count - month_accounts[month_key][user]) / month_count);
        }
      }
    }
    console.log(" - " + month_key + " ( " + month_count + " days ) | $" + month_amount.space(5) + " -  $" + month_deduction.space(5) + " = $" + (month_amount - month_deduction).space(5).toString());
    total_amount = total_amount + month_amount;
    total_deduction = total_deduction + month_deduction;
  }
  console.log("------------------------------------------------------");
  console.log("total upfront : $" + total_amount.space(6));
  console.log("total paid    : $" + (total_amount - total_deduction).space(6));
}

if (typeof(process.argv[2]) === 'undefined') {
  console.error("⚠ need punchcar file ");
  console.log("usae : node license_count.js <punchcard file>");
  process.exit(-1);
}
var path = process.argv[2];
fs.readFile(path, (err, content) => {
  if (err) {
    console.error("Error while reading : " + path);
    console.error(err);
    process.exit(-1);
  }
  var parsed_content = parse(content)
  var activity_time = timespread(parsed_content)
  price(activity_time, parsed_content.start_date, new Date());
});