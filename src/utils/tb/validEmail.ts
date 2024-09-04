export const validEmail = (email: string) => {
    email = email.replace(/^\s+|\s+$/g, '');

    email = email.replace(/\s+/g, ' ');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
}
