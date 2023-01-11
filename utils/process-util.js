/**
 * Process utils
 */

exports.delay = function(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms)
    });
}
