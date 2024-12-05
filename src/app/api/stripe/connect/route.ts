import { client } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) return new NextResponse('User not authenticated')

    // Dummy account data to simulate a Stripe account
    const dummyAccount = {
      id: 'acct_dummy_account_id',
      country: 'US',
      type: 'custom',
      business_type: 'company',
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
      external_account: 'btok_us',
      tos_acceptance: {
        date: 1547923073,
        ip: '172.18.80.19',
      },
      business_profile: {
        mcc: '5045',
        url: 'https://bestcookieco.com',
      },
      company: {
        address: {
          city: 'Fairfax',
          line1: '123 State St',
          postal_code: '22031',
          state: 'VA',
        },
        tax_id: '000000000',
        name: 'The Best Cookie Co',
        phone: '8888675309',
      },
    }

    const dummyPerson = {
      first_name: 'Jenny',
      last_name: 'Rosen',
      relationship: {
        representative: true,
        title: 'CEO',
      },
      address: {
        city: 'Victoria',
        line1: '123 State St',
        postal_code: 'V8P 1A1',
        state: 'BC',
      },
      dob: {
        day: 10,
        month: 11,
        year: 1980,
      },
      ssn_last_4: '0000',
      phone: '8888675309',
      email: 'jenny@bestcookieco.com',
    }

    // Simulating Stripe account creation by returning dummy data
    const accountLink = {
      url: 'http://localhost:3000/callback/stripe/onboarding',
    }

    // Save the dummy Stripe account ID in the user record
    const saveAccountId = await client.user.update({
      where: {
        clerkId: user.id,
      },
      data: {
        stripeId: dummyAccount.id,
      },
    })

    if (saveAccountId) {
      return NextResponse.json({
        url: accountLink.url,
        account: dummyAccount,
        person: dummyPerson,
      })
    }

  } catch (error) {
    console.error(
      'An error occurred when simulating the Stripe account creation:',
      error
    )
    return new NextResponse('Error occurred while processing the request', {
      status: 500,
    })
  }
}

