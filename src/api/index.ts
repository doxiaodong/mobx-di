export function overview() {
  return Promise.resolve({
    email: 'duxiaodong@darlin.me',
    nickname: '毒枭东',
    id: 1
  })
}

export function login() {
  return overview()
}

export function logout() {
  return Promise.resolve(null)
}

export async function getNews(nums) {
  let id = 1
  const news = []
  await new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 2000)
  })

  while (id < nums) {
    news.push({
      id: ++id,
      title: `News title ${id}`
    })
  }
  return Promise.resolve(news)
}
