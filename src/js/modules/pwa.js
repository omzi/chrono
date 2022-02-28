const registerServiceWorker = (retry = false) => {
	if (retry) {
		console.log('[i] Attempting to re-register service worker...');
	}

	return new Promise(async (resolve, reject) => {
		try {
			const registration = await navigator.serviceWorker.register('/sw.js');
			console.log(`[i] Service worker ${retry ? 're-registered' : 'registered'} successfully! \n`, registration);
			resolve(registration);
		} catch (error) {
			console.log(`[x] Service worker ${retry ? 're-registration' : 'registration'} failed! \n`, error);
			reject(error);
		}
	});
}


const installButton = document.getElementById('installButton');
let deferredPrompt;

// Show install prompt
const showInstallPrompt = async () => {
	deferredPrompt.prompt();
	// Wait for the user to respond to the prompt
	const { outcome } = await deferredPrompt.userChoice;
	// Optionally, send analytics event with outcome of user choice
	console.log(`User response to the install prompt: ${outcome}`);
	// We've used the prompt, and can't use it again, throw it away
	deferredPrompt = null;
}

// Service Worker registration
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		// Catch error from service worker registration
		registerServiceWorker().catch(() => {
			if (navigator.onLine) {
				console.log('[i] Retrying service worker registration in 5 seconds...');
				setTimeout(() => registerServiceWorker(true), 5e3);
			} else {
				console.log(`[i] You're currently offline. Service registration will be begin when you're online.`);
				window.addEventListener('online', registerServiceWorker.bind(true));
			}
		})

		// Prevent the mini-infobar from showing
		window.addEventListener('beforeinstallprompt', e => {
			e.preventDefault();
			// Stash the event so it can be triggered later.
			deferredPrompt = e;
      
			setTimeout(() => {
				// Add the '--visible' class to the install button.
				installButton.classList.add('install__button--visible');
				installButton.classList.remove('disabled');
			}, 3e3);
		});

		window.addEventListener('appinstalled', () => {
			installButton.classList.remove('install__button--visible');
			installButton.classList.add('disabled');

			// Clear the deferredPrompt so it can be garbage collected
			deferredPrompt = null;
			// Optionally, send analytics event to indicate successful install
			console.log('PWA was installed');
		});

		installButton.addEventListener('click', showInstallPrompt);
	})
}