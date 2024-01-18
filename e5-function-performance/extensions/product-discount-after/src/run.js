// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Discount} Discount
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.All,
  discounts: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  /**
   * @type {{
   *    tag: string
   *    percentOff: string
   * }[]}
   */
  const configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}"
  );

  const offers = configuration.reduce((map, offer) => {
    map.set(offer.tag, parseFloat(offer.percentOff));
    return map;
  }, new Map())

  /** @type {Discount[]} */
  const discounts = [];
  for (let cartLine of input.cart.lines) {
    if (cartLine.merchandise.__typename != "ProductVariant") {
      continue;
    }

    for (let tag of cartLine.merchandise.product.hasTags) {
      if (!tag.hasTag) {
        continue;
      }
      const percentOff = offers.get(tag.tag);
      if (!percentOff) {
        continue;
      }
      discounts[discounts.length] = {
        targets: [
          {
            productVariant: {
              id: cartLine.merchandise.id
            }
          }
        ],
        value: {
          percentage: {
            value: percentOff
          }
        }
      };
    }
  }

  return {
    discountApplicationStrategy: DiscountApplicationStrategy.All,
    discounts
  };
};