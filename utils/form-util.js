/**
 * Form/Value Utilities
 */

const FormUtil = {
    /**
     * 
     */
    // Object에서 field 값을 fnCheck함수를 통해 확인해서 불만족 errMsg를 리턴
    validateForm(obj, fieldName, errEmpty, errMsg = null, fnCheck = null) {
        if (!obj[fieldName]) return errEmpty

        if (null != fnCheck) {
            if (!errMsg) errMsg = errEmpty
            // true/false

            const ret = fnCheck(obj[fieldName])
            if (ret == false) return errMsg
        }
        return null
    },

    /**
     * Usage:
     * 
        const checkList = [
            ['content_id', '컨텐츠 아이디를 입력하세요.', null, null],
            ...
        ]

        const m = FormUtil.validateFormList(item, checkList)
        if (m != null) {
            alert(m);
            return false;
        }

     * @param {*} obj 
     * @param {*} checkList 
     * @returns 
     */
    validateFormList(obj, checkList) {
        for (let i = 0; i < checkList.length; i++) {
            const msg = this.validateForm(obj, checkList[i][0],
                checkList[i][1], checkList[i][2], checkList[i][3])
            if (msg != null) return msg;
        }
        return null
    },
}

moduel.exports = FormUtil;