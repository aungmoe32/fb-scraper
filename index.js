const { ApifyClient } = require("apify-client");
const {
  ToadScheduler,
  SimpleIntervalJob,
  Task,
  AsyncTask,
} = require("toad-scheduler");
const moment = require("moment");
const { send } = require("./slack");
require("dotenv").config();

// Initialize the ApifyClient with API token
const client = new ApifyClient({
  token: process.env.APIFY_API_KEY,
});

// Prepare Actor input
const input = {
  startUrls: [
    {
      url: process.env.PAGE_URL,
    },
  ],
  resultsLimit: 1,
};

function time() {
  return moment().format("MMMM Do YYYY, h:mm:ss a");
}

const scheduler = new ToadScheduler();
let latest_post = null;
const jobId = "latest_post";
function getData() {
  console.log(time(), " - Fetching from Apify ");
  // Run the Actor and wait for it to finish
  return client
    .actor(process.env.ACTOR_ID)
    .call(input)
    .then((run) => {
      // Fetch and print Actor results from the run's dataset (if any)
      // console.log("Results from dataset ");
      return client.dataset(run.defaultDatasetId).listItems();
    })
    .then(({ items }) => {
      items.forEach((item) => {
        // console.log(item.text);
        if (latest_post && latest_post.postId != item.postId) {
          // New post uploaded
          console.log(time(), " - New post : ", item.postId);

          // sending Slack message
          send(
            `Post ID : ${item.postId} \n` + item.text.substring(0, 50) + " ..."
          );
          console.log("Sending message to Slack");

          // stopping job
          scheduler.stopById(jobId);
          console.log(time(), " - Taking a break");

          // sleep * minutes and restart job
          const sleep = process.env.SLEEP_AFTER_NEWPOST * 60 * 1000;
          setTimeout(() => {
            console.log(time(), " - Restart");
            scheduler.startById(jobId);
          }, sleep);
        } else {
          console.log(time(), " - No new post");
        }
        latest_post = item;
      });
    });
}

// Creating a job
const task = new AsyncTask("Getting latest post", getData);
const job = new SimpleIntervalJob(
  { seconds: process.env.FETCH_INTERVAL * 60, runImmediately: true },
  task,
  {
    id: jobId,
    preventOverrun: true,
  }
);

scheduler.addSimpleIntervalJob(job);

// when stopping your app
// scheduler.stop();
