export class InputExtRef{

	public readonly iedName: 	 string = ""
	public readonly serviceType: string = ""
	public readonly ldInst: 	 string = ""
	public readonly lnClass: 	 string = ""
	public readonly lnInst: 	 string = ""
	public readonly prefix: 	 string = ""
	public readonly doName: 	 string = ""
	public readonly daName: 	 string = ""
	public readonly srcLNClass:  string = ""
	public readonly srcLDInst: 	 string = ""
	public readonly srcPrefix: 	 string = ""
	public readonly srcCBName: 	 string = ""

	constructor(inputExtRef?: Partial<InputExtRef>){
		const newThis: InputExtRef = {
			...this,
			...inputExtRef,
		}
		Object.setPrototypeOf(newThis, InputExtRef.prototype)
		return newThis
	}
}