// @flow
/* eslint-disable import/prefer-default-export */
import log from 'loglevel';
import { init, config, getUserSettings, getManifest } from 'd2/lib/d2';
import environments from 'capture-core/constants/environments';
import moment from 'capture-core/utils/moment/momentResolver';
import CurrentLocaleData from 'capture-core/utils/localeData/CurrentLocaleData';
import { setD2, getTranslation } from 'capture-core/d2/d2Instance';
import { formatterOptions } from 'capture-core/utils/string/format.const';


import 'moment/locale/nb';

import loadMetaData from 'capture-core/metaDataStoreLoaders/baseLoader/metaDataLoader';
import buildMetaData from 'capture-core/metaDataMemoryStoreBuilders/baseBuilder/metaDataBuilder';

import type { LocaleDataType } from 'capture-core/utils/localeData/CurrentLocaleData';

function setLogLevel() {
    const levels = {
        [environments.dev]: log.levels.DEBUG,
        [environments.devDebug]: log.levels.TRACE,
        [environments.test]: log.levels.INFO,
        [environments.prod]: log.levels.ERROR,
    };

    // $FlowSuppress
    let level = levels[process.env.NODE_ENV];
    if (!level && level !== 0) {
        level = log.levels.ERROR;
    }

    log.setLevel(level);
}

async function initializeManifest() {
    const manifest = await getManifest('manifest.webapp');
    const baseUrl = manifest.getBaseUrl();
    config.baseUrl = `${baseUrl}/api`;
    log.info(`Loading: ${manifest.name} v${manifest.version}`);
}

function configI18n(keyUiLocale: string) {
    const locale = keyUiLocale || 'en';
    config.i18n.sources.add(`i18n/module/i18n_module_${locale}.properties`);
    return keyUiLocale;
}

// TODO: Make api-requests?
function getLocaleSpecs(locale: string) {
    const fallbackLocale = 'en';
    let calculatedLocale = locale;
    try {
        if (locale !== 'en') {
            require(`moment/locale/${locale}`);
        }
    } catch (error) {
        log.error(`could not get moment locale for ${locale}`);
        calculatedLocale = fallbackLocale;
    }

    let dateFnLocale;
    try {
        dateFnLocale = require(`date-fns/locale/${locale}`);
    } catch (error) {
        log.error(`could not get date-fns locale for ${locale}`);
        dateFnLocale = require('date-fns/locale/en');
        calculatedLocale = fallbackLocale;
    }

    return {
        calculatedLocale,
        dateFnLocale,
    };
}

function setLocaleData(uiLocale: string) { //eslint-disable-line
    const locale = 'en';
    const { calculatedLocale, dateFnLocale } = getLocaleSpecs(locale);
    moment.locale(calculatedLocale);
    const weekdays = moment.weekdays();
    const weekdaysShort = moment.weekdaysShort();
    // $FlowSuppress
    const firstDayOfWeek = moment.localeData()._week.dow; //eslint-disable-line
    const localeData: LocaleDataType = {
        dateFnsLocale: dateFnLocale,
        weekDays: weekdays,
        weekDaysShort: weekdaysShort,
        calendarFormatHeaderLong: 'dddd D MMM',
        calendarFormatHeaderShort: 'D MMM',
        selectDatesText: getTranslation('choose_one_or_more_dates', formatterOptions.CAPITALIZE_FIRST_LETTER),
        selectDateText: getTranslation('choose_a_date', formatterOptions.CAPITALIZE_FIRST_LETTER),
        todayLabelShort: getTranslation('today', formatterOptions.CAPITALIZE_FIRST_LETTER),
        todayLabelLong: getTranslation('today', formatterOptions.CAPITALIZE_FIRST_LETTER),
        weekStartsOn: firstDayOfWeek,
    };

    CurrentLocaleData.set(localeData);
}

/*
async function getSystemSettings(d2: D2) {
    const systemSettings = await d2.system.settings.all();
    return systemSettings;
}
*/

async function initializeMetaData(dbLocale: string) {
    await loadMetaData();
    await buildMetaData(dbLocale);
}

export async function initialize() {
    setLogLevel();

    await initializeManifest();
    const userSettings = await getUserSettings();
    configI18n(userSettings.keyUiLocale);
    const d2 = await init();
    setD2(d2);
    // const systemSettings = await getSystemSettings(d2);

    const uiLocale = userSettings.keyUiLocale;
    const dbLocale = userSettings.keyDbLocale;
    setLocaleData(uiLocale);
    await initializeMetaData(dbLocale);
}

