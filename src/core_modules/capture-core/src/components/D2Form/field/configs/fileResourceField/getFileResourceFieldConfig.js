// @flow
import { orientations } from '../../../../FormFields/New';
import { createFieldConfig, createProps } from '../configBase';
import { FileResourceFieldForForm } from '../../Components';

const getFileResourceFieldConfig = (metaData: MetaDataElement, options: Object) => {
    const props = createProps({
        formHorizontal: options.formHorizontal,
        fieldLabelMediaBasedClass: options.fieldLabelMediaBasedClass,
        async: true,
        orientation: options.formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL,
    }, options, metaData);

    return createFieldConfig({
        component: FileResourceFieldForForm,
        props,
    }, metaData);
};

export default getFileResourceFieldConfig;
