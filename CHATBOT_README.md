# AI Trading Assistant Chatbot

## Overview
A fully functional chatbot feature integrated into the stock trading application that provides intelligent responses about stock trading, market analysis, and financial advice.

## Features

### 🤖 Smart Responses
- Contextual responses based on user questions
- Specialized knowledge in stock trading and finance
- Predefined responses for common trading topics

### 💬 Interactive UI
- Floating chat button in bottom-right corner
- Expandable/collapsible chat window
- Minimize/maximize functionality
- Real-time message display with timestamps
- Typing indicators and loading states

### ⚡ Quick Actions
- Pre-defined quick question buttons for new users
- Topics include: Trading Basics, Risk Management, Portfolio Tips
- One-click access to common questions

### 🎨 Modern Design
- Dark/light theme support
- Responsive design
- Smooth animations and transitions
- Professional chat interface

## Technical Implementation

### API Endpoint
- **Route**: `/api/chat`
- **Method**: POST
- **Body**: `{ message: string, conversationHistory?: Message[] }`
- **Response**: `{ message: string, timestamp: string }`

### Components
1. **Chatbot.tsx** - Main chatbot component
2. **ChatMessage.tsx** - Individual message display
3. **ChatInput.tsx** - Message input with send button
4. **Card.tsx** - UI card component

### Knowledge Areas
The chatbot can help with:
- **Trading Basics**: Market orders, limit orders, bid-ask spreads
- **Market Analysis**: Technical analysis, fundamental analysis, indicators
- **Risk Management**: Stop-loss orders, diversification, position sizing
- **Portfolio Management**: Asset allocation, rebalancing, diversification strategies

## Usage

### For Users
1. Click the chat icon in the bottom-right corner
2. Type your question or use quick action buttons
3. Get instant responses about trading and finance
4. Clear chat history anytime with the "Clear Chat" button

### For Developers
The chatbot is automatically included in the authenticated layout (`app/(root)/layout.tsx`). No additional setup required.

## Future Enhancements
- Integration with real-time stock data
- Personalized recommendations based on user portfolio
- Advanced AI model integration (Gemini AI ready)
- Chat history persistence
- Multi-language support

## Files Modified/Created
- `app/api/chat/route.ts` - Chat API endpoint
- `components/Chatbot.tsx` - Main chatbot component
- `components/ui/chat-message.tsx` - Message component
- `components/ui/chat-input.tsx` - Input component
- `components/ui/card.tsx` - Card UI component
- `app/(root)/layout.tsx` - Added chatbot to layout

The chatbot is now fully functional and ready for use! 🚀