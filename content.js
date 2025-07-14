const MENTION_NAME_CLICKABLE = ['mention-name', 'clickable'];
const TRUNCATE_QUOTE_NAME = ['truncate', 'quote-name'];
const WRAPPER_IGNORE = ['.file-message-v2.file-message__container'];

const TAGS = [
	{
		wrapperSelector: '.message-content-wrapper',
		targetSelector: [
			'span.text',
			'div.message-quote-fragment__description',
			'div.truncate.quote-name',
			'div.truncate',
			'a.mention-name.clickable',
			'a.text-is-link',
			'a.text-is-email',
		]
	},
	{
		wrapperSelector: '.zl-modal__dialog.flx.flx-col.animated.zoomIn',
		targetSelector: ['div.truncate']
	},
	{
		wrapperSelector: '.flx.flx-center.slideshow',
		targetSelector: ['div.truncate']
	},
];

// const TAGS = [
//   { wrapperSelector: '.message-content-wrapper', targetSelector: 'span.text' },
//   { wrapperSelector: '.message-content-wrapper', targetSelector: 'div.message-quote-fragment__description' },
//   { wrapperSelector: '.message-content-wrapper', targetSelector: 'div.truncate.quote-name' },
//   { wrapperSelector: '.message-content-wrapper', targetSelector: 'div.truncate' },
//   { wrapperSelector: '.message-content-wrapper', targetSelector: 'a.mention-name.clickable' },
//   { wrapperSelector: '.message-content-wrapper', targetSelector: 'a.text-is-link' },
//   { wrapperSelector: '.message-content-wrapper', targetSelector: 'a.text-is-email' },
//   { wrapperSelector: '.zl-modal__dialog.flx.flx-col.animated.zoomIn', targetSelector: 'div.truncate' },
//   { wrapperSelector: '.flx.flx-center.slideshow', targetSelector: 'div.truncate' },
// ];



const HIDE_DIGIT = '•';
const REACT_VIRTUALIZED_GRID = 'ReactVirtualized__Grid__innerScrollContainer';
const MESSAGE_VIEW_SCROLL_INNER = 'message-view__scroll__inner';

const MSG_ITEM = '.msg-item';
const TRUNCATE = '.truncate';
const MESSAGE_CONTENT_WRAPPER = '.message-content-wrapper';
const SPAN_TEXT = 'span.text';

const CONV_ITEM_TITLE_NAME = 'conv-item-title__name';
const CONV_ITEM_BODY = 'conv-item-body';
const TRANSFORM_GPU = 'transform-gpu';
const MESSAGE_ACTION = 'message-action';



const observer = new MutationObserver((mutationsList) => {
	processMutationList(mutationsList);
});
observer.observe(document.body, { childList: true, subtree: true });

function processMutationList(mutationsList) {
	if (mutationsList) {
		mutationsList.forEach(mutation => {
			processAddedNodes(mutation.addedNodes);
			processTargetNode(mutation.target);
			processNextSiblingNode(mutation.nextSibling);
		});
	}
}

function processAddedNodes(addedNodes) {
	if (addedNodes && addedNodes.length > 0) {
		addedNodes.forEach(node => {
			processNodeElement(node);
		});
	}
}

function processTargetNode(node) {
	if (node) {
		if (node.classList && (
			node.classList.contains(REACT_VIRTUALIZED_GRID)
			|| node.classList.contains(MESSAGE_VIEW_SCROLL_INNER))) {
			processNodeElement(node);
		}
	}
}

function processNextSiblingNode(node) {
	if (node && node.classList && node.classList.contains(MESSAGE_ACTION)) {
		console.log('Processing next sibling node:', node);
		processNodeElement(node);
	}
}

function processNodeElement(node) {
	if (node && node.nodeType === Node.ELEMENT_NODE) {
		if (node.classList) {
			processElementReactVirtualizedGrid(node);
			processElementMessageContentWrapper(node);
			processElementMessageAction(node);
		}
	}
}

function processElementReactVirtualizedGrid(node) {
	if (node.classList.contains(REACT_VIRTUALIZED_GRID)) {
		const elements = node.querySelectorAll(`${MSG_ITEM} ${TRUNCATE}`);
		if (elements) {
			elements.forEach(element => {
				if (!element.dataset.maskHoverBound) {
					let length = 0;
					if (element.classList.contains(CONV_ITEM_TITLE_NAME)) {
						length = 10;
					} else if (element.classList.contains(CONV_ITEM_BODY)) {
						length = 11;
					}

					if (length > 0) {
						element.textContent = HIDE_DIGIT.repeat(length);
						element.dataset.maskHoverBound = true;
					}
				}
			});
		}
	}
}

function processElementMessageContentWrapper(node) {
	if (node.classList.contains(MESSAGE_VIEW_SCROLL_INNER)) {
		const elements = node.querySelectorAll(MESSAGE_CONTENT_WRAPPER);
		if (elements) {
			elements.forEach(element => {
				if (!element.dataset.isNotFirstTime) {
					processEventListener(null, false, element);
					element.dataset.isNotFirstTime = true;
				}

				if (!element.dataset.eventAttached) {
					element.addEventListener('mouseenter', (event) => { processEventListener(event, true); });
					element.addEventListener('mouseleave', (event) => { processEventListener(event, false); });
					element.dataset.eventAttached = true;
				}
			});
		}
	}
}

function processElementMessageAction(node) {
	if (node.classList.contains(MESSAGE_ACTION)) {
		const element = node.closest(MESSAGE_VIEW_SCROLL_INNER);
		if (element && element.classList) {
			processElementMessageContentWrapper(element);
		}
	}
}

function processEventListener(event, isShowDigit, element = null) {
	if (element || (event && event.target)) {
		const elements = element ? element.querySelectorAll(SPAN_TEXT) : event.target.querySelectorAll(SPAN_TEXT);
		if (elements) {
			elements.forEach(element => {
				if (isShowDigit) {
					showDigit(element);
				} else {
					hideDigit(element);
				}
			});
		}
	}
}

function hideDigit(element) {
	if (element && !element.dataset.originalText) {
		element.dataset.originalText = element.textContent;
		element.textContent = HIDE_DIGIT.repeat(element.textContent.length);
	}
}

function showDigit(element) {
	if (element && element.dataset.originalText) {
		element.textContent = element.dataset.originalText;
		element.dataset.originalText = '';
	}
}

// const observer = new MutationObserver(watchDomChanges);
// observer.observe(document.body, { childList: true, subtree: true });

// document.body.addEventListener('mouseover', (e) => {
// 	TAGS.forEach(({ wrapperSelector, targetSelector }) => {
// 		if (wrapperSelector == MSG_ITEM) {
// 			return;
// 		}

// 		const wrapper = e.target.closest(wrapperSelector);
// 		if (!wrapper) {
// 			return;
// 		}

// 		const shouldIgnore = WRAPPER_IGNORE.some(ignoreSel => wrapper.querySelector(ignoreSel));
// 		if (shouldIgnore) {
// 			return;
// 		}

// 		if (wrapper) {
// 			wrapper.querySelectorAll(targetSelector).forEach(element => { un_mask(element); });
// 		}
// 	});
// });

// document.body.addEventListener('mouseout', (e) => {
// 	TAGS.forEach(({ wrapperSelector, targetSelector }) => {
// 		if (wrapperSelector == MSG_ITEM) {
// 			return;
// 		}

// 		const wrapper = e.target.closest(wrapperSelector);
// 		if (!wrapper) {
// 			return;
// 		}

// 		const shouldIgnore = WRAPPER_IGNORE.some(ignoreSel => wrapper.querySelector(ignoreSel));
// 		if (shouldIgnore) {
// 			return;
// 		}

// 		if (wrapper) {
// 			wrapper.querySelectorAll(targetSelector).forEach(element => { mask(element); });
// 		}
// 	});
// });

function watchDomChanges() {
	let elements, element, selector, wrapper;
	const ignoreSelector = WRAPPER_IGNORE.map(selector => `:not(${selector} *)`).join('');

	TAGS.forEach(({ wrapperSelector, targetSelector }) => {
		if (wrapperSelector) {
			wrapper = document.querySelector(wrapperSelector);
			if (wrapper && !wrapper.dataset.eventAttached) {
				wrapper.addEventListener('mouseover', (e) => {
					selector = `${targetSelector}${ignoreSelector}`;
					element = e.target.closest(selector);
					if (element && !element.dataset.maskHoverBound) {
						mask(element);
						element.dataset.maskHoverBound = true;
					}
				});
				wrapper.addEventListener('mouseout', (e) => {
					selector = `${targetSelector}${ignoreSelector}`;
					element = e.target.closest(selector);
					if (element && element.dataset.maskHoverBound) {
						un_mask(element);
						element.dataset.maskHoverBound = false;
					}
				});

				wrapper.dataset.eventAttached = true;




				if (targetSelector && targetSelector.length > 0) {
					targetSelector.forEach(target => {
						if (target) {
							selector = `${wrapperSelector} ${target}${ignoreSelector}`;
							elements = document.querySelectorAll(selector);
							if (elements) {
								elements.forEach(element => {
									if (!element.dataset.maskHoverBound) {
										mask(element);

										element.dataset.maskHoverBound = true;
										element.addEventListener('mouseover', (e) => { un_mask(e.target); });
										element.addEventListener('mouseout', (e) => { mask(e.target); });
									}
								});
							}
						}
					});
				}
			}
		}
	});

	elements = document.querySelectorAll(`${MSG_ITEM} ${TRUNCATE}`);
	if (elements) {
		elements.forEach(element => {
			if (!element.dataset.maskHoverBound) {
				let length = 0;
				if (element.classList.contains("conv-item-title__name")) {
					length = 10;
				} else if (element.classList.contains("conv-item-body")) {
					length = 11;
				}

				if (length > 0) {
					element.textContent = HIDE_DIGIT.repeat(length);
					element.dataset.maskHoverBound = true;
				}
			}
		});
	}
}

function mask(element) {
	if (element && !element.dataset.originalText) {
		const length = element.classList.length;
		if (length === 1
			|| length === 2 && MENTION_NAME_CLICKABLE.every(cls => element.classList.contains(cls))
			|| length === 2 && TRUNCATE_QUOTE_NAME.every(cls => element.classList.contains(cls))
			|| length === 3 && TRUNCATE_QUOTE_NAME.every(cls => element.classList.contains(cls))) {
			element.dataset.maskHoverBound = true;
			element.dataset.originalText = element.textContent;

			const length = element.textContent.length;
			element.textContent = HIDE_DIGIT.repeat(length);
		}
	}
}

function un_mask(element) {
	if (element && element.dataset.originalText) {
		element.textContent = element.dataset.originalText;
		element.dataset.originalText = '';
	}
}
