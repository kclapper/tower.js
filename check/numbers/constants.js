"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NAN = exports.NEG_INF = exports.INF = exports.PI = exports.NEG_I = exports.I = exports.NEG_ONE = exports.HALF = exports.TWO = exports.ONE = exports.ZERO = exports.NAN_VAL = exports.NEG_INF_VAL = exports.INF_VAL = exports.PI_VAL = exports.NEG_ONE_VAL = exports.TWO_VAL = exports.ONE_VAL = exports.ZERO_VAL = void 0;
var Value_1 = require("./Value");
var BoxedNumber_1 = require("./BoxedNumber");
/////////////////////// Values ///////////////////////
exports.ZERO_VAL = new Value_1.SmallExactNumber(0);
exports.ONE_VAL = new Value_1.SmallExactNumber(1);
exports.TWO_VAL = new Value_1.SmallExactNumber(2);
exports.NEG_ONE_VAL = new Value_1.SmallExactNumber(-1);
exports.PI_VAL = new Value_1.InexactNumber(Math.PI);
exports.INF_VAL = new Value_1.InexactNumber(Number.POSITIVE_INFINITY);
exports.NEG_INF_VAL = new Value_1.InexactNumber(Number.NEGATIVE_INFINITY);
exports.NAN_VAL = new Value_1.InexactNumber(Number.NaN);
/////////////////////// Numbers ///////////////////////
exports.ZERO = new BoxedNumber_1.BoxedNumber(exports.ZERO_VAL);
exports.ONE = new BoxedNumber_1.BoxedNumber(exports.ONE_VAL);
exports.TWO = new BoxedNumber_1.BoxedNumber(exports.TWO_VAL);
exports.HALF = exports.ONE.divide(exports.TWO);
exports.NEG_ONE = new BoxedNumber_1.BoxedNumber(exports.NEG_ONE_VAL);
exports.I = new BoxedNumber_1.BoxedNumber(exports.ZERO_VAL, exports.ONE_VAL);
exports.NEG_I = new BoxedNumber_1.BoxedNumber(exports.ZERO_VAL, exports.NEG_ONE_VAL);
exports.PI = new BoxedNumber_1.BoxedNumber(exports.PI_VAL);
exports.INF = new BoxedNumber_1.BoxedNumber(exports.INF_VAL);
exports.NEG_INF = new BoxedNumber_1.BoxedNumber(exports.NEG_INF_VAL);
exports.NAN = new BoxedNumber_1.BoxedNumber(exports.NAN_VAL);
