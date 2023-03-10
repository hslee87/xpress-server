/**
 * API Return Code enumeration.
 *
 * <Enum>.key, <Enum>.value
 */
"use strict"

let ApiResultCode = {
	OK: 0,
    PENDING: 1,
    FAIL: -1,
    
    INVALID_ACCESS: 1000,
    AUTHORIZATION_REQUIRED: 1001,
	AUTHORIZATION_INVALID: 1002,
	AUTHORIZATION_EXPIRED: 1003,
    ACCESS_RIGHT_REQUIRED: 1004,
    LOGIN_ID_OR_PASSWORD_MISMATCH: 1007,
    PASSWORD_MISMATCH: 1008,    // 암호 수정시
	INVALID_SESSION: 1010,
    SESSION_VERIFICATION_REQUIRED: 1011,
    INVALID_ID_OR_PASSWORD: 1101,
    NO_ACCESS_RIGHT: 1102,
    BAD_REQUEST: 2001,      // 파라미터 부족 또는 형식이 잘 못된 경우
    NOT_FOUND: 2002,      // 요청 정보가 없는 경우 
    MISSING_PARAMETER: 2003,      // 파라미터가 없는 경우
    NO_SUCH_INSTANCE: 2109,
    NO_SUCH_ACCOUNT: 2012,
    ALREADY_EXISTS: 2013,
    UNSATISFIED_CONDITION: 2014,
    
    INVALID_PARAMETER: 2015,
    INVALID_VALUE: 2016,
    INVALID_FORMAT: 2017,
    INVALID_TYPE: 2018,
    INVALID_LENGTH: 2019,
    INVALID_RANGE: 2020,
    INVALID_STATUS: 2021,
    INVALID_OPERATION: 2022,
    INVALID_STATE: 2023,
    INVALID_REQUEST: 2024,
    INVALID_RESPONSE: 2025,
    INVALID_DATA: 2026,
    INVALID_TOKEN: 2027,
    INVALID_SIGNATURE: 2028,
    INVALID_CERTIFICATE: 2029,
    INVALID_PASSWORD: 2030,

    // Common
    OPERATION_FAILED: 9991, // 비지니스 로직 오류
    INTERNAL_ERROR: 9992,   // 서버 내부 (ex: Exception) 오류
    UNSUPPORTED_METHOD: 9993,
    NOT_YET_IMPLEMENTED: 9999,
    END_OF_RES: 0
}

module.exports = ApiResultCode
