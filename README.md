# Meetup Auto RSVP

This project automates the process of RSVPing to events on Meetup for specific groups. It fetches upcoming events for the groups and sends a "Yes" RSVP if the event allows it.

## Features
- Fetch upcoming events from specified Meetup groups.
- Automatically RSVP to events that allow RSVPs.
- Simple command-line tool that can be run on a schedule (e.g., with cron).

## Prerequisites
1. **Node.js** (version 12 or higher)
2. **Meetup API OAuth Token** - You must generate an OAuth token to authenticate requests to the Meetup API. This token is required to interact with the API securely.

## Setup and Installation

### Step 1: Clone the Repository
Clone this repository to your local machine:
```bash
git clone https://github.com/Ni1esh-Yadav/meetup-auto-rsvp.git
cd meetup-auto-rsvp
```

### Step 2: Install Dependencies
Install the required dependencies using `npm`:
```bash
npm install
```
```bash
npm install axios dotenv
```

### Step 3: Create a `.env` File
Create a `.env` file in the root directory of the project to store sensitive information securely. You can use the following template:

```plaintext
const BASE_URL = ""; // Api of meetup.com
const OAUTH_TOKEN = ""; // Replace with your OAuth token
const GROUPS_TO_MONITOR = [""]; // Replace with your group IDs
```

- **BASE_URL**: The base URL of the Meetup API 
- **OAUTH_TOKEN**: Your OAuth token for authenticating API requests.
- **GROUPS_TO_MONITOR**: A comma-separated list of group IDs that you want to monitor for events.


### Step 4: Running the Program
Once you've set up your `.env` file, you can run the program using the following command:
```bash
node meetup-auto-rsvp.js
```

### Step 5: Automate the Process (Optional)
Make the file executable:
```bash
chmod +x meetup-auto-rsvp.js
```
1. Automate with Cron
Open the crontab editor:
```bash
crontab -e
```

2. Add the following line to run the script every hour:
```bash
0 * * * * /path/to/node /path/to/meetup-auto-rsvp/meetup-auto-rsvp.js
```

3. Replace /path/to/node with the path to your Node.js binary and /path/to/meetup-auto-rsvp.js with the path to your script.

4. Save and exit the editor.

## How the Code Works
1. **Fetching Upcoming Events**: 
   - The code fetches events for the specified groups by calling the Meetup API using the `GET /{groupId}/events` endpoint.
   - The events are then checked to see if they are RSVPable.
   
2. **RSVPing to Events**:
   - If the event allows RSVP, the code sends a "Yes" RSVP via the `POST /events/{eventId}/rsvps` endpoint.

3. **Main Flow**:
   - The program loops through each group in `GROUPS_TO_MONITOR`, fetching and RSVPing to events as necessary.

## Error Handling
- If an error occurs while fetching events or RSVPing, the error is logged to the console, but the program continues to run for other groups and events.

