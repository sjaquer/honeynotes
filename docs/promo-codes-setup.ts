/**
 * Script para crear códigos promocionales en Firestore
 * 
 * Para ejecutar este script:
 * 1. Ve a la consola de Firebase: https://console.firebase.google.com
 * 2. Selecciona tu proyecto HoneyNotes
 * 3. Ve a Firestore Database
 * 4. Crea una colección llamada "promoCodes"
 * 5. Agrega los siguientes documentos:
 * 
 * ========================================
 * DOCUMENTO 1: codedev2026
 * ========================================
 * ID del documento: codedev2026
 * Campos:
 * - id: "codedev2026" (string)
 * - polen: 99999 (number)
 * - jaleaReal: 99999 (number)
 * - maxUses: null (o dejarlo vacío)
 * - usedCount: 0 (number)
 * - usedBy: [] (array vacío)
 * - isActive: true (boolean)
 * - createdAt: (timestamp - usar la fecha actual)
 * 
 * ========================================
 * DOCUMENTO 2: infamous
 * ========================================
 * ID del documento: infamous
 * Campos:
 * - id: "infamous" (string)
 * - polen: 0 (number)
 * - jaleaReal: 100 (number)
 * - maxUses: null (o dejarlo vacío)
 * - usedCount: 0 (number)
 * - usedBy: [] (array vacío)
 * - isActive: true (boolean)
 * - createdAt: (timestamp - usar la fecha actual)
 * 
 * ========================================
 * DOCUMENTO 3: freegift
 * ========================================
 * ID del documento: freegift
 * Campos:
 * - id: "freegift" (string)
 * - polen: 400 (number)
 * - jaleaReal: 0 (number)
 * - maxUses: null (o dejarlo vacío)
 * - usedCount: 0 (number)
 * - usedBy: [] (array vacío)
 * - isActive: true (boolean)
 * - createdAt: (timestamp - usar la fecha actual)
 * 
 * ========================================
 * 
 * NOTAS:
 * - Los IDs de documento deben estar en MINÚSCULAS
 * - El código ingresado por el usuario se normaliza a minúsculas
 * - Para desactivar un código, cambia isActive a false
 * - Para limitar usos, establece maxUses a un número
 * - usedBy se llena automáticamente con los UIDs de usuarios que usaron el código
 */

// Si quieres ejecutar esto programáticamente con Node.js y el Admin SDK:
/*
const admin = require('firebase-admin');
const serviceAccount = require('./path-to-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const promoCodes = [
  {
    id: 'codedev2026',
    polen: 99999,
    jaleaReal: 99999,
    maxUses: null,
    usedCount: 0,
    usedBy: [],
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: 'infamous',
    polen: 0,
    jaleaReal: 100,
    maxUses: null,
    usedCount: 0,
    usedBy: [],
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: 'freegift',
    polen: 400,
    jaleaReal: 0,
    maxUses: null,
    usedCount: 0,
    usedBy: [],
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

async function createPromoCodes() {
  for (const code of promoCodes) {
    await db.collection('promoCodes').doc(code.id).set(code);
    console.log(`Created promo code: ${code.id}`);
  }
  console.log('All promo codes created!');
}

createPromoCodes();
*/
