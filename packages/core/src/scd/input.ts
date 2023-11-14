import { InputExtRef } from "scd/input-extref"

export class Input{

	public readonly iedName: string 	   = ""
	public readonly extRefs: InputExtRef[] = []

	constructor(input?: Partial<Input>){
		const newThis: Input = {
			...this,
			...input,
		}
		Object.setPrototypeOf(newThis, Input.prototype)
		return newThis
	}
}