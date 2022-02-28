/* eslint-disable prefer-promise-reject-errors */
// Helper Functions


/**
 * Slides up/collapses an element in a specified duration
 * @param {HTMLElement} target The element you want to collapse
 * @param {Number} duration The duration for the 'slideUp'
 */
const slideUp = (target, duration = 500) => {
	target.style.transitionProperty = 'height, margin, padding';
	target.style.transitionDuration = `${duration  }ms`;
	target.style.boxSizing = 'border-box';
	target.style.height = `${target.offsetHeight  }px`;
	target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	window.setTimeout(() => {
		target.style.display = 'none';
		target.style.removeProperty('height');
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
	}, duration);
}


/**
 * Slides down/expands an element in a specified duration
 * @param {HTMLElement} target The element you want to expand
 * @param {Number} duration The duration for the 'slideDown'
 */
const slideDown = (target, duration = 500) => {
	target.style.removeProperty('display');
	let {display} = window.getComputedStyle(target);

	if (display === 'none')
		display = 'block';

	target.style.display = display;
	const height = target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	target.offsetHeight;
	target.style.boxSizing = 'border-box';
	target.style.transitionProperty = 'height, margin, padding';
	target.style.transitionDuration = `${duration  }ms`;
	target.style.height = `${height  }px`;
	target.style.removeProperty('padding-top');
	target.style.removeProperty('padding-bottom');
	target.style.removeProperty('margin-top');
	target.style.removeProperty('margin-bottom');
	window.setTimeout(() => {
		target.style.removeProperty('height');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
	}, duration);
}


/**
 * Slide toggles an element up or down
 * @param {HTMLElement} target The HTML element you want to slideToggle
 * @param {Number} duration 
 * @return {slideDown | slideUp}
 */
export const slideToggle = (target, duration = 500) => {
	if (window.getComputedStyle(target).display === 'none') {
		return slideDown(target, duration);
	} else {
		return slideUp(target, duration);
	}
}


/**
 * 
 * @param {Event} e An event to execute the function for
 */
export const validateInputs = e => {
	if (!parseInt(e.target.value) || (parseInt(e.target.value) < parseInt(e.target.min))) {
		e.target.value = e.target.min;
	} else if (parseInt(e.target.value) > parseInt(e.target.max)) {
		e.target.value = e.target.max;
	}

	const {length} = e.target.value;
	if (length === 1) {
		e.target.value = `0${e.target.value}`;
	} else if (length > 2) {
		e.target.value = e.target.value.substring(length - 2, length);
	}
}


const elementMap = new WeakMap();

/**
 * Fade's in a specified HTML element
 * @param {HTMLElement} element Any 'invisible' HTML element
 * @param {Boolean} smooth Specifies whether the transition should be 'animated'. Default is true
 * @param {String} displayStyle The display value of the element after fadeIn
 * @param {{ add: [], remove: [] }} classes An object of classes to add and/or remove from the element
 * @return {void}
 */
export const fadeIn = (element, smooth = true, displayStyle = 'block', classes = { add: [], remove: []}) => {
	if (!elementMap.has(element)) elementMap.set(element, { isAnimating: false });

	return new Promise((resolve, reject) => {
		if (elementMap.get(element).isAnimating) return reject();
		if (classes.add && classes.add.length) element.classList.add(...classes.add);
		if (classes.remove && classes.remove.length) element.classList.remove(...classes.remove);

		elementMap.get(element).isAnimating = true;
		element.style.opacity = 0;
		element.style.display = displayStyle;
		if (smooth) {
			let request; let opacity = 0;
			const animation = () => {
				element.style.opacity = opacity += 0.025;
				if (opacity >= 1) {
					element.style.opacity = opacity = 1;
					cancelAnimationFrame(request);
					elementMap.get(element).isAnimating = false;
					resolve();
				}
			}

			const animationFrame = () => {
				request = requestAnimationFrame(animationFrame);
				animation();
			}; animationFrame();
		} else {
			elementMap.get(element).isAnimating = false;
			element.style.opacity = 1;
			element.style.display = displayStyle;
			resolve();
		}
	});
}


/**
 * Fade's out a specified HTML element
 * @param {HTMLElement} element Any visible HTML element
 * @param {Boolean} smooth Specifies whether the transition should be 'animated'. Default is true
 * @param {String} displayStyle The display value of the element after fadeOut
 * @param {{ add: [], remove: [] }} classes 
 * @return {void}
 */
export const fadeOut = (element, smooth = true, displayStyle = 'none', classes = { add: [], remove: []}) => {
	return new Promise((resolve, reject) => {
		if (elementMap.get(element).isAnimating) return reject();
		if (classes.add && classes.add.length) element.classList.add(...classes.add);
		if (classes.remove && classes.remove.length) element.classList.remove(...classes.remove);

		if (smooth) {
			let request; let opacity = element.style.opacity || 1;
			const animation = () => {
				element.style.opacity = opacity -= 0.025;
				if (opacity <= 0) {
					element.style.opacity = opacity = 0;
					element.style.display = displayStyle;
					cancelAnimationFrame(request);
					elementMap.get(element).isAnimating = false;
					resolve();
				}
			}

			const animationFrame = () => {
				request = requestAnimationFrame(animationFrame); animation();
			}; animationFrame();
		} else {
			elementMap.get(element).isAnimating = false;
			element.style.opacity = 0;
			element.style.display = displayStyle;
			resolve();
		}
	});
}


/**
 * 
 * @param {HTMLElement} element Any HTML element
 * @param {Number} delay The period before the element gets disabled (in milliseconds)
 * @param {Number} duration The period the element should remain disabled (in milliseconds)
 * @param {String[]} classes The classes to add to the element
 * @return {Number | void}
 */
export const disableElement = (element, delay, duration, classes = []) => {
	if (Number(delay)) {
		return setTimeout(() => disableElement(element, 0, duration), delay);
	}

	element.setAttribute('disabled', true);
	element.classList.add('disabled');
	if (classes.length) element.classList.add(...classes);

	if (Number(duration)) {
		setTimeout(() => {
			element.removeAttribute('disabled'); element.classList.remove('disabled');
		}, duration);
	}
}


/**
 * 
 * @param {HTMLElement} element Any HTML element
 * @param {String[]} classes The classes to remove from the element
 */
export const enableElement = (element, classes = []) => {
	element.removeAttribute('disabled');
	element.classList.remove('disabled');

	if (classes.length) element.classList.add(...classes);
}