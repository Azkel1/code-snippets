<!-- ---------------------------------------------------------- JS/TS ---------------------------------------------------------- -->
<script lang="ts">
	import TimeDivider, { TimeMeasurements } from '$lib/TimeDivider.svelte'

	export let title: string
	export let endValue: number = 50
	export let startValue: number = 50
	export let startTimescale: TimeMeasurements = TimeMeasurements.MINUTES
	export let endTimescale: TimeMeasurements = TimeMeasurements.MINUTES
	$: timescale = Math.max(startTimescale, endTimescale)

	function getTimescalePercentage(value: number) {
		switch (timescale) {
			case TimeMeasurements.MINUTES:
				return (value * 100) / 60
			case TimeMeasurements.HOURS:
				return ((value / 24) * 100) / timescale
			case TimeMeasurements.DAYS:
				return ((value / 7) * 100) / timescale
			case TimeMeasurements.WEEKS:
				return ((value / 56) * 100) / timescale
		}
	}

	$: cssVariables = `
		--start-value: ${getTimescalePercentage(startValue)}%;
        --end-value: ${getTimescalePercentage(endValue)}%;
    `
</script>

<!-- ----------------------------------------------------------- HTML ---------------------------------------------------------- -->
<div class="timespan">
	<header>
		<h2>{title}</h2>
	</header>

	<main>
		<TimeDivider bind:smallestMeasurement={startTimescale} bind:total={startValue} />
		<TimeDivider bind:smallestMeasurement={endTimescale} bind:total={endValue} />
	</main>

	<footer style={cssVariables}>
		<h3>Current timescale: {TimeMeasurements[timescale]}</h3>
		<span id="track">
			<span id="start-point" />
			<span id="range-start" class="marker">
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
					><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg
				>
				<label for="range-start">start</label>
			</span>
			<span id="range-end" class="marker">
				<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
					><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg
				>
				<label for="range-end">end</label>
			</span>
		</span>
	</footer>
</div>

<!-- ----------------------------------------------------------- CSS ----------------------------------------------------------- -->
<style lang="scss">
	.timespan {
		--_center-color: var(--center-color, hsl(0, 100%, 82.9%));
		--_marker-color: var(--marker-color, hsl(9, 100%, 70%));
		--_start-value: var(--start-value, 0%);
		--_end-value: var(--end-value, 0%);

		background-color: var(--background, rgba(0 0 0 / 0.05));

		display: inline-flex;
		flex-direction: column;

		main {
			display: flex;
			justify-content: center;
			gap: 1rem;
		}

		footer {
			--start-point-size: 1rem;
			--marker-size: 1.5rem;
			--track-size: 0.3rem;

			padding: 1.5rem;

			#track {
				background-color: var(--track-color, rgba(0 0 0 / 0.1));
				border-radius: 0.25rem;

				display: flex;
				align-items: center;
				justify-content: center;

				height: var(--track-size);
				position: relative;

				#start-point {
					background-color: var(--_center-color);
					border-radius: 50%;
					aspect-ratio: 1;
					height: var(--start-point-size);
					z-index: 1;
				}

				.marker {
					color: var(--_marker-color);

					aspect-ratio: 1;
					height: var(--marker-size);
					transform: translate(-50%, 30%);
					position: absolute;
					transition: 150ms;
					transition-property: left;

					label {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translateX(-50%);
					}

					&#range-start {
						left: calc(50% - var(--start-value) / 2);
					}

					&#range-end {
						left: calc(50% + var(--end-value) / 2);
					}
				}

				&::before {
					background-color: rgba(0 0 0 / 0.2);
					border-radius: 0.25rem;
					content: '';

					left: calc(50% - var(--start-value) / 2);
					top: 50%;
					position: absolute;
					height: var(--track-size);
					width: calc((var(--start-value) + var(--end-value)) / 2);
					transform: translateY(-50%);
					transition: 150ms;
				}
			}
		}
	}
</style>
