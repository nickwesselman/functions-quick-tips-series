import type {
  RunInput,
  FunctionRunResult,
  FunctionError,
} from "../generated/api";

export function run(input: RunInput): FunctionRunResult {
  const errors: FunctionError[] = input.cart.lines
    .filter(line => line.quantity > 1 &&
      line.merchandise.__typename == "ProductVariant" &&
      line.merchandise.product.onlyOne)
    .map(() => ({
      localizedMessage: "Not possible to order more than one of each",
      target: "cart",
    }));

  return {
    errors
  }
};