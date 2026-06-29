// src/pages/api/search.json.ts
import { getCollection } from 'astro:content';

export async function GET() {
  const blogEntries = await getCollection('blog');
  
  const posts = blogEntries
    // 👇 新增这一行：过滤掉所有 id 以 '/config' 结尾的文件
    .filter(post => !post.id.endsWith('/config'))
    .map((post) => ({
      id: post.id, 
      title: post.data.title,
      description: post.data.description || '探索未知领域...',
      color: post.data.color 
    }));

  return new Response(JSON.stringify(posts), {
    headers: { 'Content-Type': 'application/json' }
  });
}