UPDATE posts
SET sections_pt = json_set(
  sections_pt,
  '$[0].content',
  json_extract(sections_pt, '$[0].content') || char(10) || char(10) || 'Se precisar de uma senha rápida para uma conta nova, use o [gerador de senhas](/tools/gerador-de-senhas). Ele funciona no próprio navegador e não envia o resultado para lugar nenhum.'
)
WHERE id = 'launch-account-security';
