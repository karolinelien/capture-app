// @flow
import React, { Component } from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InfoIcon from '@material-ui/icons/InfoOutline';
import i18n from '@dhis2/d2-i18n';
import DataEntry from '../../../../components/DataEntry/DataEntry.container';
import withSaveButton from '../../../../components/DataEntry/withSaveButton';
import withCancelButton from '../../../../components/DataEntry/withCancelButton';
import withDataEntryField from '../../../../components/DataEntry/dataEntryField/withDataEntryField';
import { placements } from '../../../../components/DataEntry/dataEntryField/dataEntryField.const';
import getEventDateValidatorContainers from './fieldValidators/eventDate.validatorContainersGetter';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';

import { withInternalChangeHandler, withLabel, withFocusSaver, DateField, TextField, TrueOnlyField, withCalculateMessages, withDisplayMessages } from '../../../FormFields/New';
import withDefaultFieldContainer from '../../../D2Form/field/withDefaultFieldContainer';
import withFeedbackOutput from '../../../../components/DataEntry/dataEntryOutput/withFeedbackOutput';
import withDefaultShouldUpdateInterface from
    '../../../D2Form/field/withDefaultShouldUpdateInterface';

import inMemoryFileStore from '../../../DataEntry/file/inMemoryFileStore';
import withIndicatorOutput from '../../../DataEntry/dataEntryOutput/withIndicatorOutput';
import withErrorOutput from '../../../DataEntry/dataEntryOutput/withErrorOutput';
import withWarningOutput from '../../../DataEntry/dataEntryOutput/withWarningOutput';
import TextEditor from '../../../FormFields/TextEditor/TextEditor.component';
import { newEventSaveTypes, newEventSaveTypeDefinitions } from './newEventSaveTypes';
import labelTypeClasses from './dataEntryFieldLabels.mod.css';

const getStyles = theme => ({
    savingContextContainer: {
        paddingTop: theme.typography.pxToRem(10),
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.text.hint,
    },
    savingContextText: {
        paddingLeft: theme.typography.pxToRem(10),
    },
    savingContextNames: {
        fontWeight: 'bold',
    },
    topButtonsContainer: {
        display: 'flex',
        flexFlow: 'row-reverse',
    },
    horizontalPaper: {
        padding: theme.typography.pxToRem(10),
        paddingTop: theme.typography.pxToRem(20),
        paddingBottom: theme.typography.pxToRem(15),
    },
    fieldLabelMediaBased: {
        [theme.breakpoints.down(481)]: {
            paddingTop: '0px !important',
        },
    },
    dataEntryVerticalContainer: {
        backgroundColor: 'white',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: theme.typography.pxToRem(2),
        padding: theme.typography.pxToRem(20),
    },
});

const overrideMessagePropNames = {
    errorMessage: 'validationError',
};

const getSaveOptions = (props: Object) => {
    const options: {color?: ?string, saveTypes?: ?Array<any>} = {
        color: 'primary',
    };

    if (props.formHorizontal) {
        options.saveTypes = [
            newEventSaveTypeDefinitions[newEventSaveTypes.SAVEANDADDANOTHER],
            newEventSaveTypeDefinitions[newEventSaveTypes.SAVEANDEXIT],
        ];
        return options;
    }
    if (props.saveTypes) {
        options.saveTypes = props.saveTypes.map(saveType => newEventSaveTypeDefinitions[saveType]);
        return options;
    }

    options.saveTypes = [newEventSaveTypeDefinitions[newEventSaveTypes.SAVEANDEXIT], newEventSaveTypeDefinitions[newEventSaveTypes.SAVEANDADDANOTHER]];
    return options;
};

const getCancelOptions = () => ({
    color: 'primary',
});

const baseComponentStyles = {
    labelContainerStyle: {
        flexBasis: 200,
    },
    inputContainerStyle: {
        flexBasis: 150,
    },
};

const buildNoteSettingsFn = () => {
    const getNoteComponent = (props: Object) =>
        withCalculateMessages()(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: () => props.formHorizontal,
                            onGetCustomFieldLabeClass: () =>
                                `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.noteLabel}`,
                        })(
                            withDisplayMessages()(
                                withInternalChangeHandler()(TextEditor),
                            ),
                        ),
                    ),
                ),
            ),
        );
    let component = null;
    const noteSettings = (props: Object) => {
        component = component || getNoteComponent(props);
        return {
            component: getNoteComponent(props),
            componentProps: {
                style: {
                    width: '100%',
                },
                styles: baseComponentStyles,
                label: 'Comment',
            },
            propName: 'notes',
            hidden: props.formHorizontal,
            validatorContainers: [
            ],
            meta: {
                placement: placements.BOTTOM,
            },
        };
    };
    return noteSettings;
};

const buildReportDateSettingsFn = () => {
    const getReportDateComponent = (props: Object) =>
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: () => props.formHorizontal,
                            onGetCustomFieldLabeClass: () =>
                                `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
                        })(
                            withDisplayMessages()(
                                withInternalChangeHandler()(DateField),
                            ),
                        ),
                    ),
                ),
            ),
        );
    let component = null;
    const reportDateSettings = (props: Object) => {
        component = component || getReportDateComponent(props);
        return {
            component,
            componentProps: {
                width: props && props.formHorizontal ? 150 : 350,
                calendarWidth: 350,
                label: props.formFoundation.getLabel('eventDate'),
                required: true,
                styles: baseComponentStyles,
            },
            propName: 'eventDate',
            validatorContainers: getEventDateValidatorContainers(),
        };
    };

    return reportDateSettings;
};

const buildCompleteFieldSettingsFn = () => {
    const getCompleteComponent = (props: Object) =>
        withCalculateMessages(overrideMessagePropNames)(
            withFocusSaver()(
                withDefaultFieldContainer()(
                    withDefaultShouldUpdateInterface()(
                        withLabel({
                            onGetUseVerticalOrientation: () => props.formHorizontal,
                            onGetCustomFieldLabeClass: () =>
                                `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.trueOnlyLabel}`,
                        })(
                            withDisplayMessages()(
                                withInternalChangeHandler()(TrueOnlyField),
                            ),
                        ),
                    ),
                ),
            ),
        );
    let component = null;
    const completeSettings = (props: Object) => {
        component = component || getCompleteComponent(props);
        return {
            component,
            componentProps: {
                label: 'Complete event',
                styles: baseComponentStyles,
            },
            propName: 'complete',
            validatorContainers: [
            ],
            meta: {
                placement: placements.BOTTOM,
            },
        };
    };

    return completeSettings;
};

const CommentField = withDataEntryField(buildNoteSettingsFn())(DataEntry);
const ReportDateField = withDataEntryField(buildReportDateSettingsFn())(CommentField);
const CompleteField = withDataEntryField(buildCompleteFieldSettingsFn())(ReportDateField);
const FeedbackOutput = withFeedbackOutput()(CompleteField);
const IndicatorOutput = withIndicatorOutput()(FeedbackOutput);
const WarningOutput = withWarningOutput()(IndicatorOutput);
const ErrorOutput = withErrorOutput()(WarningOutput);
const SaveableDataEntry = withSaveButton(getSaveOptions)(ErrorOutput);
const CancelableDataEntry = withCancelButton(getCancelOptions)(SaveableDataEntry);

type Props = {
    formFoundation: ?RenderFoundation,
    programName: string,
    orgUnitName: string,
    onUpdateField: (innerAction: ReduxAction<any, any>) => void,
    onStartAsyncUpdateField: Object,
    onSetSaveTypes: (saveTypes: ?Array<$Values<typeof newEventSaveTypes>>) => void,
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void,
    onSaveAndAddAnother: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void,
    onCancel: () => void,
    classes: {
        savingContextContainer: string,
        savingContextText: string,
        savingContextNames: string,
        topButtonsContainer: string,
        horizontalPaper: string,
        dataEntryVerticalContainer: string,
    },
    theme: Theme,
    formHorizontal: ?boolean,
    saveTypes?: ?Array<$Values<typeof newEventSaveTypes>>
};

class NewEventDataEntry extends Component<Props> {
    fieldOptions: { theme: Theme };

    constructor(props: Props) {
        super(props);
        this.fieldOptions = {
            theme: props.theme,
            fieldLabelMediaBasedClass: props.classes.fieldLabelMediaBased,
        };
    }

    componentWillMount() {
        this.props.onSetSaveTypes(null);
    }

    componentWillUnmount() {
        inMemoryFileStore.clear();
    }

    handleSave = (itemId: string, dataEntryId: string, formFoundation: RenderFoundation, saveType?: ?string) => {
        if (saveType === newEventSaveTypes.SAVEANDADDANOTHER) {
            if (!this.props.formHorizontal) {
                this.props.onSetSaveTypes([newEventSaveTypes.SAVEANDADDANOTHER, newEventSaveTypes.SAVEANDEXIT]);
            }
            this.props.onSaveAndAddAnother(itemId, dataEntryId, formFoundation);
        } else if (saveType === newEventSaveTypes.SAVEANDEXIT) {
            this.props.onSave(itemId, dataEntryId, formFoundation);
        }
    }

    getSavingText() {
        const { classes, orgUnitName, programName } = this.props;
        const firstPart = `${i18n.t('Saving to')} `;
        const secondPart = ` ${i18n.t('in')} `;

        return (
            <span>
                {firstPart}
                <span
                    className={classes.savingContextNames}
                >
                    {programName}
                </span>
                {secondPart}
                <span
                    className={classes.savingContextNames}
                >
                    {orgUnitName}
                </span>
            </span>
        );
    }
    renderHorizontal = () => {
        const classes = this.props.classes;
        return (
            <Paper
                className={classes.horizontalPaper}
            >
                {this.renderContent()}
            </Paper>
        );
    }

    renderVertical = () => (<div className={this.props.classes.dataEntryVerticalContainer}>{this.renderContent()}</div>);

    renderContent = () => {
        const {
            formFoundation,
            onUpdateField,
            onStartAsyncUpdateField,
            onCancel,
            programName, // eslint-disable-line
            orgUnitName, // eslint-disable-line
            classes,
            formHorizontal,
            saveTypes,
        } = this.props;
        return (
            <div>
                <div>
                    <CancelableDataEntry
                        id={'singleEvent'}
                        formFoundation={formFoundation}
                        onUpdateFormField={onUpdateField}
                        onUpdateFormFieldAsync={onStartAsyncUpdateField}
                        onCancel={onCancel}
                        onSave={this.handleSave}
                        formHorizontal={formHorizontal}
                        saveTypes={saveTypes}
                        fieldOptions={this.fieldOptions}
                    />
                </div>
                <div
                    className={classes.savingContextContainer}
                >
                    <InfoIcon />
                    <div
                        className={classes.savingContextText}
                    >
                        {this.getSavingText()}
                    </div>
                </div>
            </div>
        );
    }


    render() {
        return this.props.formHorizontal ? this.renderHorizontal() : this.renderVertical();
    }
}


export default withStyles(getStyles)(withTheme()(NewEventDataEntry));
