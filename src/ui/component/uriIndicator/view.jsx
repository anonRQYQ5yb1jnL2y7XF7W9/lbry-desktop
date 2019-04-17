// @flow
import React from 'react';
import Button from 'component/button';
import { buildURI } from 'lbry-redux';

type Props = {
  isResolvingUri: boolean,
  channelUri: ?string,
  link: ?boolean,
  claim: ?StreamClaim,
  channelClaim: ?ChannelClaim,
  // Lint thinks we aren't using these, even though we are.
  // Possibly because the resolve function is an arrow function that is passed in props?
  resolveUri: string => void,
  uri: string,
};

class UriIndicator extends React.PureComponent<Props> {
  componentWillMount() {
    this.resolve(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.resolve(nextProps);
  }

  resolve = (props: Props) => {
    const { isResolvingUri, resolveUri, claim, uri } = props;

    if (!isResolvingUri && claim === undefined && uri) {
      resolveUri(uri);
    }
  };

  render() {
    const { link, isResolvingUri, claim, channelClaim } = this.props;
    console.log(this.props);
    if (!claim) {
      return <span className="empty">{isResolvingUri ? 'Validating...' : 'Unused'}</span>;
    }

    if (!channelClaim) {
      return <span className="channel-name">Anonymous</span>;
    }

    let channelLink;
    debugger;
    if (signatureIsValid) {
      channelLink = link ? buildURI({ channelName, claimId: channelClaimId }) : false;
    }

    const inner = <span className="channel-name">{channelName}</span>;

    if (!channelLink) {
      return inner;
    }

    return (
      <Button noPadding className="button--uri-indicator" navigate={channelLink}>
        {inner}
      </Button>
    );
  }
}

export default UriIndicator;
