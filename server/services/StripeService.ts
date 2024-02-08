import Stripe from "stripe";
import { paymentAccount } from "../database/schema";

export class StripeService {
  private static api = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  static async createCustomer(
    userExternalId: string,
    customerParams: Stripe.CustomerCreateParams
  ): Promise<Stripe.Customer> {
    const customer = await this.api.customers.create(customerParams);

    await db
      .insert(paymentAccount)
      .values({
        providerID: "stripe",
        providerUserID: customer.id,
        userId: userExternalId
      })
      .returning();

    return customer;
  }

  static async getCustomer() {
    // this.api.customers.retrieve();
    console.log();
  }
}
