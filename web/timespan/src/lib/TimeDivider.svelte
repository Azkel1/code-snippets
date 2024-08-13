<!-- ---------------------------------------------------------- JS/TS ---------------------------------------------------------- -->
<script lang="ts" context="module">
	export enum TimeMeasurements {
		MINUTES = 1,
		HOURS = 60,
		DAYS = 1440,
		WEEKS = 10080
	}

	export type TimeMeasurementChangeManager = {
		[timeMeasurement: string]: (value: number) => void
	}
</script>

<script lang="ts">
	export let total = 0,
		minutes = 0,
		hours = 0,
		days = 0,
		weeks = 0

	export let smallestMeasurement: TimeMeasurements | undefined = undefined

	const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

	function handleInputChange(event: Event) {
		if (event.target) {
			const id = (event.target as HTMLInputElement).id
			const value = (event.target as HTMLInputElement).valueAsNumber ?? 0

			if (id in timeMeasurementManager) timeMeasurementManager[id](value)
			else throw new Error(`Time measurement ('${id}') not valid. Valid values are: [ ${Object.keys(timeMeasurementManager).join(', ')} ]`)
		}
	}

	const timeMeasurementManager: TimeMeasurementChangeManager = {
		total(value: number) {
			minutes = value % 60
			hours = Math.floor(value / 60) % 24
			days = Math.floor(value / 60 / 24) % 7
			weeks = Math.floor(value / 60 / 24 / 7)
			total = clamp(value, 0, 564480)

			smallestMeasurement =
				weeks > 0
					? TimeMeasurements.WEEKS
					: days > 0
					? TimeMeasurements.DAYS
					: hours > 0
					? TimeMeasurements.HOURS
					: TimeMeasurements.MINUTES
		},
		minutes(value: number) {
			const newTotal = total - minutes + value
			timeMeasurementManager.total(newTotal)
		},
		hours(value: number) {
			const newTotal = total - hours * 60 + value * 60
			timeMeasurementManager.total(newTotal)
		},
		days(value: number) {
			const newTotal = total - days * 60 * 24 + value * 60 * 24
			timeMeasurementManager.total(newTotal)
		},
		weeks(value: number) {
			const newTotal = total - weeks * 60 * 24 * 7 + value * 60 * 24 * 7
			timeMeasurementManager.total(newTotal)
		}
	}
</script>

<!-- ----------------------------------------------------------- HTML ---------------------------------------------------------- -->
<div id="manager">
	<header>Time measurement manager</header>
	<main>
		<label for="total">Total (minutes)</label>
		<input id="total" type="number" value={total} on:input={handleInputChange} />

		<label for="minutes">Minutes</label>
		<input id="minutes" type="number" placeholder="Minutes" value={minutes} on:input={handleInputChange} />

		<label for="hours">Hours</label>
		<input id="hours" type="number" placeholder="Hours" value={hours} on:input={handleInputChange} />

		<label for="days">Days</label>
		<input id="days" type="number" placeholder="Days" value={days} on:input={handleInputChange} />

		<label for="weeks">Weeks</label>
		<input id="weeks" type="number" placeholder="Weeks" value={weeks} on:input={handleInputChange} />
	</main>
</div>

<!-- ----------------------------------------------------------- CSS ----------------------------------------------------------- -->
<style lang="scss">
	#manager {
		background-color: rgba(0 0 0 / 0.15);
		border-radius: 0.25rem;
		padding: 1rem;

		display: inline-flex;
		flex-direction: column;
		gap: 1rem;

		header {
			text-align: center;
			font-size: large;
			font-weight: bold;
		}
		main {
			display: inline-grid;
			grid-template-columns: repeat(2, max-content);
			gap: 1rem;
		}
	}
</style>
