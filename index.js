// index.ts
import express from "express";
import admin from "firebase-admin";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8080;

// Add JSON body parser middleware
app.use(express.json());
app.use(cors());
const serviceAccount = {
  type: "service_account",
  project_id: "modakchallenge",
  private_key_id: "bb2b3b5c45ef996c367cbca1ca096eba287d6910",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDDwQEp1g3ez9BO\ndxGtKNe+kyXPKIw4dVvDT3vWJN8S/2kyhBrL47iYCaynLdzerkv+LMfbtNMR+kB4\nfzJpOEgJJJBWDvnJUsW10rzyzwc7T3KWVCLpNGQKw8WxZmH1RmYYpleU+Ka6R17M\ntDfjXkBxA9mqpFksP2Eo1YZkpyQV7OJM9+a1fCNsAzpmTB5DC3kjeWHDBhkE3Jnf\nEsDZ8e7Xs7vX1SlePb4LqOFR0nV5TrCG/p5yUs3Z81VOR3JGqVhArgtnUzsTbiQm\nBJZWabwuj2KCuwt2jUAAMOffps6v+Y0SaUvoAh8ya5hCgrIWzdF1B1EibvwpN4UK\neqe174HFAgMBAAECggEAJexnxcue30oiYHkn1wShG14Vhpcj5zIxR1rIMnntL5iE\nsFEwgcyJsAa7yJ2VexyIQ2M4iuNyurphMBbwVLsfFYpcXhfDo5GiFPIRQfcCvyZK\nnD4Lj2NjeERqMc6UbrinQeJD+GvdnRwDjSPi6e0SDfMBgdIaJnzW3VrUkP5ies6U\n1G6y8Ump0xZ7XggVNc0bKpzkiatZmtIpvtWBKY+t+FLFrTQ9HjQbB2Z24VTrWeua\nQkvbwX//KGsY2s2uV4quez+AEdEPL0h7vn8NhaJnALGWs50Iznv7EJMkOZtBaAOK\n2lpnRjfXvDfmg5xuwbh7AUMJVECm8biUORHyJbxHtwKBgQD6m9MTQeU9QJpaoDOd\nQOrjRYebiRQ1a99/VDgOOG0cyRc6kl0+tE7niCyGgL/gRJJJFnP2Qc0BYZ6ucgV5\n9IidWlg5SKxN06EF0gJKGMdPim5JBaOdrDxc+nyRrHgnbEQwakl1pdBQP+zCr3xB\nt/TwX6T2EQ37XZgV7rd1DyYXFwKBgQDH9xQp68Tjg1g11FJd8nbdG9BCpCAtiDKT\nIKP0iFF280kZvqZlYyVnjmoNF6CJeW6umNXIjdeY0vqB505q8XSogzGm52mudvbD\nwZbO7Hg9lCNeuXRz4RBsscL1fjWUQWFyMWY0EI0BugQbdYxA7HzcVItI7OeET7Xb\nP/jOlrp3gwKBgGl6rJyuX44oYs9CHndRm4uM+Ea+q4LQpIEzMWTK2yICgYRlllmO\nCqfo6NSz3A7Izcl1adl8WIz8SY2i8CskgVu5auixbdRT/rI0ckI9q6YO3dxeQz9Z\n/w4jX8rwjKILL6gxFDowUD12qnBG7EW855tEpmnrQ7dI7XpNv2nFtoKBAoGAOiu1\ncPCGaU0XRymKAIx9aZsivZAzUCuT0tsm9wcE896YQGYGz+3EvtheH4rlB7kMqrwJ\nTPt+YZXWjB224UN2lWL8+bnOM5Ol+5KAhZei7v7+PxsiNmeduJEJzxK1EXjnmSmn\nurOp4Xu0oCxU7boeJJZvonpQa1wo4iw8/BQ7EHMCgYBhXllVm6Uc3W4w0sQMc2vS\nN+ROgpSYhANdvoKgXistQ967sGyaLMBQUus85ZBwLRXQsI6cKVwv9OW41DXarm1I\n9zAEf5mR7dDOlT7BE8YdzbYnuZYMhT5JJnv5PANpuqO/YVeCO5vUb7P/MDb/6ufK\nY5Bcx30fIc5fClWlQYlCJA==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@modakchallenge.iam.gserviceaccount.com",
  client_id: "118111403094431227149",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40modakchallenge.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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

    setTimeout(async () => {
      try {
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

        const response = await admin.messaging().send(message);
        console.log("✅ Notification sent successfully. Response:", response);
      } catch (err) {
        console.error("❌ Detailed error sending notification:", {
          error: err.message,
          code: err.code,
          details: err.details,
          stack: err.stack,
          fcmToken: fcmToken,
          productTitle: productTitle,
        });
      }
    }, 10000);

    console.log("Notification scheduled");
    res.status(200).json({
      message: "Notification scheduled",
      details: {
        scheduledTime: new Date(Date.now() + 10000).toISOString(),
        productTitle,
      },
    });
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
