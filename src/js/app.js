// Styles
import '../css/app.css';

import * as utils from './modules/helpers';
import { getSettings, saveTimer } from './modules/settings';
import { sounds } from './modules/sounds';
import { Notify as Toast } from './modules/vendors/notify.min';
import { isNotificationGranted, browserNotification } from './modules/notifications';
import './modules/pwa';

const countDownContainer = document.querySelector('.js-countdownContainer');
const durationContainer = document.querySelector('.js-durationContainer');
const startCountDownButton = document.getElementById('startCountDownButton');
const endCountDownButton = document.getElementById('endCountDownButton');
const pauseResumeButton = document.getElementById('pauseResumeButton');
const timerTask = document.querySelector('.js-timer__task');

const timerTaskInput = document.getElementById('timerTaskInput');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');

// Loop through duration inputs & attach event listeners
[minutesInput, secondsInput].forEach(input => {
	input.addEventListener('input', utils.validateInputs);
});


// Fade in duration container when the app loads
// getSettings: animations
if (getSettings('animations')) {
	utils.fadeIn(durationContainer, true, 'block', { add: ['fadeInLeft'], remove: ['fadeOutRight'] });
} else {
	utils.fadeIn(durationContainer, false, 'block', { add: ['fadeInLeft'], remove: ['fadeOutRight'] });
}

const minutesDisplay = document.getElementById('minutesDisplay');
const secondsDisplay = document.getElementById('secondsDisplay');
const minutesElements = minutesDisplay.children;
const secondsElements = secondsDisplay.children;


const countDownOuter = document.querySelector('.js-countdownContainer__outer');
const spinningBall = document.querySelector('.js-countdownContainer__spinning-ball');

const settingsToggle = document.querySelector('.js-actionsContainer__settings-toggle');
const settingsOptions = document.querySelector('.js-settings');

const infoButton = document.getElementById('infoButton');
const overlay = document.querySelector('.js-overlay');
const footer = document.querySelector('footer');


let isTimerRunning = false;
let isTimerDismissed = false;
let tickingAnimationTimer;
let countDownTimer;


const CURRENT_TIMER = {
	timerTask: '',
	totalDuration: 0,
	currentDuration: 0,
	dismissed: false,
	date: new Date()
}

const titleElement = document.querySelector('title');
const CURRENT_PAGE_TITLE = titleElement.innerHTML;


const tickingAnimation = (currentDuration, totalDuration) => {
	const currentDurationPercentage = (currentDuration / totalDuration) * 100;

	countDownOuter.style.backgroundImage = `conic-gradient(#fff ${currentDurationPercentage}%, #00aced 0%)`;
	spinningBall.style.transform = `rotate(${currentDurationPercentage * 3.6}deg)`;

	currentDuration++;

	return tickingAnimationTimer = setTimeout(() => {
		tickingAnimation(currentDuration, totalDuration);
	}, 1e3);
}


const durationFormatter = duration => {
	return `${Math.floor(duration / 60).toString().padStart(2, '0')}:${(duration % 60).toString().padStart(2, '0')}`;
}


const startCountDown = (minutes, seconds, skipSetup = false) => {  
	if (!skipSetup) {
		isTimerRunning = true;
		isTimerDismissed = false;
		CURRENT_TIMER.currentDuration = minutes * 60 + seconds;

		// Add 0 to arrays w/ a single element
		const minutesArray = `${minutes}`.padStart(2, '0').split('');
		const secondsArray = `${seconds}`.padStart(2, '0').split('');

		// Loop through the minutesDisplay span elements & update their innerText
		[...minutesElements].forEach((_element, index, array) => {
			if (array[index].innerText !== minutesArray[index]) {
				array[index].innerText = minutesArray[index];
			}
		});

		// Loop through the secondsDisplay span elements & update their innerText
		[...secondsElements].forEach((_element, index, array) => {
			if (array[index].innerText !== secondsArray[index]) {
				array[index].innerText = secondsArray[index];
			}
		});

		// Log current duration to console
		// console.log(minutesArray.join(''), ':', secondsArray.join(''));
		// Add current duration to title bar + app state
		titleElement.innerHTML = `${durationFormatter(CURRENT_TIMER.currentDuration)} - ${CURRENT_PAGE_TITLE} [Running]`;

		seconds--;

		// Some magic ✨
		if (minutes > 0 && seconds === -1) {
			minutes--; seconds = 59;
		} else if (minutes === 0 && seconds === -1) {
			setTimeout(() => endCountDown(), 1e3);
		}
	}

	// Return the function one (1) second later w/ updated values
	return (countDownTimer = setTimeout(() => {
		startCountDown(minutes, seconds);

		// getSettings: secondTickSound
		// Play secondTick sound
		if (getSettings('secondTickSound')) sounds.play('secondTick');
	}, skipSetup ? 0 : 1e3));
}


const endCountDown = async () => {
	isTimerRunning = false;
	isTimerDismissed = true;
  
	clearTimeout(countDownTimer);
	clearTimeout(tickingAnimationTimer);

	// Show initial page title
	titleElement.innerHTML = CURRENT_PAGE_TITLE;

	// getSettings: timerCompletedSound/timerCancelledSound
	if (CURRENT_TIMER.currentDuration === 0) {
		// Play timerCompleted sound
		if (getSettings('timerCompletedSound')) sounds.play('timerCompleted');

		// BrowserNotification: timerCompleted
		if (getSettings('browserNotifications') && isNotificationGranted()) {
			browserNotification('🚀 Timer Completed ~ Chrono App', [`⏲ Total Duration: ${durationFormatter(CURRENT_TIMER.totalDuration)}`, `🛠 Task: ${CURRENT_TIMER.timerTask}`].join('\n'));
		}
	} else {
		// Set CURRENT_TIMER.dismissed to true
		CURRENT_TIMER.dismissed = true;

		// Play timerCancelled sound
		if (getSettings('timerCancelledSound')) sounds.play('timerCancelled');

		// BrowserNotification: timerCancelled
		if (getSettings('browserNotifications') && isNotificationGranted()) {
			browserNotification('❌ Timer Cancelled ~ Chrono App', [`🕚 Current Duration: ${durationFormatter(CURRENT_TIMER.currentDuration)}`, `⏲ Total Duration: ${durationFormatter(CURRENT_TIMER.totalDuration)}`, `🛠 Task: ${CURRENT_TIMER.timerTask}`].join('\n'));
		}
	}
	

	// getSettings: animations
	if (getSettings('animations')) {
		await utils.fadeOut(countDownContainer, true, 'none', { add: ['fadeOutRight'], remove: ['fadeInLeft'] });
		await utils.fadeIn(durationContainer, true, 'block', { add: ['fadeInLeft'], remove: ['fadeOutRight'] });
	} else {
		await utils.fadeOut(countDownContainer, false, 'none', { add: ['fadeOutRight'], remove: ['fadeInLeft'] });
		await utils.fadeIn(durationContainer, false, 'block', { add: ['fadeInLeft'], remove: ['fadeOutRight'] });
	}

	endCountDownButton.classList.remove('countdownContainer__end-button--visible');
	pauseResumeButton.classList.remove('countdownContainer__pauseresume-button--visible');

	// Hide timerTask element & clear it's innerText
	await utils.fadeOut(timerTask, true, 'none', { add: ['bounceOutUp'], remove: ['bounceInDown'] });
	timerTask.addEventListener('animationend', () => {
		!isTimerRunning && (timerTask.querySelector('span').innerText = '');
	})

	// Enable endCountDownButton & pauseResumeButton
	utils.enableElement(endCountDownButton);
	utils.enableElement(pauseResumeButton);

	// Save CURRENT_TIMER
	saveTimer(CURRENT_TIMER);

	// Reset CURRENT_TIMER object
	CURRENT_TIMER.timerTask = '';
	CURRENT_TIMER.totalDuration = 0;
	CURRENT_TIMER.currentDuration = 0;
	CURRENT_TIMER.dismissed = false;

	countDownOuter.style.backgroundImage = ''; spinningBall.style.transform = '';
  
	[...minutesElements, ...secondsElements].forEach(element => element.innerText = '0');
}


startCountDownButton.addEventListener('click', async () => {
	// Play buttonClick sound
	if (getSettings('buttonClickSound')) sounds.play('buttonClick');
	
	const totalMinutes = parseInt(minutesInput.value) || 0;
	const totalSeconds = parseInt(secondsInput.value) || 0;
	const totalDuration = (totalMinutes * 60) + totalSeconds;
	
	// Checks if the timerTask input is empty
	if (!/\S/.test(timerTaskInput.value.trim())) {
		utils.disableElement(startCountDownButton, 50, 3.45e3);
		return Toast({
			title: 'Enter the task you want to do', type: 'warning',
			position: 'bottom center', duration: 3.5e3
		})
	}
	
	// Checks if the minutes or seconds input is empty
	if (!minutesInput.value || !secondsInput.value) {
		utils.disableElement(startCountDownButton, 50, 3.45e3);
		return Toast({
			title: 'Enter the duration in minutes & seconds', type: 'warning',
			position: 'bottom center', duration: 3.5e3
		})
	}
	
	// Checks if the total duration of values entered are greater than 0
	if (minutesInput.value && secondsInput.value && totalDuration === 0) {
		utils.disableElement(startCountDownButton, 50, 3.45e3);
		return Toast({
			title: 'Enter values greater than 0!', type: 'warning',
			position: 'bottom center', duration: 3.5e3
		})
	}

	// Checks if the total duration is less than/equal to the max duration allowed (99:59)
	if (totalDuration > 0 && totalMinutes <= 99 && totalSeconds <= 59) {
		// getSettings: animations
		if (getSettings('animations')) {
			await utils.fadeOut(durationContainer, true, 'none', { add: ['fadeOutRight'], remove: ['fadeInLeft'] });
			await utils.fadeIn(countDownContainer, true, 'block', { add: ['fadeInLeft'], remove: ['fadeOutRight'] });
		} else {
			await utils.fadeOut(durationContainer, false, 'none', { add: ['fadeOutRight'], remove: ['fadeInLeft'] });
			await utils.fadeIn(countDownContainer, false, 'block', { add: ['fadeInLeft'], remove: ['fadeOutRight'] });
		}

		endCountDownButton.classList.add('countdownContainer__end-button--visible');
		pauseResumeButton.classList.add('countdownContainer__pauseresume-button--visible');

		// Show pause icon SVG path, hide the resume icon SVG path
		pauseResumeButton.querySelector('.countdownContainer__pauseresume-button--pause').classList.remove('countdownContainer__pauseresume-button--hidden');
		pauseResumeButton.querySelector('.countdownContainer__pauseresume-button--resume').classList.add('countdownContainer__pauseresume-button--hidden');

		// Reset CURRENT_TIMER's values
		CURRENT_TIMER.totalDuration = totalDuration;
		CURRENT_TIMER.currentDuration = 0;
		CURRENT_TIMER.timerTask = timerTaskInput.value;
		CURRENT_TIMER.date = new Date();
		CURRENT_TIMER.dismissed = false;

		// Start the countdown & ticking animation
		startCountDown(totalMinutes, totalSeconds);
		tickingAnimation(0, totalDuration);

		// Show current task title
		timerTask.querySelector('span').innerText = timerTaskInput.value;
		timerTask.setAttribute('aria-label', timerTaskInput.value);
		await utils.fadeIn(timerTask, true, 'block', { add: ['bounceInDown'], remove: ['bounceOutUp'] });

		// Resets the value of the minutes & seconds input to 00
		minutesInput.value = '00'; secondsInput.value = '00';

		// Resets task title input
		timerTaskInput.value = '';

		// BrowserNotification: startCountdown
		if (getSettings('browserNotifications') && isNotificationGranted()) {
			browserNotification('✅ Timer Started ~ Chrono App', [`⏲ Duration: ${durationFormatter(CURRENT_TIMER.totalDuration)}`, `🛠 Task: ${CURRENT_TIMER.timerTask}`].join('\n'));
		}
	} else {
		utils.disableElement(startCountDownButton, 50, 3.45e3);
		return Toast({
			title: 'Invalid input(s)!', type: 'danger',
			position: 'bottom center', duration: 3.5e3
		})
	}
})

endCountDownButton.addEventListener('click', () => {
	// Ask user for confirmation...

	if (isTimerDismissed) return;

	// Disable endCountDownButton & pauseResumeButton
	utils.disableElement(endCountDownButton);
	utils.disableElement(pauseResumeButton);
	endCountDown();
});


pauseResumeButton.addEventListener('click', () => {
	if (isTimerRunning) {
		pauseResumeButton.setAttribute('title', 'Resume Timer');

		pauseResumeButton.querySelector('.countdownContainer__pauseresume-button--pause').classList.add('countdownContainer__pauseresume-button--hidden');
		pauseResumeButton.querySelector('.countdownContainer__pauseresume-button--resume').classList.remove('countdownContainer__pauseresume-button--hidden');

		clearTimeout(countDownTimer);
		clearTimeout(tickingAnimationTimer);

		// Change [Running] to [Paused] in title bar
		titleElement.innerHTML = titleElement.innerHTML.replace('[Running]', '[Paused]');

		isTimerRunning = false;
	} else {
		if (isTimerDismissed) return;
    
		pauseResumeButton.setAttribute('title', 'Pause Timer');

		pauseResumeButton.querySelector('.countdownContainer__pauseresume-button--pause').classList.remove('countdownContainer__pauseresume-button--hidden');
		pauseResumeButton.querySelector('.countdownContainer__pauseresume-button--resume').classList.add('countdownContainer__pauseresume-button--hidden');

		// console.log('Current Duration:', CURRENT_TIMER.currentDuration);
		// console.log('Total Duration:', CURRENT_TIMER.totalDuration);

		startCountDown(Math.floor(CURRENT_TIMER.currentDuration / 60), (CURRENT_TIMER.currentDuration % 60), true);
		tickingAnimation(CURRENT_TIMER.totalDuration - CURRENT_TIMER.currentDuration, CURRENT_TIMER.totalDuration);

		isTimerRunning = true;
	}
})


settingsToggle.addEventListener('click', () => {
	// getSettings: animations
	settingsToggle.classList.toggle('active');
	if (getSettings('animations')) {
		utils.slideToggle(settingsOptions, 350);
	} else {
		utils.slideToggle(settingsOptions, 0);
	}
});


// Show footer & overlay
infoButton.addEventListener('click', () => {
	// Play buttonClick sound
	if (getSettings('buttonClickSound')) sounds.play('buttonClick');

	overlay.classList.add('overlay--visible');
	utils.disableElement(infoButton);

	// getSettings: animations
	if (getSettings('animations')) {
		// Fade in footer
		utils.fadeIn(footer, true, 'block', { add: ['bounceInUp'], remove: ['bounceOutDown'] });
	} else {
		utils.fadeIn(footer, false, 'block', { add: ['bounceInUp'], remove: ['bounceOutDown'] });
	}
})


// Hide footer & overlay
overlay.addEventListener('click', () => {
	setTimeout(() => {
		overlay.classList.remove('overlay--visible');
		utils.enableElement(infoButton);
	}, getSettings('animations') ? 500 : 0);
  
	// getSettings: animations
	if (getSettings('animations')) {
		// Fade in footer
		utils.fadeOut(footer, true, 'block', { add: ['bounceOutDown'], remove: ['bounceInUp'] });
	} else {
		utils.fadeOut(footer, false, 'block', { add: ['bounceOutDown'], remove: ['bounceInUp'] });
	}
})