<?php

namespace App\Helpers;

/**
 * Class TextHelper
 *
 * Provides text transformation utilities for Spanish title casing,
 * ensuring correct capitalization rules for articles, prepositions,
 * and conjunctions.
 *
 * @package App\Helpers
 */
class TextHelper
{
    /**
     * List of Spanish words that should remain lowercase
     * unless they appear as the first or last word in a title.
     *
     * @var array
     */
    protected static array $lowercaseWords = [
        'a',
        'ante',
        'bajo',
        'cabe',
        'con',
        'contra',
        'de',
        'del',
        'desde',
        'en',
        'entre',
        'hacia',
        'hasta',
        'para',
        'por',
        'según',
        'sin',
        'so',
        'sobre',
        'tras',
        'la',
        'las',
        'el',
        'los',
        'lo',
        'un',
        'una',
        'unos',
        'unas',
        'y',
        'o',
        'e',
        'u',
        'ni',
        'que',
        'como',
        'pero',
        'aunque',
        'mientras',
        'si'
    ];

    /**
     * Convert a string to Spanish "Title Case":
     * - First and last words are always capitalized.
     * - Articles, prepositions, and conjunctions remain lowercase,
     *   unless at the start or end of the text.
     * - Handles hyphens and multiple spaces correctly.
     *
     * @param  string  $value  Input string
     * @return string Title-cased string
     */
    public static function titleCaseSpanish(string $value): string
    {
        $value = trim($value);
        if ($value === '') {
            return '';
        }

        $text = mb_strtolower($value, 'UTF-8');

        $tokens = preg_split('/([\s\-]+)/u', $text, -1, PREG_SPLIT_DELIM_CAPTURE);

        $words = array_filter($tokens, fn($t) => !preg_match('/^[\s\-]+$/u', $t));
        $total = count($words);

        $result = [];
        $wordIndex = 0;

        foreach ($tokens as $token) {
            if (preg_match('/^[\s\-]+$/u', $token)) {
                $result[] = $token;
                continue;
            }

            $isFirst = $wordIndex === 0;
            $isLast = $wordIndex === $total - 1;
            $wordIndex++;

            $lower = in_array($token, self::$lowercaseWords, true);

            if ($isFirst || $isLast || !$lower) {
                $token = self::mb_ucfirst($token);
            }

            $result[] = $token;
        }

        return implode('', $result);
    }

    /**
     * Capitalize the first letter of a string (UTF-8 safe).
     *
     * @param  string  $str
     * @return string
     */
    protected static function mb_ucfirst(string $str): string
    {
        $first = mb_substr($str, 0, 1, 'UTF-8');
        $rest = mb_substr($str, 1, null, 'UTF-8');
        return mb_strtoupper($first, 'UTF-8') . $rest;
    }
}
