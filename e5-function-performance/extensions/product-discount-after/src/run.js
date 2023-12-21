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

  const discounts = input.cart.lines.reduce(
    /** @param {Discount[]} acc */
    (acc, cartLine) => {
      if (cartLine.merchandise.__typename != "ProductVariant") {
        return acc;
      }

      cartLine.merchandise.product.hasTags.forEach(tag => {
        if (!tag.hasTag) {
          return;
        }
        const percentOff = offers.get(tag.tag);
        if (!percentOff) {
          return;
        }
        acc.push({
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
        });
      })

      return acc;
    },
    (/** @param {Discount[]} acc */ [])
  );

  
  // const discounts = configuration.flatMap((config) => {
  //   return lines.filter(
  //       line => line.merchandise.__typename == "ProductVariant" &&
  //       line.merchandise.product.hasTags.find(tag => tag.tag == config.tag && tag.hasTag)
  //     ).map(line => /** @type {Discount} */ {
  //       return {
  //         value: {
  //           percentage: {
  //             value: parseFloat(config.percentOff)
  //           }
  //         },
  //         targets: [
  //           {
  //             productVariant: {
  //               // @ts-ignore
  //               id: line.merchandise.id
  //             }
  //           }
  //         ],
  //       };
  //     });
  // });

  return {
    discountApplicationStrategy: DiscountApplicationStrategy.All,
    discounts
  };
};