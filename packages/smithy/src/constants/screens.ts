export const screens = [
  'main',
  'forge',
  'cast',
  'anvil',
  'chisel',
  'docs',
  'help',
] as const
export type Screen = (typeof screens)[number]
