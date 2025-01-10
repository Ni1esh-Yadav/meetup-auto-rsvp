#!/usr/bin/env node

const axios = require("axios");

// Constants
const BASE_URL = "https://api.meetup.com/gql";
const OAUTH_TOKEN = "your-oauth-token-here"; // Replace with your OAuth token
const GROUPS_TO_MONITOR = ["group1-id", "group2-id"]; // Replace with your group IDs

// Function to fetch upcoming events for a specific group
async function fetchUpcomingEvents(groupId) {
  const query = `
    query($urlname: String!) {
      groupByUrlname(urlname: $urlname) {
        upcomingEvents(first: 5) {
          edges {
            node {
              id
              title
              isRsvpable
            }
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      BASE_URL,
      {
        query,
        variables: { urlname: groupId },
      },
      {
        headers: {
          Authorization: `Bearer ${OAUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const events = response.data.data.groupByUrlname.upcomingEvents.edges.map(
      (edge) => edge.node
    );

    return events;
  } catch (error) {
    console.error(`Error fetching events for group ${groupId}:`, error.message);
    return [];
  }
}

// Function to send RSVP "Yes" to a specific event
async function autoRSVP(eventId) {
  const mutation = `
    mutation($eventId: ID!) {
      rsvp(eventId: $eventId, response: YES) {
        result
      }
    }
  `;

  try {
    const response = await axios.post(
      BASE_URL,
      {
        query: mutation,
        variables: { eventId },
      },
      {
        headers: {
          Authorization: `Bearer ${OAUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.data.rsvp.result === "SUCCESS") {
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
      if (event.isRsvpable) {
        console.log(`RSVPing to event: ${event.title}`);
        await autoRSVP(event.id);
      } else {
        console.log(`Event ${event.title} is not open for RSVP`);
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
