(function () {
	const animals = ["Aardvark", "Albatross", "Alligator", "Alpaca", "Ant", "Anteater", "Antelope", "Ape", "Armadillo", "Donkey", "Baboon", "Badger", "Barracuda", "Bat", "Bear", "Beaver", "Bee", "Bison", "Boar", "Buffalo", "Butterfly", "Camel", "Capybara", "Caribou", "Cassowary", "Cat", "Caterpillar", "Cattle", "Chamois", "Cheetah", "Chicken", "Chimpanzee", "Chinchilla", "Chough", "Clam", "Cobra", "Cockroach", "Cod", "Cormorant", "Coyote", "Crab", "Crane", "Crocodile", "Crow", "Curlew", "Deer", "Dinosaur", "Dog", "Dogfish", "Dolphin", "Dotterel", "Dove", "Dragonfly", "Duck", "Dugong", "Dunlin", "Eagle", "Echidna", "Eel", "Eland", "Elephant", "Elk", "Emu", "Falcon", "Ferret", "Finch", "Fish", "Flamingo", "Fly", "Fox", "Frog", "Gaur", "Gazelle", "Gerbil", "Giraffe", "Gnat", "Gnu", "Goat", "Goldfinch", "Goldfish", "Goose", "Gorilla", "Goshawk", "Grasshopper", "Grouse", "Guanaco", "Gull", "Hamster", "Hare", "Hawk", "Hedgehog", "Heron", "Herring", "Hippopotamus", "Hornet", "Horse", "Human", "Hummingbird", "Hyena", "Ibex", "Ibis", "Jackal", "Jaguar", "Jay", "Jellyfish", "Kangaroo", "Kingfisher", "Koala", "Kookabura", "Kouprey", "Kudu", "Lapwing", "Lark", "Lemur", "Leopard", "Lion", "Llama", "Lobster", "Locust", "Loris", "Louse", "Lyrebird", "Magpie", "Mallard", "Manatee", "Mandrill", "Mantis", "Marten", "Meerkat", "Mink", "Mole", "Mongoose", "Monkey", "Moose", "Mosquito", "Mouse", "Mule", "Narwhal", "Newt", "Nightingale", "Octopus", "Okapi", "Opossum", "Oryx", "Ostrich", "Otter", "Owl", "Oyster", "Panther", "Parrot", "Partridge", "Peafowl", "Pelican", "Penguin", "Pheasant", "Pig", "Pigeon", "Pony", "Porcupine", "Porpoise", "Quail", "Quelea", "Quetzal", "Rabbit", "Raccoon", "Rail", "Ram", "Rat", "Raven", "Red deer", "Red panda", "Reindeer", "Rhinoceros", "Rook", "Salamander", "Salmon", "Sand Dollar", "Sandpiper", "Sardine", "Scorpion", "Seahorse", "Seal", "Shark", "Sheep", "Shrew", "Skunk", "Snail", "Snake", "Sparrow", "Spider", "Spoonbill", "Squid", "Squirrel", "Starling", "Stingray", "Stinkbug", "Stork", "Swallow", "Swan", "Tapir", "Tarsier", "Termite", "Tiger", "Toad", "Trout", "Turkey", "Turtle", "Viper", "Vulture", "Wallaby", "Walrus", "Wasp", "Weasel", "Whale", "Wildcat", "Wolf", "Wolverine", "Wombat", "Woodcock", "Woodpecker", "Worm", "Wren", "Yak", "Zebra"];

	let nOfItems = null;
	while (!nOfItems || nOfItems === NaN) {
		nOfItems = +prompt("Enter a number of items");
	}

	const currentAnimals = animals.slice(0, nOfItems) || animals.slice(0, animals.length - 1);
	const elements = [];

	for (const i in currentAnimals) {
		const newEm = document.createElement("div");

		newEm.classList.add("filter-item");
		newEm.setAttribute(
			"data-category",
			(+i + 1) % 2 === 0 ? "seagreen" : "salmon"
		);
		newEm.innerText = currentAnimals[i];
		elements.push(newEm);
	}

	document.addEventListener("DOMContentLoaded", () => {
		const container = document.querySelector(".content");
		container.append(...elements);
		new Portfolio(".content");
	});
})();

class Portfolio {
	// #region ----------------------- ATTRIBUTES -----------------------
	currentFilter = null;
	defaultOptions = {
		animationDuration: 1500, // Time the animation will take to complete
		itemSelector: ".filter-item", // Selector for the container items
		filters: {
			selector: ".filters", // Default selector for the filter's container
			activeClass: "active", // CSS class that contains the style for the active filter
		},
		search: {
			textSelector: null, // Selector that indicates which texts should be searched for matches.
			isCaseSensitive: false,
			delay: 300, // Delay after the last key is pressed
		},
	};
	// #endregion

	// #region ----------------------- CONSTRUCTOR & HELPER METHODS -----------------------

	/**
	 * Initialization of the portfolio.
	 * @param {string} em Selector string for the container
	 * @param {object} options Configuration object
	 * @param {number} options.animationDuration default value: 1500
	 * @param {string} options.itemSelector default value: '.filter-item'
	 * @param {object} options.filters Filter options
	 * @param {string} options.filters.selector default value: '.filters'
	 * @param {string} options.filters.activeClass default value: 'active'
	 * @param {object} options.search Search options
	 * @param {string|null} options.search.textSelector default value: null
	 * @param {boolean} options.search.isCaseSensitive default value: false
	 * @param {number} options.search.delay default value: 300
	 */
	constructor(em = "", options = {}) {
		this.em = document.querySelector(em); // Select the container that matches the query given

		// If the container exists
		if (this.em) {
			// Height of the container when it has all the items visible.
			// For this to work the initial state of the filters must be 'all'.
			this.maxHeight = `${this.em.offsetHeight}px`;
			this.animation = null;

			// Merge the default options with the given ones.
			//! If you want to change a property of a nested options object (ex: options.search.textSelector)
			//! you need to specify ALL of the properties of that nested object
			this.options = { ...this.defaultOptions, ...options };

			// Assign event listeners
			this.addFilteringButtonsListener();
			this.addSearchFieldListener();
		} else {
			alert("Selector not valid!");
		}
	}

	/**
	 * Add the 'click' event listener to each filter button
	 */
	addFilteringButtonsListener() {
		document
			.querySelectorAll(`${this.options.filters.selector} *[data-filter]`)
			.forEach((filter) => {
				filter.addEventListener("click", (e) => {
					e.preventDefault();

					// Filter the items according to the value of the filter's 'data-filter' attribute value
					this.initFiltering(e.target.getAttribute("data-filter"));
				});
			});
	}

	/**
	 * Add the keypress listener to the search field, if there is one.
	 */
	addSearchFieldListener() {
		const searchField = document.querySelector(
			`${this.options.filters.selector} *[data-search]`
		);

		// If a search field is present
		if (searchField) {
			let timeout = null;

			// Add the event listener
			searchField.addEventListener("keyup", (event) => {
				// Get the trimmed value from the input
				const inputValue = event.target.value.trim();
				// If a timeout was already ongoing, clear it.
				if (timeout !== null) clearTimeout(timeout);

				// Set a timeout is set so the items aren't filtered each time a user presses a key
				timeout = setTimeout(() => {
					// If the user has input a value, search for it
					if (inputValue !== "") {
						this.initFiltering(undefined, inputValue);
					}
					// If not, show all items
					else {
						this.initFiltering("all");
					}
				}, this.options.search.delay);
			});
		}
	}

	/**
	 * Toggle the locking of the window to the current position, preventing scrolling.
	 */
	toggleScrollLock() {
		if (!window.scrollLock) {
			window.scrollLock = () => {
				if (window.scrollLockPos !== undefined) {
					window.scrollTo(0, window.scrollLockPos);
				}
			};
		}

		if (window.isScrollLockEnabled) {
			window.removeEventListener("scroll", window.scrollLock);
			window.isScrollLockEnabled = false;
		} else {
			window.scrollLockPos = window.pageYOffset;
			window.addEventListener("scroll", window.scrollLock);
			window.isScrollLockEnabled = true;
		}
	}
	// #endregion

	// #region ----------------------- MAIN METHODS -----------------------

	/**
	 *
	 * @param {string} category Category by which to filter the portfolio.
	 * @param {string|null} searchText Text string to be searched for.
	 */
	initFiltering(category = "all", searchText = null) {
		this.currentFilter = { category, searchText };
		this.isContainerVisible =
			window.innerHeight - this.em.getBoundingClientRect().y > 0;

		// Deselect the currently selected filters (remove CSS class)
		document
			.querySelectorAll(
				`${this.options.filters.selector} *[data-filter].${this.options.filters.activeClass}`
			)
			.forEach((activeFilter) =>
				activeFilter.classList.remove(this.options.filters.activeClass)
			);
		// Select the clicked filter (add CSS class)
		document
			.querySelector(
				`${this.options.filters.selector} *[data-filter~="${this.currentFilter.category}"]`
			)
			.classList.add(this.options.filters.activeClass);

		if (this.isContainerVisible) {
			// Lock page scrolling
			this.toggleScrollLock();

			this.fold();
		} else {
			this.filterContainerItems();
		}
	}

	/**
	 * Filter the items of the portfolio by only showing the ones that contain the selected
	 * category or the ones that match the given search text.
	 */
	filterContainerItems() {
		// Show all the items
		this.em
			.querySelectorAll(this.options.itemSelector)
			.forEach((item) => (item.style.display = ""));

		// If a specific filter was chosen, hide the ones that don't contain it.
		if (this.currentFilter.category !== "all") {
			this.em
				.querySelectorAll(
					`${this.options.itemSelector}:not([data-category~="${this.currentFilter.category}"])`
				)
				.forEach((item) => {
					item.style.display = "none";
				});
		}

		// If a search string was given,
		if (this.currentFilter.searchText) {
			// By default all the text of the item is searched (the base selector is used),
			// If you only want to search a certain text (title, name) use the
			// option 'search.textSelector' to specify it.
			const selector =
				this.options.search.textSelector || this.options.itemSelector;

			Array.from(this.em.querySelectorAll(selector))
				.filter((item) => {
					if (this.options.search.isCaseSensitive) {
						return !item.innerText.includes(
							this.currentFilter.searchText
						);
					} else {
						return !item.innerText
							.toLowerCase()
							.includes(
								this.currentFilter.searchText.toLowerCase()
							);
					}
				})
				.forEach((item) => {
					item.closest(this.options.itemSelector).style.display =
						"none";
				});
		}

		// After the filtering is done, unfold the container
		if (this.isContainerVisible) this.unfold();
	}

	/**
	 * Animate the height of the container so that it folds to height 0 and then triggers the
	 * filtering when its done.
	 */
	fold() {
		// Height of the container when the animation is started.
		const currentHeight = this.em.offsetHeight;
		const currentMaxHeight =
			window.innerHeight - this.em.getBoundingClientRect().y;

		// If an animation is already running, cancel it first.
		if (this.animation) this.animation.cancel();

		// Animation (see https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
		this.animation = this.em.animate(
			{
				height: [
					`${
						currentHeight < currentMaxHeight
							? currentHeight
							: currentMaxHeight
					}px`,
					0,
				],
			},
			{
				duration: this.options.animationDuration / 2,
				easing: "ease-in-out",
			}
		);

		this.animation.onfinish = () => this.filterContainerItems();
	}

	/**
	 * Unfold the container to the height necessary to hold all of the items or the max height that
	 * will be visible on the screen, whichever is smaller.
	 */
	unfold() {
		// Calculate the next max height of the container by adding the height of all of its rows and the gaps.
		const styles = window.getComputedStyle(this.em); // Get the current styles of the container
		const gridRows = styles.gridTemplateRows.replace(/px/g, "").split(" "); // Get grid rows height and remove the 'px'
		const baseHeight = gridRows.reduce(
			(prev, curr) => (prev = +prev + +curr)
		); // Add the height of all the rows
		const nextHeight =
			+styles.gridColumnGap.replace("px", "") * (gridRows.length - 1) +
			baseHeight; // Add the gaps size to the previouly calculated rows height
		const maxVisibleHeight =
			window.innerHeight - this.em.getBoundingClientRect().y; // Calculate the visible height of the container

		// If an animation is already running, cancel it first.
		if (this.animation) this.animation.cancel();

		// Animation (see https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
		this.animation = this.em.animate(
			{
				height: [
					0,
					`${
						nextHeight < maxVisibleHeight
							? nextHeight
							: maxVisibleHeight
					}px`,
				],
			},
			{
				duration: this.options.animationDuration / 2,
				easing: "ease-out",
			}
		);

		this.animation.onfinish = this.toggleScrollLock;
	}
	// #endregion
}
