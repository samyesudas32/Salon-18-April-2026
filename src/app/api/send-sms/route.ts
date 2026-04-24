
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { mobile, variables } = await request.json();

    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;
    const senderId = process.env.MSG91_SENDER_ID || 'SALONG';

    if (!authKey || !templateId) {
      console.error('MSG91 Auth Key or Template ID is missing.');
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    // Prepare payload for MSG91 v5 Flow API
    const payload = {
      template_id: templateId,
      short_url: "0",
      recipients: [
        {
          mobiles: mobile.replace(/\D/g, ''), // Ensure only numbers
          ...variables
        }
      ]
    };

    const response = await fetch('https://api.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: {
        'authkey': authKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json({ message: 'SMS request initiated.', details: result }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'MSG91 API error.', details: result }, { status: response.status });
    }
  } catch (error) {
    console.error('SMS Route Error:', error);
    return NextResponse.json({ error: 'Failed to process SMS request.' }, { status: 500 });
  }
}
