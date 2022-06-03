import View from "./View.js";

class AddRecipeView extends View {
	_parentEl = document.querySelector(".upload");
	_message = "Recipe successfuly uploaded :)";

	_window = document.querySelector(".add-recipe-window");
	_overlay = document.querySelector(".overlay");

	_btnOpen = document.querySelector(".nav__btn--add-recipe");
	_btnClose = document.querySelector(".btn--close-modal");

	constructor() {
		super();
		this._addHandlerShowWindow();
		this._addHandlerHideWindow();
	}

	openWindow() {
		this._overlay.classList.remove("hidden");
		this._window.classList.remove("hidden");
	}

	closeWindow() {
		this._overlay.classList.add("hidden");
		this._window.classList.add("hidden");
	}

	_addHandlerShowWindow() {
		this._btnOpen.addEventListener("click", this.openWindow.bind(this));
	}

	_addHandlerHideWindow() {
		this._btnClose.addEventListener("click", this.closeWindow.bind(this));
		this._overlay.addEventListener("click", this.closeWindow.bind(this));
	}

	addHandlerUpload(handler) {
		this._parentEl.addEventListener("submit", function (e) {
			e.preventDefault();
			const data = Object.fromEntries([...new FormData(this)]);
			handler(data);
		});
	}

	_generateMarkup() {}
}

export default new AddRecipeView();
