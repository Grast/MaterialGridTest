import { writable } from "svelte/store";

export const color = writable(localStorage.getItem("color") || "blue-grey");
if(!localStorage.getItem("color")) {
	localStorage.setItem("color", "blue-grey");
};
export const theme = writable(localStorage.getItem("theme") || "dark");
if(!localStorage.getItem("theme")) {
	localStorage.setItem("theme", "dark");
};
export const setColor = colorItem => {
	localStorage.setItem("color", colorItem);
	color.set(colorItem);
};
export const setTheme = themeItem => {
	localStorage.setItem("theme", themeItem);
	theme.set(themeItem);
};

export const colorList = [
	"red", 
	"pink", 
	"purple", 
	"deep-purple", 
	"indigo", 
	"blue", 
	"light-blue", 
	"cyan", 
	"teal", 
	"green", 
	"light-green", 
	"lime", 
	"yellow", 
	"amber", 
	"orange", 
	"deep-orange", 
	"brown", 
	"grey", 
	"blue-grey"
];
export const themeList = [
	"light", 
	"dark"
];
export const highBrightColorList = [
	"light-blue", 
	"cyan", 
	"green", 
	"light-green", 
	"lime", 
	"yellow", 
	"amber"
];
export const getContrastTextColor = value => highBrightColorList.indexOf(value) > -1? "black-text": "";