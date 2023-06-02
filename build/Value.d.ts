export type Value = Exact | Inexact;
export type Inexact = {
    'kind': 'inexact';
    'value': number;
};
export type Exact = number | bigint;
export type BoxedExact = {
    'kind': 'exact';
    'value': number;
};
