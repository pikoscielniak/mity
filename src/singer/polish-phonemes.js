// Polish spelling → phoneme symbols. Polish orthography is nearly phonetic, so a few ordered rules are enough:
// digraphs first, then softening by "i", then voicing assimilation and final devoicing.
(function (LM) {
  'use strict';

  const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y']);
  const DIGRAPHS = [
    ['dzi', 'dzj'], ['dź', 'dzj'], ['dż', 'dzh'], ['dz', 'dz'],
    ['ch', 'x'], ['cz', 'ch'], ['sz', 'sh'], ['rz', 'zh'],
    ['ci', 'cj'], ['si', 'sj'], ['zi', 'zj'], ['ni', 'nj'],
  ];
  const SINGLE_LETTERS = {
    a: 'a', e: 'e', i: 'i', o: 'o', u: 'u', y: 'y', ó: 'u',
    b: 'b', c: 'c', d: 'd', f: 'f', g: 'g', h: 'x', j: 'j', k: 'k', l: 'l', ł: 'w',
    m: 'm', n: 'n', p: 'p', r: 'r', s: 's', t: 't', w: 'v', z: 'z', v: 'v',
    ś: 'sj', ć: 'cj', ź: 'zj', ż: 'zh', ń: 'nj',
  };
  const DEVOICED = { b: 'p', d: 't', g: 'k', v: 'f', z: 's', zh: 'sh', zj: 'sj', dz: 'c', dzh: 'ch', dzj: 'cj' };
  const VOICELESS = new Set(['p', 't', 'k', 'f', 's', 'sh', 'sj', 'x', 'c', 'ch', 'cj']);
  const SOFT_FROM_DIGRAPH = new Set(['dzj', 'cj', 'sj', 'zj', 'nj']);
  const PUNCTUATION = /[.,!?;:„”"'()«»…–—]/g;

  function isVowelLetter(letter) {
    return VOWELS.has(letter) || letter === 'ó' || letter === 'ą' || letter === 'ę';
  }

  function matchDigraph(word, index) {
    return DIGRAPHS.find(function (pair) { return word.startsWith(pair[0], index); }) || null;
  }

  // "si", "ci", "ni"… before a vowel only soften the consonant; before a consonant the "i" is also sung.
  function readSoftDigraph(word, index, digraph, output) {
    const iIndex = index + digraph[0].length - 1;
    output.push({ symbol: digraph[1], letterIndex: index });
    const nextLetter = word[iIndex + 1];
    if (!nextLetter || !isVowelLetter(nextLetter)) {
      output.push({ symbol: 'i', letterIndex: iIndex });
    }
    return digraph[0].length;
  }

  function readNasalVowel(word, index, output) {
    const isWordFinalE = word[index] === 'ę' && index === word.length - 1;
    output.push({ symbol: word[index] === 'ą' ? 'o' : 'e', letterIndex: index });
    if (!isWordFinalE) {
      output.push({ symbol: 'n~', letterIndex: index });
    }
    return 1;
  }

  // Any other consonant + "i" + vowel: the "i" becomes the glide j ("pióra" → p j u r a).
  function readLetter(word, index, output) {
    const letter = word[index];
    const symbol = SINGLE_LETTERS[letter];
    if (!symbol) {
      return 1;
    }
    output.push({ symbol: symbol, letterIndex: index });
    const isConsonant = !isVowelLetter(letter);
    if (isConsonant && word[index + 1] === 'i' && isVowelLetter(word[index + 2] || '')) {
      output.push({ symbol: 'j', letterIndex: index + 1 });
      return 2;
    }
    return 1;
  }

  function spellOut(word) {
    const output = [];
    let index = 0;
    while (index < word.length) {
      const digraph = matchDigraph(word, index);
      if (digraph && SOFT_FROM_DIGRAPH.has(digraph[1]) && digraph[0].endsWith('i')) {
        index += readSoftDigraph(word, index, digraph, output);
      } else if (digraph) {
        output.push({ symbol: digraph[1], letterIndex: index });
        index += digraph[0].length;
      } else if (word[index] === 'ą' || word[index] === 'ę') {
        index += readNasalVowel(word, index, output);
      } else {
        index += readLetter(word, index, output);
      }
    }
    return output;
  }

  // "przy" is said "pszy", "kwiat" is said "kfiat": rz and w lose voice after a voiceless consonant.
  function assimilateAfterVoiceless(phonemes) {
    for (let index = 1; index < phonemes.length; index += 1) {
      const previous = phonemes[index - 1].symbol;
      const current = phonemes[index].symbol;
      if (VOICELESS.has(previous) && (current === 'zh' || current === 'v')) {
        phonemes[index].symbol = DEVOICED[current];
      }
    }
  }

  // "dziewczyna" is said "dziefczyna": a voiced consonant loses voice before a voiceless one.
  function assimilateBeforeVoiceless(phonemes) {
    for (let index = phonemes.length - 2; index >= 0; index -= 1) {
      const current = phonemes[index].symbol;
      if (DEVOICED[current] && VOICELESS.has(phonemes[index + 1].symbol)) {
        phonemes[index].symbol = DEVOICED[current];
      }
    }
  }

  function devoiceWordEnd(phonemes) {
    const last = phonemes[phonemes.length - 1];
    if (last && DEVOICED[last.symbol]) {
      last.symbol = DEVOICED[last.symbol];
    }
  }

  function normalizeWord(word) {
    return word.toLowerCase().replace(PUNCTUATION, '');
  }

  // Returns [{ symbol, letterIndex }]; letterIndex points into the word without hyphens.
  function isVowelSymbol(symbol) {
    return VOWELS.has(symbol);
  }

  // Vowel-less prepositions ("w", "z") take the voicing of the next word, so they are not devoiced.
  function wordToPhonemes(word) {
    const phonemes = spellOut(normalizeWord(word));
    assimilateAfterVoiceless(phonemes);
    assimilateBeforeVoiceless(phonemes);
    if (phonemes.some(function (phoneme) { return isVowelSymbol(phoneme.symbol); })) {
      devoiceWordEnd(phonemes);
    }
    return phonemes;
  }

  // "dzie-wczy-na" → [['dzj','e'], ['f','ch','y'], ['n','a']] (one array of symbols per written syllable).
  function hyphenatedWordToSyllables(hyphenatedWord) {
    const parts = normalizeWord(hyphenatedWord).split('-');
    const syllableOfLetter = [];
    parts.forEach(function (part, syllableIndex) {
      Array.from(part).forEach(function () { syllableOfLetter.push(syllableIndex); });
    });
    const syllables = parts.map(function () { return []; });
    wordToPhonemes(parts.join('')).forEach(function (phoneme) {
      syllables[syllableOfLetter[phoneme.letterIndex]].push(phoneme.symbol);
    });
    return syllables;
  }

  // Inside one sung syllable only the first vowel is the nucleus: "tau" is sung "taw".
  function turnTrailingVowelsIntoGlides(symbols) {
    const nucleus = symbols.findIndex(isVowelSymbol);
    return symbols.map(function (symbol, index) {
      if (index > nucleus && symbol === 'u') {
        return 'w';
      }
      if (index > nucleus && symbol === 'i') {
        return 'j';
      }
      return symbol;
    });
  }

  // A sung line: "Na Kre-cie w głę-bi _" → [{ text, symbols, isHold }]. A vowel-less word ("w", "z")
  // is sung together with the next syllable; "_" holds the previous vowel on the next note.
  function lineToSyllables(line) {
    const result = [];
    let pending = { text: '', symbols: [] };
    line.split(/\s+/).filter(Boolean).forEach(function (word) {
      if (word === '_') {
        result.push({ text: '', symbols: [], isHold: true });
        return;
      }
      const texts = word.split('-');
      hyphenatedWordToSyllables(word).forEach(function (symbols, index) {
        const text = texts[index] + (index === texts.length - 1 ? ' ' : '');
        if (!symbols.some(isVowelSymbol)) {
          pending = { text: pending.text + text, symbols: pending.symbols.concat(symbols) };
          return;
        }
        result.push({
          text: pending.text + text,
          symbols: turnTrailingVowelsIntoGlides(pending.symbols.concat(symbols)),
          isHold: false,
        });
        pending = { text: '', symbols: [] };
      });
    });
    return result;
  }

  LM.phonemes = { wordToPhonemes, hyphenatedWordToSyllables, lineToSyllables, isVowelSymbol };
}(window.LM = window.LM || {}));
