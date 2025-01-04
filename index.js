const { ApifyClient } = require("apify-client");
const {
  ToadScheduler,
  SimpleIntervalJob,
  Task,
  AsyncTask,
} = require("toad-scheduler");
const moment = require("moment");
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
  console.log(time(), " - Fetching from actor ");
  // Run the Actor and wait for it to finish
  return client
    .actor("KoJrdxJCTtpon81KY")
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
          scheduler.stopById(jobId);
          console.log(time(), " - Taking a break");

          // sleep 20 minutes and restart job
          setTimeout(() => {
            console.log(time(), " - Restart");
            scheduler.startById(jobId);
          }, 2 * 60 * 1000);
        } else {
          console.log(time(), " - No new post");
        }
        latest_post = item;
      });
    });
}

const task = new AsyncTask("Getting latest post", getData);
const job = new SimpleIntervalJob({ seconds: 30, runImmediately: true }, task, {
  id: jobId,
  preventOverrun: true,
});

scheduler.addSimpleIntervalJob(job);

// when stopping your app
// scheduler.stop();
