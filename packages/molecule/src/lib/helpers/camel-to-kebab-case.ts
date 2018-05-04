/**
 * Coverts a camelCase string to kebab-case.
 *
 * @export
 * @param {string} str The camelCaseString
 * @returns {string} The kebab-version of the string
 */
export function camelCaseToKebab(str: string): string {
    const sub = str.substring(1, str.length);
    return str[0].toLowerCase() + sub.replace(/([A-Z])/g, '-$1').toLowerCase();
}