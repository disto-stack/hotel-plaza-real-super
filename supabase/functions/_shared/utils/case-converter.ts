/** biome-ignore-all lint/suspicious/noExplicitAny: <we need to ignore this because we are using any> */

/**
 * Converts a camelCase string to snake_case
 * @param str - The camelCase string to convert
 * @returns The snake_case version of the string
 */
export function camelToSnake(str: string): string {
	return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Converts an object with camelCase keys to an object with snake_case keys
 * @param obj - The object with camelCase keys
 * @returns A new object with snake_case keys
 */
export function convertKeysToSnakeCase(obj: any): any {
	if (obj === null || obj === undefined) {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => convertKeysToSnakeCase(item));
	}

	if (typeof obj !== "object") {
		return obj;
	}

	const converted: any = {};
	for (const key in obj) {
		if (Object.hasOwn(obj, key)) {
			const snakeKey = camelToSnake(key);
			converted[snakeKey] = convertKeysToSnakeCase(obj[key]);
		}
	}

	return converted;
}
