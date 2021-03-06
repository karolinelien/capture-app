// @flow
import log from 'loglevel';
import { pipe } from 'capture-core-utils';
import { errorCreator } from 'capture-core-utils';
import OptionSet from '../../../../../metaData/OptionSet/OptionSet';
import { convertValue } from '../../../../../converters/clientToForm';

const errorMessages = {
    DATAELEMENT_MISSING: 'DataElement missing',
};

const buildFormOptionSet = (clientOptionSet: OptionSet) => {
    if (!clientOptionSet.dataElement) {
        log.error(errorCreator(errorMessages.DATAELEMENT_MISSING)({ clientOptionSet }));
        return null;
    }
    return clientOptionSet.dataElement.getConvertedOptionSet(convertValue);
};

const flattenOptionSetForRadioButtons = (formOptionSet: OptionSet) => formOptionSet
    .options
    .map(option => ({
        id: option.id,
        name: option.text,
        value: option.value,
    }));

const flattenOptionSetForSelect = (formOptionSet: OptionSet) => formOptionSet
    .options
    .map(option => ({
        id: option.id,
        label: option.text,
        value: option.value,
        icon: option.icon ? {
            data: option.icon.data,
            color: option.icon.color,
        } : null,
    }));


export const getOptionsForRadioButtons = (clientOptionSet: OptionSet) => {
    const getOptionSet = pipe(
        buildFormOptionSet,
        flattenOptionSetForRadioButtons,
    );
    return getOptionSet(clientOptionSet);
};

export const getOptionsForSelect = (clientOptionSet: OptionSet) => {
    const getOptionSet = pipe(
        buildFormOptionSet,
        flattenOptionSetForSelect,
    );
    return getOptionSet(clientOptionSet);
};
