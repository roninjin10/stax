import type { FeatureDefinition } from '@growthbook/growthbook-react'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { flagType, TypesafeGrowthbook } from './TypesafeGrowthbook'

const flagTypes = {
  bool: flagType.bool,
  url: flagType.url,
  string: flagType.string,
  number: flagType.number,
  stringArray: flagType.stringArray,
  numberArray: flagType.numberArray,
  json: z.object({
    foo: z.string(),
  }),
}

const features: Record<string, FeatureDefinition> = {
  bool: {
    defaultValue: true,
  },
  url: {
    defaultValue: 'https://example.com',
  },
  string: {
    defaultValue: 'some string',
    rules: [
      {
        force: 'force some other string',
      },
    ],
  },
  number: {
    defaultValue: 5,
  },
  stringArray: {
    defaultValue: ['a', 'b', 'c'],
  },
  numberArray: {
    defaultValue: [1, 2, 3],
  },
  json: {
    defaultValue: { foo: 'bar' },
  },
}

describe('TypesafeGrowthbook', () => {
  describe('class TypesafeGrowthbook', () => {
    it('Tages flagTypes as a generic type parameter', () => {
      const gb = new TypesafeGrowthbook(flagTypes)
      expect(gb.flagTypes).toEqual(flagTypes)
    })

    it('Allows you to set features', () => {
      const gb = new TypesafeGrowthbook(flagTypes)
      gb.setFeatures(features)
      expect(gb.getFeatures()).toMatchInlineSnapshot(`
        {
          "bool": {
            "defaultValue": true,
          },
          "json": {
            "defaultValue": {
              "foo": "bar",
            },
          },
          "number": {
            "defaultValue": 5,
          },
          "numberArray": {
            "defaultValue": [
              1,
              2,
              3,
            ],
          },
          "string": {
            "defaultValue": "some string",
            "rules": [
              {
                "force": "force some other string",
              },
            ],
          },
          "stringArray": {
            "defaultValue": [
              "a",
              "b",
              "c",
            ],
          },
          "url": {
            "defaultValue": "https://example.com",
          },
        }
      `)
    })
  })

  // describe('initGrowthbookReact', () => {})
})
