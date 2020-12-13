import React, { useEffect, useCallback, useReducer, useMemo } from "react";
import axios from "axios";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredients, action) => {
	switch (action.type) {
		case "ADD":
			return [...currentIngredients, action.ingredient];
		case "SET":
			return action.ingredients;
		case "DELETE":
			return currentIngredients.filter((ing) => ing.id !== action.id);
		default:
			throw new Error("this is not supposed to happen");
	}
};

const httpReducer = (curHttpState, action) => {
	switch (action.type) {
		case "SEND":
			return { loading: true, error: null };
		case "RESPONSE":
			return { ...curHttpState, loading: false };
		case "ERROR":
			return { loading: false, error: action.error };
		case "CLEAR":
			return { ...curHttpState, error: null };
		default:
			throw new Error("this is not supposed to happen");
	}
};

const Ingredients = () => {
	const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
	const [httpState, dispatchHttp] = useReducer(httpReducer, {
		loading: false,
		error: null,
	});

	useEffect(() => {
		console.log("RENDERING INGREDIENTS", userIngredients);
	}, [userIngredients]);

	const filteredIngredientHandler = useCallback((filteredIngredients) => {
		dispatch({
			type: "SET",
			ingredients: filteredIngredients,
		});
	}, []);

	const addIngredientHandler = useCallback((ingredient) => {
		dispatchHttp({ type: "SEND" });
		axios
			.post(
				"https://intro-hooks-default-rtdb.firebaseio.com/ingredient.json",
				ingredient
			)
			.then((response) => {
				dispatchHttp({ type: "RESPONSE" });
				return response.data.name;
			})
			.then((name) => {
				dispatch({
					type: "ADD",
					ingredient: { id: name, ...ingredient },
				});
			});
	}, []);

	const removeIngredientHandler = useCallback((ingredientId) => {
		dispatchHttp({ type: "SEND" });
		axios
			.delete(
				`https://intro-hooks-default-rtdb.firebaseio.com/ingredient/${ingredientId}.json`
			)
			.then((response) => {
				dispatchHttp({ type: "RESPONSE" });
				dispatch({
					type: "DELETE",
					id: ingredientId,
				});
			})
			.catch((error) => {
				dispatchHttp({ type: "ERROR", error: error.message });
			});
	}, []);

	const clearError = useCallback(() => {
		dispatchHttp({ type: "CLEAR" });
	}, []);

	const ingredientList = useMemo(() => {
		return (
			<IngredientList
				ingredients={userIngredients}
				onRemoveItem={removeIngredientHandler}
			/>
		);
	}, [userIngredients, removeIngredientHandler]);

	return (
		<div className="App">
			{httpState.error && (
				<ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
			)}

			<IngredientForm
				onAddIngredient={addIngredientHandler}
				loading={httpState.loading}
			/>

			<section>
				<Search onLoadIngredient={filteredIngredientHandler} />
				{ingredientList}
			</section>
		</div>
	);
};

export default Ingredients;
