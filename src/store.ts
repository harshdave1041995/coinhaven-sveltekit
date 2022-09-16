import { writable } from 'svelte/store';

type CurrencyObject = {
	base: string;
	pair: string;
	price: string;
	percChange: string;
	volume: string;
	currencyPrice: string;
};

type State = {
	btc: CurrencyObject;
	eth: CurrencyObject;
	bnb: CurrencyObject;
	error?: string;
	prevCurrency: string;
};

export const state = writable<State>({
	btc: {} as CurrencyObject,
	eth: {} as CurrencyObject,
	bnb: {} as CurrencyObject,
	prevCurrency: 'USDT'
});

export const connectBTC = (socketURL: string, currency = 'USDT') => {
	const ws = new WebSocket(`wss://${socketURL}`);
	if (!ws) {
		state.update((s: State) => {
			return { ...s, error: 'Unable to connect' };
		});
		return;
	}

	ws.addEventListener('open', () => {
		ws.send(
			JSON.stringify({
				method: 'SUBSCRIBE',
				params:
					currency !== 'USDT'
						? ['btcusdt@ticker', `btc${currency.toLowerCase()}@ticker`]
						: ['btcusdt@ticker'],
				id: 1
			})
		);
	});

	ws.addEventListener('message', (message: any) => {
		const data = JSON.parse(message.data);
		let btcData = {};
		if (currency !== 'USDT') {
			if (data.s === 'BTCUSDT') {
				btcData = {
					...btcData,
					base: 'BTC',
					pair: 'USDT',
					price: data.c ? parseFloat(data.c).toFixed(2) : 0,
					percChange: data.P ? parseFloat(data.P).toFixed(2) : 0,
					volume: data.v ? parseFloat(data.v).toFixed(6) : 0
				};
			} else {
				btcData = {
					...btcData,
					currencyPrice: data.c ? parseFloat(data.c).toFixed(2) : 0
				};
			}
		} else {
			btcData = {
				...btcData,
				base: 'BTC',
				pair: 'USDT',
				price: data.c ? parseFloat(data.c).toFixed(2) : 0,
				percChange: data.P ? parseFloat(data.P).toFixed(2) : 0,
				volume: data.v ? parseFloat(data.v).toFixed(6) : 0,
				currencyPrice: data.c ? parseFloat(data.c).toFixed(2) : 0
			};
		}
		// Mutate state by prepending the new data to the array.
		state.update((state) => ({
			...state,
			btc: { ...state.btc, ...btcData },
			prevCurrency: currency
		}));
	});
	return ws;
};

export const connectETH = (socketURL: string, currency = 'USDT') => {
	const ws = new WebSocket(`wss://${socketURL}`);
	if (!ws) {
		state.update((s: State) => {
			return { ...s, error: 'Unable to connect' };
		});
		return;
	}

	ws.addEventListener('open', () => {
		ws.send(
			JSON.stringify({
				method: 'SUBSCRIBE',
				params:
					currency !== 'USDT'
						? ['ethusdt@ticker', `eth${currency.toLowerCase()}@ticker`]
						: ['ethusdt@ticker'],
				id: 1
			})
		);
	});

	ws.addEventListener('message', (message: any) => {
		const data = JSON.parse(message.data);
		let ethData = {};
		if (currency !== 'USDT') {
			if (data.s === 'ETHUSDT') {
				ethData = {
					...ethData,
					base: 'ETH',
					pair: 'USDT',
					price: data.c ? parseFloat(data.c).toFixed(2) : 0,
					percChange: data.P ? parseFloat(data.P).toFixed(2) : 0,
					volume: data.v ? parseFloat(data.v).toFixed(6) : 0
				};
			} else {
				ethData = {
					...ethData,
					currencyPrice: data.c ? parseFloat(data.c).toFixed(2) : 0
				};
			}
		} else {
			ethData = {
				...ethData,
				base: 'ETH',
				pair: 'USDT',
				price: data.c ? parseFloat(data.c).toFixed(2) : 0,
				percChange: data.P ? parseFloat(data.P).toFixed(2) : 0,
				volume: data.v ? parseFloat(data.v).toFixed(6) : 0,
				currencyPrice: data.c ? parseFloat(data.c).toFixed(2) : 0
			};
		}
		// Mutate state by prepending the new data to the array.
		state.update((state) => ({ ...state, eth: { ...state.eth, ...ethData } }));
	});
	return ws;
};

export const connectBNB = (socketURL: string, currency = 'USDT') => {
	const ws = new WebSocket(`wss://${socketURL}`);
	if (!ws) {
		state.update((s: State) => {
			return { ...s, error: 'Unable to connect' };
		});
		return;
	}

	ws.addEventListener('open', () => {
		ws.send(
			JSON.stringify({
				method: 'SUBSCRIBE',
				params:
					currency !== 'USDT'
						? ['bnbusdt@ticker', `bnb${currency.toLowerCase()}@ticker`]
						: ['bnbusdt@ticker'],
				id: 1
			})
		);
	});

	ws.addEventListener('message', (message: any) => {
		const data = JSON.parse(message.data);
		let bnbData = {};
		if (currency !== 'USDT') {
			if (data.s === 'BNBUSDT') {
				bnbData = {
					...bnbData,
					base: 'BNB',
					pair: 'USDT',
					price: data.c ? parseFloat(data.c).toFixed(2) : 0,
					percChange: data.P ? parseFloat(data.P).toFixed(2) : 0,
					volume: data.v ? parseFloat(data.v).toFixed(6) : 0
				};
			} else {
				bnbData = {
					...bnbData,
					currencyPrice: data.c ? parseFloat(data.c).toFixed(2) : 0
				};
			}
		} else {
			bnbData = {
				...bnbData,
				base: 'BNB',
				pair: 'USDT',
				price: data.c ? parseFloat(data.c).toFixed(2) : 0,
				percChange: data.P ? parseFloat(data.P).toFixed(2) : 0,
				volume: data.v ? parseFloat(data.v).toFixed(6) : 0,
				currencyPrice: data.c ? parseFloat(data.c).toFixed(2) : 0
			};
		}
		// Mutate state by prepending the new data to the array.
		state.update((state) => ({ ...state, bnb: { ...state.bnb, ...bnbData } }));
	});
	return ws;
};
