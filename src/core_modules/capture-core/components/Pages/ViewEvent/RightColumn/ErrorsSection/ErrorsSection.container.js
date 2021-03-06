// @flow
import { connect } from 'react-redux';
import ErrorsSection from './ErrorsSection.component';
import { makeGetVisibleMessages } from './messageSection.selectors';

const makeStateToProps = () => {
    const getVisibleErrors = makeGetVisibleMessages();
    const mapStateToProps = (state: ReduxState, props: Object) => {
        const messagesContainer = state.rulesEffectsGeneralErrors[props.dataEntryKey];
        return {
            errors: getVisibleErrors({
                messagesContainer,
                containerPropNameMain: 'error',
                containerPropNameOnComplete: 'errorOnComplete',
                showOnComplete: true,
            }),
        };
    };
    return mapStateToProps;
};
// $FlowSuppress
export default connect(makeStateToProps, () => ({}))(ErrorsSection);
