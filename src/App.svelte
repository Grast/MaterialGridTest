<script>
    import { writable } from "svelte/store";
    import AppBar from "./Component/AppBar.svelte";
    import DataGrid from "./Component/DataGrid.svelte";
    import { onMount } from "svelte";

	const columnList = writable([
		{ key: "id", 					text: "ID", 			width: "100px", 	align: "right", 	fixed: true, 	format: null }, 
		{ key: "title", 				text: "제품명", 		width: "100px", 	align: "left", 		fixed: false,	format: null }, 
		{ key: "description", 			text: "설명", 			width: "100px", 	align: "left", 		fixed: false,	format: null }, 
		{ key: "category", 				text: "분류", 			width: "100px", 	align: "left", 		fixed: false,	format: null }, 
		{ key: "price", 				text: "가격", 			width: "100px", 	align: "right", 	fixed: false,	format: null }, 
		{ key: "discountPercentage", 	text: "할인율", 		width: "100px", 	align: "right", 	fixed: false,	format: null }, 
		{ key: "rating", 				text: "평점", 			width: "100px", 	align: "right", 	fixed: false,	format: null }, 
		{ key: "stock", 				text: "재고", 			width: "100px", 	align: "right", 	fixed: false,	format: null }, 
		{ key: "tags", 					text: "태그", 			width: "100px", 	align: "left", 		fixed: false,	format: null }, 
		{ key: "brand", 				text: "브랜드", 		width: "100px", 	align: "left", 		fixed: false,	format: null }, 
		{ key: "sku", 					text: "SKU", 			width: "100px", 	align: "left", 		fixed: false,	format: null }, 
		{ key: "weight", 				text: "가중치", 		width: "100px", 	align: "right", 	fixed: false,	format: null }, 
		{ key: "dimensions", 			text: "부피", 			width: "100px", 	align: "left", 		fixed: false,	format: (/** @type {{ width: Number, height: Number, depth: Number }} */ value) => `${value.width}w * ${value.height}h * ${value.depth}d` }, 
		{ key: "warrantyInformation", 	text: "보증정보", 		width: "100px", 	align: "left", 		fixed: false,	format: null }, 
		{ key: "shippingInformation", 	text: "배송정보", 		width: "100px", 	align: "left", 		fixed: false,	format: null }, 
		{ key: "avilabilityStatus", 	text: "가용성상태", 	width: "100px", 	align: "left", 		fixed: false,	format: null }, 
		{ key: "returnPolicy", 			text: "환불정책", 		width: "100px", 	align: "left", 		fixed: false,	format: null }, 
		{ key: "minimumOrderQuantity", 	text: "최소주문갯수", 	width: "100px", 	align: "right", 	fixed: false,	format: null }, 
		{ key: "images", 				text: "이미지", 		width: "100px", 	align: "left", 		fixed: false,	format: null }, 
		{ key: "thumbnail", 			text: "썸네일", 		width: "100px", 	align: "left", 		fixed: false,	format: null }
	]);
	const dataList = writable([]);
	let keyColumn = "id";
	let indexable = true;
	let checkable = true;
	let resizable = true;
	let multiple = true;
	let tooltip = true;

	onMount(async () => {
		dataList.set(await fetch("https://dummyjson.com/products").then(res => res.json()).then(resultList => resultList.products));
	});
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<AppBar />
<DataGrid 
		columnList={columnList}
		dataList={dataList}
		bind:keyColumn
		viewportWidth={"100%"}
		viewportHeight={"600px"}
		bind:indexable 
		bind:checkable 
		bind:resizable 
		bind:multiple 
		bind:tooltip
/>