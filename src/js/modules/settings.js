import { requestNotificationPermission, isNotificationGranted } from './notifications';

const _APP_SETTINGS = JSON.parse(localStorage.getItem(':CountDownTimerSettings')) || {};
const settingsOptions = document.querySelectorAll('[data-setting]');


// const _APP_SETTINGS = {
//   animations: Boolean,
//   browserNotifications: Boolean,
//   buttonClickSound: Boolean,
//   secondTickSound: Boolean,
//   timerCompletedSound: Boolean,
//   timerCancelledSound: Boolean,
//   previousTimers: [
//     {
//       taskTitle: String,
//       currentDuration: Number,
//       totalDuration: Number,
//       dismissed: Boolean,
//       date: Date
//     }
//   ]
// }


if (!('animations' in _APP_SETTINGS)) {
	_APP_SETTINGS.animations = true;
}

if (!('browserNotifications' in _APP_SETTINGS) || !isNotificationGranted()) {
	_APP_SETTINGS.browserNotifications = false;
}

if (!('buttonClickSound' in _APP_SETTINGS)) {
	_APP_SETTINGS.buttonClickSound = true;
}

if (!('secondTickSound' in _APP_SETTINGS)) {
	_APP_SETTINGS.secondTickSound = false;
}

if (!('timerCompletedSound' in _APP_SETTINGS)) {
	_APP_SETTINGS.timerCompletedSound = true;
}

if (!('timerCancelledSound' in _APP_SETTINGS)) {
	_APP_SETTINGS.timerCancelledSound = false;
}

if (!('previousTimers' in _APP_SETTINGS)) {
	_APP_SETTINGS.previousTimers = [];
}


if (!_APP_SETTINGS.animations) document.body.classList.add('disableAnimation');


/**
 * Returns the value of a setting or all settings
 * @param {String|undefined} setting The setting to get it's value
 * @return {String|null|JSON}
 */
export const getSettings = setting => {
	if (setting) {
		try {
			return JSON.parse(localStorage.getItem(':CountDownTimerSettings'))[setting];
		} catch {
			return null;
		}
	} else {
		return JSON.parse(localStorage.getItem(':CountDownTimerSettings')) || {};
	}
}

export const saveSettings = (updatedSettings) => {
	localStorage.setItem(':CountDownTimerSettings', JSON.stringify(updatedSettings));
}

saveSettings(_APP_SETTINGS);


const _handleSettingsChange = async ({ setting, value, element }) => {
	switch (setting) {
	case 'animations': {
		value
			? document.body.classList.remove('disableAnimation')
			: document.body.classList.add('disableAnimation')
		break;
	}

	case 'browserNotifications': {
		element.checked = value && isNotificationGranted();

		try {
			await requestNotificationPermission();
		} catch {
			value = isNotificationGranted();
		}

		element.checked = value;
		break;
	}
    // Other settings option don't require an immediate global change
	}

  
	// Save updated settings
	const newSettings = getSettings();
	newSettings[setting] = value;
	saveSettings(newSettings);
}

settingsOptions.forEach(option => {
	option.checked = _APP_SETTINGS[option.dataset['setting']];
  
	option.addEventListener('change', e => {
		const element = e.target.closest('input');
		const { dataset, checked: value } =  element;
		_handleSettingsChange({ setting: dataset.setting, value, element });
	})
})


/**
 * 
 * @param {{
		timerTask: String,
		totalDuration: Number,
		currentDuration: Number,
		dismissed: Boolean,
		date: Date
	}} timer The timer object
 */
export const saveTimer = timer => {
	// Save new timer
	const newSettings = getSettings();
	newSettings['previousTimers'].push(timer);
	saveSettings(newSettings);
}