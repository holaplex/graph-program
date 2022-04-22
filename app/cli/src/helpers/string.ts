export const b = (input: TemplateStringsArray) =>
  new TextEncoder().encode(input.join(""));
