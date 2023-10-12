// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const errors = input.cart.lines
    .filter(line => line.quantity > 1
      && line.merchandise.__typename == "ProductVariant"
      && line.merchandise.product.onlyOne)
    .map(() => ({
      localizedMessage: "Not possible to order more than one of each",
      target: "cart",
    }));

  return {
    errors
  }
};