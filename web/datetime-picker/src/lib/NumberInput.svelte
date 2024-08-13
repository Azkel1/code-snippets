<script lang="ts">
	export let value = 0;
	export let max: number | undefined = undefined;
	export let min: number | undefined = undefined;
	export let step = 1;
	export let loopAround = false;
	export let padding: number | undefined = undefined;

	function increase(): void {
		if (max !== undefined) {
			if (value + step <= max) {
				value += step;
			} else if (loopAround) {
				value = max + 1 - (value + step);
			}
		} else {
			value += step;
		}
	}

	function decrease(): void {
		if (min !== undefined) {
			if (value - step >= min) {
				value -= step;
			} else if (loopAround && max !== undefined) {
				value = min + (max + 1 - (step - value));
			}
		} else {
			value -= step;
		}
	}
</script>

<div class="number-input">
	<button on:click={increase} title={`+${step}`}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			fill="none"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			class="feather"><path d="m18 15-6-6-6 6" /></svg
		>
	</button>
	<span>{padding ? value.toString().padStart(padding, "0") : value}</span>
	<button on:click={decrease} title={`-${step}`}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			fill="none"
			stroke="currentColor"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			class="feather"><path d="m6 9 6 6 6-6" /></svg
		>
	</button>
</div>

<style lang="scss">
	.number-input {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		width: min-content;

		> button {
			display: flex;
			align-items: center;
			justify-content: center;

			margin: 0;
			width: 100%;
		}
	}
</style>
