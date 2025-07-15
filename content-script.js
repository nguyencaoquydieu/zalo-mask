(function () {
	const MASK_CHAR = '•';
	const maskedMap = new WeakMap();
  
	function maskTextNode(node) {
	  if (!node || !node.textContent.trim()) return;
	  if (maskedMap.has(node)) return;
  
	  const originalText = node.textContent;
	  const masked = MASK_CHAR.repeat(originalText.length);
  
	  maskedMap.set(node, originalText);
	  node.textContent = masked;
	  node.classList?.add('masked-text');
  
	  node.addEventListener('mouseenter', () => {
		node.textContent = maskedMap.get(node);
	  });
  
	  node.addEventListener('mouseleave', () => {
		node.textContent = MASK_CHAR.repeat(maskedMap.get(node).length);
	  });
	}
  
	function processNode(node) {
	  if (node.nodeType === Node.TEXT_NODE) {
		if (node.parentElement) maskTextNode(node.parentElement);
	  } else if (node.nodeType === Node.ELEMENT_NODE) {
		node.querySelectorAll('*').forEach(child => {
		  if (child.childNodes.length === 1 && child.childNodes[0].nodeType === Node.TEXT_NODE) {
			maskTextNode(child);
		  }
		});
	  }
	}
  
	function maskAll() {
	  const allTextElements = document.body.querySelectorAll('*');
	  allTextElements.forEach(el => {
		if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
		  maskTextNode(el);
		}
	  });
	}
  
	const observer = new MutationObserver(mutations => {
	  mutations.forEach(mutation => {
		mutation.addedNodes.forEach(processNode);
	  });
	});
  
	window.addEventListener('load', () => {
	  maskAll();
	  observer.observe(document.body, {
		childList: true,
		subtree: true,
	  });
	});
  })();