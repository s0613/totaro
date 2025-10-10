// HubSpot CRM Integration Utilities

interface ContactData {
  name: string;
  email: string;
  company: string;
  country?: string;
  interest: string[];
  message: string;
}

interface HubSpotContact {
  properties: {
    email: string;
    firstname: string;
    lastname: string;
    company: string;
    country?: string;
    message: string;
    interest: string;
  };
}

/**
 * Create or update a contact in HubSpot
 */
export async function createHubSpotContact(data: ContactData) {
  const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;

  if (!HUBSPOT_API_KEY) {
    console.warn("[HubSpot] API key not configured, skipping CRM sync");
    return { success: false, message: "HubSpot not configured" };
  }

  try {
    // Split name into first and last name
    const nameParts = data.name.trim().split(" ");
    const firstname = nameParts[0] || data.name;
    const lastname = nameParts.slice(1).join(" ") || "";

    // Prepare HubSpot contact payload
    const hubspotContact: HubSpotContact = {
      properties: {
        email: data.email,
        firstname,
        lastname,
        company: data.company,
        message: data.message,
        interest: data.interest.join(", "),
      },
    };

    // Add country if provided
    if (data.country) {
      hubspotContact.properties.country = data.country;
    }

    // Create or update contact in HubSpot
    const response = await fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HUBSPOT_API_KEY}`,
        },
        body: JSON.stringify(hubspotContact),
      }
    );

    if (!response.ok) {
      // If contact already exists (409), update instead
      if (response.status === 409) {
        console.log("[HubSpot] Contact exists, attempting update");
        return await updateHubSpotContact(data);
      }

      const error = await response.text();
      console.error("[HubSpot] Create contact failed:", error);
      return { success: false, message: "Failed to create contact" };
    }

    const result = await response.json();
    console.log("[HubSpot] Contact created:", result.id);

    return { success: true, contactId: result.id };
  } catch (error) {
    console.error("[HubSpot] Error:", error);
    return { success: false, message: "HubSpot API error" };
  }
}

/**
 * Update an existing contact in HubSpot
 */
async function updateHubSpotContact(data: ContactData) {
  const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;

  if (!HUBSPOT_API_KEY) {
    return { success: false, message: "HubSpot not configured" };
  }

  try {
    // First, search for contact by email
    const searchResponse = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HUBSPOT_API_KEY}`,
        },
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "email",
                  operator: "EQ",
                  value: data.email,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!searchResponse.ok) {
      console.error("[HubSpot] Search failed");
      return { success: false, message: "Failed to find contact" };
    }

    const searchResult = await searchResponse.json();

    if (searchResult.total === 0) {
      console.log("[HubSpot] Contact not found, creating new");
      return await createHubSpotContact(data);
    }

    const contactId = searchResult.results[0].id;

    // Update contact
    const nameParts = data.name.trim().split(" ");
    const firstname = nameParts[0] || data.name;
    const lastname = nameParts.slice(1).join(" ") || "";

    const updateResponse = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HUBSPOT_API_KEY}`,
        },
        body: JSON.stringify({
          properties: {
            firstname,
            lastname,
            company: data.company,
            country: data.country || "",
            message: data.message,
            interest: data.interest.join(", "),
          },
        }),
      }
    );

    if (!updateResponse.ok) {
      const error = await updateResponse.text();
      console.error("[HubSpot] Update contact failed:", error);
      return { success: false, message: "Failed to update contact" };
    }

    const result = await updateResponse.json();
    console.log("[HubSpot] Contact updated:", contactId);

    return { success: true, contactId };
  } catch (error) {
    console.error("[HubSpot] Update error:", error);
    return { success: false, message: "HubSpot API error" };
  }
}

/**
 * Send email notification via HubSpot (optional)
 */
export async function sendHubSpotEmail(to: string, subject: string, body: string) {
  const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;

  if (!HUBSPOT_API_KEY) {
    console.warn("[HubSpot] Email not configured");
    return { success: false };
  }

  try {
    // TODO: Implement HubSpot email API
    // This requires HubSpot email template setup
    console.log("[HubSpot] Email notification:", { to, subject });

    return { success: true };
  } catch (error) {
    console.error("[HubSpot] Email error:", error);
    return { success: false };
  }
}
