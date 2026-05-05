import { verifyWebhook } from '@clerk/nextjs/webhooks';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createUserWebhook } from '@/services/repository/user';

export async function POST(req: NextRequest) {
  try {
    const evt: WebhookEvent = await verifyWebhook(req);
    const { type, data } = evt;

    if (type === 'user.created') {
      const { id, image_url, email_addresses, username } = data;

      const email = email_addresses?.[0]?.email_address;

      if (!id || !email) {
        return NextResponse.json(
          { success: false, message: 'Missing required user data' },
          { status: 400 }
        );
      }

      const createUser = await createUserWebhook({
        id,
        image_url,
        email,
        username: username ?? email.split('@')[0],
      });

      return NextResponse.json(
        { success: true, message: 'User synced successfully' },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true, message: 'Unhandled event type' }, { status: 200 });
  } catch (error) {
    console.error('Webhook Error:', error);

    return NextResponse.json(
      { success: false, message: 'Webhook verification failed' },
      { status: 400 }
    );
  }
}
