"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Right = exports.Left = exports.Either = void 0;
const R = require("ramda");
const log_1 = require("./log");
class Either {
    constructor(value, msg) {
        this.val = value;
        this.msg = msg;
    }
    static ofRight(val) {
        return new Right(val);
    }
    static ofLeft(msg) {
        return new Left(msg);
    }
    static ofNullable(val, msg) {
        return R.isNil(val) ? new Left(msg()) : new Right(val);
    }
    static ofCondition(cnd, left, right) {
        return cnd() ? new Right(right()) : new Left(left());
    }
    static ofTruth(truth, right) {
        const left = truth.filter(e => e.isLeft());
        return left.length === 0 ? new Right(right()) : new Left(left.map(l => l.message()).join(','));
    }
    get() {
        return this.val;
    }
    message() {
        return this.msg;
    }
}
exports.Either = Either;
Either.until = (next, init, max = 500) => {
    let val = init;
    const all = [];
    let cnt = 0;
    while (val.isRight()) {
        if (cnt > max) {
            log_1.Log.error('Either#until', 'Iterations limit of $max reached', { max });
            break;
        }
        val.exec((v) => all.push(v));
        val = next(val.get());
        cnt = cnt + 1;
    }
    return Either.ofCondition(() => all.length > 0, () => 'Empty result for ' + init, () => all);
};
Either.ofArray = (...args) => {
    const ret = args.filter(e => e.isRight()).map(e => e.get());
    return Either.ofCondition(() => ret.length > 0, () => 'All candidates for Array are Left: ' + args, () => ret);
};
class Left extends Either {
    constructor(msg) {
        super(null, msg);
    }
    mapGet(left, right) {
        return left(this.msg);
    }
    assert(fn) {
        return this;
    }
    map(fn) {
        return this;
    }
    remap(mf, jf) {
        return this;
    }
    exec(fn) {
        return this;
    }
    isLeft() {
        return true;
    }
    append(producer, appender) {
        return this;
    }
    isRight() {
        return false;
    }
    orElse(other) {
        return other;
    }
    orElseGet(fn) {
        return fn();
    }
    get() {
        throw new TypeError('Left has no value: ' + this.message());
    }
    toString() {
        return `Left[${this.message()}]`;
    }
}
exports.Left = Left;
class Right extends Either {
    constructor(value) {
        super(value, 'Right');
        if (R.isNil(value)) {
            log_1.Log.error('Right#', 'null provided to Right');
        }
    }
    assert(fn) {
        const resp = fn(this.val);
        if (resp.isLeft()) {
            log_1.Log.error('Right#assert', resp.message());
            return Either.ofLeft(resp.message());
        }
        return this;
    }
    orElseGet(fn) {
        return this.val;
    }
    exec(fn) {
        fn(this.get());
        return this;
    }
    append(producer, appender) {
        const val = this.get();
        const res = producer(val);
        if (R.isNil(res) || res.isLeft()) {
            return Either.ofLeft('append got null for ' + val);
        }
        appender(val, res.get());
        return new Right(val);
    }
    map(fn) {
        const val = this.get();
        const res = fn(val);
        return R.isNil(res) ? Either.ofLeft('map got null for ' + val) : res instanceof Either ? res : new Right(res);
    }
    remap(mf, jf) {
        const val = this.get();
        const res = mf(val);
        if (R.isNil(res) || res.isLeft()) {
            return Either.ofLeft('remap got null for ' + val);
        }
        jf(res.get(), val);
        return res;
    }
    isLeft() {
        return false;
    }
    isRight() {
        return true;
    }
    orElse(other) {
        return R.isNil(this.val) ? other : this.val;
    }
    toString() {
        return `Right[${this.get()}]`;
    }
    mapGet(left, right) {
        return right(this.val);
    }
}
exports.Right = Right;
//# sourceMappingURL=either.js.map