// @flow
import React from 'react';
import { withStyles } from 'material-ui-next/styles';
import LoadingMask from './LoadingMask.component';

const styles = () => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

type Props = {
    classes: {
        container: string,
    },
    containerStyle?: ?Object,
};

const LoadingMaskForPage = (props: Props) => {
    const { containerStyle, ...passOnProps } = props;
    return (
        <div
            className={props.classes.container}
            style={containerStyle}
        >
            <LoadingMask
                {...passOnProps}
            />
        </div>
    );
};

export default withStyles(styles)(LoadingMaskForPage);