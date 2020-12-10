import React, { useState, useEffect } from "react";
import axios from "axios";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = () => {
	const [ingredients, setIngredients] = useState([]);

	useEffect(() => {
		axios
			.get(
				"https://intro-hooks-default-rtdb.firebaseio.com/ingredient.json"
			)
			.then((response) => {
				const loadedIngredients = [];
				for (const key in response.data) {
					loadedIngredients.push({
						id: key,
						title: response.data[key].title,
						amount: response.data[key].amount,
					});
				}

				setIngredients(loadedIngredients);
			});
	}, []);

	const addIngredientHandler = (ingredient) => {
		axios
			.post(
				"https://intro-hooks-default-rtdb.firebaseio.com/ingredient.json",
				ingredient
			)
			.then((response) => {
				return response.data.name;
			})
			.then((name) => {
				setIngredients((prevIngredients) => [
					...prevIngredients,
					{ id: name, ...ingredient },
				]);
			});
	};

	return (
		<div className="App">
			<IngredientForm onAddIngredient={addIngredientHandler} />

			<section>
				<Search />
				<IngredientList
					ingredients={ingredients}
					onRemoveItem={() => {}}
				/>
			</section>
		</div>
	);
};

export default Ingredients;
