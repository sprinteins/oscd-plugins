export function isPropertyOfObject<
	GenericObject extends Record<string, unknown>,
	GenericKey extends keyof GenericObject
>(key: string, object: GenericObject): key is string & GenericKey {
	return key in object
}
