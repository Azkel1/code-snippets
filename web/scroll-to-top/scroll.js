(function () {
	const scrollButton = document.createElement("div"); // Button element
	scrollButton.classList.add("scroll-to-top"); // Add the CSS class to the button
	const BUTTON_TRIGGER_PERCENTAGE = 30; // Percentage that has to be scrolled for the button to be shown

	toggleButtonVisibility(); // Check the scroll amount on start

	window.addEventListener("scroll", toggleButtonVisibility);

	scrollButton.addEventListener("click", function () {
		window.scrollTo({ top: 0, behavior: "smooth" }); // FIXME: Safari does not support 'behaviour: smooth'
	});

	document.body.append(scrollButton); // Add the button to the page

	/* ----------------------------------- FUNCTIONS ----------------------------------- */

	/**
	 * Show or hide the button if the page has scrolled the amount defined in BUTTON_TRIGGER_PERCENTAGE
	 */
	function toggleButtonVisibility() {
		if (window.scrollY > window.innerHeight * (BUTTON_TRIGGER_PERCENTAGE / 100)) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
	}
})();
