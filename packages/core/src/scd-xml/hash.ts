import { describeElement } from "./describers"

export function hashElement(el: Element): Promise<string> {
	const desc = describeElement(el)
	
	return hash(JSON.stringify(desc))
}

export async function hash(str: string): Promise<string> {
	const buffer = new TextEncoder().encode(str)
	const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
	const hashArray = Array.from(new Uint8Array(hashBuffer))
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
	return hashHex
}