import type { FeatureDefinition } from '@growthbook/growthbook-react'
import matchers from '@testing-library/jest-dom/matchers'
import { cleanup, render } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { afterEach, describe, expect, it } from 'vitest'
import { z } from 'zod'

import {
  flag,
  initGrowthbookReact,
  TypesafeGrowthbook,
} from './TypesafeGrowthbook'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})

const flagTypes = {
  bool: flag.bool,
  url: flag.url,
  string: flag.string,
  number: flag.number,
  stringArray: flag.stringArray,
  numberArray: flag.numberArray,
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

    it('should fail if boolean flag returns a non boolean', () => {
      const gb = new TypesafeGrowthbook(flagTypes)
      const badFeatures = {
        ...features,
        bool: {
          defaultValue: 'not a boolean',
        },
      }
      expect(() =>
        gb.setFeatures(badFeatures),
      ).toThrowErrorMatchingInlineSnapshot(
        '"There were errors validating growthbook feature flags"',
      )
    })
  })

  it('should fail if url flag returns a non url', () => {
    const gb = new TypesafeGrowthbook(flagTypes)
    const badFeatures = {
      ...features,
      url: {
        defaultValue: 'not a url',
      },
    }
    expect(() =>
      gb.setFeatures(badFeatures),
    ).toThrowErrorMatchingInlineSnapshot(
      '"There were errors validating growthbook feature flags"',
    )
  })

  it('should fail if string flag returns a non string', () => {
    const gb = new TypesafeGrowthbook(flagTypes)
    const badFeatures = {
      ...features,
      string: {
        defaultValue: 5,
      },
    }
    expect(() =>
      gb.setFeatures(badFeatures),
    ).toThrowErrorMatchingInlineSnapshot(
      '"There were errors validating growthbook feature flags"',
    )
  })

  it('should fail if number flag returns a non number', () => {
    const gb = new TypesafeGrowthbook(flagTypes)
    const badFeatures = {
      ...features,
      number: {
        defaultValue: 'not a number',
      },
    }
    expect(() =>
      gb.setFeatures(badFeatures),
    ).toThrowErrorMatchingInlineSnapshot(
      '"There were errors validating growthbook feature flags"',
    )
  })

  it('should fail if stringArray flag returns a non string array', () => {
    const gb = new TypesafeGrowthbook(flagTypes)
    const badFeatures = {
      ...features,
      stringArray: {
        defaultValue: [1, 2, 3],
      },
    }
    expect(() =>
      gb.setFeatures(badFeatures),
    ).toThrowErrorMatchingInlineSnapshot(
      '"There were errors validating growthbook feature flags"',
    )
  })

  it('should fail if numberArray flag returns a non number array', () => {
    const gb = new TypesafeGrowthbook(flagTypes)
    const badFeatures = {
      ...features,
      numberArray: {
        defaultValue: ['a', 'b', 'c'],
      },
    }
    expect(() =>
      gb.setFeatures(badFeatures),
    ).toThrowErrorMatchingInlineSnapshot(
      '"There were errors validating growthbook feature flags"',
    )
  })

  it('should fail if force is misconfigured', () => {
    const gb = new TypesafeGrowthbook(flagTypes)
    const badFeatures = {
      ...features,
      string: {
        defaultValue: 'some string',
        rules: [
          {
            force: 5,
          },
        ],
      },
    }
    expect(() =>
      gb.setFeatures(badFeatures),
    ).toThrowErrorMatchingInlineSnapshot(
      '"There were errors validating growthbook feature flags"',
    )
  })

  it('should be typesafe when TypesafeGrowthbook.feature is called', () => {
    const gb = new TypesafeGrowthbook(flagTypes)
    gb.setFeatures(features)
    expect(gb.feature('bool')).toMatchInlineSnapshot(`
      {
        "off": false,
        "on": true,
        "ruleId": "",
        "source": "defaultValue",
        "value": true,
      }
    `)
    expect(gb.feature('url')).toMatchInlineSnapshot(`
      {
        "off": false,
        "on": true,
        "ruleId": "",
        "source": "defaultValue",
        "value": "https://example.com",
      }
    `)
    expect(gb.feature('string')).toMatchInlineSnapshot(`
      {
        "off": false,
        "on": true,
        "ruleId": "",
        "source": "force",
        "value": "force some other string",
      }
    `)
    expect(gb.feature('number')).toMatchInlineSnapshot(`
      {
        "off": false,
        "on": true,
        "ruleId": "",
        "source": "defaultValue",
        "value": 5,
      }
    `)
    expect(gb.feature('stringArray')).toMatchInlineSnapshot(`
      {
        "off": false,
        "on": true,
        "ruleId": "",
        "source": "defaultValue",
        "value": [
          "a",
          "b",
          "c",
        ],
      }
    `)
    expect(gb.feature('numberArray')).toMatchInlineSnapshot(`
      {
        "off": false,
        "on": true,
        "ruleId": "",
        "source": "defaultValue",
        "value": [
          1,
          2,
          3,
        ],
      }
    `)
    // @ts-expect-error testing
    gb.feature('not a feature')
  })

  it('should be typesafe with TypesafeGrowthbook.getFeatureValue is called', () => {
    const gb = new TypesafeGrowthbook(flagTypes)
    gb.setFeatures(features)
    expect(gb.getFeatureValue('bool', true)).toMatchInlineSnapshot('true')
    expect(
      gb.getFeatureValue('url', 'https://localhost:420'),
    ).toMatchInlineSnapshot('"https://example.com"')
    expect(gb.getFeatureValue('string', 'some string')).toMatchInlineSnapshot(
      '"force some other string"',
    )
    expect(gb.getFeatureValue('number', 420)).toMatchInlineSnapshot('5')
    expect(gb.getFeatureValue('stringArray', ['a', 'b']))
      .toMatchInlineSnapshot(`
      [
        "a",
        "b",
        "c",
      ]
    `)
    expect(gb.getFeatureValue('numberArray', [69, 69])).toMatchInlineSnapshot(`
      [
        1,
        2,
        3,
      ]
    `)
    expect(() =>
      // @ts-expect-error testing
      gb.getFeatureValue('not a feature', 'default'),
    ).toThrowErrorMatchingInlineSnapshot(
      '"No validator found for feature flag not a feature"',
    )
    const uninitializedGrowthbook = new TypesafeGrowthbook(flagTypes)
    // @ts-expect-error testing
    uninitializedGrowthbook.getFeatureValue('bool', 'bad fallback')
  })

  it('should be typesafe with Growthbook.evalFeature is called', () => {
    const gb = new TypesafeGrowthbook(flagTypes)
    gb.setFeatures(features)
    expect(gb.evalFeature('bool')).toMatchInlineSnapshot(`
      {
        "off": false,
        "on": true,
        "ruleId": "",
        "source": "defaultValue",
        "value": true,
      }
    `)
    expect(gb.evalFeature('url')).toMatchInlineSnapshot(`
      {
        "off": false,
        "on": true,
        "ruleId": "",
        "source": "defaultValue",
        "value": "https://example.com",
      }
    `)
    expect(gb.evalFeature('string')).toMatchInlineSnapshot(`
      {
        "off": false,
        "on": true,
        "ruleId": "",
        "source": "force",
        "value": "force some other string",
      }
    `)
    expect(gb.evalFeature('number')).toMatchInlineSnapshot(`
      {
        "off": false,
        "on": true,
        "ruleId": "",
        "source": "defaultValue",
        "value": 5,
      }
    `)
    expect(gb.evalFeature('stringArray')).toMatchInlineSnapshot(`
      {
        "off": false,
        "on": true,
        "ruleId": "",
        "source": "defaultValue",
        "value": [
          "a",
          "b",
          "c",
        ],
      }
    `)
    expect(gb.evalFeature('numberArray')).toMatchInlineSnapshot(`
      {
        "off": false,
        "on": true,
        "ruleId": "",
        "source": "defaultValue",
        "value": [
          1,
          2,
          3,
        ],
      }
    `)
    // @ts-expect-error testing
    gb.evalFeature('not a feature')
  })

  describe('React API', () => {
    const gb = new TypesafeGrowthbook(flagTypes)
    gb.setFeatures(features)
    const { FeatureString, IfFeatureEnabled, useFeature, Provider } =
      initGrowthbookReact(gb)

    describe('useFeatureValue', () => {
      it('should be typesafe', () => {
        // @ts-expect-error testing
        useFeature('not a feature')
        const { result } = renderHook(() => useFeature('bool'), {
          wrapper: Provider,
        })
        expect(result.current).toMatchInlineSnapshot()
      })
    })
  })
})
