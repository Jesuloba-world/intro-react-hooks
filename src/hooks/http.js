import { useReducer, useCallback } from "react";
import axios from "axios";

const httpReducer = (curHttpState, action) => {
	switch (action.type) {
		case "SEND":
			return { loading: true, error: null, data: null };
		case "RESPONSE":
			return {
				...curHttpState,
				loading: false,
				data: action.responseData,
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
	});

	const sendRequest = useCallback((url, method, body) => {
		dispatchHttp({ type: "SEND" });
		axios[method](url)
			.then((response) => {
				return response.json;
			})
			.then((responseData) => {
				dispatchHttp({ type: "RESPONSE", responseData: responseData });
			})
			.catch((error) => {
				dispatchHttp({ type: "ERROR", error: error.message });
			});
	}, []);

	return {
		isLoading: httpState.loading,
		data: httpState.data,
		error: httpState.error,
		sendRequest: sendRequest,
	};
};

export default useHttp;
