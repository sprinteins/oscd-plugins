import * as fs from 'node:fs'
import * as path from 'node:path'
import * as util from 'node:util'
import { fileURLToPath } from 'node:url'

import generateDefinitionConstant from './generate-definition-constant'
//import generateTree from './generate-tree-constant'

//====== INITIALIZATION ======//

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function writeResultToFile(filename: string, result: Record<string, unknown>) {
	const dirPath = path.resolve(__dirname, '../constants')
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true })
	}
	const filePath = path.join(dirPath, filename)
	const fileContent = `
/**
 * This file is auto-generated. Do not edit it directly.
 * Last generated at ${new Date().toISOString()}
 */

const generated = ${JSON.stringify(result, null, 2).replace(/"([^"]+)":/g, '$1:')} as const;

export default generated;`

	fs.writeFileSync(filePath, fileContent)

	console.log(`
###########################################################################################
## ${filename} has been written to ./${dirPath.split('/').slice(-6).join('/')}
###########################################################################################
`)
}

const definitionConstant = generateDefinitionConstant()
//const treeConstant = generateTree(definitionConstant.scl)

writeResultToFile('definition.generated.ts', definitionConstant)
