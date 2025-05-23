require("dotenv").config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY;
const privateKeyId = process.env.PRIVATE_KEY_ID;
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.CLIENT_EMAIL;
const clientId = process.env.CLIENT_ID;

export const serviceAccount = {
  type: "service_account",
  project_id: projectId,
  private_key_id: privateKeyId,
  private_key: privateKey.replace(/\\n/g, "\n"),
  client_email: clientEmail,
  client_id: clientId,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40modakchallenge.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};
