import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { reason, preferredContact, contactInfo, subject, message } = body

  if (!reason || !preferredContact || !contactInfo || !subject || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Novation <hello@novationapp.com>',
      to: 'hello@novationapp.com',
      subject: `New Contact Form: ${subject}`,
      text: `
New submission:

Reason: ${reason}
Preferred Contact: ${preferredContact}
Contact Info: ${contactInfo}
Subject: ${subject}

Message:
${message}
      `,
    })

    if (error) {
      console.error(error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
