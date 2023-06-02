

export default function uppercase(str: string | undefined) {

    if (!str) {
        return str;
    }

    if (typeof str !== 'string') {
        return str
    }

    return str.toUpperCase();
}