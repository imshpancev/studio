import * as admin from 'firebase-admin';

// Эта переменная окружения должна содержать полный JSON сервисного аккаунта Google (одной строкой)
const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

if (!serviceAccountJson) {
  throw new Error(
    'Не найдена переменная окружения GOOGLE_APPLICATION_CREDENTIALS_JSON с ключом сервисного аккаунта Google!'
  );
}

const serviceAccount = JSON.parse(serviceAccountJson);

// Защита от повторной инициализации в средах с hot-reload (например, Next.js)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminDb = admin.firestore();
