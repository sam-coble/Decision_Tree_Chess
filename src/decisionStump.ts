export interface StumpModel {
	predict: any;
	split: any;
	baseSplit: any;
}

export function decisionStump(_X: number[][], _y: number[]): StumpModel {
	// fits a decision stump based on inequalities

	// get size of the data matrix
	const n: number = _X?.length;
	const d: number = _X?.[0]?.length;

	// don't round
	// const X = _X.map(e => Math.round(e));

	const X: number[][] = _X.map(row => [...row]);
	const y: number[] = [..._y];

	let y_mode: number = mode(y);
	let minError: number = y
		.map(y_i => y_i != y_mode)
		.reduce((acc, cur) => acc + +cur, 0);
	let splitVariable: number = -1;
	let splitValue: number = -1;
	let splitYes: boolean = true;
	let splitNo: boolean = true;

	let yhat: boolean[] = new Array(n).map(e => false);
	for (let j = 0; j < d; j++) {
		for (let val of uniqueValuesInCol(X, j)) {

			// Test whether each object satisfies inequality
			const isYes: boolean[] = X.map(example => example[j] < val);

			// find correct label on both sides of split
			// FIX
			const y_yes: boolean = !!mode(y.map((e, i) => isYes[i]));
			const y_no: boolean = !!mode(y.map((e, i) => isYes[i]));

			// make predictions
			yhat.map((e, i) => isYes[i] ? y_yes : y_no);

			// compute error
			let trainError = yhat.reduce((acc, cur, i) => {
				if (cur == isYes[i]) {
					return acc + 1;
				} else {
					return acc;
				}
			}, 0);

			// update best rule
			if (trainError < minError && trainError != 0) {
				minError = trainError;
				splitVariable = j;
				splitValue = val;
				splitYes = y_yes;
				splitNo = y_no;
			}
		}
	}

	function split(Xhat: number[][]): boolean[] {
		const t: number = Xhat?.length;
		const d: number = Xhat?.[0]?.length;

		if (splitVariable >= 0) {
			return new Array(t).map(e => true);
		} else {
			return Xhat.map(e => e[splitVariable] < splitValue);
		}
	}

	// build predict function
	function predict(Xhat: number[][]): boolean[] {
		const t: number = Xhat?.length;
		const d: number = Xhat?.[0]?.length;
		const yes: boolean[] = split(Xhat);
		let yhat: boolean[] = new Array(t).map(e => splitYes);

		if (yes.filter(e => !e).length > 0) {
			yhat = yhat.map(e => e ? e : splitNo);
		}
		return yhat;
	}

	return {predict: predict, split: split, baseSplit: true};
}

function mode<T>(arr: T[]): T {
	let counts: Map<T,number> = new Map<T,number>();
	arr.forEach(e => {
		counts.set(e, counts.has(e) ? counts.get(e) + 1: 1);
	});
	let max: number = -Infinity;
	let maxI: T;
	for (let [key, value] of counts) {
		if (value > max) {
			max = value;
			maxI = key;
		}
	}
	return maxI;
}

function uniqueValuesInCol(X: number[][], j: number): number[] {
	return X
		.reduce((acc, cur) => acc.includes(cur[j])?acc:[...acc, cur[j]], [])
		.map(row => row[j]);
}