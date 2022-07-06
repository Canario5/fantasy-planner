// https://vitejs.dev/guide/features.html#glob-import

const modules = import.meta.glob("../svg/*.svg")
const logoNhl = {}

for (const path in modules) {
	/* console.log(modules) */
	/* modules[path]().then(() => { */
	console.log(path)
	const id = path.replace(/(\D+)/g, "")
	const logoObject = new URL(`../svg/${id}.svg`, import.meta.url).href

	console.log(logoObject)
	logoNhl[id] = logoObject

	/* 	}) */
}

export { logoNhl }
