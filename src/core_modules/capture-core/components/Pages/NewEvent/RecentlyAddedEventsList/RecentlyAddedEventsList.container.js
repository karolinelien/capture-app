// @flow
import { connect } from 'react-redux';
import NewEventsList from './RecentlyAddedEventsList.component';

const mapStateToProps = (state: ReduxState) => ({
    events: state.recentlyAddedEvents,
    eventsValues: state.recentlyAddedEventsValues,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onRowClick: () => {
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(NewEventsList);
