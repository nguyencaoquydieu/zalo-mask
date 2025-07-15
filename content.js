const HIDE_DIGIT = '•';
const REACT_VIRTUALIZED_GRID = 'ReactVirtualized__Grid__innerScrollContainer';
const MESSAGE_VIEW_SCROLL_INNER = 'message-view__scroll__inner';
const REL = 'rel';
const MESSAGE_VIEW = 'message-view';
const CHAT_CONTENT = 'chat-content';
const BLOCK_DATE = 'block-date';

const MSG_ITEM = '.msg-item';
const TRUNCATE = '.truncate';
const MESSAGE_CONTENT_WRAPPER = 'message-content-wrapper';
const SPAN_TEXT = 'span.text';

const CONV_ITEM_TITLE_NAME = 'conv-item-title__name';
const CONV_ITEM_BODY = 'conv-item-body';
const TRANSFORM_GPU = 'transform-gpu';
const MESSAGE_ACTION = 'message-action';

const STYLE_HIDDEN_TEXT = 'hidden-text';



const observer = new MutationObserver((mutationsList) => {
	processMutationList(mutationsList);
});
observer.observe(document.body, { childList: true, subtree: true });

function processMutationList(mutationsList) {
	if (mutationsList) {
		mutationsList.forEach(mutation => {
			processMutation(mutation);

			// processAddedNodes(mutation.addedNodes);
			// processTargetNode(mutation.target);
			// processNextSiblingNode(mutation.nextSibling);
		});
	}
}

function processMutation(mutation) {
	if (mutation) {
		const nodes = [];
		if (mutation.addedNodes) {
			nodes.push(...mutation.addedNodes);
		}

		if (mutation.target) {
			nodes.push(mutation.target);
		}

		if (mutation.nextSibling) {
			nodes.push(mutation.nextSibling);
		}

		console.log('Processing nodes:', nodes);
		if (nodes.length > 0) {
			nodes.forEach(node => {
				processNodeElement(node);
			});
		}
	}
}

function processNodeElement(node) {
	if (node) {
		processElementMessageContentWrapper(node);
		// processElementReactVirtualizedGrid(node);
		// processElementMessageAction(node);
	}
}

function processElementMessageContentWrapper(node) {
	if (node) {
		const elements = node.querySelectorAll('.' + MESSAGE_CONTENT_WRAPPER);
		if (elements) {
			elements.forEach(element => {
				processElementSpanText(element);
			});
		}
	}
}

function processElementSpanText(node) {
	if (node) {
		const elements = node.querySelectorAll(SPAN_TEXT);
		if (elements) {
			elements.forEach(element => {
				processHideDigit(element);
			});
		}
	}
}

function processHideDigit(element) {
	if (element && element.classList && !element.classList.contains(STYLE_HIDDEN_TEXT)) {
		element.classList.add(STYLE_HIDDEN_TEXT);
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

// =====================




function processAddedNodes(addedNodes) {
	if (addedNodes && addedNodes.length > 0) {
		addedNodes.forEach(node => {
			processNodeElement(node);
		});
	}
}

function processTargetNode(node) {
	if (node) {
		if (node.classList) {
			if (node.classList.contains(REL)
				|| node.classList.contains(MESSAGE_VIEW)
				|| node.classList.contains(CHAT_CONTENT)
				|| node.classList.contains(BLOCK_DATE)) {
				elements = node.querySelectorAll('.' + MESSAGE_VIEW_SCROLL_INNER);
				if (elements) {
					elements.forEach(element => {
						processTargetNode(element);
					});
				}
			}

			if (node.classList.contains(REACT_VIRTUALIZED_GRID)
				|| node.classList.contains(MESSAGE_VIEW_SCROLL_INNER)
				|| node.classList.contains(MESSAGE_CONTENT_WRAPPER)) {
				processNodeElement(node);
			}
		}
	}
}

function processNextSiblingNode(node) {
	if (node && node.classList && node.classList.contains(MESSAGE_ACTION)) {
		processNodeElement(node);
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


function processElementMessageAction(node) {
	if (node.classList.contains(MESSAGE_ACTION)) {
		const element = node.closest(MESSAGE_VIEW_SCROLL_INNER);
		if (element && element.classList) {
			processElementMessageContentWrapper(element);
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
