import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import { serviceAccount } from "./modakchallenge-firebase-adminsdk-fbsvc-0bc1bf7cb4.js";
const app = express();
const port = process.env.PORT || 8080;

console.log("🚀 Starting server initialization...");

const initializeFirebase = () => {
  console.log("📱 Initializing Firebase Admin SDK...");
  try {
    console.log("🔑 Service account:", serviceAccount);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin SDK:", error);
    throw error;
  }
};

app.use(express.json());
app.use(cors());

initializeFirebase();

app.post("/notify-purchase", async (req, res) => {
  console.log("📨 Received notification request");
  try {
    console.log("📦 Request body:", JSON.stringify(req.body, null, 2));
    const { fcmToken, productTitle } = req.body;

    if (!fcmToken || !productTitle) {
      console.error("❌ Missing required fields:", { fcmToken, productTitle });
      return res.status(400).json({
        error: "Missing fields",
        details: {
          fcmToken: !fcmToken ? "Missing FCM token" : "Present",
          productTitle: !productTitle ? "Missing product title" : "Present",
        },
      });
    }

    console.log("🔍 Starting notification process...");
    console.log("🔑 FCM Token being used:", fcmToken);

    const message = {
      token: fcmToken,
      notification: {
        title: "Your order is on its way!",
        body: `We're shipping your ${productTitle} now.`,
      },
    };

    console.log("📤 Attempting to send message:", JSON.stringify(message, null, 2));

    try {
      console.log("📡 Sending notification via FCM...");
      const response = await admin.messaging().send(message);
      console.log("✅ Notification sent successfully. Response:", response);
      res.status(200).json({
        message: "Notification sent successfully",
        details: {
          productTitle,
          response,
        },
      });
    } catch (err) {
      console.error("❌ Error sending notification:", {
        error: err.message,
        code: err.code,
        details: err.details,
        stack: err.stack,
        fcmToken: fcmToken,
        productTitle: productTitle,
      });

      // Enhanced error handling
      let errorMessage = "Failed to send notification";
      let statusCode = 500;

      if (
        err.code === "messaging/invalid-registration-token" ||
        err.code === "messaging/registration-token-not-registered"
      ) {
        errorMessage = "Invalid or unregistered FCM token";
        statusCode = 400;
      } else if (err.code === "messaging/third-party-auth-error") {
        errorMessage = "Authentication error with push service";
        statusCode = 500;
      }

      res.status(statusCode).json({
        error: errorMessage,
        message: err.message,
        code: err.code,
        details: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  } catch (err) {
    console.error("❌ Unexpected error in notify-purchase endpoint:", {
      error: err.message,
      stack: err.stack,
      requestBody: req.body,
    });
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
      details: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
});

app.get("/", (req, res) => {
  console.log("🌐 Health check endpoint hit");
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
