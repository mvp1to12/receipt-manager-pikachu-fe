// API Configuration
const EXTERNAL_BASE_URL = 'https://493e79668b1a.ngrok-free.app';

// const EXTERNAL_BASE_URL = 'http://34.59.255.175';

const sanitizeResponse = (data, invalidKey=null)=>{

  let resultString = "";

  // if data is list then iterate over it and return the data
  if (Array.isArray(data)) {
    for (const item of data) {
      console.log("checkpoint 3: \n\n", item);

      if (item.content?.role === "model") {
        resultString = item.content.parts?.[0]?.text;
      }
    }
  } else {
    if (data?.content?.role === "model") {
      resultString = data?.content?.parts?.[0]?.text;
    }
  }

  if (!resultString) return null;

  if (invalidKey) {
    if (resultString.includes(invalidKey)) {
      // take the first json
      // remove the context from the second occurence of ```json
      resultString = resultString.split("```json")[1].split("```")[0];
    }
  }
  return resultString;
}

const sanitizeJson = (data, invalidKey = null) => {

  const resultString = sanitizeResponse(data, invalidKey);

  try {
    const result = JSON.parse(
      resultString.replace("```json", "").replaceAll("```", "")
    );
    return result;
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return null
  }

};

// Helper function for external API calls
const externalApiCall = async (endpoint, options = {}) => {
  const url = `${EXTERNAL_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("External API call failed:", error);
    throw error;
  }
};

// Helper function to convert file or blob to base64
const fileToBase64 = (fileOrBlob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileOrBlob);
    reader.onload = () => {
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to get MIME type from file or blob
const getMimeType = (fileOrBlob) => {
  if (fileOrBlob.type) {
    return fileOrBlob.type;
  }
  // Fallback based on file extension (only for File objects)
  if (fileOrBlob.name) {
    const extension = fileOrBlob.name.split(".").pop().toLowerCase();
    const mimeTypes = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webm",
      mp4: "video/mp4",
      avi: "video/x-msvideo",
      mov: "video/quicktime",
      wmv: "video/x-ms-wmv",
      flv: "video/x-flv",
      webm: "video/webm",
      mp3: "audio/mpeg",
      wav: "audio/wav",
      ogg: "audio/ogg",
      m4a: "audio/mp4",
    };
    return mimeTypes[extension] || "application/octet-stream";
  }
  // Default fallback for blobs without type
  return "application/octet-stream";
};

// Create session for external API
const createSession = async () => {
  try {
    const response = await fetch(
      `${EXTERNAL_BASE_URL}/apps/agentic_ai/users/user/sessions`,
      {
        method: "POST",
        headers: {},
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.id; // Return the session ID
  } catch (error) {
    console.error("Session creation failed:", error);
    throw error;
  }
};

// External API call for insights/purchase information
const getInsightsFromExternalAPI = async (
  sessionId,
  query = "What all purchases I made",
  invalidKey = null
) => {
  try {
    const payload = {
      app_name: "agentic_ai",
      user_id: "user",
      session_id: sessionId,
      new_message: {
        role: "user",
        parts: [{ text: query }],
      },
      streaming: true,
    };

    const response = await fetch(`${EXTERNAL_BASE_URL}/run`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const result = sanitizeJson(data, invalidKey);

    console.log('screens data\n', result)

    return { success: true, data: result || {} };
  } catch (error) {
    console.error("External insights API call failed:", error);
    throw error;
  }
};

// External API call for media upload
const uploadMediaToExternalAPI = async (fileOrBlob, method, sessionId) => {
  try {
    const base64Data = await fileToBase64(fileOrBlob);
    const mimeType = getMimeType(fileOrBlob);

    console.log("checkpoint 1: \n\n", base64Data, "\n\n", mimeType);

    const payload = {
      app_name: "agentic_ai",
      user_id: "user",
      session_id: sessionId,
      new_message: {
        role: "user",
        parts: [
          { text: `Save it and send wallet token` },
          {
            inline_data: {
              data: base64Data,
              mime_type: mimeType,
            },
          },
        ],
      },
      streaming: true,
    };

    const response = await fetch(`${EXTERNAL_BASE_URL}/run`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const result = sanitizeJson(data);

    return { success: true, data: result || {} };

  } catch (error) {
    console.error("External API call failed:", error);
    throw error;
  }
};

// External API call for chat messages using Server-Sent Events
const sendChatMessageWithSSE = async (sessionId, message, onChunk) => {
  try {
    const payload = {
      app_name: "agentic_ai",
      user_id: "user",
      session_id: sessionId,
      new_message: {
        role: "user",
        parts: [{ text: `User Query: ${message}` }],
      },
      streaming: true,
    };

    const response = await fetch(`${EXTERNAL_BASE_URL}/run_sse`, {
      method: "POST",
      headers: {
        Accept: "text/event-stream",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6); // Remove 'data: ' prefix

            if (data === "[DONE]") {
              return; // Stream completed
            }

            try {
              const parsed = JSON.parse(data);
              if (
                parsed.content?.role === "model" &&
                parsed.content.parts?.[0]?.text
              ) {
                onChunk(parsed.content.parts[0].text);
              }
            } catch (e) {
              // Skip invalid JSON
              console.warn("Invalid JSON in SSE stream:", data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    console.error("Chat SSE API call failed:", error);
    throw error;
  }
};

// Dashboard APIs
export const dashboardAPI = {
  // Get all dashboard data in one call using external API
  getAllDashboardData: async (sessionId) => {
    if (!sessionId) {
      throw new Error("Session ID is required for dashboard data");
    }

    // Use the external API to get all dashboard data
    return getInsightsFromExternalAPI(
      sessionId,
      'Generate data for "Dashboard" screen',
      "expectedExpenseNextMonth"
    );
  },

  // Upload receipt
  uploadReceipt: async (fileOrBlob, method, sessionId) => {
    // Use the external API for media upload
    return uploadMediaToExternalAPI(fileOrBlob, method, sessionId, null);
  },
};

// Insights APIs
export const insightsAPI = {
  // Get all insights data in one call using external API
  getAllInsightsData: async (sessionId) => {
    if (!sessionId) {
      throw new Error("Session ID is required for insights data");
    }

    // Use the external API to get all insights data
    return getInsightsFromExternalAPI(
      sessionId,
      'Generate data for "Insights" screen',
      "totalMonthlyExpense"
    );
  },

  addItemToShoppingList: async (sessionId, itemName) => {
    if (!sessionId) {
      throw new Error("Session ID is required for shopping list");
    }

    try {
      const payload = {
        app_name: "agentic_ai",
        user_id: "user",
        session_id: sessionId,
        new_message: {
          role: "user",
          parts: [{ text: `ADD TO SHOPPING LIST: ${itemName}` }],
        },
        streaming: true,
      };

      const response = await fetch(`${EXTERNAL_BASE_URL}/run`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const result = sanitizeResponse(data);

      return { success: true, data: result || '' };
    } catch (error) {
      console.error("External shopping list API call failed:", error);
      throw error;
    }
  },
};

// Chat APIs
export const chatAPI = {
  // Get template queries
  getTemplateQueries: async () => {
    // Mock data for now
    return [
      "What are my recent expenses?",
      "Show me my spending patterns",
      "What subscriptions do I have?",
    ];
  },

  // Send chat message with SSE streaming
  sendMessage: async (sessionId, message, onChunk) => {
    if (!sessionId) {
      throw new Error("Session ID is required for chat messages");
    }

    if (!message?.trim()) {
      throw new Error("Message is required");
    }

    return sendChatMessageWithSSE(sessionId, message, onChunk);
  },

  // Get chat history
  getChatHistory: async (limit = 50) => {
    // Mock data for now
    return [];
  },
};

// User APIs
export const userAPI = {
  // Get user profile
  getProfile: async () => {
    // Mock data for now
    return {
      name: "User",
      email: "user@example.com",
    };
  },

  // Update user preferences
  updatePreferences: async (preferences) => {
    // Mock implementation for now
    return { success: true };
  },
};

// Export session creation function
export { createSession };

// Export all APIs
export default {
  dashboard: dashboardAPI,
  insights: insightsAPI,
  chat: chatAPI,
  user: userAPI,
  createSession,
};


