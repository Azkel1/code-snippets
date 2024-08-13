<script lang="ts" context="module">
	import { writable } from "svelte/store";

	let currentPicker = writable<string | undefined>();
	const setCurrentPicker = (picker: string | undefined) =>
		currentPicker.set(picker);
	const closeCurrentPicker = () => currentPicker.set(undefined);

	export function getWeekdayNames(locale: Locale = "default"): Weekday[] {
		let names: Weekday[] = [];

		for (let i = 0; i < 7; i++) {
			const date = new Date(Date.UTC(1970, 1, 2 + i));

			names.push({
				short: new Intl.DateTimeFormat(locale, { weekday: "short" })
					.format(date)
					.slice(0, 2),
				long: new Intl.DateTimeFormat(locale, {
					weekday: "long",
				}).format(date),
			});
		}

		return names;
	}

	export function getMonthNames(locale: Locale = "default"): string[] {
		let names: string[] = [];

		for (let i = 0; i < 12; i++) {
			const date = new Date(Date.UTC(1970, 0 + i, 1));

			names.push(
				new Intl.DateTimeFormat(locale, { month: "long" }).format(date)
			);
		}

		return names;
	}

	function handleOutsideClick(ev: Event): void {
		if ((ev.target as HTMLElement).closest(".datetime-picker") === null) {
			setCurrentPicker(undefined);
		}
	}

	document.addEventListener("click", handleOutsideClick);
</script>

<script lang="ts">
	import { fly } from "svelte/transition";
	import dayjs from "dayjs";
	import isToday from "dayjs/plugin/isToday.js";
	import isoWeek from "dayjs/plugin/isoWeek.js";
	import NumberInput from "./NumberInput.svelte";

	import type { Dayjs } from "dayjs";

	dayjs.extend(isToday);
	dayjs.extend(isoWeek);

	export let timepicker = false;
	export let locale: Locale = "default";

	const id = `\$${crypto.getRandomValues(new Uint32Array(1))[0]}`;
	let input: HTMLInputElement;
	const dayNames = getWeekdayNames(locale);
	const monthNames = getMonthNames(locale);

	// #region Date handling
	let currentDisplayDate = dayjs().startOf("day");
	let hours = 0;
	let minutes = 0;

	let selectedPickerDate: Dayjs | undefined;
	let currentDate: Dayjs | undefined;

	$: currentDate = selectedPickerDate?.hour(hours)?.minute(minutes);

	$: firstDay = currentDisplayDate.date(1).startOf("isoWeek");
	$: currentMonthDays = new Array(42).fill(null).map((x, i): Day => {
		const day = firstDay.add(i, "day");

		return {
			dayNumber: day.date(),
			date: day,
			isCurrentMonth: day.month() === currentDisplayDate.month(),
		};
	});

	const nextMonth = () => {
		currentDisplayDate = currentDisplayDate.add(1, "month");
	};
	const previousMonth = () => {
		currentDisplayDate = currentDisplayDate.subtract(1, "month");
	};

	const setInputValue = function () {
		input.value =
			currentDate?.format(
				timepicker ? "YYYY-MM-DDTHH:mm" : "YYYY-MM-DD"
			) ?? "";
		closeCurrentPicker();
	};

	const emptyInput = function () {
		currentDate = undefined;
		setInputValue();
	};

	function setCurrentDate(node: Node) {
		if (input.value) {
			const date = dayjs(input.value);

			currentDisplayDate = date;
			selectedPickerDate = date;

			hours = date.hour();
			minutes = date.minute();
		}

		return {
			destroy() {
				selectedPickerDate = undefined;

				hours = 0;
				minutes = 0;
			},
		};
	}
	// #endregion
</script>

<div class="datetime-picker">
	<input
		type={timepicker ? "datetime-local" : "date"}
		bind:this={input}
		on:focus={() => setCurrentPicker(id)}
		on:click|preventDefault
	/>

	{#if $currentPicker === id}
		<div class="picker" transition:fly={{ y: -25 }} use:setCurrentDate>
			<header>
				<button on:click={previousMonth}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="feather"><path d="m15 18-6-6 6-6" /></svg
					>
				</button>
				<span
					>{monthNames[currentDisplayDate.month()]}
					{currentDisplayDate.year()}</span
				>
				<button on:click={nextMonth}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="feather"><path d="m9 18 6-6-6-6" /></svg
					>
				</button>
			</header>

			<section class="day-names">
				{#each dayNames as dayName}
					<small>{dayName.short}</small>
				{/each}
			</section>

			<main class="days">
				{#each currentMonthDays as day}
					<!-- FIXME: Having one event listener for each day seems... unnecessary -->
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<i
						class="day"
						on:click={() => {
							selectedPickerDate = day.date;
						}}
						class:today={day.date.isToday()}
						class:other-month={!day.isCurrentMonth}
						class:current={currentDate &&
							day.date.isSame(currentDate, "day")}
					>
						{day.dayNumber}
					</i>
				{/each}
			</main>

			{#if timepicker}
				<section class="timepicker">
					<NumberInput
						min={0}
						max={23}
						loopAround={true}
						padding={2}
						bind:value={hours}
					/>
					<NumberInput
						min={0}
						max={59}
						loopAround={true}
						padding={2}
						step={30}
						bind:value={minutes}
					/>
				</section>
			{/if}

			<footer>
				<button
					disabled={currentDate === undefined}
					on:click={setInputValue}>OK</button
				>
				<button
					disabled={currentDate === undefined}
					on:click={emptyInput}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="feather"
						viewBox="0 0 24 24"
						><path d="M18 6 6 18M6 6l12 12" /></svg
					>
				</button>
			</footer>
		</div>
	{/if}
</div>

<style lang="scss">
	.datetime-picker {
		--background: #ebebeb;
		--primary: #445fa9;
		--secondary: #e0e0e0;
		--shadow: rgba(0, 0, 0, 0.05);
		--shadow-dark: rgba(0, 0, 0, 0.1);
		--transition-duration: 300ms;

		user-select: none;
		width: min-content;

		> .picker {
			background-color: var(--background);
			border-radius: 0.3rem;
			box-shadow: 2px 2px 10px 5px var(--shadow-dark);

			margin: 0.5rem 0;
			min-width: 275px;
			min-height: 200px;
			overflow: hidden;
			position: absolute;
			z-index: 1;

			> * {
				padding: 0.5rem;
			}

			> header {
				background-color: var(--primary);
				color: var(--secondary);

				display: flex;
				justify-content: space-between;
				align-items: center;

				button {
					background-color: var(--secondary);
					border: 2px solid var(--secondary);
					color: var(--primary);
					padding: 0.05em;

					&:hover {
						background-color: var(--primary);
						color: var(--secondary);
					}
				}

				> span {
					border-radius: 0.3rem;
					cursor: pointer;
					text-transform: capitalize;

					padding: 0.1em 0.3em;
					transition: background-color var(--transition-duration);

					&:hover {
						background-color: var(--shadow-dark);
					}
				}
			}

			section.day-names {
				background-color: var(--shadow);
				text-align: center;

				display: grid;
				grid-template-columns: repeat(7, 1fr);
				align-items: center;
				justify-items: stretch;
				gap: 0.5rem;

				> small {
					text-transform: capitalize;
				}
			}

			> main.days {
				text-align: center;

				display: grid;
				grid-template-columns: repeat(7, 1fr);
				align-items: center;
				justify-items: stretch;
				gap: 0.5rem;

				> .day.today {
					background-color: var(--shadow);
				}

				> .day.other-month {
					color: darkgray;
				}

				> .day {
					border-radius: 0.3rem;
					cursor: pointer;
					font-style: normal;

					display: flex;
					align-items: center;
					justify-content: center;

					aspect-ratio: 1;
					padding: 0.2rem;

					&:hover {
						background-color: var(--shadow-dark);
					}
				}

				> .day.current {
					background-color: var(--primary);
					color: var(--secondary);
				}
			}

			section.timepicker {
				background-color: var(--shadow);

				display: grid;
				grid-auto-flow: column;
				gap: 0.5rem;

				:global(.number-input) {
					background-color: var(--shadow);

					width: 100%;
				}

				:global(.number-input > span) {
					padding: 0.3em 0;
				}

				:global(.number-input > button) {
					background-color: var(--primary);
					border: 0;
					box-shadow: 0 0 0 2px var(--primary) inset;
					color: var(--secondary);
					cursor: pointer;

					transition:
						background-color var(--transition-duration),
						color var(--transition-duration),
						transform 100ms;

					&:hover {
						background-color: var(--secondary);
						color: var(--primary);
					}

					&:active {
						transform: scale(1.05);
					}
				}

				:global(.number-input > button:nth-of-type(1)) {
					border-radius: 0.3rem 0.3rem 0 0;
				}

				:global(.number-input > button:nth-of-type(2)) {
					border-radius: 0 0 0.3rem 0.3rem;
				}
			}

			footer {
				display: grid;
				grid-auto-flow: column;
				gap: 0.5rem;

				> button {
					background-color: var(--primary);
					box-shadow: 0 0 0 2px var(--primary) inset;
					color: var(--secondary);
					cursor: pointer;

					transition:
						background-color var(--transition-duration),
						color var(--transition-duration),
						transform 100ms;
					width: 100%;

					&:hover {
						background-color: var(--secondary);
						color: var(--primary);
					}

					&:disabled {
						cursor: not-allowed;
					}
				}
			}
		}

		.feather {
			height: 100%;
		}

		button {
			border: 0;
			border-radius: 0.3rem;
			cursor: pointer;

			display: flex;
			align-items: center;
			justify-content: center;

			padding: 0.2rem 0;
			aspect-ratio: 1;
			height: 1.6rem;
			transition:
				background-color var(--transition-duration),
				color var(--transition-duration),
				transform 100ms;

			&:not(:disabled):active {
				transform: translate(1px, 1px);
			}
		}
	}
</style>
