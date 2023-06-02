
function assertType(value: any, expectedType: string, predicate?: (value: any) => boolean) {
    if (typeof value !== expectedType) {
        throw new TypeError(`Expected ${expectedType}, found ${value}`)
    }
}
