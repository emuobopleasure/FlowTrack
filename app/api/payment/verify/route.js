import { NextResponse } from 'next/server'

/**
 * POST /api/payment/verify
 *
 * Verifies a Paystack payment reference server-side.
 *
 * Why server-side verification is mandatory:
 * The Paystack inline popup fires a success callback on the client
 * when payment appears to complete. But this callback can be
 * manipulated by a user in the browser — it is not trustworthy.
 *
 * Server-side verification calls Paystack's API directly using
 * the secret key. Only Paystack can confirm the payment was genuine.
 * Never confirm a booking based on a client callback alone.
 *
 * Flow:
 * 1. Paystack popup fires onSuccess with a reference string
 * 2. Client sends that reference to this route
 * 3. This route calls Paystack's verification endpoint
 * 4. Paystack confirms status is "success"
 * 5. We return verified: true to the client
 * 6. Client then calls POST /api/booking to confirm the booking
 */
export const POST = async (request) => {
  try {
    const { reference } = await request.json()

    if (!reference) {
      return NextResponse.json(
        { success: false, error: 'Payment reference is required' },
        { status: 400 }
      )
    }

    // Call Paystack's verification endpoint using the secret key
    // The secret key is server-side only — never exposed to the browser
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const paystackData = await paystackResponse.json()

    // Paystack returns status: "success" for a completed payment
    // Any other status means the payment did not go through
    if (
      !paystackData.status ||
      paystackData.data?.status !== 'success'
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment verification failed',
          paystackStatus: paystackData.data?.status ?? 'unknown',
        },
        { status: 400 }
      )
    }

    // Return the verified amount and customer email from Paystack
    // so the booking route can use them for confirmation
    return NextResponse.json({
      success: true,
      verified: true,
      amount: paystackData.data.amount / 100, // Paystack stores in kobo
      email: paystackData.data.customer.email,
      reference,
    })

  } catch (error) {
    console.error('POST /api/payment/verify error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}