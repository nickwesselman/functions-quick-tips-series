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

  console.error(JSON.stringify(configuration));

  const lines = input.cart.lines;
  const discounts = configuration.flatMap((config) => {
    return lines
      .filter(line => line.merchandise.__typename == "ProductVariant")
      // @ts-ignore
      .filter(line => line.merchandise.product.hasTags.find(tag => tag.tag == config.tag && tag.hasTag))
      .map(line => /** @type {Discount} */ {
        console.error(JSON.stringify(line));
        return {
          value: {
            percentage: {
              value: parseFloat(config.percentOff)
            }
          },
          targets: [
            {
              productVariant: {
                // @ts-ignore
                id: line.merchandise.id
              }
            }
          ],
        };
      });
  });

  return {
    discountApplicationStrategy: DiscountApplicationStrategy.All,
    discounts
  };
};