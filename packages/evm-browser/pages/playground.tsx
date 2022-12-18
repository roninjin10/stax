import type { NextPage } from 'next'
import Head from 'next/head'

import Editor from 'components/Editor'
import HomeLayout from 'components/layouts/Home'
import { Container } from 'components/ui'

const PlaygroundPage = () => {
  return (
    <>
      <html lang="en"></html>
      <Head>
        <meta property="og:type" content="website" />
        <title>EVM Codes - Playground</title>
        <meta
          name="description"
          content="EVM Codes’ Playground is an interactive tool for learning how to use opcodes, the stack behind smart contracts."
        />
      </Head>

      <Container>
        <Editor />
      </Container>
    </>
  )
}

PlaygroundPage.getLayout = function getLayout(page: NextPage) {
  return <HomeLayout>{page}</HomeLayout>
}

export default PlaygroundPage
