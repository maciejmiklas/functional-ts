"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
class Log {
    static error(cmp, msg, ...args) {
        console.log('ERROR(' + cmp + '): ' + msg + ' - ', args);
    }
    static warn(cmp, msg, ...args) {
        console.log('ERROR(' + cmp + '): ' + msg + ' - ', args);
    }
    static info(cmp, msg, ...args) {
        // console.log('INFO(' + cmp + '): ' + msg + ' - ', args);
    }
    static debug(cmp, msg, ...args) {
        // console.log('DEBUG(' + cmp + '): ' + msg + ' - ', args);
    }
    static trace(cmp, msg, ...args) {
        // console.log('TRACE(' + cmp + '): ' + msg + ' - ', args);
    }
}
exports.Log = Log;
//# sourceMappingURL=log.js.map