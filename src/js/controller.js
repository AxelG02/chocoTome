import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarkView from "./views/bookmarkView.js";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";
import { MODAL_CLOSE_SEC } from "./consfig.js";

if (module.hot) {
	module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

const controlRecipes = async function () {
	try {
		//getting id from clicked recipe
		const id = window.location.hash.slice(1);

		if (!id) return;
		//spinner component
		recipeView.renderSpinner();

		//update results and bookmark view
		resultsView.update(model.getSearchResultPage());
		bookmarkView.update(model.state.bookmarks);

		//laoding the recipe
		await model.loadRecipe(id);

		//rendering recipe
		recipeView.render(model.state.recipe);
	} catch (error) {
		recipeView.renderError();
	}
};

const controlSearchResults = async function () {
	try {
		//getting the query
		const query = searchView.getQuery();
		if (!query) return;

		resultsView.renderSpinner();

		//laoding recipes
		await model.loadSearchResults(query);

		if (model.state.search.results.length === 0) throw new Error();

		//rendering resulting recipes
		resultsView.render(model.getSearchResultPage(1));

		//rendering pagination
		paginationView.render(model.state.search);
	} catch (error) {
		resultsView.renderError();
		console.log(error);
	}
};

const controlPagination = function (goToPage) {
	//rendering resulting recipes
	resultsView.render(model.getSearchResultPage(goToPage));

	//rendering pagination
	paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
	//update recipe servings
	if (newServings <= 0) return;
	model.updateServings(newServings);

	//update recipe view
	recipeView.update(model.state.recipe);
};

const controlBookmark = function () {
	try {
		if (!model.state.recipe.bookmarked)
			model.addBookmark(model.state.recipe);
		else model.deleteBookmark(model.state.recipe.id);

		recipeView.update(model.state.recipe);
		bookmarkView.render(model.state.bookmarks);

		if (model.state.bookmarks.length === 0) throw new Error();
	} catch (error) {
		bookmarkView.renderError("icon-smile");
	}
};

const controlBookmarkOnLoad = function () {
	try {
		bookmarkView.render(model.state.bookmarks);
		if (model.state.bookmarks.length === 0) throw new Error();
	} catch (error) {
		bookmarkView.renderError("icon-smile");
	}
};

const controlAddRecipe = async function (newRecipe) {
	try {
		addRecipeView.renderSpinner();

		await model.uploadRecipe(newRecipe);

		recipeView.render(model.state.recipe);
		bookmarkView.render(model.state.bookmarks);

		window.history.pushState(null, "", `#${model.state.recipe.id}`);

		addRecipeView.renderMessage();

		setTimeout(function () {
			addRecipeView.closeWindow();
		}, MODAL_CLOSE_SEC * 1000);
	} catch (error) {
		alert(error);
	}
};

const init = function () {
	model.initBookmarks();
	bookmarkView.addHandlerRender(controlBookmarkOnLoad);
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addHandlerAddBookmark(controlBookmark);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
	addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
