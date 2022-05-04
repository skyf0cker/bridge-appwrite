import { getArticleDetailById, getPublishedArticles } from './articles/articles'

async function main() {
    const articles = await getPublishedArticles({
        username: "sm0ke",
        page: 2,
    })

    console.log(articles[0])
}

main()
