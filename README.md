## 前期准备

### Mock API

- bun add json-server@0.17.4 -D
- 导入 db.json 和 routes.json
- 修改 package.json -> "fake": "json-server --watch ./fake-server/db.json --routes ./fake-server/routes.json --port 3090"

## 注意

1. 组件加上了 'useClient'， 首先是在服务端运行，然后在客户端也得运行，要不怎么进行交互呀

- 错误的理解：“它既然是客户端组件，那么它只在客户端运行”

| Category         | Render on server | Render on client |
| ---------------- | ---------------- | ---------------- |
| Server Component | ✅               | ❌               |
| Client Component | ✅               | ✅               |

2. .env 文件中的变量， 带有 NEXT*PUBLIC* 前缀变量才会在客户端组件 ("use client") 中可访问
   process.env.API_KEY // 无法访问
   process.env.NEXT_PUBLIC_TEST // 可访问

3. Cache
   Static SSG 和 Dynamic SSR

NextJs

- 静态渲染：在服务端构建部署时，数据重新生效，产生的静态页面可以被分发、缓存到全世界各地
- - 收益：访问更快、减轻服务器压力、利于 SEO
- - 场景：没有变化的数据、多页面共享的数据
- 动态渲染：在服务端接收到每个用户请求时，
- - 收益：显示实时数据、特定用户的特定数据（用于区别对待）、可以获取到客户端请求的 cookie 和 URL 参数

- Nextjs 14 默认的就是尽量静态渲染 SSG，这么做的好处是响应更快
- 默认情况下，当你 npm run build 后，再 npm run start，无论你刷新多少次浏览器，内容都是不变的，即使有 fetch 也不行，显示的时间仍旧是不变的

```tsx
<div>{new Date().toLocaleTimeString()}</div>
```

3.1 如果要将静态组件变为动态的，则在该组件加上：

```typescript
export const dynamic = 'force-dynamic';
```

3.2 如果想将某一个 fetch 请求设置它的缓存有效期，则需要：

```typescript
// export const dynamic = 'force-dynamic';
const fetch1 = await(
	await fetch('api', {
		next: {
			revalidate: 5, // 请求缓存有效期5秒, 如果设置为true，则表示没有缓存，每次都会请求
		},
	})
).json();
```

按照上面方式，可以给一个页面中的多个 fetch 请求，分别设置不同的 revalidate，或者一个不变的，一个是在超过有效期可以变化的，这样更加灵活

3.3 fetch 禁用缓存

```ts
await fetch('api', { cache: 'no-store' }); // no-cache
```

no-cache 指令并不意味着完全禁止缓存。实际上，它允许缓存存储响应，但要求在使用该缓存响应之前，必须先向原始服务器验证其有效性。
当一个请求带有 no-cache 指令时，浏览器会发送一个条件请求（如使用 If-Modified-Since 或 If-None-Match 头部），询问服务器缓存的内容是否仍然有效。如果服务器确认内容没有变化，就会返回一个 304 （未修改）状态码，指示浏览器可以继续使用缓存的版本；如果内容有变化，服务器则会返回新的内容。
no-store：指令则是彻底禁止缓存。它要求浏览器和任何中间代理都不应存储任何关于这个请求或响应的信息。

no-cache 是要求在使用缓存响应前进行验证，而 no-store 则是完全禁止存储响应。no-cache 可能仍能提高加载速度，因为它允许在验证后使用缓存，而 no-store 则可能会导致性能下降，因为它强制每次都从服务器获取数据

3.3 如果想将整个页面设置个缓存有效期，则不用给每个 fetch 都设置 revalidate，而需要：

```typescript
export const revalidate = 10;
```

4. 请求外部限制访问的图片，需要配置 next.config

```js
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*',
			},
		],
	},
};
```

5. 当图片请求失败时，我们想要给它一个默认图片，可以在 Image 上使用 onError，然后配合 useState 重新赋值一个默认图片来处理

- 但这带来一个问题，useState 只能在客户端组件上使用，把在整个大组件变为客户端组件，这显然是不明智的，因此可以把 Image 单独抽象出来，并成为客户端组件

```tsx
<ImageWithFallback
	height={200}
	width={300}
	src={p.article.image_url || defaultNewsPng}
	alt="Image for article"
	fallback={defaultNewsPng}
/>;

// ImageWithFallback.tsx
('use client');
import { useState } from 'react';
import Image, { ImageProps, StaticImageData } from 'next/image';

type ImageWithFallbackType = ImageProps & {
	fallback: StaticImageData;
};

export function ImageWithFallback({ fallback, src, ...p }: ImageWithFallbackType) {
	const [imgSrc, setImgSrc] = useState(src);

	return (
		<Image
			{...p}
			src={imgSrc}
			onError={() => setImgSrc(fallback.src)}
		/>
	);
}
```

6. 为什么要优化字体

CLS：谷歌用于评估网站性能和用户体验的指标之一，用于衡量网页在加载过程中内容布局的稳定性

浏览器显示页面 -> 备用字体或系统字体 -> 渲染显示 -> 自定义字体下载 -> 进行替换 -> 布局偏移

进行替换时，会产生字体大小、空隙、布局的改变，即 CLS

使用 next/font 模块后，NextJs 会自动优化字体，项目构建时，会自动下载字体文件和其他资源文件放在一起

- 如何优化

```javascript
import { Inter, Lusitana } from 'next/font/google';

// 按需下载字体的子集，节省啊
export const inter = Inter({ subsets: ['latin'] }); // 拉丁字符集

export const lusitana = Lusitana({
	subsets: ['latin'],
	weight: ['400', '700'],
});
```

7. 为什么要优化图片

1. 把大图传给小屏幕，造成贷款浪费
1. 图片从无到有的加载过程，容易造成布局偏移，CLS 过大
1. 多个图片同时请求，造成 blocking

- 如何优化

Next.js 提供了优化图片的方案——Image 组件，使用 Image 组件有四点好处：

- 优化图片大小：webp 格式
- - 对各个设备使用合适的尺寸与格式（使用 Chrome 访问页面时，图片会转换成 webp 格式）
- 防止 CLS（累计布局偏移）
- 懒加载：图片在视图中才会被加载
- 自定义图片尺寸，width、height，因为设定了 w 和 h，那么图片就有了固定的宽高比，防止 CLS
- - Next.js 会根据  Image  的  width  与  height  值，在页面请求服务端时，转换并缓存相应大小的图片

```javascript
import Image from 'next/image';

export default function About(props) {
	return (
		<>
			{/* <img
            src={'/img.jpeg'}
            alt="图片"
        /> */}
			<Image
				src={'/img.jpeg'}
				alt="图片"
				width={100}
				height={100}
			/>
			<Image
				src="/hero-desktop.png"
				width={1000}
				height={760}
				className="hidden md:block"
				alt="Screenshots of the dashboard project showing desktop version"
			/>
			<Image
				src="/hero-mobile.png"
				width={560}
				height={620}
				className="block md:hidden" // 当移动端时，才会下载图片并显示，so wonderful
				alt="Screenshots of the dashboard project showing desktop version"
			/>
		</>
	);
}
```

8. Link 组件 代替 a

1. 不会整页刷新
1. 代码自动分割：根据路由自动 code-spliting
1. 代码预取 pre-fetch，在生产环境，当 Link 组件在浏览器视口可见时（所见即所得），nextjs 会自动 prefetch Link.href 的页面

- link active

```javascript
'use client'; // 注意使用 usePathname 钩子函数，需要在客户端运行
import Link from 'next/link';

function Nav() {
	const pathname = usePathname();
	pathname === '/xxxx' ? 'active-classname' : ''; // assert link.herf matches the pathname or not.
}
```

9. SEO - metadata

- 在 layout 中，使用 metadata
- 每个页面都可以使用自己的 metadata，并会与最顶层 layout 中的 meta 进行 merge

```typescript
export const metadata: Metadata = {
	title: {
		template: '%s | NextJs Study',
		default: 'NextJs Study',
	},
	// title: 'NextJs Study',
	description: 'A Dashboard Project Practice',
	keywords: ['nextjs14', 'react', 'typescript'],
	// 当页面被分享到社交平台时，会显示该图片
	openGraph: {
		images: '/opengraph-image.png',
	},
	// 这个地址作为某些配置项的前缀
	metadataBase: new URL('https://www.example.com'),
};
```

10. SSG 预渲染动态参数的页面

- 使用 generateStaticParams 替代 nextjs@13 的 getStaticPaths

```js
export function generateStaticParams() {
	return { [propertyName]: value };
}
```

- 如果想设置它的缓存有效时间，可以加上 revalidate

```js
export const revalidate = 1000; // 1000秒
```

11. Loading

- 想给某个页面增加 loadiing，就在这个页面 page.tsx 同级目录下创建 loading.tsx
- 如果增加的 loading 只给 /A 路由使用，而不给 /A/b、 /A/c 等下面的路有使用，呢么可以将 /A 路由下的 page.tsx 和 loading.tsx 用 (文件夹任意名字)文件夹包裹

```
A                          A
  b > page.tsx               (overview) > page.tsx loading.tsx    #文件夹名字随便起，路由访问的还是 /A
  c > page.tsx      ->        b > page.tsx                        # /A/b
  page.tsx                    c > page.tsx                        # /A/c
  loading.tsx
# loading 作用在 /A、/A/b、/A/c             loading 只作用在 /A 上
```

12. 增加 error

- 想给某个页面增加 error，就在这个页面 page.tsx 同级目录下创建 error.tsx（注意要 'use client' ）
- error 页面必须是 client component

13. Not Found

- 路由找不到的情
- - 在 app 目录下，创建 not-found.tsx
- 获取不到数据 或者 id 在数据库中不存在，无法查询到数据的情况
- - 在获取数据的页面同级目录下，创建 not-found.tsx，并在请求数据页面跳用 notFound

```tsx
import { notFound } from 'next/navigation';
if (!data) {
	notFound();
}
```

14. 模版的使用

- 输出

```tsx
<Layout>
	<Template>
		{children}   <== page
		{/* other */}
	</Template>
</Layout>
```

模板文件类似于布局，因为它包装每个子布局或页面。与跨路由保留并维护状态的布局不同，模板在导航时为其每个子项创建一个新实例

- 应用场景
- - 依赖于 useEffect （例如记录页面浏览量）和 useState （例如每页反馈表）的功能。
- - 更改默认框架行为。例如，布局中的“Suspense Boundaries”仅在首次加载布局时显示回退，而在切换页面时不显示回退。对于模板，回退将显示在每个导航上

当用户在共享 的 template 路由之间导航时，将装载组件的新实例，重新创建 DOM 元素，不保留状态，并重新同步效果

```
A
  B
	C
	layout.tsx
	template.tsx

当 B -> C 或 C -> B，template 将重新渲染
```

15. Hydration Missmatch

- 在渲染应用程序时，从服务器预渲染的 React 树和在浏览器中第一次渲染时渲染的 React 树之间存在差异（水合）,浏览器这时会报错：Error: Text content does not match server-rendered HTML
- Hydration 是指 React 通过附加事件处理程序将服务器中预呈现的 HTML 转换为完全交互式的应用程序
- 我们先看一个例子

```tsx
// Randmo 组件
'use client';
import { useEffect, useState } from 'react';

export default function Random(p: {}) {
	const [value, setValue] = useState(Math.random());
	useEffect(() => {
		const intervalId = setInterval(() => {
			setValue(Math.random());
		}, 1000);
		return () => {
			clearInterval(intervalId);
		};
	}, []);
	return <>{value}</>;
}
```

出现这种状况的原因

- ❌ html 标签嵌套有问题

```html
1. <p> 嵌套在另一个 <p> 标签中： <p><p>111</p></p>
2. <div> 嵌套在 <p> 标签中：    <p><div>222</div></p>
3. <ul> 或 <ol> 嵌套在 <p> 标签中： <p><ul></ul></p>
4. 交互式内容不能嵌套（嵌 <a> 套在 <a> 标签中、 <button> 嵌套在 <button> 标签中等）
```

- ❌ 使用像在渲染逻辑中一样 typeof window !== 'undefined' 的检查
- ❌ 使用仅限浏览器的 API，例如 window 渲染逻辑中的 API localStorage
- ❌ 在渲染逻辑中使用与时间相关的 API， Date() 例如构造函数
- ❌ 修改 HTML 的浏览器扩展
- ❌ CSS-in-JS 库配置不正确 请惨遭，请参照官方示例 https://github.com/vercel/next.js/tree/canary/examples/with-styled-jsx-scss
- ❌ 未正确配置尝试修改 html 响应的 Edge/CDN，例如 Cloudflare Auto Minify

解决办法

- ✅ useEffect 仅在客户端上运行

```tsx
import { useState, useEffect } from 'react'

export default function App() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return <h1>{isClient ? 'This is never prerendered' : 'Prerendered'}</h1>
	在 React 水合期间， useEffect 被调用。这意味着浏览器 window API 可以在没有水合不匹配的情况下使用
}
```

- ✅ 在特定组件上禁用 SSR

```tsx
import dynamic from 'next/dynamic';

const NoSSR = dynamic(() => import('../components/no-ssr'), { ssr: false });

export default function Page() {
	return (
		<div>
			<NoSSR />
		</div>
	);
}
```

- ✅ 使用 suppressHydrationWarning
- - 有时，服务器和客户端之间的内容不可避免地会有所不同，例如时间戳。您可以通过添加到 suppressHydrationWarning={true} 元素来静音水合不匹配警告

```tsx
<time
	datetime="2016-10-25"
	suppressHydrationWarning
/>
```

- ✅ iOS 尝试检测文本内容中的电话号码、电子邮件地址和其他数据，并将它们转换为链接，从而导致水合作用不匹配
- - 可以使用以下 meta 标记禁用此功能：

```html
<meta
	name="format-detection"
	content="telephone=no, date=no, email=no, address=no"
/>
```

16. Get rid of shiftings

- 比如一个组件装载时，去请求数据。这样一个客户端组件，我们想改造成线 SSR，然后客户端再进行相关的交互
- 可以将这个组件，拆分成两个组件，服务端组件作为客户端组件的的父组件，父组件先 SSR，将请求的 initialData 通过 props 给子组件，这就解决了

```tsx
// A/index.server.tsx
impont { A as AClient } from './index.client.tsx'
export async function A() {
	const data = await fetch('AAA');

	return <AClient initialData={data} />
}

// A/index.client.tsx
'use client';
export function A(p: { initialData: SomeType }) {
  const [data, setData] = useState<SomeType>(p.initialData);

  const fetchFn = async () => {
    const res = await fetch('AAA');
    setData(data);
  };

  useEffect(() => {
    fetchCrypto();
    const intervalId = setInterval(fetchFn, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

	return <div>{JSON.stringify()}</div>
}

// page.tsx --> 引入 A 的服务端组件
import A from "@/components/A/index.server"
```

17. Streaming (异步渲染)
    将一个“大块”数据分成“多个小块”来处理，说白了，就是 nextjs 可以将一个页面分成静态渲染部分和动态渲染部分，免于等待所有组件全加载完才渲染，造成 页面 blocking

- 场景：流媒体、文件操作、stream 数据
  suspense 并不会把组件本身，它只是区分静态和动态的边界，因此本身需要组件本身就是动态的了，no-store

Before： /app/dashboard/page.tsx 请求所有数据，然后下分给 A,B,C 三个组件
Now：需要将 B 进行 String render

Page Rendering --> Streaming

```tsx
1. 将顶层关于 B 组件的数据请求，放到B组件中进行独立请求
2. 在 page.tsx 通过 React 的 Suspense 进行分割加载
<Suspense fallback={<B自己的loading />}>
    <B />
</Suspense>

```
