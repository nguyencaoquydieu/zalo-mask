const STYLE_HIDDEN_TEXT = 'hidden-text';
const SELECTORS = [
	'[data-id="div_DisabledTargetEventLayer"]',
	'.conv-item-title__name.truncate.grid-item',
	'.chat-group-topic__item',
	'.threadChat__title.flx-1.flx.flx-col.w0',
	'.conv-item-body.flx.flx-al-c.truncate.grid-item',
];

const observer = new MutationObserver((mutationsList) => {
	processMutationList(mutationsList);
});
observer.observe(document.body, { childList: true, subtree: true });

function processMutationList(mutationsList) {
	if (mutationsList) {
		mutationsList.forEach(mutation => {
			processMutation(mutation);
		});
	}
}

function processMutation(mutation) {
	if (mutation) {
		const nodes = [];
		if (mutation.addedNodes && mutation.addedNodes.length > 0) {
			nodes.push(...mutation.addedNodes);
		}

		if (mutation.target) {
			nodes.push(mutation.target);
		}

		if (mutation.nextSibling) {
			nodes.push(mutation.nextSibling);
		}

		if (nodes.length > 0) {
			nodes.forEach(node => {
				processNodeElement(node);
			});
		}
	}
}

function processNodeElement(node) {
	if (node && node.nodeType == Node.ELEMENT_NODE) {
		SELECTORS.forEach(selector => {
			const elements = node.querySelectorAll(selector);
			if (elements) {
				elements.forEach(element => {
					processHideDigit(element);
				});
			}
		});
	}
}

function processHideDigit(element) {
	if (element && element.classList && !element.classList.contains(STYLE_HIDDEN_TEXT)) {
		element.classList.add(STYLE_HIDDEN_TEXT);
	}
}
