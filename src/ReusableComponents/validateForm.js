export const validateForm = (formData, fieldsToValidate = []) => {
    const errors = {};

    // Validate only the fields specified in `fieldsToValidate`
    fieldsToValidate.forEach((field) => {
        switch (field) {
            case 'xtypetrn':
                if (!formData.xtypetrn) {
                    errors.xtypetrn = 'Type is required.';
                }
                break;
            case 'xnofsignatory':
                if (!formData.xnofsignatory) {
                    errors.xnofsignatory = 'Signatory Number Is Required.';
                }
                break;
            case 'xwh':
                if (!formData.xwh) {
                    errors.xwh = 'Store is required.';
                }
                break;
            case 'xmobile':
                if (!formData.xmobile) {
                    errors.xmobile = 'Mobile Number is required.';
                }
                break;

            case 'xfwh':
                if (!formData.xfwh) {
                    errors.xfwh = 'Store is required.';
                }
                break;

            case 'xcus':
                if (!formData.xcus) {
                    errors.xcus = 'Supplier is required.';
                }
                break;

            case 'xitem':
                if (!formData.xitem) {
                    errors.xitem = 'Item is required.';
                }
                break;

            case 'xdate':
                if (!formData.xdate) {
                    errors.xdate = 'Date is required.';
                }
                break;
                case 'xprepqty':
                    if (!formData.xprepqty) {
                        errors.xprepqty = 'Qty is required.';
                    }
                    break;

            case 'xrategrn':
                if (!formData.xrategrn) {
                    errors.xrategrn = 'Rate is required.';
                }
                break;

            case 'xqtygrn':
                if (!formData.xqtygrn) {
                    errors.xqtygrn = 'Quantity is required.';
                }
                break;

            case 'xref':
                if (!formData.xref) {
                    errors.xref = 'Reference is required.';
                }
                break;
            case 'xname':
                if (!formData.xname) {
                    errors.xname = 'Name is required.';
                }
                break;
            case 'xrelation':
                if (!formData.xrelation) {
                    errors.xrelation = 'Relation is required.';
                }
                break;

            case 'xgender':
                if (!formData.xgender) {
                    errors.xgender = 'Gender is required.';
                }
                break;
                case 'xsex':
                    if (!formData.xsex) {
                        errors.xsex = 'Gender is required.';
                    }
                    break;
            default:
                break;
        }
    });

    return errors;
};
