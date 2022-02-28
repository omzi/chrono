class Sound {
	constructor() {
		this.rawSoundsLists = {
			buttonClick: {
				src: '../sounds/buttonClick.mp3'
			},
			secondTick: {
				src: '../sounds/secondTick.mp3'
			},
			timerCompleted: {
				src: '../sounds/timerCompleted.mp3'
			},
			timerCancelled: {
				src: '../sounds/timerCancelled.mp3'
			}
		}
		this.loadedSounds = {};
		this.soundsLists = {};

		this.init();
	}

	async init() {
		await this.loadSounds(this.rawSoundsLists);

		// eslint-disable-next-line guard-for-in
		for (const sound in this.loadedSounds) {
			const audio = new Audio();
			audio.src = this.loadedSounds[sound].src;
			this.soundsLists[sound] = { audio };
		}
	}

	play(sound) {
		if (sound in this.soundsLists) {
			this.soundsLists[sound].audio.currentTime = 0;
			this.soundsLists[sound].audio.play();
		} else {
			console.warn(`[Warning]: Invalid sound key (${sound}). Available sound keys: ${Object.keys(this.soundsLists)}.`);
		}
	}

	loadSounds(sounds) {
		return new Promise((resolve, reject) => {
			const soundKeys = Object.keys(sounds);
			const soundDetails = Object.values(sounds);
			console.log(`Loading ${soundKeys.length} SoundKey${soundKeys.length > 1 ? 's' : ''}...`);

			soundDetails.forEach(({ src }, index) => {
				fetch(src).then(response => response.blob())
					.then(audioBlob => {
						const audioBlobUrl = URL.createObjectURL(audioBlob);
						this.loadedSounds[soundKeys[index]] = { src: audioBlobUrl };
						if ((soundKeys.length - 1) === index) {
							resolve();
							console.log(`All Sounds loaded [${soundKeys.length} Sound${soundKeys.length > 1 ? 's' : ''}]!`);
						} else {
							console.log(`Loaded ${index + 1} / ${soundKeys.length} Sound${soundKeys.length > 1 ? 's' : ''}...`);
						}
					}).catch(error => {
						this.loadedSounds[soundKeys[index]] = { src };
						if ((soundKeys.length - 1) === index) reject(error);
					})
			});
		});
	}
}

const _sounds = new Sound();

export const sounds = _sounds;