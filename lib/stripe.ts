import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export const PRICE_IDS = {
  monthly: 'price_monthly_premium', // Replace with actual Stripe price ID
  yearly: 'price_yearly_premium',   // Replace with actual Stripe price ID
}
