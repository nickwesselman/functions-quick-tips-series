import type {
  RunInput,
  FunctionRunResult,
  Discount
} from "../generated/api";
import {
  DiscountApplicationStrategy,
} from "../generated/api";

export function run(input: RunInput): FunctionRunResult {
  const discounts : Discount[] = [];

  const email = input.cart.buyerIdentity?.email;
  if (!email || email.endsWith("@shopify.com")) {
    return {
      discountApplicationStrategy: DiscountApplicationStrategy.All,
      discounts
    }
  }

  for (const line of input.cart.lines) {
    if (line.quantity >= 5 && line.merchandise.__typename === "ProductVariant") {
      discounts.push({
        targets: [{
          productVariant: {
            id: line.merchandise.id
          }
        }],
        value: {
          percentage: {
            value: 10.0
          }
        }
      });
    }
  }

  return {
    discountApplicationStrategy: DiscountApplicationStrategy.All,
    discounts
  }
};