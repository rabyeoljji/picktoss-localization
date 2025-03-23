import { marked } from 'marked';

/**
 * HTML 문자열을 마크다운으로 변환합니다.
 */
export const htmlToMarkdown = (html: string): string => {
  // 간단한 HTML -> 마크다운 변환 로직
  // 실제 프로덕션에서는 turndown 같은 라이브러리 사용을 권장합니다
  let markdown = html;
  
  // 헤딩 변환
  markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, '# $1');
  markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, '## $1');
  markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, '### $1');
  
  // 강조 변환
  markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
  markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*');
  
  // 리스트 변환
  markdown = markdown.replace(/<ul>([\s\S]*?)<\/ul>/g, (match, content) => {
    return content.replace(/<li>([\s\S]*?)<\/li>/g, '- $1\n');
  });
  
  markdown = markdown.replace(/<ol>([\s\S]*?)<\/ol>/g, (match, content) => {
    let index = 1;
    return content.replace(/<li>([\s\S]*?)<\/li>/g, () => {
      return `${index++}. $1\n`;
    });
  });
  
  // 링크 변환
  markdown = markdown.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)');
  
  // 이미지 변환
  markdown = markdown.replace(/<img src="(.*?)".*?>/g, '![]($1)');
  
  // 코드 변환
  markdown = markdown.replace(/<code>(.*?)<\/code>/g, '`$1`');
  
  // 단락 변환
  markdown = markdown.replace(/<p>([\s\S]*?)<\/p>/g, '$1\n\n');
  
  return markdown.trim();
};

/**
 * 마크다운 문자열을 HTML로 변환합니다.
 */
export const markdownToHtml = (markdown: string): string => {
  return marked(markdown);
};
