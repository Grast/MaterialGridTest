<script>
    import { color, getContrastTextColor } from "../Modules/theme";
    import Theme from "./Theme.svelte";

	let theme;
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<nav>
	<div class="nav-wrapper container">
		<a href="javascript:void(0)" class="brand-logo {getContrastTextColor($color)}">Material-Grid-Test</a>
		<ul id="nav" class="right">
			<li><a href="javascript:void(0)" class="{getContrastTextColor($color)}" on:click={() => theme.open()}><i class="material-icons no-padding">format_paint</i></a></li>
			<li><a href="javascript:void(0)" class="{getContrastTextColor($color)}"><i class="material-icons no-padding">logout</i></a></li>
		</ul>
	</div>
</nav>
<Theme bind:this={theme} />