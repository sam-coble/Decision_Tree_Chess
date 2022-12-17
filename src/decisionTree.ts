import {decisionStump, StumpModel} from './decisionStump';
function decisionTree(X: number[][], y: number[], depth: number): any {
	const n = X?.length;
	const d = X?.[0]?.length;

	let splitModel: StumpModel = decisionStump(X, y);

	if (depth <= 1 || splitModel.baseSplit) {
		return splitModel;
	}

	let yes: boolean[] = splitModel.split(X);

	let yesModel = decisionTree(X.filter((e, i) => {
		return yes[i];
	}), y.filter((e, i) => {
		return yes[i];
	}), depth - 1);

	let noModel = decisionTree(X.filter((e, i) => {
		return !yes[i];
	}), y.filter((e, i) => {
		return !yes[i];
	}), depth - 1);

	function predict(Xhat: number[][]): boolean[] {
		const t = Xhat?.length;
		const d = Xhat?.[0]?.length;
		const yhat: boolean[] = new Array(t).map(e => false);

		const yes: any = splitModel.split(Xhat);

		// yhat.map((e, i) => yes[i] ? yesModel.predict(Xhat))
		return yhat;

	}

	return predict;
}