const axios = require("axios");
const {configDotenv} = require(dotenv)
configDotenv()

// Constants
const BASE_URL = process.env.BASE_URL;
const OAUTH_TOKEN = process.env.OAUTH_TOKEN; 
const GROUPS_TO_MONITOR = process.env.GROUPS_TO_MONITOR; // 


const meetupAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${OAUTH_TOKEN}`,
    "Content-Type": "application/json",
  },
});

// Function to fetch upcoming events for a specific group
async function fetchUpcomingEvents(groupId) {
  try {
    const response = await meetupAPI.get(`/${groupId}/events`);
    return response.data; // List of events
  } catch (error) {
    console.error(`Error fetching events for group ${groupId}:`, error.message);
    return [];
  }
}

// Function to send RSVP "Yes" to a specific event
async function autoRSVP(eventId) {
  try {
    const response = await meetupAPI.post(`/events/${eventId}/rsvps`, {
      response: "yes",
    });
    if (response.status === 200) {
      console.log(`Successfully RSVPed to event: ${eventId}`);
    }
  } catch (error) {
    console.error(`Error RSVPing to event ${eventId}:`, error.message);
  }
}

// Main function to monitor groups and RSVP to events
async function monitorGroupsAndRSVP() {
  for (const groupId of GROUPS_TO_MONITOR) {
    console.log(`Fetching events for group: ${groupId}`);
    const events = await fetchUpcomingEvents(groupId);

    for (const event of events) {
      if (event.rsvpable) {
        console.log(`RSVPing to event: ${event.name}`);
        await autoRSVP(event.id);
      } else {
        console.log(`Event ${event.name} is not open for RSVP`);
      }
    }
  }
}

// Run the program
(async () => {
  try {
    console.log("Starting Meetup Auto-RSVP...");
    await monitorGroupsAndRSVP();
    console.log("Meetup Auto-RSVP completed.");
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
})();
