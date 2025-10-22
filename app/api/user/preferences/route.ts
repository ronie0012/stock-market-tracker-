import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/better-auth/auth';
import { connectToDatabase } from '@/database/mongoose';

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth.api.getSession({ 
      headers: request.headers 
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { country, investmentGoals, riskTolerance, preferredIndustry } = await request.json();

    // Connect to database
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Database connection failed');
    }

    // Save user preferences
    const userPreferences = {
      userId: session.user.id,
      email: session.user.email,
      country,
      investmentGoals,
      riskTolerance,
      preferredIndustry,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('userPreferences').insertOne(userPreferences);

    console.log('User preferences saved:', userPreferences);

    return NextResponse.json({ 
      success: true, 
      message: 'Preferences saved successfully' 
    });

  } catch (error: any) {
    console.error('Error saving user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}