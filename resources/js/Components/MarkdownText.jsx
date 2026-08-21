import React from 'react';

/**
 * Format inline markdown tokens: **bold**, *italic*, `code`, [link](url)
 */
function formatInlineTokens(text) {
    if (!text) return text;

    // Pattern matching **bold**, *italic*, `code`, and [link](url)
    const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
    const parts = text.split(tokenRegex);

    return parts.map((part, index) => {
        if (!part) return null;

        // **Bold**
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
            return (
                <strong key={index} className="font-bold text-stone-900">
                    {part.slice(2, -2)}
                </strong>
            );
        }

        // *Italic*
        if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
            return (
                <em key={index} className="italic text-stone-700">
                    {part.slice(1, -1)}
                </em>
            );
        }

        // `Inline Code`
        if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
            return (
                <code key={index} className="px-1.5 py-0.5 mx-0.5 rounded bg-stone-100 text-yellow-800 font-mono text-[11px] border border-stone-200">
                    {part.slice(1, -1)}
                </code>
            );
        }

        // [Link](url)
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
            return (
                <a 
                    key={index} 
                    href={linkMatch[2]} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-yellow-700 font-bold underline hover:text-yellow-800 transition-colors inline-flex items-center gap-0.5"
                >
                    {linkMatch[1]}
                </a>
            );
        }

        return <span key={index}>{part}</span>;
    });
}

/**
 * Robust, lightweight Markdown Parser & Formatter for Sellify AI Chat
 */
export default function MarkdownText({ content = '', isStreaming = false }) {
    if (!content) return null;

    const lines = content.split('\n');

    return (
        <div className="space-y-1.5 text-xs text-stone-800 leading-relaxed font-sans select-text">
            {lines.map((rawLine, idx) => {
                const line = rawLine.trimEnd();

                if (!line) {
                    return <div key={idx} className="h-1" />;
                }

                // Headings: ### or ## or #
                if (line.startsWith('### ')) {
                    return (
                        <h4 key={idx} className="font-bold text-xs sm:text-sm text-stone-900 mt-2 mb-1 border-b border-stone-100 pb-0.5">
                            {formatInlineTokens(line.replace('### ', ''))}
                        </h4>
                    );
                }
                if (line.startsWith('## ')) {
                    return (
                        <h3 key={idx} className="font-bold text-sm text-stone-950 mt-2.5 mb-1">
                            {formatInlineTokens(line.replace('## ', ''))}
                        </h3>
                    );
                }
                if (line.startsWith('# ')) {
                    return (
                        <h2 key={idx} className="font-extrabold text-sm sm:text-base text-stone-950 mt-3 mb-1">
                            {formatInlineTokens(line.replace('# ', ''))}
                        </h2>
                    );
                }

                // Bullet Lists: - or *
                const isBullet = line.startsWith('- ') || line.startsWith('* ');
                if (isBullet) {
                    const cleanText = line.replace(/^[-*]\s+/, '');
                    return (
                        <div key={idx} className="flex items-start gap-2 pl-1.5 my-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0 mt-1.5" />
                            <div className="flex-1">
                                {formatInlineTokens(cleanText)}
                            </div>
                        </div>
                    );
                }

                // Numbered Lists: 1. 2. 3. etc.
                const numberedMatch = line.match(/^(\d+)\.\s+(.*)$/);
                if (numberedMatch) {
                    return (
                        <div key={idx} className="flex items-start gap-2 pl-1 my-1">
                            <span className="px-1.5 py-0.2 rounded bg-yellow-100 text-yellow-950 font-bold text-[10px] shrink-0 mt-0.5 border border-yellow-300">
                                {numberedMatch[1]}
                            </span>
                            <div className="flex-1 font-normal">
                                {formatInlineTokens(numberedMatch[2])}
                            </div>
                        </div>
                    );
                }

                // Standard Paragraph
                return (
                    <p key={idx} className="my-0.5">
                        {formatInlineTokens(line)}
                    </p>
                );
            })}

            {isStreaming && (
                <span className="inline-block w-1.5 h-3 bg-yellow-500 ml-1 align-middle animate-pulse" />
            )}
        </div>
    );
}
