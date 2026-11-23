import type { ServiceItem } from '../../../../headless/services/ied-detail-view'
import type { MessageType } from '../../../../headless/types'
import type { IEDElkNode } from '../../diagram/nodes'

export { ConnectionTypeDirection } from '../../../../headless/services/ied-detail-view'
export type ServiceObject = ServiceItem<IEDElkNode, MessageType>
