import React from 'react'

import Link from 'next/link'

type Props = {
  title: string
  to?: string
}

export const RelativeLink: React.FC<Props> = ({ title, to }: Props) => (
  <Link href={to ? `/${to}` : '/'} passHref>
    <a className="underline font-mono">{title}</a>
  </Link>
)
