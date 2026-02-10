export function randomIndex(max: number): number {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0]! % max;
}
export function generatePassword(): string {
    const length = 20;
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()-_=+[]{}|;:,.<>?";

    const allChars = upper + lower + numbers + symbols;

    const password: string[] = [];

    // Ensure at least one from each category
    password.push(upper[randomIndex(upper.length)]!);
    password.push(lower[randomIndex(lower.length)]!);
    password.push(numbers[randomIndex(numbers.length)]!);
    password.push(symbols[randomIndex(symbols.length)]!);

    // Fill remaining characters
    for (let i = password.length; i < length; i++) {
        password.push(allChars[randomIndex(allChars.length)]!);
    }

    // Shuffle for randomness
    for (let i = password.length - 1; i > 0; i--) {
        const j = randomIndex(i + 1);
        [password[i], password[j]] = [password[j]!, password[i]!];
    }

    return password.join("");
}