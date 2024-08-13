<script context="module" lang="ts">
	import { writable } from "svelte/store";

	let currentTimepicker = writable<string | undefined>(undefined);
	const show = (t: string) => currentTimepicker.set(t);
	const hide = () => currentTimepicker.set(undefined);

	function handleOutsideClick(ev: Event): void {
		if ((ev.target as HTMLElement).closest(".timepicker") === null) {
			hide();
		}
	}

	document.addEventListener("click", handleOutsideClick);
</script>

<script lang="ts">
	import { fly } from "svelte/transition";
	import NumberInput from "./NumberInput.svelte";

	export let allowManualInput = false;
	export let initialValue = "";
	export let currentValue: string = "";

	const id = `_${crypto.getRandomValues(new Uint32Array(1))[0]}`;
	let input: HTMLInputElement;
	let hours = +initialValue.split(":")[0];
	let minutes = +initialValue.split(":")[1];
	$: currentValue = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

	function setTime(): void {
		input.value = currentValue;
		hide();
	}

	function setNowAsTime(): void {
		const now = new Date();

		hours = now.getHours();
		minutes = now.getMinutes();
	}
</script>

<div class="timepicker">
	<input
		type="time"
		bind:this={input}
		on:keydown={(e) => {
			if (!allowManualInput) e.preventDefault();
		}}
		on:focus={() => {
			show(id);
		}}
	/>

	{#if $currentTimepicker === id}
		<div class="container" tabindex="-1" transition:fly={{ y: -15 }}>
			<header>
				<h5>Timepicker</h5>
			</header>
			<main>
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
				<button on:click={setTime}>Ok</button>
				<button on:click={setNowAsTime}>Now</button>
			</main>
		</div>
	{/if}
</div>

<style lang="scss">
	.timepicker {
		--primary: #445fa9;
		--secondary: #e3e3e3;
		--shadow: rgba(0, 0, 0, 0.1);

		position: relative;
		width: min-content;
		user-select: none;

		.container {
			background-color: var(--secondary);
			border-radius: 0.3rem;
			box-shadow: 2px 2px 10px var(--shadow);

			margin-top: 0.3rem;
			position: absolute;
			width: 200px;
			min-height: 75px;
			overflow: hidden;
			z-index: 1;

			* {
				color: var(--secondary);
				margin: 0;
				padding: 0;
			}

			> * {
				padding: 0.5rem;
			}

			> header {
				background-color: var(--primary);
				text-align: center;
			}

			> main {
				display: grid;
				grid-template-areas:
					"hours minutes ok"
					"hours minutes now";
				gap: 1rem;

				> :global(*:nth-child(1)) {
					grid-area: hours;
				}

				> :global(*:nth-child(2)) {
					grid-area: minutes;
				}

				> :global(*:nth-child(3)) {
					grid-area: ok;
				}

				> :global(*:nth-child(4)) {
					grid-area: now;
				}

				> button {
					border-radius: 0.3rem;
				}

				:global(.number-input) {
					background-color: var(--shadow);
					border-radius: 0.3rem;

					width: 100%;
				}

				:global(.number-input > span) {
					color: var(--primary);
					padding: 0.5rem 0;
				}

				:global(.number-input > button:nth-of-type(1)) {
					border-radius: 0.3rem 0.3rem 0 0;
				}

				:global(.number-input > button:nth-of-type(2)) {
					border-radius: 0 0 0.3rem 0.3rem;
				}

				:global(button) {
					background-color: var(--primary);
					border: none;
					box-shadow: 0 0 0 2px var(--primary) inset;
					color: var(--secondary);
					cursor: pointer;

					transition:
						background-color 300ms,
						transform 100ms;

					&:hover {
						background-color: var(--secondary);
						color: var(--primary);
					}

					&:active {
						transform: scale(1.05);
					}
				}
			}
		}
	}
</style>
