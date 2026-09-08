import { describe, expect, it } from 'vitest'

import {
  CONDUCTING_EQUIPMENTS,
  TYPE_FAMILY,
} from '@/headless/constants/type-elements'
import { getChildrenOptions } from './children-options.helper'

function createConductingEquipment(
  type?: string,
  terminalCount = 0,
): Element {
  const xmlDocument = document.implementation.createDocument(
    null,
    'SCL',
    null,
  )

  const element = xmlDocument.createElement('ConductingEquipment')

  if (type) {
    element.setAttribute('type', type)
  }

  for (let index = 0; index < terminalCount; index += 1) {
    element.append(xmlDocument.createElement('Terminal'))
  }

  return element
}

describe('getChildrenOptions', () => {
  const familiesWithoutChildrenOptions = [
    TYPE_FAMILY.bay,
    TYPE_FAMILY.generalEquipment,
    TYPE_FAMILY.function,
    TYPE_FAMILY.lNodeType,
  ] as const

  const singleTerminalEquipment = Object.values(
    CONDUCTING_EQUIPMENTS,
  ).find((equipment) => equipment.numberOfTerminals === 1)

  const doubleTerminalEquipment = Object.values(
    CONDUCTING_EQUIPMENTS,
  ).find((equipment) => equipment.numberOfTerminals === 2)

  if (!singleTerminalEquipment || !doubleTerminalEquipment) {
    throw new Error(
      'Expected conducting-equipment constants for one and two terminals',
    )
  }

  it.each(familiesWithoutChildrenOptions)(
    'GIVEN the "%s" family without child options WHEN children options are requested THEN no children options are returned',
    (family) => {
      const result = getChildrenOptions({
        family: family,
        element: document.createElement('TestElement'),
      })

      expect(result[family]).toBeUndefined()
      expect(result.conductingEquipment).toBeUndefined()
    },
  )

  it('GIVEN known single-terminal conducting equipment WHEN children options are requested THEN one terminal is the only option', () => {
    const element = createConductingEquipment(
      singleTerminalEquipment.type,
      1,
    )

    const result = getChildrenOptions({
      family: TYPE_FAMILY.conductingEquipment,
      element,
    })

    expect(result.conductingEquipment).toEqual({
      currentTerminalsElements: [element.children[0]],
      currentValue: 1,
      options: [
        {
          label: 'One',
          value: 1,
        },
      ],
    })
  })

  it('GIVEN known double-terminal conducting equipment WHEN children options are requested THEN two terminals are the only option', () => {
    const element = createConductingEquipment(
      doubleTerminalEquipment.type,
      2,
    )

    const result = getChildrenOptions({
      family: TYPE_FAMILY.conductingEquipment,
      element,
    })

    expect(result.conductingEquipment).toMatchObject({
      currentValue: 2,
      options: [
        {
          label: 'Two',
          value: 2,
        },
      ],
    })
  })

  it('GIVEN conducting equipment with Terminal and non-Terminal children WHEN children options are requested THEN only Terminal children are counted', () => {
    const element = createConductingEquipment(
      doubleTerminalEquipment.type,
      2,
    )
    element.append(document.createElement('OtherChild'))

    const result = getChildrenOptions({
      family: TYPE_FAMILY.conductingEquipment,
      element,
    })

    expect(result.conductingEquipment).toMatchObject({
      currentValue: 2,
    })
  })

  it('GIVEN unknown conducting equipment WHEN children options are requested THEN one and two terminals are allowed', () => {
    const element = createConductingEquipment('UnknownEquipment', 0)

    const result = getChildrenOptions({
      family: TYPE_FAMILY.conductingEquipment,
      element,
    })

    expect(result.conductingEquipment).toMatchObject({
      currentValue: 0,
      options: [
        {
          label: 'One',
          value: 1,
        },
        {
          label: 'Two',
          value: 2,
        },
      ],
    })
  })

  it('GIVEN conducting equipment without a type attribute WHEN children options are requested THEN an error is thrown', () => {
    const element = createConductingEquipment()

    expect(() =>
      getChildrenOptions({
        family: TYPE_FAMILY.conductingEquipment,
        element,
      }),
    ).toThrow('No type attribute found on conducting equipment')
  })
})