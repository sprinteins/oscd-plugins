export const enum MessageType {
	GOOSE = "GOOSE",
	MMS = "MMS",
	SampledValues = "SampledValues",
	Unknown = "Unknown",
}

export const allMessageTypes = [
	MessageType.GOOSE,
	MessageType.MMS,
	MessageType.SampledValues,
	MessageType.Unknown,
] as const