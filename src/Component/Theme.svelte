<script>
    import { onMount } from "svelte";
	
	import { color, colorList, setColor, theme, setTheme, getContrastTextColor } from "../Modules/theme";

	const id = `_${Date.now()}`;
	
	
	export const open = () => M.Modal.getInstance(document.querySelector(`#${id}`)).open();
	export const close = () => M.Modal.getInstance(document.querySelector(`#${id}`)).close();

	onMount(() => {
		M.Modal.init(document.querySelector(`#${id}`), {
			"inDuration": 100, 
			"outDuration": 100, 
			"startingTop": "10%", 
			"endingTop": "10%"
		});

		return () => {
			M.Modal.getInstance(document.querySelector(`#${id}`)).destroy();
		};
	});
</script>

<link rel="stylesheet" href="./css/css_{$color}_{$theme}/materialize.css">

<!-- svelte-ignore a11y-invalid-attribute -->
<div id={id} class="modal bottom-sheet">
	<div class="modal-content container">
		<blockquote class="col s12">
			<h5>개인화 설정</h5>
		</blockquote>
		<div class="col s12 divider {$theme == "dark"? "grey lighten-2": "grey darken-1"}" /><br/>
		<blockquote class="col s12">
			<h5>색상 선택</h5>
			<div class="col s12 row">
				{#each colorList as colorItem}
				<button class="btn {colorItem}" on:click={() => setColor(colorItem)}>
					<i class="material-icons no-margin no-padding {getContrastTextColor(colorItem)}">{$color == colorItem? "check": "palette"}</i>
				</button>
				{/each}
			</div>
		</blockquote>
		<div class="col s12 divider {$theme == "dark"? "grey lighten-2": "grey darken-1"}" /><br/>
		<blockquote class="col s12">
			<h5>테마 선택</h5>
			<div class="col s12 row">
				<button class="col s6 btn white black-text" on:click={() => setTheme("light")}>
					<i class="material-icons">{$theme == "light"? "check": "light_mode"}</i>
				</button>
				<button class="col s6 btn black white-text" on:click={() => setTheme("dark")}>
					<i class="material-icons">{$theme == "dark"? "check": "dark_mode"}</i>
				</button>
			</div>
		</blockquote>
	</div>
	<div class="modal-footer container">
		<a href="javascript:void(0)" class="modal-close waves-effect btn-flat">닫기</a>
	</div>
</div>
