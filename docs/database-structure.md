# HoneyNotes Database Structure

This document describes the Firestore database structure for the HoneyNotes application.

## Collections

### `/letters/{letterId}`

Main collection for all letters sent between users.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `senderId` | string | ✅ | UID of the user who sent the letter |
| `recipientId` | string | ✅ | UID of the recipient (can be same as sender for self-letters) |
| `title` | string \| null | ❌ | Optional title for the letter |
| `content` | string | ✅ | The letter content (must not be empty) |
| `config` | object | ✅ | Letter customization settings (see below) |
| `config.paperColor` | string | ✅ | Paper color ID (e.g., 'cream', 'pink', 'sunset') |
| `config.stamp` | string | ✅ | Stamp ID (e.g., 'heart', 'bee', 'crown-emoji') |
| `config.font` | string | ✅ | Font ID (e.g., 'Indie_Flower', 'Dancing_Script') |
| `config.borderStyle` | string | ✅ | Border style ID (e.g., 'simple', 'floral', 'gold') |
| `createdAt` | timestamp | ✅ | Server timestamp when created |
| `status` | string | ✅ | Letter status: 'draft' \| 'sent' \| 'opened' |
| `isRead` | boolean | ✅ | Whether recipient has opened the letter |
| `senderName` | string | ✅ | Display name of sender (customizable) |
| `recipientName` | string | ✅ | Display name of recipient (customizable) |

**Security Rules:**
- Create: Only authenticated users, must be the sender
- Read: Only sender or recipient
- Update: Only recipient (to mark as read)
- Delete: Only sender

---

### `/users/{userId}`

User profiles with partner linking information.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Same as document ID (user UID) |
| `displayName` | string | ✅ | User's display name |
| `email` | string | ❌ | User's email |
| `photoURL` | string | ❌ | Profile photo URL |
| `partnerCode` | string | ❌ | 6-character code for partner linking |
| `partnerId` | string | ❌ | UID of linked partner |
| `partnerName` | string | ❌ | Display name of linked partner |
| `partnerUnlinkedAt` | timestamp | ❌ | When partner unlinked (for notifications) |
| `createdAt` | timestamp | ✅ | When profile was created |
| `updatedAt` | timestamp | ✅ | Last update timestamp |

**Security Rules:**
- Read: Any authenticated user (needed for partner linking)
- Write: Owner only, OR partner unlinking/linking operations

---

### `/partnerCodes/{code}`

Partner invitation codes for linking.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | string | ✅ | UID of the user who owns this code |
| `createdAt` | timestamp | ✅ | When code was created |

**Security Rules:**
- Read: Any authenticated user
- Create: Authenticated users (must be the owner)
- Delete: Only the owner
- Update: Not allowed

---

### `/userEconomy/{userId}`

User's currency, inventory, and progression.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `polen` | number | ✅ | Free currency amount |
| `jaleaReal` | number | ✅ | Premium currency amount |
| `inventory` | object | ✅ | Owned items (see below) |
| `inventory.paperColors` | array | ✅ | Array of owned paper color IDs |
| `inventory.stamps` | array | ✅ | Array of owned stamp IDs |
| `inventory.borderStyles` | array | ✅ | Array of owned border style IDs |
| `inventory.fonts` | array | ✅ | Array of owned font IDs |
| `inventory.special` | array | ✅ | Array of special item IDs |
| `adsWatchedToday` | number | ✅ | Number of ads watched today |
| `lastAdWatchDate` | string | ❌ | ISO date of last ad watch |
| `loginStreak` | number | ✅ | Consecutive login days |
| `lastLoginDate` | string | ❌ | ISO date of last login |
| `totalLettersSent` | number | ✅ | Total letters sent (for tasks) |
| `totalLettersRead` | number | ✅ | Total letters read (for tasks) |
| `createdAt` | timestamp | ✅ | When created |
| `updatedAt` | timestamp | ✅ | Last update |

**Default Inventory:**
```javascript
{
  paperColors: ['cream', 'pink', 'honey'],
  stamps: ['heart', 'bee', 'wax-seal'],
  borderStyles: ['simple'],
  fonts: ['Indie_Flower', 'Belleza'],
  special: []
}
```

**Security Rules:**
- Read/Write: Owner only

---

### `/userTasks/{userId}`

User's weekly task progress.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `weekStartDate` | string | ✅ | ISO date of week start (Monday) |
| `tasks` | array | ✅ | Array of task progress objects |
| `tasks[].taskId` | string | ✅ | Task ID |
| `tasks[].progress` | number | ✅ | Current progress |
| `tasks[].completed` | boolean | ✅ | Whether task is completed |
| `tasks[].claimed` | boolean | ✅ | Whether reward was claimed |
| `lastUpdated` | timestamp | ✅ | Last update timestamp |

**Security Rules:**
- Read/Write: Owner only

---

### `/promoCodes/{codeId}`

Promotional codes for rewards.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `polen` | number | ✅ | Polen reward amount |
| `jaleaReal` | number | ✅ | Jalea Real reward amount |
| `maxUses` | number | ❌ | Maximum uses (null = unlimited) |
| `usedCount` | number | ✅ | Current use count |
| `usedBy` | array | ✅ | Array of user UIDs who used this code |
| `expiresAt` | timestamp | ❌ | Expiration date |
| `createdAt` | timestamp | ✅ | When created |
| `isActive` | boolean | ✅ | Whether code is active |

**Security Rules:**
- Read: Any authenticated user
- Update: Authenticated users (to add themselves to usedBy)
- Create/Delete: Admin only (via Firebase Console)

---

## Valid Values Reference

### Paper Colors
- **Free:** `cream`, `pink`, `honey`
- **Polen:** `lavender`, `mint`, `light-pink`, `crimson`, `peach`, `sky`, `rose`
- **Premium:** `sunset`, `ocean`, `aurora`, `rose-gold`, `champagne`, `moonlight`, `cherry-blossom`

### Stamps
- **Free:** `heart`, `bee`, `wax-seal`
- **Polen:** `rose-emoji`, `star-emoji`, `butterfly-emoji`, `flower-emoji`, `rainbow-emoji`, `kiss-emoji`, `sparkle-emoji`, `sun-emoji`, `fire-emoji`, `cupid-emoji`, `infinity-emoji`, `ring-emoji`
- **Premium:** `moon-emoji`, `crown-emoji`, `diamond-emoji`, `angel-emoji`, `dove-emoji`, `teddy-emoji`, `lovebirds-emoji`, `shooting-star-emoji`

### Fonts
- **Free:** `Indie_Flower`, `Belleza`
- **Polen:** `Caveat`, `Amatic_SC`, `Shadows_Into_Light`, `Patrick_Hand`, `Architects_Daughter`, `Dancing_Script`, `Pacifico`, `Permanent_Marker`, `Sacramento`, `Satisfy`, `Cookie`, `Courgette`, `Lobster`
- **Premium:** `Great_Vibes`, `Kalam`, `Allura`, `Tangerine`, `Alex_Brush`, `Mr_Dafoe`

### Border Styles
- **Free:** `simple`
- **Polen:** `dashed`, `airmail`, `hearts`, `stars`, `waves`, `ribbon`
- **Premium (Animated):** `floral`, `vintage`, `ornate`, `gold`, `lace`

---

## Indexes

The following Firestore indexes are required:

```json
{
  "indexes": [
    {
      "collectionGroup": "letters",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "recipientId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "letters",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "senderId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```
