export interface StumpModel {
	predict: any;
	split: any;
	baseSplit: any;
}

export function decisionStump(_X: number[][], _y: number): stumpModel {
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
	function predict(Xhat: number[][]): number[] {
		const t: number = Xhat?.length;
		const d: number = Xhat?.[0]?.length;
		const yes: boolean[] = split(Xhat);
		const yhat = new Array(t).map(e => splitYes);

		if (yes.filter(e => !e).length > 0) {
			yhat.map(e => e ? e : splitNo);
		}
	}

	return {predict: predict, split: split, baseSplit: splitNo.length == 0};
}

function mode(arr: number[]): number {
	return arr
		.reduce((acc, cur) => {
			acc[cur] = acc[cur] ? acc[cur] + 1: 1;
		}, {})
		.reduce((acc, cur) => {
			return acc > cur ? acc : cur;
		}, -Infinity);
}

function uniqueValuesInCol(X: number[][], j: number): number[] {
	return X
		.reduce((acc, cur) => {
			if (!acc.includes(cur[j])) {
				acc.push(cur[j]);
			}
		}, [])
		.map(row => row[j]);
}