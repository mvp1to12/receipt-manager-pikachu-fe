# Receipt Manager - Personal Financial Assistant

A mobile-first web application for managing receipts and personal finances, built with React and functional components.

## Features

### 📊 Dashboard

- View total monthly expenses
- Upload receipts via multiple methods (Photo, Video, Voice, Upload)
- Interactive spending graphs
- Recent spending transactions
- Top spending categories with alerts

### 💡 Insights

- Expense predictions for next month
- Shopping alerts for items expiring soon
- Subscription tracking and renewal reminders
- Savings goals with progress tracking
- Product warranty monitoring
- Financial snapshots and analytics

### 💬 Chat

- AI-powered financial assistant
- Template queries for quick insights
- Interactive chat interface
- Real-time responses about spending patterns

## Technology Stack

- **Frontend**: React 18 with functional components and hooks
- **Styling**: CSS3 with mobile-first responsive design
- **Icons**: Lucide React
- **State Management**: React useState and useEffect
- **API Integration**: Fetch API with error handling

## Project Structure

```
receipt-manager/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.js     # Dashboard tab component
│   │   ├── Insights.js      # Insights tab component
│   │   └── Chat.js          # Chat tab component
│   ├── services/
│   │   └── api.js          # API integration layer
│   ├── App.js              # Main app with tab navigation
│   ├── App.css             # Application styles
│   ├── index.js            # React entry point
│   └── index.css           # Global styles
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd receipt-manager
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Start the development server**

   ```bash
   npm start
   ```
4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

### Building for Production

```bash
npm run build
```

This creates a `build` folder with production-ready files.

## API Integration

The application integrates with both internal backend APIs and external media processing APIs. All API endpoints are defined in `src/services/api.js`:

### Session Management

The application automatically creates a session when it starts up. This session ID is used for all external API calls.

**Session Creation API:**

```
POST https://8000-cs-c96b176c-b0a8-4232-a9f7-26e60feaa5b9.cs-asia-southeast1-fork.cloudshell.dev/apps/agentic_ai/users/user/sessions
```

**Response Format:**

```json
{
  "id": "6df7d1cd-41d7-48bb-a627-aad04c23af73",
  "app_name": "agentic_ai",
  "user_id": "user",
  "state": {},
  "events": [],
  "last_update_time": 1753538870.3630674
}
```

The `id` field contains the session ID that will be used for subsequent API calls.

### Media Upload API

The application uses an external Server-Sent Events (SSE) API for processing uploaded media files (photos, videos, audio). The API endpoint is:

```
POST https://8000-cs-c96b176c-b0a8-4232-a9f7-26e60feaa5b9.cs-asia-southeast1-fork.cloudshell.dev/run_sse
```

**Request Format:**

```json
{
  "app_name": "agentic_ai",
  "user_id": "user",
  "session_id": "6df7d1cd-41d7-48bb-a627-aad04c23af73",
  "new_message": {
    "role": "user",
    "parts": [
      { "text": "Save it" },
      {
        "inline_data": {
          "data": "base64_encoded_file_data",
          "mime_type": "image/jpeg"
        }
      }
    ]
  },
  "streaming": true
}
```

**Note:** The `session_id` is dynamically generated when the application starts and is used for all media upload requests.

**Supported Media Types:**

- Images: JPEG, PNG, GIF, WebP
- Videos: MP4, AVI, MOV, WMV, FLV, WebM
- Audio: MP3, WAV, OGG, M4A

### Backend API Endpoints

#### Dashboard APIs

- `GET /api/dashboard/total-expense` - Get total monthly expense
- `GET /api/dashboard/recent-spending` - Get recent transactions
- `GET /api/dashboard/top-categories` - Get top spending categories
- `POST /api/dashboard/upload-receipt` - Upload receipt files
- `GET /api/dashboard/spending-graph` - Get spending graph data

#### Insights APIs

- `GET /api/insights/expected-expense` - Get next month's predicted expense
- `GET /api/insights/shopping-alerts` - Get shopping alerts
- `GET /api/insights/subscriptions` - Get user subscriptions
- `GET /api/insights/savings-goals` - Get savings goals
- `GET /api/insights/warranties` - Get product warranties
- `GET /api/insights/financial-snapshot` - Get financial analytics
- `POST /api/insights/add-to-shopping-list` - Add items to shopping list

#### Chat APIs

- `GET /api/chat/template-queries` - Get template questions
- `POST /api/chat/send-message` - Send chat messages
- `GET /api/chat/history` - Get chat history

#### User APIs

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/preferences` - Update user preferences

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_BASE_URL=http://localhost:3001/api
```

## Mobile Design

The application is optimized for mobile devices with:

- **Responsive Layout**: Adapts to different screen sizes
- **Touch-Friendly UI**: Large tap targets and intuitive gestures
- **Bottom Navigation**: Easy thumb navigation
- **Mobile-First CSS**: Optimized for mobile performance
- **Fixed Positioning**: Chat input and navigation stay accessible

### Supported Screen Sizes

- Mobile: 320px - 480px
- Tablet: 481px - 768px
- Desktop: 769px and above

## Features Implementation

### Tab Navigation

- Three main tabs: Dashboard, Insights, Chat
- Active tab highlighting
- Smooth transitions
- Persistent bottom navigation

### Receipt Upload

- Multiple upload methods supported
- File validation and error handling
- Progress indicators
- Success/error feedback

### Chat Interface

- Real-time messaging
- Template queries for quick access
- Typing indicators
- Message history
- Auto-scroll to latest messages

### Data Visualization

- Spending graphs (placeholder for chart library integration)
- Category breakdowns
- Trend analysis
- Interactive elements

## Development Notes

### Mock Data

Currently uses mock data for development. Replace with actual API calls when backend is ready.

### State Management

Uses React hooks for state management. Consider Redux or Context API for complex state requirements.

### Performance Optimization

- Lazy loading for components
- Memoization for expensive calculations
- Optimized re-renders
- Efficient list rendering

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository.
