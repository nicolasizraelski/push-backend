// index.ts
import express from "express";
import admin from "firebase-admin";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8080;

// Add JSON body parser middleware
app.use(express.json());
app.use(cors());

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDpIqJOPVcWTSMo4v8Ew8pnKgy-qax5VpY",
  authDomain: "modakchallenge.firebaseapp.com",
  projectId: "modakchallenge",
  storageBucket: "modakchallenge.firebasestorage.app",
  messagingSenderId: "1010475356071",
  appId: "1:1010475356071:web:3e8477fa7d5a6a1e47b082",
};

initializeApp(firebaseConfig);

app.post("/notify-purchase", async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { fcmToken, productTitle } = req.body;

    if (!fcmToken || !productTitle) {
      console.error("Missing required fields:", { fcmToken, productTitle });
      return res.status(400).json({
        error: "Missing fields",
        details: {
          fcmToken: !fcmToken ? "Missing FCM token" : "Present",
          productTitle: !productTitle ? "Missing product title" : "Present",
        },
      });
    }

    console.log("Starting notification process...");
    console.log("FCM Token being used:", fcmToken);

    const message = {
      token: fcmToken,
      notification: {
        title: "Your order is on its way!",
        body: `We're shipping your ${productTitle} now.`,
      },
    };

    console.log("Attempting to send message:", JSON.stringify(message, null, 2));

    try {
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
      res.status(500).json({
        error: "Failed to send notification",
        message: err.message,
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
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
