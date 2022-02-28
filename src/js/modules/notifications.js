/* eslint-disable prefer-promise-reject-errors */
import { Notify } from './vendors/notify.min';

const NOTIFICATION_STATES = {
	DEFAULT: 'default',
	ACCEPTED: 'granted',
	REJECTED: 'denied'
}


export const requestNotificationPermission = () => {
	return new Promise(async (resolve, reject) => {
		if (!('Notification' in window)) reject();

		if (isNotificationGranted()) {
			resolve();
		} else {
			const permission = await Notification.requestPermission();

			switch (permission) {
			case NOTIFICATION_STATES.ACCEPTED: {
				Notify({
					title: `Notification permission granted!`, type: 'success',
					position: 'top center', duration: 3.5e3
				})
				return resolve();
			}
        
			case NOTIFICATION_STATES.REJECTED: {
				Notify({
					title: 'Notification prompt was rejected', type: 'danger',
					position: 'top center', duration: 3.5e3
				})
				return reject();
			}
        
			case NOTIFICATION_STATES.DEFAULT: {
				Notify({
					title: `You've not accepted the notification prompt`, type: 'warning',
					position: 'top center', duration: 3.5e3
				})
				return reject();
			}
			}
		}
	});
}


export const isNotificationGranted = () => {
	return ('Notification' in window)
		? Notification.permission === NOTIFICATION_STATES.ACCEPTED
		: false;
}


export const browserNotification = (title, body, icon) => {
	const notification = new Notification(title, { body, icon: icon || '/logoCircle.png' });

	notification.addEventListener('click', e => {
		window.parent.focus();
		e.target.close();
	})

	return notification;
}