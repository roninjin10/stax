import fs from 'fs'
import fetch from 'node-fetch'
import path from 'path'

export const scrapeDiscourse = async () => {
  let data = { post_stream: { posts: [] as any[], stream: [] as string[] } }
  const scrape = (i: number) =>
    fetch(`https://gov.optimism.io/t/delegate-commitments/235/${i}.json`, {
      headers: {
        'Api-Username': 'willcory',
        'Api-Key':
          '75124e84127cb0a45c3578a5392b6b983f9862854ae59cfccabc8c41be378dd6',
      },
    }).then((res) => res.json())
  let currentIndex = 0
  let shouldScrape = true
  while (shouldScrape) {
    const newData = (await scrape(currentIndex)) as typeof data
    const newPostStream = newData['post_stream'].posts
    const oldPostStream = data['post_stream'].posts
    const oldPOstIds = oldPostStream.map((post: any) => post.id)
    const newPosts = newPostStream.filter(
      (post: any) => !oldPOstIds.includes(post.id),
    )
    data = {
      ...data,
      post_stream: {
        ...newData['post_stream'],
        posts: [...data.post_stream.posts, ...newPosts],
      },
    }
    shouldScrape = Boolean(newPosts.length)
    currentIndex += 20
  }
  fs.writeFileSync(
    path.resolve(
      __dirname,
      '../../frontend/src/pages/Airdrop/components/delegateCreator/rawData.json',
    ),
    JSON.stringify(data, null, 2),
  )
}

scrapeDiscourse()
