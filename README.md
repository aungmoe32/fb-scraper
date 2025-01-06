# Facebook Page Post Scraper

This tool scrapes posts from a Facebook page and checks for new posts at regular intervals. When a new post is detected, it sends a notification to a Slack channel.

## Technologies Used

- **Apify**: For scraping Facebook page posts.
- **Slack**: For sending notifications to a Slack channel.
- **Express**: Lightweight framework for handling requests.
- **Toad Scheduler**: For scheduling tasks.
- **Cron Jobs**: To run scheduled tasks.
- **Docker**: For containerization.
- **Render**: For hosting the application.

## Installation Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/aungmoe32/fb-scraper.git
   cd fb-scraper
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

4. Open the `.env` file and enter the required values (such as your Facebook page and Slack credentials).

5. Start the application:
   ```bash
   node index.js
   ```

## Hosting

The app is hosted on **Render**, but you can also deploy it using Docker or any hosting service of your choice.
