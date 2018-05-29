// @flow
import { replace } from 'react-router-redux';
import {
    actionTypes as newEventDataEntryActionTypes,
} from '../newEventDataEntry.actions';

const getArguments = (programId: string, orgUnitId: string) => {
    const argArray = [];
    if (programId) {
        argArray.push(`programId=${programId}`);
    }
    if (orgUnitId) {
        argArray.push(`orgUnitId=${orgUnitId}`);
    }

    return argArray.join('&');
};

export const cancelNewEventIncompleteSelectionsLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(newEventDataEntryActionTypes.CANCEL_NEW_EVENT_FROM_INCOMPLETE_SELECTIONS_RETURN_TO_MAIN_PAGE)
        .map(() => {
            const state = store.getState();
            const { programId, orgUnitId } = state.currentSelections;
            const args = getArguments(programId, orgUnitId);
            return replace(`/${args}`);
        });
