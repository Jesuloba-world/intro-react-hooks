import React, { useState, useEffect, useCallback, useReducer } from "react";
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

const Ingredients = () => {
	const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
	// const [userIngredients, setUserIngredients] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	useEffect(() => {
		console.log("RENDERING INGREDIENTS", userIngredients);
	}, [userIngredients]);

	const filteredIngredientHandler = useCallback((filteredIngredients) => {
		// setUserIngredients(filteredIngredients);
		dispatch({
			type: "SET",
			ingredients: filteredIngredients,
		});
	}, []);

	const addIngredientHandler = (ingredient) => {
		setIsLoading(true);
		axios
			.post(
				"https://intro-hooks-default-rtdb.firebaseio.com/ingredient.json",
				ingredient
			)
			.then((response) => {
				setIsLoading(false);
				return response.data.name;
			})
			.then((name) => {
				// setUserIngredients((prevIngredients) => [
				// 	...prevIngredients,
				// 	{ id: name, ...ingredient },
				// ]);
				dispatch({
					type: "ADD",
					ingredient: { id: name, ...ingredient },
				});
			});
	};

	const removeIngredientHandler = (ingredientId) => {
		setIsLoading(true);
		axios
			.delete(
				`https://intro-hooks-default-rtdb.firebaseio.com/ingredient/${ingredientId}.json`
			)
			.then((response) => {
				setIsLoading(false);
				// setUserIngredients((prevIngredients) =>
				// 	prevIngredients.filter(
				// 		(ingredient) => ingredient.id !== ingredientId
				// 	)
				// );
				dispatch({
					type: "DELETE",
					id: ingredientId,
				});
			})
			.catch((error) => {
				setError(error.message);
				setIsLoading(false);
			});
	};

	const clearError = () => {
		setError(null);
	};

	return (
		<div className="App">
			{error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

			<IngredientForm
				onAddIngredient={addIngredientHandler}
				loading={isLoading}
			/>

			<section>
				<Search onLoadIngredient={filteredIngredientHandler} />
				<IngredientList
					ingredients={userIngredients}
					onRemoveItem={removeIngredientHandler}
				/>
			</section>
		</div>
	);
};

export default Ingredients;
