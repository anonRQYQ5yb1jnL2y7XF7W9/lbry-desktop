import { connect } from 'react-redux';
import { doFetchAccessToken, selectAccessToken, selectUser } from 'lbryinc';
import { selectDaemonSettings } from 'redux/selectors/settings';
import HelpPage from './view';

const select = state => ({
  user: selectUser(state),
  accessToken: selectAccessToken(state),
  deamonSettings: selectDaemonSettings(state),
});

const perform = (dispatch, ownProps) => ({
  doAuth: () => ownProps.history.push('/$/auth?redirect=help'),
  fetchAccessToken: () => dispatch(doFetchAccessToken()),
});

export default connect(
  select,
  perform
)(HelpPage);
