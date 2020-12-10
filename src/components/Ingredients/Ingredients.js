import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const Ingredients = () => {
	const [userIngredients, setUserIngredients] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	const filteredIngredientHandler = useCallback((filteredIngredients) => {
		setUserIngredients(filteredIngredients);
	}, []);

	useEffect(() => {
		console.log("RENDERING INGREDIENTS", userIngredients);
	}, [userIngredients]);

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
				setUserIngredients((prevIngredients) => [
					...prevIngredients,
					{ id: name, ...ingredient },
				]);
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
				setUserIngredients((prevIngredients) =>
					prevIngredients.filter(
						(ingredient) => ingredient.id !== ingredientId
					)
				);
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
