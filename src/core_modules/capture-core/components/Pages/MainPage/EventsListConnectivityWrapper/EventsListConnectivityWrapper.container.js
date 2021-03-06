// @flow
import { connect } from 'react-redux';
import EventsListConnectivityWrapper from './EventsListConnectivityWrapper.component';

const mapStateToProps = (state: ReduxState) => ({
    isOnline: !!state.offline.online && !state.app.goingOnlineInProgress,
});

export default connect(mapStateToProps, {})(EventsListConnectivityWrapper);
