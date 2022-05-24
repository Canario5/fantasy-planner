// https://vitejs.dev/guide/features.html#glob-import

const modules = import.meta.glob("../svg/*.svg")
const logoNhl = {}

for (const path in modules) {
	/* console.log(modules) */
	/* 	modules[path]().then(() => { */
	/*  console.log(path) */
	const logoObject = new URL(path, import.meta.url)
	const id = logoObject.pathname.replace(/(\D+)/g, "")
	logoNhl[id] = logoObject
	/* 	}) */
}

export { logoNhl }
