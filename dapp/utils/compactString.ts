export default function compactString(input?: string): string {
  if (!input) {
    return '';
  }
  
  if (input.length <= 9) {
      return input; // If the string is less than or equal to 9 characters, return it as is.
  }

  const left = input.substring(0, 5);
  const right = input.substring(input.length - 4);
  return `${left}...${right}`;
}