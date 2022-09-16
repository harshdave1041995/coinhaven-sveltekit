<script lang="ts">
	import { onMount } from 'svelte';
	import { state, connectBTC, connectETH, connectBNB } from '../store';
	import { gql, request } from 'graphql-request';

	type CurrencyType = 'EUR' | 'AUD' | 'GBP' | 'USDT';

	type Country = {
		name: string;
		currency: CurrencyType;
		emoji: string;
	};

	const defaultCountry: Country = { name: 'United States', currency: 'USDT', emoji: '' };
	const optionCountries = ['United Kingdom', 'Australia', 'Germany', 'Estonia'];

	let countries: Country[] = [defaultCountry];
	let selectedCountry: Country = defaultCountry;
	let countryName: string = defaultCountry.name;
	let btcSocket: WebSocket | undefined;
	let ethSocket: WebSocket | undefined;
	let bnbSocket: WebSocket | undefined;
	let loading: boolean = true;

	const GET_COUNTRIES = gql`
		{
			countries {
				name
				currency
				emoji
			}
		}
	`;

	export const load = async () => {
		const data = await request('https://countries.trevorblades.com/', GET_COUNTRIES);
		return data.countries;
	};

	$: callSockets = async (currency = 'USDT') => {
		if (btcSocket) btcSocket.close();
		if (ethSocket) ethSocket.close();
		if (bnbSocket) bnbSocket.close();
		btcSocket = connectBTC(`stream.binance.com:9443/ws/btc${currency}@ticker`, currency);
		ethSocket = connectETH(`stream.binance.com:9443/ws/eth${currency}@ticker`, currency);
		bnbSocket = connectBNB(`stream.binance.com:9443/ws/bnb${currency}@ticker`, currency);
		setTimeout(() => {
			loading = false;
		}, 3000);
	};

	onMount(async () => {
		callSockets();
		const ctrs = await load();
		const filteredCountries: Country[] = ctrs.filter((country: Country) =>
			optionCountries.includes(country.name)
		);
		let us: Country = ctrs.find((country: Country) => country.name === defaultCountry.name);
		us = { ...us, currency: 'USDT' };
		const finalCountries = [us, ...filteredCountries];
		countries.splice(0, 1, ...finalCountries);
		countries = [...countries];
		selectedCountry = { ...us };
	});

	const handleOnChange = () => {
		selectedCountry =
			countries.find((country: Country) => country.name === countryName) || defaultCountry;
		loading = true;
		callSockets(selectedCountry.currency);
	};

	$: getCurrencySymbol = () => {
		if (selectedCountry.currency === 'USDT') return '$';
		if (selectedCountry.currency === 'EUR') return '€';
		if (selectedCountry.currency === 'AUD') return 'A$';
		if (selectedCountry.currency === 'GBP') return '￡';
	};
</script>

<main class="w-screen h-screen flex justify-center">
	<div class="w-full h-full flex flex-col justify-center items-center">
		<div class="w-9/12 p-4 flex justify-center">
			<div class="w-full flex flex-col items-center md:w-1/2">
				<label class="w-full mb-1" for="country">Select your country</label>
				<select
					class="w-full p-2 bg-slate-100"
					id="country"
					bind:value={countryName}
					on:change={handleOnChange}
				>
					{#each countries as country}
						<option value={country.name}>{country.emoji} {country.name}</option>
					{/each}
				</select>
			</div>
		</div>
		{#if loading}
			<div class="text-xl font-bold p-4">Loading...</div>
		{/if}
		{#if !loading}
			<div class="w-9/12 flex justify-center gap-4 mt-4 p-4">
				<div class="flex flex-col">
					<div class="w-56 flex flex-col bg-white shadow-xl p-4 rounded relative">
						<div class="text-l">{$state.btc.base}/{$state.btc.pair}</div>
						<div
							class={parseFloat($state.btc.percChange) > 0
								? 'text-green-400 absolute right-4 top-4'
								: 'text-red-400 absolute right-4 top-4'}
						>
							{parseFloat($state.btc.percChange) > 0
								? `+${$state.btc.percChange}%`
								: `${$state.btc.percChange}%`}
						</div>
						<div class="text-2xl font-semibold">{$state.btc.price}</div>
						<div class="text-md font-medium">Volume: {$state.btc.volume}</div>
					</div>
					<div class="mt-2 p-4 font-semibold">
						{selectedCountry.currency === 'USDT' ? 'USD' : selectedCountry.currency}: {getCurrencySymbol()}
						{$state.btc.currencyPrice || 0}
					</div>
				</div>
				<div class="flex flex-col">
					<div class="w-56 flex flex-col bg-white shadow-xl p-4 rounded relative">
						<div class="text-l">{$state.eth.base}/{$state.eth.pair}</div>
						<div
							class={parseFloat($state.eth.percChange) > 0
								? 'text-green-400 absolute right-4 top-4'
								: 'text-red-400 absolute right-4 top-4'}
						>
							{parseFloat($state.eth.percChange) > 0
								? `+${$state.eth.percChange}%`
								: `${$state.eth.percChange}%`}
						</div>
						<div class="text-2xl font-semibold">{$state.eth.price}</div>
						<div class="text-md font-medium">Volume: {$state.eth.volume}</div>
					</div>
					<div class="mt-2 p-4 font-semibold">
						{selectedCountry.currency === 'USDT' ? 'USD' : selectedCountry.currency}: {getCurrencySymbol()}
						{$state.eth.currencyPrice || 0}
					</div>
				</div>
				<div class="flex flex-col">
					<div class="w-56 flex flex-col bg-white shadow-xl p-4 rounded relative">
						<div class="text-l">{$state.bnb.base}/{$state.bnb.pair}</div>
						<div
							class={parseFloat($state.bnb.percChange) > 0
								? 'text-green-400 absolute right-4 top-4'
								: 'text-red-400 absolute right-4 top-4'}
						>
							{parseFloat($state.bnb.percChange) > 0
								? `+${$state.bnb.percChange}%`
								: `${$state.bnb.percChange}%`}
						</div>
						<div class="text-2xl font-semibold">{$state.bnb.price}</div>
						<div class="text-md font-medium">Volume: {$state.bnb.volume}</div>
					</div>
					<div class="mt-2 p-4 font-semibold">
						{selectedCountry.currency === 'USDT' ? 'USD' : selectedCountry.currency}: {getCurrencySymbol()}
						{$state.bnb.currencyPrice || 0}
					</div>
				</div>
			</div>
		{/if}
	</div>
</main>
