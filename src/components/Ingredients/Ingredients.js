import React, { useEffect, useCallback, useReducer, useMemo } from "react";
import axios from "axios";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";
import useHttp from "../../hooks/http";

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

const Ingredients = () => {
	const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
	const { isLoading, data, error, sendRequest } = useHttp();

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
		// dispatchHttp({ type: "SEND" });
		// axios
		// 	.post(
		// 		"https://intro-hooks-default-rtdb.firebaseio.com/ingredient.json",
		// 		ingredient
		// 	)
		// 	.then((response) => {
		// 		dispatchHttp({ type: "RESPONSE" });
		// 		return response.data.name;
		// 	})
		// 	.then((name) => {
		// 		dispatch({
		// 			type: "ADD",
		// 			ingredient: { id: name, ...ingredient },
		// 		});
		// 	});
	}, []);

	const removeIngredientHandler = useCallback(
		(ingredientId) => {
			sendRequest(
				`https://intro-hooks-default-rtdb.firebaseio.com/ingredient/${ingredientId}.json`,
				"delete"
			);
		},
		[sendRequest]
	);

	const clearError = useCallback(() => {
		// dispatchHttp({ type: "CLEAR" });
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
			{error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

			<IngredientForm
				onAddIngredient={addIngredientHandler}
				loading={isLoading}
			/>

			<section>
				<Search onLoadIngredient={filteredIngredientHandler} />
				{ingredientList}
			</section>
		</div>
	);
};

export default Ingredients;
