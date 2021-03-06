// @flow
import * as React from 'react';

type Props = {
    metaDisabled?: ?boolean,
    rulesDisabled?: ?boolean,
};

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        class DisabledFieldCalculationHOC extends React.Component<Props> {
            render() {
                const { metaDisabled, rulesDisabled, ...passOnProps } = this.props;

                return (
                    <InnerComponent
                        disabled={!!(metaDisabled || rulesDisabled)}
                        {...passOnProps}
                    />
                );
            }
        };
