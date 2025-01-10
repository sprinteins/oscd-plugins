import type {
	Header,
	Substation,
	Communication,
	Ied,
	DataTypeTemplates,
	Line,
	Process
} from '@oscd-plugins/core-standard/ed2'
import type { Xml } from '@oscd-plugins/core-api/plugin/v1'

export type RootElements = {
	header: Xml.SclElement<Header.Root> | null
	substation: Array<Xml.SclElement<Substation.Root>> | null
	// communication: Xml.SclElement<Communication.Root> | null
	// ied: Array<Xml.SclElement<Ied.Root> | null>
	dataTypeTemplates: Xml.SclElement<DataTypeTemplates.Root> | null
	// line: Array<Xml.SclElement<Line.Root>> | null
	// process: Array<Xml.SclElement<Process.Root>> | null
}

export type DataTypeTemplatesElements = {
	lNodeType: Array<Xml.SclElement<DataTypeTemplates.LNodeType>> | null
	dOType: Array<Xml.SclElement<DataTypeTemplates.DOType>> | null
	dAType: Array<Xml.SclElement<DataTypeTemplates.DAType>> | null
	enumType: Array<Xml.SclElement<DataTypeTemplates.EnumType>> | null
}
