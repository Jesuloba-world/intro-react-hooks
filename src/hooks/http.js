import { useReducer, useCallback } from "react";
import axios from "axios";

const httpReducer = (curHttpState, action) => {
	switch (action.type) {
		case "SEND":
			return {
				loading: true,
				error: null,
				data: null,
				extra: null,
				identifier: action.identifier,
			};
		case "RESPONSE":
			return {
				...curHttpState,
				loading: false,
				data: action.responseData,
				extra: action.extra,
			};
		case "ERROR":
			return { ...curHttpState, loading: false, error: action.error };
		case "CLEAR":
			return { ...curHttpState, error: null };
		default:
			throw new Error("this is not supposed to happen");
	}
};

const useHttp = () => {
	const [httpState, dispatchHttp] = useReducer(httpReducer, {
		loading: false,
		error: null,
		data: null,
		extra: null,
		identifier: null,
	});

	const sendRequest = useCallback(
		(url, method, body, reqExtra, reqIdentifier) => {
			dispatchHttp({ type: "SEND", identifier: reqIdentifier });
			axios[method](url, body)
				.then((response) => {
					dispatchHttp({
						type: "RESPONSE",
						responseData: response.data,
						extra: reqExtra,
					});
				})
				.catch((error) => {
					dispatchHttp({ type: "ERROR", error: error.message });
				});
		},
		[]
	);

	return {
		isLoading: httpState.loading,
		data: httpState.data,
		error: httpState.error,
		sendRequest: sendRequest,
		reqExtra: httpState.extra,
		reqIdentifier: httpState.identifier,
	};
};

export default useHttp;