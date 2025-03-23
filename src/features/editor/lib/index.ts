export const htmlToMarkdown = (html: string): string => {
  let markdown = html
    .replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n')
    .replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n')
    .replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n')
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
    .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)')
    .replace(/<ul>(.*?)<\/ul>/g, '$1\n')
    .replace(/<ol>(.*?)<\/ol>/g, '$1\n')
    .replace(/<li>(.*?)<\/li>/g, '- $1\n')
    .replace(/<code>(.*?)<\/code>/g, '`$1`')
    .replace(/<img src="(.*?)".*?>/g, '![]($1)')
    .replace(/<br>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")

  return markdown.trim()
}
