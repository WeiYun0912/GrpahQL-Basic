## 初始設定

在開發的時候建議使用nodemon，這樣我們變更檔案存檔後就不用再重新啟動server。

要使用GrpahQL必須先安裝以下套件

```javascript=
npm install apollo-server
```

Apollo Server裡面就包含使用GraphQL的工具與Server。

安裝完以後直接將Apollo Server啟動

***server.js***

```javascript=
const { ApolloServer } = require("apollo-server");

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server is ${url}`);
});
```

這邊如果直接執行該程式會報錯，因為我們還沒用定義type和resolvers。

## 範例資料
因為GraphQL是查詢語言並不是資料庫，所以這邊我們必須要提供資料來做查詢。

本範例省略掉資料庫的連線設定與使用，如果需要連線資料庫的話推薦使用Mongo DB。

***tempData.js***
```json=
const Books = [
  {
    id: 1,
    name: "WeiWei Adventure Ep1",
    author: "Wei",
    publish: "Wei's Publish",
  },

  {
    id: 2,
    name: "WeiWei Adventure Ep2",
    author: "Wei",
    publish: "Wei's Publish",
  },

  {
    id: 3,
    name: "WeiWei Adventure Ep3",
    author: "Wei",
    publish: "Wei's Publish",
  },
  {
    id: 4,
    name: "YunYun Adventure Ep1",
    author: "Yun",
    publish: "Yun's Publish",
  },
  {
    id: 5,
    name: "YunYun Adventure Ep2",
    author: "Yun",
    publish: "Yun's Publish",
  },
  {
    id: 6,
    name: "YunYun Adventure Ep3",
    author: "Yun",
    publish: "Yun's Publish",
  },
];

module.exports = Books;
```

## 型態
要定義type之前當然要知道GraphQL有提供哪些type給我們使用

==Int== : 32-bit的整數型態

==Float== : 符號雙精度的小數點型態

==String== : UTF-8 字串型態

==Boolean== : 布林值型態 (true or false)

==ID== : 標識符

## 定義type與resolvers

知道了有哪些型態以後就來先定義我們的type吧，這邊先以書本為例子，
一本書會有書名、作者、出版社，當然，每本書都是獨一的，所以也必須加上ID。

**type Query**裡面要放的是我們想查詢的資料與回傳格式，可以看到程式第12行，我們希望輸入books查詢後，回傳的是陣列型態，而該陣列裡面的包含的型態就是程式碼第4行~第9行定義的型態。


***typeDefs.js***
```javascript=
const { gql } = require("apollo-server");

const typeDefs = gql`
  type Book {
    id: ID!
    name: String!
    author: String!
    publish: String!
  }

  type Query {
    books: [Book!]
  }
`;

module.exports = typeDefs;
```

定義好type以後還沒結束，我們必須來實作resolvers，這樣當我們下達指定的條件server才會回傳值給我們，本範例是使用上面的範例資料來做查詢。

***resolvers.js***
```javascript=
const Books = require("../tempData");

const resolvers = {
  Query: {
    books: () => {
      return Books;
    },
  },
};

module.exports = resolvers;
```

這邊我們先簡單的把範例資料回傳就好，這邊就如同前面提到的，回傳型態會是Array。


## 啟動Server
定義好type和resolvers以後將他引入至server.js，之後就可以啟動server了！

server預設的port是4000

***server.js***

```javascript=
const { ApolloServer } = require("apollo-server");
const resolvers = require("./schema/resolvers");
const typeDefs = require("./schema/typeDefs");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server Url : ${url}`);
});
```

```javascript=
nodemon server.js
```

![](https://i.imgur.com/4OLUyts.png)

接著在瀏覽器就可以輸入localhost:4000進入到後台，畫面如下：
![](https://i.imgur.com/2tfzPh3.png)

可以在左手邊的Fields看到我們剛剛定義的books！

現在我們直接來下query，來看回傳的是不是範例資料內的資料~

我們直接在**Operations**輸入
```graphql=
query{
  books{
    id
    name
    author
    publish
  }
}
```
也就是我們一開始定義的型態，按下Run以後回傳的值如下：

![](https://i.imgur.com/W1ocQZE.png)

而我們也可以定義query的名稱，定義的方式非常簡單，只要在query後面加上要自訂的名稱就好，如以下：
```graphql=
query Books{
  books{
    id
    name
    author
    publish
  }
}
```

![](https://i.imgur.com/XiMS0MD.png)


## Parent

GrpahQL也可以有階層式的查詢，在以上的範例資料不好做示範，所以這邊我們來更新一下我們的範例資料，這邊因為只是簡單的示範，所以欄位名稱上先不要求嚴謹，在以下範例資料我們把作者獨立出來，並把書本的作者欄位改成對應的ID值。

***tempData.js***
```json=
const Authors = [
  {
    id: 1,
    name: "Wei",
  },
  {
    id: 2,
    name: "Yun",
  },
];

const Books = [
  {
    id: 1,
    name: "WeiWei Adventure Ep1",
    author: 1,
    publish: "Wei's Publish",
  },

  {
    id: 2,
    name: "WeiWei Adventure Ep2",
    author: 1,
    publish: "Wei's Publish",
  },

  {
    id: 3,
    name: "WeiWei Adventure Ep3",
    author: 1,
    publish: "Wei's Publish",
  },
  {
    id: 4,
    name: "YunYun Adventure Ep1",
    author: 2,
    publish: "Yun's Publish",
  },
  {
    id: 5,
    name: "YunYun Adventure Ep2",
    author: 2,
    publish: "Yun's Publish",
  },
  {
    id: 6,
    name: "YunYun Adventure Ep3",
    author: 2,
    publish: "Yun's Publish",
  },
];

module.exports = { Authors, Books };
```

在定義type的地方也要改一下

***typeDefs.js***
```javascript=
const { gql } = require("apollo-server");

/* Book內的author型態 改為 [Author!] */
const typeDefs = gql`
  type Book {
    id: ID!
    name: String!
    author: [Author!]
    publish: String!
  }

  type Author {
    id: ID!
    name: String!
  }

  type Query {
    books: [Book!]
    book(id: ID): Book
  }
`;

module.exports = typeDefs;
```


我們來看一下階層式查詢的範例

```graphql=
query Books {
  books {
    id
    name
    publish
    author {
      id
      name
    }
  }
}
```

型態定義好了，那現在我們要怎麼查詢到書本的作者呢?

這時候就輪到 **Parent** 登場了~ 直接來看範例

我們必須在Book型態底下去實作author的resolver。

***resolvers.js***

```javascript=
const { Authors, Books } = require("../tempData");

const resolvers = {
  Query: {
    books: () => {
      return Books;
    },

    book: (parent, args) => {
      return Books.find((book) => book.id === +args.id);
    },
  },

  Book: {
    author: (parent) => {
      console.log(parent);
    },
  },
};

module.exports = resolvers;
```

這邊我們先不return值，先在後台的**Operation**輸入以下Query，來查看parent裡面的值是什麼。

```graphql=
query Books {
  books {
    id
    name
    publish
    author {
      id
      name
    }
  }
}
```

執行後，我們會在TERMINAL看到以下畫面

![](https://i.imgur.com/5bziUoM.png)

這時候"Parent"這個單字應該很明顯了，就是取得父階層的值，那現在我們把resolvers實作完吧！

***resolver.js***
```javascript=
const { Authors, Books } = require("../tempData");

const resolvers = {
  Query: {
    books: () => {
      return Books;
    },

    book: (parent, args) => {
      return Books.find((book) => book.id === +args.id);
    },
  },

  Book: {
    author: (parent) => {
      return Authors.find((author) => author.id === parent.author);
    },
  },
};

module.exports = resolvers;
```

![](https://i.imgur.com/lDVEbuu.png)


## Args
假設今天我們想要單獨查詢書本的資訊要怎麼做呢?
一般的作法都是利用 **id** 來找尋資料，而在GraphQL我們一樣可以靠外部參數來找尋特定的資料，來看以下範例：

在type定義時必須多加一條規則，也就是程式碼第13行，括號的意思是接收的參數名稱與參數型態。

***typeDefs.js***
```javascript=
const { gql } = require("apollo-server");

const typeDefs = gql`
  type Book {
    id: ID!
    name: String!
    author: String!
    publish: String!
  }

  type Query {
    books: [Book!]
    book(id: ID): Book
  }
`;

module.exports = typeDefs;
```

同樣的我們也必須在resolvers實作，先來看如何傳入外部參數。

在下方的Variables內定義bookId，名稱可以自己取，但要跟query傳入的名稱一樣。

![](https://i.imgur.com/GiVNlXo.png)

***resolvers.js***
```javascript=
const Books = require("../tempData");

const resolvers = {
  Query: {
    books: () => {
      return Books;
    },

    book: (parent, args) => {
      console.log(args); // output : { id : '1' }
      return Books.find((book) => book.id === +args.id);
    },
  },
};

module.exports = resolvers;
```

## Context

Context有點像是Middleware，Context可以拿來做一些驗證，像是JWT，直接來看範例。

要啟用Context必須在Server做設定，這邊我們直接回傳request。

***server.js***
```javascript=
const { ApolloServer } = require("apollo-server");
const resolvers = require("./schema/resolvers");
const typeDefs = require("./schema/typeDefs");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return req;
  },
});

server.listen().then(({ url }) => {
  console.log(`Server Url : ${url}`);
});
```

回傳的context可以在resolvers做使用

***resolvers.js***

```javascript=
const { Authors, Books } = require("../tempData");

const resolvers = {
  Query: {
    books: (parent, args, context) => {
      console.log(context.headers);
      return Books;
    },
  },
};

module.exports = resolvers;
```

直接在後台查詢books後查看我們的TERMINAL。

![](https://i.imgur.com/q2BM0We.png)


## Context 2

當然，我們也可以直接將範例資料傳入Context，之後就不用在resolvers去引入我們的範例資料！

***server.js***
```javascript=
const { ApolloServer } = require("apollo-server");
const resolvers = require("./schema/resolvers");
const typeDefs = require("./schema/typeDefs");
const { Books } = require("./tempData");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    Books,
  },
});

server.listen().then(({ url }) => {
  console.log(`Server Url : ${url}`);
});
```

***resolvers.js***
```javascript=
const resolvers = {
  Query: {
    books: (parent, args, context) => {
      return context.Books;
    },
  },
};

module.exports = resolvers;

```
![](https://i.imgur.com/Ch6sQDM.png)


## Fragment
當回傳值太多的時候，或是多個type回傳的值都一樣時可以使用**Fragment**來簡化，直接來看以下範例。

假設要回傳的值有以下：

```graphql=
query Books{
    books{
        id
        name
        author
        publish
    }
}
```

我們可以利用**Fragment**來將要回傳的值個別獨立出來。

```graphql=
query Books{
    books{
        ...BookFragement
    }
}

fragment BookFragement on Book{
    id
    name
    author
    publish
}
```

![](https://i.imgur.com/ujs5Idd.png)


## Interface

善用**Interface**能夠有效管理型態，Interface type可以提供一組fields讓不同的物件(Object)共享，我們直接來看範例。


我們用以下範例來看，如果要在GraphQL回傳下面的範例資料，則必須在定義type的時候把所有需要的欄位補上。

***tempData.js***
```json=
const Animals = [
  {
    name: "狼蛛",
    footLength: 123,
  },
  {
    name: "奇異鳥",
    footLength: 123,
    wingLength: 456,
    wing: false,
  },
];
```

像是這樣

***typeDefs.js***
```javascript=
const { gql } = require("apollo-server");

const typeDefs = gql`
  type Animal {
    name: String
    footLength: Int
    wingLength: Int
    wing: Boolean
  }

  type Query {
    animals: [Animal!]!
  }
`;

module.exports = typeDefs;
```

***resolvers.js***
```javascript=

const {Animals} = require("./tempData")

const resolvers = {
  Query: {
    animals: () => {
      return Animals;
    },
  },
};

module.exports = resolvers;
```


但我們會發現執行query後，第一筆資料的其他欄位會是null，這不是我們想要的。

![](https://i.imgur.com/hXxxMWh.png)

這時候，可以利用interface來解決上述的問題~


***typeDefs.js***
```javascript=
const { gql } = require("apollo-server");

const typeDefs = gql`
  interface Animal {
    name: String
    footLength: Int
  }

  type Spider implements Animal {
    name: String
    footLength: Int
  }

  type Bird implements Animal {
    name: String
    footLength: Int
    wingLength: Int
    wing: Boolean
  }

  type Query {
    animals: [Animal]
  }
`;

module.exports = typeDefs;
```

可以看到我們把範例資料的共同鍵值抽取出來，獨立成另外的type，這邊要注意，只要該type有implements interface，一定要把interface內的type在重新定義一次且型態都要一樣，類似抽象類別。


***resolver.js***
```javascript=
const {Animals} = require("./tempData")

const resolvers = {
  Animal: {
    __resolveType(obj) {
      //檢查obj裡面是否有wingLength的鍵值(key)
      if (obj.wingLength) {
        //有的話就回傳Bird的type
        return "Bird";
      }
        
      //沒有的話就回傳 Spider type
      return "Spider";
    },
  },

  Query: {
    animals: () => {
      return Animals;
    },
  },
};

module.exports = resolvers;
```

那query的部分要怎麼下呢?

```graphql=
query Query {
  animals {
    ... on Spider {
      name
      footLength
    }
    ... on Bird {
      name
      wingLength
      footLength
      wing
    }
  }
}
```


![](https://i.imgur.com/XRtadKz.png)


## Union

Union與Interface蠻相似的，我們可以看到以下的定義方式與Interface的差異，
最大的差異就在於如果type有implements interface，則該type必須將interface的內的type全部定義，否則會報錯，而Union則不用。

***tempData.js***
```javascript=
const Animals = [
  {
    name: "狼蛛",
    footLength: 123,
  },
  {
    name: "奇異鳥",
    wingLength: 456,
  },
];
```

***typeDefs.js***
```javascript=
const { gql } = require("apollo-server");

const typeDefs = gql`
  union Animal = Spider | Bird

  type Spider {
    name: String
    footLength: Int
  }

  type Bird {
    name: String
    wingLength: Int
  }

  type Query {
    animals: [Animal]
  }
`;

module.exports = typeDefs;
```

***resolver.js***
```javascript=
const {Animals} = require("./tempData")

const resolvers = {
  Animal: {
    __resolveType(obj) {
      if (obj.footLength) {
        return "Spider";
      }

      if (obj.wingLength) {
        return "Bird";
      }
    },
  },

  Query: {
    animals: (parent, args, context) => {
      return Animals;
    },
  },
};

module.exports = resolvers;
```

![](https://i.imgur.com/isxCIF5.png)

