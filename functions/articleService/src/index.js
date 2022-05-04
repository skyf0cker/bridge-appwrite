const { Article } = require("./forem-client");
const sdk = require("node-appwrite");

let client = new sdk.Client();

client
    .setEndpoint('http://192.168.32.163:8081/v1') // Your API Endpoint
    .setProject('62723ccbd8829654b529') // Your project ID
    .setKey('68f4dfb44564ca61c4a4595584b5168c8b99027d23a7d6d3a8a4705b02c850fb69099c64a0776147ba50612ae11a522a6407f99f8e9b26c6bca783b931a5656d8989bc071b1b665d2dde1af2b615578561bac65b92ea1ffd2258788c7f3dba5525767f3f581e667cacdd7b605abe0fd5dde33c9e4d61f815d186b0433736bcd6')
    .setSelfSigned()
    ;

let db = new sdk.Database(client);

module.exports = async function (req, res) {
    const payload = req.payload;
    const p = JSON.parse(payload)

    console.log("payload: ", p)
    const method = p.method
    if (!method) {
        res.json({
            status: "error",
            msg: "method needed",
        })
        return
    }

    let data = {}
    try {
        switch (method) {
            case "getUserArticles": {
                data = await handleGetUserArticles(p);
                break;
            }
            case "getArticleDetail": {
                data = await handleGetArticleDetail(p);
                break;
            }
            case "verify": {
                data = await handleVerify(p);
                break;
            }
            case "sync": {
                data = await handleSync(p);
                break;
            }
            case "getSyncInfo": {
                data = await getSyncInfo(p);
                break;
            }
            default: {
                res.json({
                    status: "error",
                    message: "unspported operation"
                });
                return;
            }
        }
    } catch (err) {
        console.log(err);
        res.json({
            status: "error",
            message: err,
        });
        return
    }

    const reduceData = handleRespSize(p.idx, data)
    const resp = {
        status: "success",
        data: reduceData,
    }

    res.json(resp)
    return
};

async function handleGetUserArticles(payload) {
    if (!payload.username || !payload.pageNum) {
        throw "invalid params: lack of username or pageNum"
    }

    let perPage = 3
    if (payload.perPage) {
        perPage = payload.perPage
    }

    const articles = await Article.getPublishedArticles({
        username: payload.username,
        page: payload.pageNum,
        per_page: perPage
    });

    return articles;
}

async function handleGetArticleDetail(payload) {
    if (!payload.articleId) {
        throw "invalid params: lack of articleId";
    }

    const detail = await Article.getArticleDetailById(payload.articleId);
    console.log("detail: ", detail)
    return detail
}

async function handleVerify(payload) {
    if (!payload.username || !payload.verifyHash) {
        throw "invalid params: lack of username or verify hash";
    }

    let found = false;
    let pageNum = 0;
    while (!found) {
        const articles = await Article.getPublishedArticles({
            username: payload.username,
            page: pageNum,
            tag: "verify",
            per_page: 100,
        })

        pageNum++

        for (const article of articles) {
            if (article.title.includes(payload.verifyHash)) {
                found = true;
                break;
            }
        }
    }

    return {
        isVerified: found,
    }
}

async function handleSync(payload) {
    if (!payload.articleId || !payload.arweaveAddress || !payload.ownerAddress || !payload.username) {
        throw "invalid params: lack of articleId or arweave address"
    }

    const collectionId = "62724145b94c117062e7"

    const docs = await db.listDocuments(collectionId, [
        sdk.Query.equal('articleId', payload.articleId),
    ])

    if (docs.total !== 0) {
        return
    }

    const doc = await db.createDocument(collectionId, 'unique()', {
        articleId: payload.articleId,
        arweaveAddress: payload.arweaveAddress,
        ownerAddress: payload.ownerAddress,
        devtoUsername: payload.username,
    })

    if (doc.$id.length === 0) {
        throw "doc create failed"
    }

    return 
}

async function getSyncInfo(payload) {
    if (!payload.articleId ) {
        throw "invalid params: lack of articleId"
    }

    const collectionId = "62724145b94c117062e7"

    const docs = await db.listDocuments(collectionId, [
        sdk.Query.equal('articleId', payload.articleId),
    ])

    return docs
}

// for appwrite function resp size limit
// https://github.com/appwrite/appwrite/blob/63538bb0a10f16f16696ace1d00528c15217c9fa/app/executor.php#L515
function handleRespSize(idx, resp) {
    if (!idx) {
        idx = 0;
    }
    const blockSize = 10000;
    const text = JSON.stringify(resp);
    const block = text.substring(idx * blockSize, (idx + 1) * blockSize);

    return {
        isAll: text.length <= blockSize * (idx + 1),
        result: block,
    };
}