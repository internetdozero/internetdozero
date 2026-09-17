const mockPosts = [
  {
    id: 'launch-own-corner',
    slug: 'como-publicar-um-site-proprio-sem-complicar',
    type: 'article',
    title_pt: 'Como publicar um site próprio sem complicar',
    subtitle_pt: 'Um caminho curto para tirar uma ideia do computador e colocá-la no ar.',
    category: 'Web',
    tags_pt: ['web', 'prática'],
    author: 'Eduardo S.',
    createdAt: '2026-09-15T10:00:00.000Z',
    likes: 12,
    commentsCount: 2,
    sections_pt: [{ title: 'O caminho mais curto', content: 'Você precisa de um domínio, hospedagem e os arquivos do seu site. O resto é escolher uma ferramenta que não atrapalhe.' }]
  },
  {
    id: 'launch-account-security',
    slug: 'um-checklist-pratico-para-proteger-suas-contas',
    type: 'article',
    title_pt: 'Um checklist prático para proteger suas contas',
    subtitle_pt: 'Pequenas configurações que evitam uma dor de cabeça grande.',
    category: 'Segurança',
    tags_pt: ['segurança', 'contas'],
    author: 'Eduardo S.',
    createdAt: '2026-09-13T10:00:00.000Z',
    likes: 8,
    commentsCount: 1,
    sections_pt: [{ title: 'Comece pelo básico', content: 'Use senhas diferentes, ative a autenticação em dois fatores e mantenha seus meios de recuperação atualizados.' }]
  },
  {
    id: 'launch-backup-routine',
    slug: 'backup-sem-drama-uma-rotina-que-cabe-na-vida-real',
    type: 'article',
    title_pt: 'Backup sem drama: uma rotina que cabe na vida real',
    subtitle_pt: 'Como guardar o que importa sem transformar isso em um segundo emprego.',
    category: 'Organização',
    tags_pt: ['organização', 'backup'],
    author: 'Eduardo S.',
    createdAt: '2026-09-10T10:00:00.000Z',
    likes: 5,
    commentsCount: 0,
    sections_pt: [{ title: 'Uma regra simples', content: 'Escolha o que seria impossível refazer, faça uma cópia automática e teste a restauração de tempos em tempos.' }]
  },
  {
    id: 'mock-fourth-post',
    slug: 'o-que-aprendi-montando-um-canto-na-internet',
    type: 'article',
    title_pt: 'O que aprendi montando um canto na internet',
    subtitle_pt: 'Notas de quem preferiu construir aos poucos e entender cada peça.',
    category: 'Ideias',
    tags_pt: ['ideias', 'web'],
    author: 'Eduardo S.',
    createdAt: '2026-09-07T10:00:00.000Z',
    likes: 3,
    commentsCount: 0,
    sections_pt: [{ title: 'Fazer é descobrir', content: 'Nem tudo precisa nascer pronto. Às vezes o melhor jeito de entender uma coisa é colocá-la para funcionar.' }]
  },
  {
    id: 'mock-thought',
    slug: 'nota-sobre-ferramentas',
    type: 'thought',
    title_pt: 'Uma ferramenta boa desaparece enquanto você usa',
    subtitle_pt: 'Se ela pede explicação demais, talvez ainda esteja no caminho.',
    category: 'Ideias',
    tags_pt: ['ideias'],
    author: 'Eduardo S.',
    createdAt: '2026-09-05T10:00:00.000Z',
    likes: 2,
    commentsCount: 0,
    sections_pt: []
  }
];

export const mockBlogPosts = mockPosts;
export const mockBlogCategories = ['Web', 'Segurança', 'Organização', 'Ideias'];

export function getMockPost(slug) {
  return mockPosts.find((post) => post.slug === slug || post.id === slug) || null;
}
