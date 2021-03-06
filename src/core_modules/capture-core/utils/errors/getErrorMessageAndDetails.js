// @flow
import isString from 'd2-utilizr/src/isString';
import isObject from 'd2-utilizr/src/isObject';

export default function getErrorMessageAndDetails(error: any) {
    if (!error) {
        return {
            message: null,
            details: null,
        };
    }

    const message = isString(error) ? error : error.message;
    const details = isObject(error) ? error : null;

    return {
        message,
        details,
    };
}
