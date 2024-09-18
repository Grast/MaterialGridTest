<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { theme } from "../Modules/theme";

	export let columnList = writable([
		{ key: "id", 					text: "ID", 			width: "100px", 	align: "right", 	type: "number", 	fixed: true, 	format: null }, 
		{ key: "title", 				text: "제품명", 		width: "250px", 	align: "left", 		type: "string", 	fixed: false,	format: null }, 
		{ key: "description", 			text: "설명", 			width: "400px", 	align: "left", 		type: "string", 	fixed: false,	format: null }, 
		{ key: "category", 				text: "분류", 			width: "100px", 	align: "left", 		type: "string", 	fixed: false,	format: null }, 
		{ key: "price", 				text: "가격", 			width:  "80px", 	align: "right", 	type: "number", 	fixed: false,	format: null }, 
		{ key: "discountPercentage", 	text: "할인율", 		width:  "60px", 	align: "right", 	type: "number", 	fixed: false,	format: null }, 
		{ key: "rating", 				text: "평점", 			width:  "60px",	 	align: "right", 	type: "number", 	fixed: false,	format: null }, 
		{ key: "stock", 				text: "재고", 			width:  "60px",	 	align: "right", 	type: "number", 	fixed: false,	format: null }, 
		{ key: "tags", 					text: "태그", 			width: "200px", 	align: "left", 		type: "string", 	fixed: false,	format: null }, 
		{ key: "brand", 				text: "브랜드", 		width: "200px", 	align: "left", 		type: "string", 	fixed: false,	format: null }, 
		{ key: "sku", 					text: "SKU", 			width: "100px", 	align: "left", 		type: "string", 	fixed: false,	format: null }, 
		{ key: "weight", 				text: "가중치", 		width:  "50px",	 	align: "right", 	type: "number", 	fixed: false,	format: null }, 
		{ key: "dimensions", 			text: "부피", 			width: "200px", 	align: "left", 		type: "string", 	fixed: false,	format: (/** @type {{ width: Number, height: Number, depth: Number }} */ value) => `${value?.width || 0}w * ${value?.height || 0}h * ${value?.depth || 0}d` }, 
		{ key: "warrantyInformation", 	text: "보증정보", 		width: "200px", 	align: "left", 		type: "string", 	fixed: false,	format: null }, 
		{ key: "shippingInformation", 	text: "배송정보", 		width: "200px", 	align: "left", 		type: "string", 	fixed: false,	format: null }, 
		{ key: "avilabilityStatus", 	text: "가용성상태", 	width: "100px", 	align: "left", 		type: "string", 	fixed: false,	format: null }, 
		{ key: "returnPolicy", 			text: "환불정책", 		width: "200px", 	align: "left", 		type: "string", 	fixed: false,	format: null }, 
		{ key: "minimumOrderQuantity", 	text: "최소주문갯수", 	width: "120px", 	align: "right", 	type: "string", 	fixed: false,	format: null }, 
		{ key: "images", 				text: "이미지", 		width: "240px", 	align: "left", 		type: "string", 	fixed: false,	format: null }, 
		{ key: "thumbnail", 			text: "썸네일", 		width: "240px", 	align: "left", 		type: "string", 	fixed: false,	format: null }
	]);
	export let dataList = writable([]);
	export let selectedDataList = writable([]);
	export let keyColumn = "id";
	export let viewportWidth = "100%";
	export let viewportHeight = "550px";

	export const initData = async () => setData(await fetch("./products.json").then(res => res.json()).then(fetchResultList => fetchResultList.products));
	export const setData = paramDataList => dataList.set(paramDataList);
	export const getData = () => $dataList;
	export const addData = paramDataList => dataList.set([ ...$dataList, ...paramDataList ]);
	export const deleteData = () => {
		if($selectedDataList.length == 0) {
			alert("선택된 데이터가 없습니다.");
			return;
		} else if(confirm("선택된 데이터를 제외하시겠습니까?")) {
			let deleteTargetKeyList = $selectedDataList.map(item => item[keyColumn]);

			dataList.set($dataList.filter(dataItem => deleteTargetKeyList.indexOf(dataItem[keyColumn]) == -1));
			selectedDataList.set([]);
		}
	};
	export const clearData = () => {
		dataList.set([]);
		selectedDataList.set([]);
	};

	const id = `${Date.now().toString(16)}`;
	const checkAll = forceAll => {
		if([ true, false ].indexOf(arguments[0]) > -1) {
			selectedDataList.set(arguments[0]? $dataList: []);
		} else {
			selectedDataList.set($selectedDataList.length == $dataList.length? []: $dataList);
		}
	};
	const checkItem = dataItem => {
		if($selectedDataList.find(selectedDataItem => selectedDataItem[keyColumn] == dataItem[keyColumn])) {
			selectedDataList.set($selectedDataList.filter(selectedDataItem => selectedDataItem[keyColumn] != dataItem[keyColumn]));
		} else {
			selectedDataList.set([...$selectedDataList, dataItem]);
		}
	};
	const sortColumn = item => {
		columnList.set($columnList.map(columnItem => {
			if(columnItem["key"] == item["key"]) {
				if(columnItem["sort"] && columnItem["sort"] == "asc") {
					columnItem["sort"] = "";
				} else if(columnItem["sort"] && columnItem["sort"] == "desc") {
					columnItem["sort"] = "asc";
				} else {
					columnItem["sort"] = "desc";
				}
			} else {
				columnItem["sort"] = "";
			}

			return columnItem;
		}));

		if($columnList.filter(columnItem => ["asc", "desc"].indexOf(columnItem["sort"]) > -1).length == 0) {
			columnList.set($columnList.map(columnItem => {
				if(columnItem["key"] == keyColumn) {
					columnItem["sort"] = "desc";
				}

				return columnItem;
			}));
		}

		let targetColumn = $columnList.find(columnItem => ["asc", "desc"].indexOf(columnItem["sort"]) > -1) || $columnList.find(columnItem => columnItem["key"] == keyColumn);
		dataList.set($dataList.sort((i1, i2) => {
			switch(targetColumn["type"]) {
				case "number": return targetColumn["sort"] == "asc"? (i2[targetColumn.key] - i1[targetColumn.key]): (i1[targetColumn.key] - i2[targetColumn.key]);
				case "string": return targetColumn["sort"] == "asc"? ((i2[targetColumn.key] || "").localeCompare(i1[targetColumn.key])): ((i1[targetColumn.key] || "").localeCompare(i2[targetColumn.key]));
				default: return 0;
			}
		}));
	};

	let datagrid;
	let contentRect;
	let scrollLeft;
	let hoverDataIndex = -1;
	let hoverColumnIndex = -1;
	const onKeyDown = event => {
		if(event.keyCode == 27) {
			checkAll($dataList.length != $selectedDataList.length);
		}
	};
	let onRollback;
	const enterInput = (event, columnItem, dataItem) => {
		columnItem["editting"] = dataItem[keyColumn];

		columnList.set($columnList.map(item => {
			if(item.key == columnItem.key) {
				item["editting"] = dataItem[keyColumn];
			}

			return item;
		}));
		
		let rollbackData = dataItem[columnItem.key];
		onRollback = () => dataList.set($dataList.map(item => {
			if(item[keyColumn] == dataItem[keyColumn]) {
				item[columnItem.key] = rollbackData;
			}

			return item;
		}));
	};
	const initInput = el => el.select();
	const exitInput = event => {
		event.stopPropagation();
		
		if(event.keyCode == 13) {
			columnList.set($columnList.map(columnItem => {
				if(columnItem["editting"]) {
					delete columnItem["editting"];
				}

				return columnItem;
			}));
		} else if(event.keyCode == 27) {
			onRollback();
			document.querySelector("input.editting").blur();
		}
	};
	const onScroll = event => scrollLeft = event.target.scrollLeft;
	const onMouseEnter = (dataIndex, columnIndex) => {
		hoverDataIndex = dataIndex;
		hoverColumnIndex = columnIndex;
	};

	onMount(() => {
		initData();
	});
</script>

<svelte:window on:keydown={onKeyDown} />

<!-- 공통 -->
<style>
	
</style>
{#if $theme == "dark"}
<!-- 어두운 테마 -->
<style>
	::-webkit-scrollbar { width: 8px; height: 8px; }
	::-webkit-scrollbar-track { background-color: gray; }
	::-webkit-scrollbar-thumb { background-color: lightgray; }
	::-webkit-scrollbar-button { display: none; }
	::-webkit-scrollbar-thumb:hover { background-color: white; }

	div.datagrid { border-spacing: 0px; }
	div.datagrid div.datagrid_header { background-color: rgba(31, 31, 31, 255); }
	div.datagrid div.datagrid_header div.datacell { border-left: 1px lightgray solid; border-bottom: 1px darkgray solid; padding: 5px 5px; }
	div.datagrid div.datagrid_header div.datacell:first-child { border-left: none; }
	div.datagrid div.datagrid_body div.datacell { border-left: 1px lightgray solid; border-bottom: 1px lightgray solid; padding: 5px 5px; }
	div.datagrid div.datagrid_body div.datacell:first-child { border-left: none; }
	div.datagrid div.datagrid_body div.datacell.focus { background-color: #FFFFFF2F; }
</style>
{:else}
<!-- 밝은 테마 -->
<style>
	::-webkit-scrollbar { width: 8px; height: 8px; }
	::-webkit-scrollbar-track { background-color: lightgray; }
	::-webkit-scrollbar-thumb { background-color: gray; }
	::-webkit-scrollbar-button { display: none; }
	::-webkit-scrollbar-thumb:hover { background-color: black; }

	div.datagrid { border-spacing: 0px; }
	div.datagrid div.datagrid_header { background-color: rgba(223, 223, 223, 255); }
	div.datagrid div.datagrid_header div.datacell { border-left: 1px darkgray solid; border-bottom: 1px darkgray solid; padding: 5px 5px; }
	div.datagrid div.datagrid_header div.datacell:first-child { border-left: none; }
	div.datagrid div.datagrid_body div.datacell { border-left: 1px darkgray solid; border-bottom: 1px darkgray solid; padding: 5px 5px; }
	div.datagrid div.datagrid_body div.datacell:first-child { border-left: none; }
	div.datagrid div.datagrid_body div.datacell.focus { background-color: #0000002F; }
</style>
{/if}

<div class="datagrid">
	<div id="datagrid_header_{id}" style="{viewportWidth? `width:${viewportWidth};overflow-x:hidden;`: ``}">
		<div id="datagrid_header_{id}" class="datagrid_header" style="overflow:hidden;">
			<div class="datagrid_row" style="min-width:fit-content;display:flex;margin-left:-{scrollLeft}px;">
				<div class="datacell center-align truncate" style="width:50px;">
					<label>
						<input type="checkbox" checked={$selectedDataList.length && $selectedDataList.length == $dataList.length} on:click={checkAll} />
						<span style="padding-left:25px;"></span>
					</label>
				</div>
				{#each $columnList as columnItem, columnIndex}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="datacell center-align truncate" data-columnIndex={columnIndex} on:click={() => sortColumn(columnItem)} style="width:{columnItem.width};cursor:pointer;">
					{columnItem.text}
					{#if ["asc", "desc"].indexOf(columnItem.sort) > -1}
					&nbsp;<i class="material-icons vertical-text">{columnItem.sort == "asc"? "arrow_drop_down": "arrow_drop_up"}</i>
					{/if}
				</div>
				{/each}
			</div>
		</div>
	</div>
</div>
<div id="viewport_{id}" style="{viewportWidth? `width:${viewportWidth};overflow-x:auto;`: ``}{viewportHeight? `height:${viewportHeight};overflow-y:auto;`: ``}" bind:contentRect={contentRect} on:scroll={onScroll}>
	<div id="datagrid_{id}" class="datagrid" bind:this={datagrid} style="min-width:fit-content;overflow:hidden;">
		<div id="datagrid_body_{id}" class="datagrid_body" style="position:relative;">
			{#if $dataList?.length == 0}
			<div style="width:100%;">
				<p class="center-align">데이터가 없습니다.</p>
			</div>
			{/if}
			{#each $dataList as dataItem, dataIndex}
			<div class="datagrid_row" style="display:flex;" on:mouseleave={() => onMouseEnter(-1, -1)}>
				<div class="datacell center-align{dataIndex == hoverDataIndex || 0 == hoverColumnIndex? " focus": ""}" on:mouseenter={() => onMouseEnter(dataIndex, 0)} style="width:50px;">
					<label>
						<input type="checkbox" value={dataItem[keyColumn]} checked={$selectedDataList.find(selectedDataItem => selectedDataItem[keyColumn] == dataItem[keyColumn])} on:change={() => checkItem(dataItem)} />
						<span style="padding-left:25px;"></span>
					</label>
				</div>
				{#each $columnList as columnItem, columnIndex}
				{#if columnItem?.format && typeof(columnItem?.format) == "function"}
				<div class="datacell truncate{dataIndex == hoverDataIndex || columnIndex + 1 == hoverColumnIndex? " focus": ""}" on:mouseenter={() => onMouseEnter(dataIndex, columnIndex + 1)} style="width:{columnItem.width};">
					<span>{columnItem.format(dataItem[columnItem.key])}</span>
				</div>
				{:else}
				<div class="datacell truncate {columnItem?.align}-align{dataIndex == hoverDataIndex || columnIndex + 1 == hoverColumnIndex? " focus": ""}{columnItem.edittable? " editable": ""}{columnItem.editting == dataItem[keyColumn]? " no-padding": ""}" on:mouseenter={() => onMouseEnter(dataIndex, columnIndex + 1)} style="width:{columnItem.width};" on:dblclick={event => enterInput(event, {...columnItem}, {...dataItem})}>
					{#if columnItem.editting == dataItem[keyColumn]}
					<input type="text" class="editting browser-default" bind:value={dataItem[columnItem.key]} on:blur={() => columnItem.editting = null} on:keydown={exitInput} use:initInput style="width:100%;height:100%;" />
					{:else}
					<span>{dataItem[columnItem.key] || ""}</span>
					{/if}
				</div>
				{/if}
				{/each}
			</div>
			{/each}
		</div>
	</div>
</div>
<br/><div class="col s12 right-align">
	<button class="btn btn-flat waves-effect{$theme == "dark"? " waves-light": ""}" on:click={initData}>initData()</button>
	<button class="btn btn-flat waves-effect{$theme == "dark"? " waves-light": ""}" on:click={() => console.log("getData(): ", getData())}>getData()</button>
	<button class="btn btn-flat waves-effect{$theme == "dark"? " waves-light": ""}" on:click={() => console.log("getSelectedData(): ", $selectedDataList)}>getSelectedData()</button>
	<button class="btn btn-flat waves-effect{$theme == "dark"? " waves-light": ""}" on:click={() => setData([{}])}>setData()</button>
	<button class="btn btn-flat waves-effect{$theme == "dark"? " waves-light": ""}" on:click={() => addData([{}])}>addData()</button>
	<button class="btn btn-flat waves-effect{$theme == "dark"? " waves-light": ""}" on:click={deleteData}>deleteData()</button>
	<button class="btn btn-flat waves-effect{$theme == "dark"? " waves-light": ""}" on:click={clearData}>clearData()</button>
</div>