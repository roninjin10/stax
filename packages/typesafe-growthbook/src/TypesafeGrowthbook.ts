import type {
  Context,
  FeatureDefinition,
  FeatureResult,
} from '@growthbook/growthbook-react'
import {
  FeatureString as FeatureStringGrowthbook,
  GrowthBook,
  GrowthBookProvider,
  IfFeatureEnabled as IfFeatureEnabledGrowthbook,
  useFeature as useFeatureGrowthbook,
} from '@growthbook/growthbook-react'
import * as React from 'react'
import { z } from 'zod'

/**
 * Types of feature flags that can be configured by growthbook
 */
export const flag = {
  bool: z.boolean(),
  url: z.string().url(),
  string: z.string(),
  number: z.number(),
  stringArray: z.array(z.string()),
  numberArray: z.array(z.number()),
} as const

export class TypesafeGrowthbook<
  TFlagTypes extends Record<string, z.ZodType<any>>,
> extends GrowthBook {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public readonly flagTypes: TFlagTypes,
    growthbookContext: Context = {},
  ) {
    super(growthbookContext)
  }

  /**
   * Set feature flags from a JSON object
   *
   * @param features
   */
  public override readonly setFeatures = (
    features: Record<string, FeatureDefinition>,
  ) => {
    const errors: Error[] = []

    const validatedFeatures = Object.fromEntries(
      Object.entries(this.flagTypes).map(([featureName, zodValidator]) => {
        if (!(featureName in features)) {
          throw new Error(`Feature ${featureName} is missing from features`)
        }
        const featureValidator = z.object({
          defaultValue: zodValidator,
          rules: z.array(z.object({ force: zodValidator })).optional(),
        })
        const validation = featureValidator.safeParse(features[featureName])
        if (!validation.success) {
          errors.push(
            new Error(
              `Invalid feature flag configured for ${featureName} ${features[featureName]}: ` +
                validation.error.message,
            ),
          )
          return [featureName, features[featureName]]
        }
        return [featureName, validation.data]
      }),
    )

    if (errors.length) {
      throw new AggregateError(
        errors,
        'There were errors validating growthbook feature flags',
      )
    }

    super.setFeatures(validatedFeatures as typeof features)
  }

  public override readonly feature = <
    TFeature extends keyof TFlagTypes & string,
  >(
    id: TFeature,
  ) => {
    return super.feature(id) as FeatureResult<z.infer<TFlagTypes[TFeature]>>
  }

  public override readonly evalFeature = <
    TFeature extends keyof TFlagTypes & string,
  >(
    id: TFeature,
  ) => {
    return super.evalFeature(id) as FeatureResult<z.infer<
      TFlagTypes[TFeature]
    > | null>
  }

  public override readonly getFeatureValue = <
    TFeature extends keyof TFlagTypes & string,
  >(
    id: TFeature,
    fallback: z.infer<TFlagTypes[TFeature]>,
  ) => {
    const validator = this.flagTypes[id]
    if (!validator) {
      throw new Error(`No validator found for feature flag ${String(id)}`)
    }
    return super.getFeatureValue(id, fallback) as z.infer<TFlagTypes[TFeature]>
  }

  public override readonly isOn = <TFeature extends keyof TFlagTypes & string>(
    id: TFeature,
  ) => {
    return super.isOn(id)
  }

  public override readonly isOff = <TFeature extends keyof TFlagTypes & string>(
    id: TFeature,
  ) => {
    return super.isOff(id)
  }
}

export const initGrowthbookReact = <
  TGrowthbook extends TypesafeGrowthbook<any>,
>(
  growthbook: TGrowthbook,
) => {
  const useFeature = <
    TFeature extends keyof TGrowthbook['flagTypes'] & string,
    TValue = z.infer<TGrowthbook['flagTypes'][TFeature]>,
  >(
    id: TFeature,
  ) => {
    return useFeatureGrowthbook(id) as FeatureResult<TValue>
  }

  const IfFeatureEnabled = <
    TFeature extends keyof TGrowthbook['flagTypes'] & string,
  >({
    feature,
    children,
  }: React.PropsWithChildren<{
    feature: TFeature
  }>) =>
    React.createElement(
      IfFeatureEnabledGrowthbook,
      { feature, children },
      children,
    )

  const FeatureString = <
    TFeature extends keyof TGrowthbook['flagTypes'] & string,
  >(props: {
    feature: TFeature
    default: z.infer<TGrowthbook['flagTypes'][TFeature]>
  }) => {
    return React.createElement(FeatureStringGrowthbook, props)
  }

  const Provider = ({ children }: React.PropsWithChildren) => {
    return React.createElement(GrowthBookProvider, { children, growthbook })
  }

  return {
    useFeature,
    IfFeatureEnabled,
    growthbookVanilla: growthbook,
    FeatureString,
    Provider,
  }
}
