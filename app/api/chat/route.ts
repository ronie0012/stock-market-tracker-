import { NextRequest, NextResponse } from 'next/server';

// Predefined responses for common stock trading questions
const stockResponses = {
    greetings: [
        "Hello! I'm your AI trading assistant. I can help you with stock market insights, trading strategies, and financial analysis. What would you like to know?",
        "Hi there! I'm here to help you with all things related to stock trading and market analysis. How can I assist you today?",
        "Welcome! I specialize in stock market guidance, trading tips, and financial insights. What can I help you with?"
    ],

    trading_basics: [
        "Stock trading involves buying and selling shares of publicly traded companies. Key concepts include: market orders vs limit orders, bid-ask spreads, volume, and market capitalization. Would you like me to explain any of these in detail?",
        "For beginners, I recommend starting with: 1) Understanding market fundamentals, 2) Learning about different order types, 3) Practicing with paper trading, 4) Diversifying your portfolio, and 5) Managing risk. What aspect interests you most?",
        "Basic trading strategies include: Buy and Hold (long-term investing), Day Trading (same-day transactions), Swing Trading (holding for days/weeks), and Value Investing (undervalued stocks). Each has different risk levels and time commitments."
    ],

    market_analysis: [
        "Market analysis involves two main approaches: Technical Analysis (studying price charts and patterns) and Fundamental Analysis (evaluating company financials and economic factors). Both are valuable for making informed trading decisions.",
        "Key market indicators to watch include: P/E ratios, moving averages, trading volume, market volatility (VIX), and economic indicators like GDP and employment rates. These help gauge market sentiment and trends.",
        "When analyzing stocks, consider: company earnings, revenue growth, debt levels, competitive position, industry trends, and overall market conditions. This comprehensive view helps identify good investment opportunities."
    ],

    risk_management: [
        "Risk management is crucial in trading. Key principles: 1) Never invest more than you can afford to lose, 2) Diversify across different sectors, 3) Use stop-loss orders, 4) Position sizing (don't put all money in one stock), and 5) Regular portfolio review.",
        "Common risk management tools include: Stop-loss orders (automatic selling at predetermined price), diversification (spreading investments), position sizing (limiting investment per stock), and hedging strategies. Which would you like to learn more about?",
        "The golden rule: Don't put all your eggs in one basket. Diversify across different stocks, sectors, and even asset classes. Also, always have an exit strategy before entering any trade."
    ],

    portfolio_tips: [
        "A balanced portfolio typically includes: 60-70% stocks (mix of growth and value), 20-30% bonds, and 5-10% alternative investments. Adjust based on your age, risk tolerance, and investment goals.",
        "Portfolio rebalancing involves periodically adjusting your holdings to maintain your target allocation. This helps you 'buy low, sell high' automatically and manage risk effectively.",
        "Consider these portfolio strategies: Dollar-cost averaging (regular investments regardless of market conditions), asset allocation based on age (100 minus your age in stocks), and regular review/rebalancing."
    ]
};

function getRandomResponse(category: string[]): string {
    return category[Math.floor(Math.random() * category.length)];
}

function generateResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('start')) {
        return getRandomResponse(stockResponses.greetings);
    }

    // Trading basics
    if (lowerMessage.includes('trading') || lowerMessage.includes('beginner') || lowerMessage.includes('start') || lowerMessage.includes('basic') || lowerMessage.includes('learn')) {
        return getRandomResponse(stockResponses.trading_basics);
    }

    // Market analysis
    if (lowerMessage.includes('analysis') || lowerMessage.includes('market') || lowerMessage.includes('indicator') || lowerMessage.includes('chart') || lowerMessage.includes('technical')) {
        return getRandomResponse(stockResponses.market_analysis);
    }

    // Risk management
    if (lowerMessage.includes('risk') || lowerMessage.includes('loss') || lowerMessage.includes('safe') || lowerMessage.includes('protect') || lowerMessage.includes('manage')) {
        return getRandomResponse(stockResponses.risk_management);
    }

    // Portfolio management
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('diversif') || lowerMessage.includes('balance') || lowerMessage.includes('allocation')) {
        return getRandomResponse(stockResponses.portfolio_tips);
    }

    // Default response for other questions
    return "That's a great question about trading! I can help you with stock market basics, trading strategies, risk management, portfolio diversification, and market analysis. Could you be more specific about what aspect of trading you'd like to learn about?";
}

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Generate response based on message content
        const responseText = generateResponse(message);

        return NextResponse.json({
            message: responseText,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process chat message' },
            { status: 500 }
        );
    }
}