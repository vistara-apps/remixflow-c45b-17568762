# RemixFlow API Documentation

This document provides comprehensive documentation for the RemixFlow API, which enables developers to integrate with the RemixFlow platform for audio and video remixing with fair creator royalties.

## Base URL

```
https://remixflow.app/api
```

## Authentication

All API requests require authentication using a JWT token. To obtain a token, users must connect their wallet and sign a message.

Include the token in the `Authorization` header of your requests:

```
Authorization: Bearer <token>
```

## Rate Limiting

The API is rate-limited to 100 requests per hour per IP address. Rate limit information is included in the response headers:

- `X-RateLimit-Limit`: Maximum number of requests allowed in the current time window
- `X-RateLimit-Remaining`: Number of requests remaining in the current time window
- `X-RateLimit-Reset`: Unix timestamp when the rate limit window resets

## Error Handling

The API returns standard HTTP status codes to indicate success or failure:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

Error responses include a JSON object with an `error` field containing a human-readable error message:

```json
{
  "error": "Invalid request parameters"
}
```

## API Endpoints

### User Management

#### Get User

```
GET /api/users/:userId
```

Retrieves a user by ID.

**Response**

```json
{
  "userId": "0x1234...",
  "walletAddress": "0x1234...",
  "displayName": "Creator123",
  "profileImage": "ipfs://...",
  "bio": "Audio remix artist",
  "createdAt": 1632150985000,
  "updatedAt": 1632150985000,
  "socialLinks": {
    "twitter": "creator123",
    "instagram": "creator123",
    "website": "https://creator123.com"
  }
}
```

#### Create User

```
POST /api/users
```

Creates a new user.

**Request Body**

```json
{
  "walletAddress": "0x1234...",
  "displayName": "Creator123",
  "profileImage": "ipfs://...",
  "bio": "Audio remix artist",
  "email": "creator@example.com",
  "socialLinks": {
    "twitter": "creator123",
    "instagram": "creator123",
    "website": "https://creator123.com"
  }
}
```

**Response**

```json
{
  "userId": "0x1234...",
  "walletAddress": "0x1234...",
  "displayName": "Creator123",
  "profileImage": "ipfs://...",
  "bio": "Audio remix artist",
  "createdAt": 1632150985000,
  "updatedAt": 1632150985000,
  "socialLinks": {
    "twitter": "creator123",
    "instagram": "creator123",
    "website": "https://creator123.com"
  }
}
```

#### Update User

```
PUT /api/users/:userId
```

Updates an existing user.

**Request Body**

```json
{
  "displayName": "NewCreatorName",
  "bio": "Updated bio",
  "socialLinks": {
    "twitter": "newcreator",
    "instagram": "newcreator",
    "website": "https://newcreator.com"
  }
}
```

**Response**

```json
{
  "userId": "0x1234...",
  "walletAddress": "0x1234...",
  "displayName": "NewCreatorName",
  "profileImage": "ipfs://...",
  "bio": "Updated bio",
  "createdAt": 1632150985000,
  "updatedAt": 1632150985000,
  "socialLinks": {
    "twitter": "newcreator",
    "instagram": "newcreator",
    "website": "https://newcreator.com"
  }
}
```

### Content Management

#### Get Content

```
GET /api/content/:contentId
```

Retrieves content by ID.

**Response**

```json
{
  "contentId": "content:1632150985000",
  "ipfsHash": "QmX...",
  "ownerAddress": "0x1234...",
  "title": "Original Audio",
  "description": "Original audio file for remixing",
  "royaltyPercentage": 50,
  "contentType": "audio/mp3",
  "createdAt": 1632150985000,
  "updatedAt": 1632150985000,
  "tags": ["music", "original"],
  "metadata": {
    "duration": 180,
    "bitrate": 320
  }
}
```

#### Create Content

```
POST /api/content
```

Creates new content. This endpoint accepts `multipart/form-data` to upload a file.

**Request Body**

```
file: <file>
ownerAddress: "0x1234..."
title: "Original Audio"
description: "Original audio file for remixing"
royaltyPercentage: 50
tags: ["music", "original"]
metadata: { "duration": 180, "bitrate": 320 }
```

**Response**

```json
{
  "contentId": "content:1632150985000",
  "ipfsHash": "QmX...",
  "ownerAddress": "0x1234...",
  "title": "Original Audio",
  "description": "Original audio file for remixing",
  "royaltyPercentage": 50,
  "contentType": "audio/mp3",
  "createdAt": 1632150985000,
  "updatedAt": 1632150985000,
  "tags": ["music", "original"],
  "metadata": {
    "duration": 180,
    "bitrate": 320
  }
}
```

#### Update Content

```
PUT /api/content/:contentId
```

Updates existing content.

**Request Body**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "royaltyPercentage": 60,
  "tags": ["music", "original", "updated"]
}
```

**Response**

```json
{
  "contentId": "content:1632150985000",
  "ipfsHash": "QmX...",
  "ownerAddress": "0x1234...",
  "title": "Updated Title",
  "description": "Updated description",
  "royaltyPercentage": 60,
  "contentType": "audio/mp3",
  "createdAt": 1632150985000,
  "updatedAt": 1632150985000,
  "tags": ["music", "original", "updated"],
  "metadata": {
    "duration": 180,
    "bitrate": 320
  }
}
```

### Remix Management

#### Get Remix

```
GET /api/remixes/:remixId
```

Retrieves a remix by ID.

**Response**

```json
{
  "remixId": "remix:1632150985000",
  "originalContentId": "content:1632150985000",
  "creatorAddress": "0x1234...",
  "ipfsHash": "QmY...",
  "originalIpfsHash": "QmX...",
  "title": "Dubbing Remix",
  "description": "Dubbed version of the original audio",
  "transformation": "dubbing",
  "transformationParams": {
    "language": "es"
  },
  "contentType": "audio/mp3",
  "creationTimestamp": 1632150985000,
  "onchainTxHash": "0xabc...",
  "royaltyDistributionTxHash": "0xdef...",
  "tokenId": 123,
  "plays": 0,
  "likes": 0,
  "shares": 0,
  "earnings": 0,
  "tags": ["remix", "dubbing", "spanish"],
  "metadata": {
    "duration": 180,
    "bitrate": 320
  }
}
```

#### Create Remix

```
POST /api/remixes
```

Creates a new remix. This endpoint accepts `multipart/form-data` to upload a file.

**Request Body**

```
file: <file>
type: "audio"
transformation: "dubbing"
transformationParams: { "language": "es" }
originalContentId: "content:1632150985000"
creatorAddress: "0x1234..."
title: "Dubbing Remix"
description: "Dubbed version of the original audio"
royaltySplits: [{ "recipient": "0x5678...", "percentage": 30 }]
tags: ["remix", "dubbing", "spanish"]
metadata: { "duration": 180, "bitrate": 320 }
```

**Response**

```json
{
  "remixId": "remix:1632150985000",
  "originalContentId": "content:1632150985000",
  "creatorAddress": "0x1234...",
  "ipfsHash": "QmY...",
  "originalIpfsHash": "QmX...",
  "title": "Dubbing Remix",
  "description": "Dubbed version of the original audio",
  "transformation": "dubbing",
  "transformationParams": {
    "language": "es"
  },
  "contentType": "audio/mp3",
  "creationTimestamp": 1632150985000,
  "onchainTxHash": "0xabc...",
  "royaltyDistributionTxHash": "0xdef...",
  "tokenId": 123,
  "plays": 0,
  "likes": 0,
  "shares": 0,
  "earnings": 0,
  "tags": ["remix", "dubbing", "spanish"],
  "metadata": {
    "duration": 180,
    "bitrate": 320
  }
}
```

#### Update Remix

```
PUT /api/remixes/:remixId
```

Updates an existing remix.

**Request Body**

```json
{
  "title": "Updated Remix Title",
  "description": "Updated description",
  "tags": ["remix", "dubbing", "spanish", "updated"]
}
```

**Response**

```json
{
  "remixId": "remix:1632150985000",
  "originalContentId": "content:1632150985000",
  "creatorAddress": "0x1234...",
  "ipfsHash": "QmY...",
  "originalIpfsHash": "QmX...",
  "title": "Updated Remix Title",
  "description": "Updated description",
  "transformation": "dubbing",
  "transformationParams": {
    "language": "es"
  },
  "contentType": "audio/mp3",
  "creationTimestamp": 1632150985000,
  "onchainTxHash": "0xabc...",
  "royaltyDistributionTxHash": "0xdef...",
  "tokenId": 123,
  "plays": 0,
  "likes": 0,
  "shares": 0,
  "earnings": 0,
  "tags": ["remix", "dubbing", "spanish", "updated"],
  "metadata": {
    "duration": 180,
    "bitrate": 320
  }
}
```

### Royalty Management

#### Get Royalty Information

```
GET /api/royalties/:remixId
```

Retrieves royalty information for a remix.

**Response**

```json
{
  "splits": [
    {
      "splitId": "split:remix:1632150985000:0x5678...",
      "remixId": "remix:1632150985000",
      "recipientAddress": "0x5678...",
      "percentage": 30,
      "amountPaid": 0.1,
      "createdAt": 1632150985000,
      "lastPaidAt": 1632150985000,
      "transactions": [
        {
          "txHash": "0xghi...",
          "amount": 0.1,
          "timestamp": 1632150985000
        }
      ]
    },
    {
      "splitId": "split:remix:1632150985000:0x1234...",
      "remixId": "remix:1632150985000",
      "recipientAddress": "0x1234...",
      "percentage": 70,
      "amountPaid": 0.2,
      "createdAt": 1632150985000,
      "lastPaidAt": 1632150985000,
      "transactions": [
        {
          "txHash": "0xghi...",
          "amount": 0.2,
          "timestamp": 1632150985000
        }
      ]
    }
  ],
  "totalPaid": 0.3,
  "lastDistribution": 1632150985000
}
```

#### Distribute Royalties

```
POST /api/royalties/distribute
```

Distributes royalties for a remix.

**Request Body**

```json
{
  "remixId": "remix:1632150985000",
  "amount": 0.1
}
```

**Response**

```json
{
  "success": true,
  "txHash": "0xjkl...",
  "remixId": "remix:1632150985000",
  "amount": 0.1
}
```

#### Get Recipient Royalty Splits

```
GET /api/royalties/recipient/:address
```

Retrieves all royalty splits for a recipient.

**Response**

```json
[
  {
    "splitId": "split:remix:1632150985000:0x5678...",
    "remixId": "remix:1632150985000",
    "recipientAddress": "0x5678...",
    "percentage": 30,
    "amountPaid": 0.1,
    "createdAt": 1632150985000,
    "lastPaidAt": 1632150985000,
    "transactions": [
      {
        "txHash": "0xghi...",
        "amount": 0.1,
        "timestamp": 1632150985000
      }
    ]
  },
  {
    "splitId": "split:remix:1632150985001:0x5678...",
    "remixId": "remix:1632150985001",
    "recipientAddress": "0x5678...",
    "percentage": 50,
    "amountPaid": 0.2,
    "createdAt": 1632150985001,
    "lastPaidAt": 1632150985001,
    "transactions": [
      {
        "txHash": "0xmno...",
        "amount": 0.2,
        "timestamp": 1632150985001
      }
    ]
  }
]
```

### Provenance Management

#### Get Provenance Certificate

```
GET /api/provenance/certificate/:tokenId
```

Retrieves the provenance certificate for a remix.

**Response**

```json
{
  "tokenId": 123,
  "creator": "0x1234...",
  "originalContentHash": "QmX...",
  "remixContentHash": "QmY...",
  "transformation": "dubbing",
  "tokenURI": "ipfs://QmZ...",
  "metadata": {
    "name": "Dubbing Remix",
    "description": "Dubbed version of the original audio",
    "external_url": "https://remixflow.app/remix/QmY...",
    "image": "https://remixflow.app/api/thumbnail/QmY...",
    "attributes": [
      {
        "trait_type": "Transformation",
        "value": "dubbing"
      },
      {
        "trait_type": "Content Type",
        "value": "audio/mp3"
      },
      {
        "trait_type": "Original Creator",
        "value": "0x5678..."
      }
    ],
    "properties": {
      "originalContentHash": "QmX...",
      "remixContentHash": "QmY...",
      "transformation": "dubbing",
      "transformationParams": {
        "language": "es"
      },
      "contentType": "audio/mp3",
      "createdAt": 1632150985000
    }
  }
}
```

#### Get Remixes by Original Content

```
GET /api/provenance/remixes/:originalContentHash
```

Retrieves all remixes for an original content.

**Response**

```json
[
  123,
  124,
  125
]
```

## Webhook Events

RemixFlow provides webhooks for real-time notifications of events. To receive webhooks, register a webhook URL in your account settings.

### Event Types

- `remix.created`: A new remix has been created
- `remix.updated`: A remix has been updated
- `royalty.distributed`: Royalties have been distributed
- `nft.minted`: An NFT has been minted for a remix

### Webhook Payload

```json
{
  "event": "remix.created",
  "timestamp": 1632150985000,
  "data": {
    "remixId": "remix:1632150985000",
    "originalContentId": "content:1632150985000",
    "creatorAddress": "0x1234...",
    "ipfsHash": "QmY...",
    "title": "Dubbing Remix",
    "transformation": "dubbing"
  }
}
```

## SDK

RemixFlow provides a JavaScript SDK for easy integration with the API. The SDK is available on npm:

```
npm install remixflow-sdk
```

### Usage

```javascript
import { RemixFlow } from 'remixflow-sdk';

// Initialize the SDK
const remixflow = new RemixFlow({
  apiKey: 'your-api-key',
  environment: 'production' // or 'staging'
});

// Create a remix
const remix = await remixflow.createRemix({
  file: file,
  type: 'audio',
  transformation: 'dubbing',
  transformationParams: { language: 'es' },
  originalContentId: 'content:1632150985000',
  creatorAddress: '0x1234...',
  title: 'Dubbing Remix',
  description: 'Dubbed version of the original audio'
});

console.log(remix);
```

## Support

For API support, please contact us at api@remixflow.app or join our Discord server at https://discord.gg/remixflow.

