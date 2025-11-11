// ===================================================================
// CLASS 1: POSTagger (Your final correct version)
// ===================================================================
class POSTagger {
    constructor(lexicon = (typeof window !== 'undefined' ? window.POSTAGGER_LEXICON : {}), options = {}) {
        this.lexicon = lexicon || (typeof window !== 'undefined' ? window.POSTAGGER_LEXICON : {});
        this.options = Object.assign({ debug: false }, options);
        this.lemmatizer = new Lemmatizer();
        this.lexiconCache = Object.create(null);
        this._quoteState = { singleOpen: true, doubleOpen: true };

        // ---------- Contraction dictionary (lower-case keys) ----------
        // Inside the POSTagger class constructor...

        this.contractionDict = {
            // Existing n't contractions
            "don't": { parts: ["do", "not"], tags: ["VB", "RB"] },
            "doesn't": { parts: ["does", "not"], tags: ["VBZ", "RB"] },
            "didn't": { parts: ["did", "not"], tags: ["VBD", "RB"] },
            "can't": { parts: ["ca", "not"], tags: ["MD", "RB"] },
            "won't": { parts: ["will", "not"], tags: ["MD", "RB"] },
            "couldn't": { parts: ["could", "not"], tags: ["MD", "RB"] },
            "shouldn't": { parts: ["should", "not"], tags: ["MD", "RB"] },
            "wouldn't": { parts: ["would", "not"], tags: ["MD", "RB"] },
            "isn't": { parts: ["is", "not"], tags: ["VBZ", "RB"] },
            "aren't": { parts: ["are", "not"], tags: ["VBP", "RB"] },
            "wasn't": { parts: ["was", "not"], tags: ["VBD", "RB"] },
            "weren't": { parts: ["were", "not"], tags: ["VBD", "RB"] },

            // --- NEWLY ADDED CONTRACTIONS ---
            "they're": { parts: ["they", "are"], tags: ["PRP", "VBP"] },
            "we're": { parts: ["we", "are"], tags: ["PRP", "VBP"] },
            "you're": { parts: ["you", "are"], tags: ["PRP", "VBP"] },
            "i'm": { parts: ["I", "am"], tags: ["PRP", "VBP"] },
            "i've": { parts: ["I", "have"], tags: ["PRP", "VBP"] },
            "i'll": { parts: ["I", "will"], tags: ["PRP", "MD"] },
            "i'd": { parts: ["I", "would"], tags: ["PRP", "MD"] },
            // --- END NEW CONTRACTIONS ---

            // Existing 's and 'd contractions
            "he'd": { parts: ["he", "would"], tags: ["PRP", "MD"] },
            "she'd": { parts: ["she", "would"], tags: ["PRP", "MD"] },
            "he's": { parts: ["he", "is"], tags: ["PRP", "VBZ"] },
            "she's": { parts: ["she", "is"], tags: ["PRP", "VBZ"] },
            "it's": { parts: ["it", "is"], tags: ["PRP", "VBZ"] },

            // --- NEWLY ADDED 'll CONTRACTIONS ---
            "she'll": { parts: ["she", "will"], tags: ["PRP", "MD"] },
            "he'll": { parts: ["he", "will"], tags: ["PRP", "MD"] },
            "it'll": { parts: ["it", "will"], tags: ["PRP", "MD"] },
            "you'll": { parts: ["you", "will"], tags: ["PRP", "MD"] },
            "you've": { parts: ["you", "have"], tags: ["PRP", "VBP"] },
            "we've": { parts: ["we", "have"], tags: ["PRP", "VBP"] },
            "they've": { parts: ["they", "have"], tags: ["PRP", "VBP"] },
            "what's": { parts: ["what", "is"], tags: ["WP", "VBZ"] },
            "that's": { parts: ["that", "is"], tags: ["DT", "VBZ"] },
            "what's": { parts: ["what", "is"], tags: ["WP", "VBZ"] },
            "where's": { parts: ["where", "is"], tags: ["WRB", "VBZ"] },
            "there's": { parts: ["there", "is"], tags: ["EX", "VBZ"] },
        };
    }

    // ---------- Utilities ----------
    log(message, context) {
        if (!this.options.debug) return;
        if (context !== undefined) console.log(`[POS] ${message}`, context);
        else console.log(`[POS] ${message}`);
    }

    normalizeApostrophes(s) {
        if (!s) return s;
        return s.replace(/[’‘`]/g, "'");
    }

    applyCasing(original, part) {
        if (!original || original.length === 0) return part;
        const firstChar = original[0];
        if (firstChar.toUpperCase() === firstChar && firstChar.toLowerCase() !== firstChar) {
            if (/^[A-Za-zÀ-ÖØ-öø-ÿ]/.test(part)) {
                return part.charAt(0).toUpperCase() + part.slice(1);
            }
        }
        return part;
    }

    tagQuoteToken(tok) {
        const isDouble = tok === '"' || tok === '“' || tok === '”';

        if (isDouble) {
            const isOpen = this._quoteState.doubleOpen;
            this._quoteState.doubleOpen = !isOpen; // Use and flip the double quote state
            return isOpen ? '``' : "''";
        } else { // It's a single quote
            const isOpen = this._quoteState.singleOpen;
            this._quoteState.singleOpen = !isOpen; // Use and flip the single quote state
            return isOpen ? '``' : "''";
        }
    }

    isCapitalized(word) {
        if (!word || word.length === 0) return false;
        return /^[A-Z]/.test(word);
    }

    isMainVerb(tag) {
        return tag && ['VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ'].includes(tag);
    }

    isAuxiliaryOrModal(tag, word) {
        const auxTags = ['MD', 'VBP', 'VBZ', 'VBD']; // Note: VB removed to prevent flagging infinitives
        const auxWords = ['am', 'is', 'are', 'was', 'were', 'be', 'being', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'shall', 'would', 'should', 'can', 'could', 'may', 'might', 'must', "'re", "'ve", "'ll", "'d"];
        return (tag && auxTags.includes(tag)) || (word && auxWords.includes(word.toLowerCase()));
    }

    _getConceptText(taggedWords) {
        if (!taggedWords || taggedWords.length === 0) {
            return '';
        }
        const words = [];
        let foundFirstContentWord = false;
        for (const token of taggedWords) {
            // Skip any leading determiners (DT tags)
            if (!foundFirstContentWord && token.tag === 'DT') {
                continue;
            }
            foundFirstContentWord = true;
            words.push(token.word);
        }
        return words.join(' ');
    }

    // ========== Tokenization ==========
    tokenize(sentence) {
        if (!sentence) return [];

        let text = this.normalizeApostrophes(sentence);
        text = text.replace(/\u00A০/g, ' ').replace(/\s+/g, ' ');

        // The word-matching part of the regex has been updated to include an optional trailing apostrophe (')
        const regex = /[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:['-][A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*'?|\d+(?:[.,]\d+)*|\.\.\.|[.,!?;:()"'“”‘’'\-–—…%]/g;

        const tokens = [];
        let m;
        while ((m = regex.exec(text)) !== null) {
            tokens.push(m[0]);
        }
        return tokens;
    }

    // ---------- Lexicon ----------
    getLexiconTags(word) {
        if (!word) return [];
        const lower = word.toLowerCase();
        if (this.lexiconCache[lower]) return this.lexiconCache[lower];
        const raw = this.lexicon[lower];
        const tags = Array.isArray(raw) ? raw.slice() : (raw ? [raw] : []);
        this.lexiconCache[lower] = tags;
        this.log(`Lexicon lookup: "${word}" -> [${tags.join(', ')}]`);
        return tags;
    }

    // ---------- Contraction Expansion ----------
    expandContractions(tokens) {
        const expanded = [];
        const contractionTagMap = new Map();

        const lookupEntry = (s) => {
            if (!s) return undefined;
            const norm = this.normalizeApostrophes(s).toLowerCase();
            return this.contractionDict.hasOwnProperty(norm) ? this.contractionDict[norm] : undefined;
        };

        for (let i = 0; i < tokens.length; i++) {
            const orig = tokens[i];
            const directEntry = lookupEntry(orig);
            if (directEntry) {
                const parts = directEntry.parts || [];
                const tags = directEntry.tags || [];
                for (let p = 0; p < parts.length; p++) {
                    const rawPart = parts[p];
                    const cased = p === 0 ? this.applyCasing(orig, rawPart) : rawPart;
                    const newIndex = expanded.length;
                    expanded.push(cased);
                    if (tags[p]) contractionTagMap.set(newIndex, tags[p]);
                }
                this.log(`Contraction expansion: "${orig}" -> [${directEntry.parts.join(', ')}]`);
                continue;
            }
            expanded.push(orig);
        }
        return { tokens: expanded, contractionTagMap };
    }

    // ---------- Heuristics ----------
    suffixHeuristic(word) {
        const w = (word || '').toLowerCase();
        if (this.getLexiconTags(word).length) {
            this.log(`Suffix heuristic skipped (in lexicon): "${word}"`);
            return [];
        }
        if (w.endsWith('ing')) return ['VBG', 'NN'];
        if (w.endsWith('ed')) return ['VBD', 'VBN'];
        if (w.endsWith('ly')) return ['RB'];
        if (w.endsWith('s') && w.length > 2) return ['NNS', 'VBZ'];
        if (w.endsWith('able') || w.endsWith('ible')) return ['JJ'];
        if (w.endsWith('ous') || w.endsWith('ful') || w.endsWith('less')) return ['JJ'];
        if (w.endsWith('ize') || w.endsWith('ify')) return ['VB'];
        if (/^\d+(\.\d+)?$/.test(w)) return ['CD']; // Cardinal number
        this.log(`Suffix heuristic (none): "${word}"`);
        return [];
    }

    // ---------- Contextual Rules Engine ----------
    // In your POSTagger class...

    applyTwoTokenContextRules({ word, prevWord, prev2, prevTag, prev2Tag, prev3Tag = null, nextWord, possibleTags }) {

        this.log(`Applying 2-token context: word="${word}", prev="${prevWord}", prevTag="${prevTag}", prev2="${prev2}", prev2Tag="${prev2Tag}", prev3Tag="${prev3Tag}", next="${nextWord}"`);

        const poss = possibleTags || [];
        const next = nextWord || null;
        const lowerWord = word.toLowerCase();

        // --- Logic to "look past" negation words like "n't" ---
        const isNegated = prevWord && prevWord.toLowerCase() === "n't";
        const effectivePrevWord = isNegated ? prev2 : prevWord;
        const effectivePrevTag = isNegated ? prev2Tag : prevTag;

        const doAuxTags = new Set(['VBD', 'VBP', 'VBZ']);
        // --- MODIFIED: Check for PRP OR DT (start of NP) ---
        if (doAuxTags.has(prev2Tag) && (prevTag === 'PRP' || prevTag === 'DT') && poss.includes('VB')) {
            this.log(`Question inversion rule (Aux + Subj[${prevTag}] + Verb) -> tag "${word}" as VB`);
            return 'VB';
        }

        const lw = word.toLowerCase();
        if (prevWord && new Set(['is', 'am', 'are', 'was', 'were']).has(prevWord.toLowerCase())) {
            if (lw.endsWith('er') && poss.includes('JJR')) {
                this.log(`Comparative adjective rule -> tag "${word}" as JJR`);
                return 'JJR';
            }
            if (lw.endsWith('est') && poss.includes('JJS')) {
                this.log(`Superlative adjective rule -> tag "${word}" as JJS`);
                return 'JJS';
            }
        }

        // Rule for Gerunds as Subjects (e.g., "Running is fun.")
        if (prevTag === null && poss.includes('VBG') && nextWord) {
            const nextTags = this.getLexiconTags(nextWord);
            if (nextTags.includes('VBZ') || nextTags.includes('VBP') || nextTags.includes('VBD')) {
                this.log(`Gerund subject rule -> tag "${word}" as VBG`);
                return 'VBG';
            }
        }

        // --- 1. WORD-SPECIFIC DISAMBIGUATION ---
        if (lowerWord === 'there') {
            if (prevTag && prevTag.startsWith('VB')) { return 'RB'; } // "gone there"
            const nextTags = this.getLexiconTags(next);
            if (nextTags.some(t => t === 'VBP' || t === 'VBZ')) { return 'EX'; } // "There is..."
        }
        if (lowerWord === 'to') {
            const nextTags = this.getLexiconTags(next);
            if (nextTags.includes('VB')) { return 'TO'; }
            if (nextTags.some(t => t === 'DT' || t.startsWith('NN'))) { return 'IN'; }
        }
        if (lowerWord === 'her') {
            if (prevTag && prevTag.startsWith('VB')) { return 'PRP'; }
            const nextTags = this.getLexiconTags(next);
            if (nextTags.some(t => t.startsWith('NN'))) { return 'PRP$'; }
        }
        if (lowerWord === 'that') {
            // Rule 1: Handles "That car..." at the start of a sentence.
            if (prevTag === null && next) {
                const nextTags = this.getLexiconTags(next);
                if (nextTags.some(t => t.startsWith('NN'))) {
                    this.log(`Demonstrative determiner rule -> tag "${word}" as DT`);
                    return 'DT';
                }
            }

            // Rule 2: Handles "...the book that I read." (Your old rule)
            if (prevTag && prevTag.startsWith('NN')) {
                return 'WDT';
            }

            // Future rules for "that" could be added here.
        }
        if (lowerWord === 'which') {
            if (prevTag === ',' || (prevTag && prevTag.startsWith('NN'))) { return 'WP'; }
        }

        // --- 2. GENERAL GRAMMATICAL RULES (ORDERED BY PRIORITY) ---

        // A) Highest Priority: Core structures, modals, and linking verbs.

        // Rule: Disambiguate Modal vs. Noun (e.g., "must", "can").
        if (poss.includes('MD') && nextWord) {
            const nextTags = this.getLexiconTags(nextWord);
            if (nextTags.includes('VB')) {
                this.log(`Modal verb rule (MD + VB) -> tag "${word}" as MD`);
                return 'MD';
            }
        }

        // Interjection Heuristic
        if ((prevTag === null || prevTag === '``') && next === '!') {
            if (poss.length === 0) {
                this.log(`Interjection heuristic -> tag "${word}" as UH`);
                return 'UH';
            }
        }

        if (prevTag === 'IN' && poss.includes('JJ') && next === ',') { return 'JJ'; }
        if (prevTag === 'TO' && poss.includes('VB')) { return 'VB'; }

        if (prevTag === 'MD') {
            if (prevWord && prevWord.toLowerCase() === "'d" && poss.includes('VBN')) {
                return 'VBN';
            }
            if (poss.includes('VB')) {
                return 'VB';
            }
        }

        // Base Verb after Auxiliary "do"
        const doAux = new Set(['do', 'does', 'did']);
        if (effectivePrevWord && doAux.has(effectivePrevWord.toLowerCase()) && poss.includes('VB')) {
            this.log(`Base verb after auxiliary 'do' -> tag "${word}" as VB`);
            return 'VB';
        }

        const copulaWords = new Set(['is', 'am', 'are', 'was', 'were', 'be', 'being', 'been', 'seem', 'seems', 'seemed', 'become', 'becomes', 'became', "'re", "'s"]);
        if (prevWord && copulaWords.has(prevWord.toLowerCase())) {
            if (poss.includes('RB') && next) {
                const nextTags = this.getLexiconTags(next);
                if (nextTags.includes('JJ') || nextTags.includes('RB')) { return 'RB'; }
            }
            // --- START CHANGE ---
            // Prioritize VBN (past participle) for passive voice detection.
            if (poss.includes('VBN')) { return 'VBN'; }
            // VBG is now the fallback if VBN wasn't a possibility.
            if (poss.includes('VBG')) { return 'VBG'; }
            // --- END CHANGE ---
            if (poss.includes('JJ')) { return 'JJ'; }
        }

        if (prevTag && prevTag.startsWith('VB') && poss.includes('VBG')) {
            return 'VBG';
        }

        const participleAuxTags = ['VBP', 'VBZ', 'VBD', 'VBN'];
        if (participleAuxTags.includes(prevTag) && poss.includes('VBN')) { return 'VBN'; }

        // --- START: Improved Subject-Verb Agreement Rules ---
        // --- ADD THE NEW, MORE SPECIFIC RULES HERE ---
        // Rule for plural noun -> adverb -> verb (e.g., "scripts jointly support")
        if (prev2Tag === 'NNS' && prevTag === 'RB' && poss.includes('VBP')) {
            this.log(`Plural subject-adverb-verb rule -> tag "${word}" as VBP`);
            return 'VBP';
        }
        // Rule for singular noun -> adverb -> verb (e.g., "script jointly supports")
        if ((prev2Tag === 'NN' || prev2Tag === 'NNP') && prevTag === 'RB' && poss.includes('VBZ')) {
            this.log(`Singular subject-adverb-verb rule -> tag "${word}" as VBZ`);
            return 'VBZ';
        }

        // Rule for a Noun following a Determiner (e.g., "This set")
        if (prevTag === 'DT' && poss.includes('NN')) {
            this.log(`Determiner-noun rule -> tag "${word}" as NN`);
            return 'NN';
        }

        // PRIORITY 1: Handle plural nouns at the end of a compound noun phrase.
        // This is more specific and must run before the general subject-verb rule.
        if (poss.includes('NNS') && lowerWord.endsWith('s')) {
            if (prevTag === 'NN' || prevTag === 'JJ') {
                this.log(`Plural compound noun rule -> tag "${word}" as NNS`);
                return 'NNS';
            }
        }

        // PRIORITY 2: General subject-verb agreement rules.
        // Rule for singular noun subjects (e.g., "fox [NN] jumps [VBZ]")
        if ((prevTag === 'NN' || prevTag === 'NNP') && poss.includes('VBZ')) {
            this.log(`Subject-verb agreement -> tag "${word}" as VBZ`);
            return 'VBZ';
        }
        // Rule for singular noun subjects with past-tense verbs (e.g., "team [NN] reviewed [VBD]")
        if ((prevTag === 'NN' || prevTag === 'NNP') && poss.includes('VBD')) {
            this.log(`Past-tense subject-verb agreement -> tag "${word}" as VBD`);
            return 'VBD';
        }
        // Rule for plural noun subjects (e.g., "scripts [NNS] support [VBP]")
        if (prevTag === 'NNS') {
            if (word.toLowerCase() === 'were' && poss.includes('VBD')) {
                this.log(`Plural past-tense agreement -> tag "${word}" as VBD`);
                return 'VBD';
            }
            if (poss.includes('VBP') || poss.includes('VB')) {
                this.log(`Plural subject-verb agreement -> tag "${word}" as VBP`);
                return 'VBP';
            }
        }

        // B) Subject-Verb Agreement (Verb Preference over Nouns)
        // (The original complex rules have been replaced by the simpler ones above)

        if (prevTag === 'PRP') {
            if (poss.includes('MD')) { return 'MD'; }
            const thirdPersonSingular = new Set(['he', 'she', 'it']);
            if (prevWord && thirdPersonSingular.has(prevWord.toLowerCase()) && poss.includes('VBZ')) { return 'VBZ'; }
            if (poss.includes('VBD')) { return 'VBD'; }
            if (poss.includes('VBP')) { return 'VBP'; }
        }

        // C) Noun Identification
        if (this.isCapitalized(word)) {
            if (prevTag === 'DT' || prevTag === 'NNP') { return 'NNP'; }
        }

        // Participle as adjective
        if ((poss.includes('VBG') || poss.includes('VBN')) && nextWord) {
            // --- START NEW LOGIC ---
            // Add an exception: do not apply this rule if the participle follows a form of "have".
            // This prevents "have been" from being tagged as "have (VB) been (JJ)".
            const haveAux = new Set(['have', 'has', 'had']);
            if (prevWord && haveAux.has(prevWord.toLowerCase())) {
                // Do nothing and let it be tagged as a verb part later.
            } else {
                // --- END NEW LOGIC ---
                const nextTags = this.getLexiconTags(nextWord);
                if (nextTags.some(t => t.startsWith('NN'))) {
                    this.log(`Participle as adjective rule -> tag "${word}" as JJ`);
                    return 'JJ';
                }
            } // Close the new else block
        }

        // --- START NEW MODAL RULE ---
        const commonModals = new Set(['can', 'could', 'may', 'might', 'must', 'shall', 'should', 'will', 'would']);
        if (commonModals.has(lowerWord) && poss.includes('MD')) {
            // If a modal follows a noun and is followed by a determiner (like in a question), tag as MD
            if ((prevTag === 'NN' || prevTag === 'NNS') && next && this.getLexiconTags(next).includes('DT')) {
                this.log(`Modal in possible question rule -> tag "${word}" as MD`);
                return 'MD';
            }
            // Add other heuristics for modals if needed, e.g., if it follows PRP
            if (prevTag === 'PRP') {
                this.log(`Modal after pronoun rule -> tag "${word}" as MD`);
                return 'MD'; // e.g., "I can go"
            }
        }

        // --- MOVED RULE ---
        // This rule now runs *after* the more specific verb/modal rules.
        if (prevTag && prevTag.startsWith('NN') && (poss.includes('NNS') || poss.includes('NN'))) {
            if (poss.includes('WP')) {
                this.log(`Relative pronoun rule -> tag "${word}" as WP`);
                return 'WP';
            }
            const objectPronouns = new Set(['it', 'him', 'her', 'them', 'me', 'us']);
            if (nextWord && objectPronouns.has(nextWord.toLowerCase()) && poss.includes('VBZ')) {
                this.log(`Noun-Verb-Pronoun pattern -> tag "${word}" as VBZ`);
                return 'VBZ';
            }
            const verbExceptions = new Set(['is', 'are', 'was', 'were', 'has', 'have', 'had']);
            if (verbExceptions.has(lowerWord)) {
                // This is a verb, not part of a compound noun.
            } else {
                const tag = poss.includes('NNS') ? 'NNS' : 'NN';
                this.log(`Compound noun rule -> tag "${word}" as ${tag}`);
                return tag;
            }
        }

        // D) Other Common Phrase Patterns
        if (poss.includes('IN') && next) {
            const nextTags = this.getLexiconTags(next);
            if (nextTags.some(t => t === 'DT' || t === 'JJ' || t.startsWith('NN'))) { return 'IN'; }
        }
        if (prevTag === 'VBG' && poss.includes('NN')) { return 'NN'; }

        if (effectivePrevTag === 'MD') {
            if (effectivePrevWord && effectivePrevWord.toLowerCase() === "'d" && poss.includes('VBN')) {
                return 'VBN';
            }
            if (poss.includes('VB')) {
                return 'VB';
            }
        }
        if (effectivePrevTag === 'VB' && effectivePrevWord && effectivePrevWord.toLowerCase() === 'do') {
            if (poss.includes('VB')) { return 'VB'; }
        }
        if (prevTag && this.isMainVerb(prevTag) && poss.includes('DT')) { return 'DT'; }

        // E) General Fallback Rule for Adverbs
        const skipAfterAux = this.isAuxiliaryOrModal(prevTag, prevWord) || isNegated;
        const finiteVerbTags = ['VB', 'VBD', 'VBP', 'VBZ'];
        if (!skipAfterAux && finiteVerbTags.includes(prevTag) && poss.includes('RB')) {
            const commonCopulas = new Set(['is', 'am', 'are', 'was', 'were']);
            if (commonCopulas.has(lowerWord)) { /* Do nothing */ }
            else { return 'RB'; }
        }

        return null; // No rule matched
    }

    // ---------- Public API ----------
    tagSentence(sentence) {
        this.log(`\nTagging sentence: "${sentence}"`);
        let tokens = this.tokenize(sentence);

        const { tokens: expandedTokens, contractionTagMap } = this.expandContractions(tokens);
        const taggedWords = [];

        for (let i = 0; i < expandedTokens.length; i++) {
            const word = expandedTokens[i];

            // Use pre-assigned tag from contraction expansion if it exists
            if (contractionTagMap.has(i)) {
                const tag = contractionTagMap.get(i);
                this.log(`Contraction dict -> tag "${word}" as ${tag}`);
                taggedWords.push({ word, tag });
                continue;
            }

            // NEW: Ellipsis check
            if (word === '...') {
                this.log(`Punctuation -> tag "..." as ELL`);
                taggedWords.push({ word, tag: 'ELL' });
                continue;
            }

            // Punctuation check
            if (/^[.,;:!?()]$/.test(word)) {
                if (word === '(' || word === ')') {
                    this.log(`Parenthetical -> tag "${word}" as PRN`);
                    taggedWords.push({ word, tag: 'PRN' });
                    continue;
                }
                const tag = word === ';' ? ':' : (word === '!' || word === '?' ? '.' : word);
                this.log(`Punctuation -> tag "${word}" as ${tag}`);
                taggedWords.push({ word, tag });
                continue;
            }

            // Quote handling check
            if (word === "'" || word === '"' || word === '`') {
                const tag = this.tagQuoteToken(word);
                this.log(`Quote -> tag "${word}" as ${tag}`);
                taggedWords.push({ word, tag });
                continue;
            }

            // Possessive check
            // This runs before the main context rules to correctly identify 's
            if (word.endsWith("'s") || word.endsWith("s'")) {
                this.log(`Possessive rule -> tag "${word}" as POS`);
                taggedWords.push({ word, tag: 'POS' });
                continue;
            }

            // Gather context for the rules engine
            const prevWord = i > 0 ? expandedTokens[i - 1] : null;
            const prevTag = i > 0 ? taggedWords[i - 1].tag : null;
            const prev2 = i > 1 ? expandedTokens[i - 2] : null;
            const prev2Tag = i > 1 ? taggedWords[i - 2].tag : null;
            const prev3Tag = i > 2 ? taggedWords[i - 3].tag : null; // Add this line
            const nextWord = i < expandedTokens.length - 1 ? expandedTokens[i + 1] : null;
            const possibleTags = this.getLexiconTags(word);

            // Apply contextual rules
            const ctxTag = this.applyTwoTokenContextRules({
                word, prevWord, prev2, prevTag, prev2Tag,
                prev3Tag, // Pass the new tag here
                nextWord, possibleTags
            });
            if (ctxTag) {
                taggedWords.push({ word, tag: ctxTag });
                continue;
            }

            // Apply suffix heuristic if no context rule matched and word is OOV
            const suffixTags = this.suffixHeuristic(word);
            if (suffixTags.length > 0 && possibleTags.length === 0) {
                this.log(`Suffix heuristic -> tag "${word}" as ${suffixTags[0]}`);
                taggedWords.push({ word, tag: suffixTags[0] });
                continue;
            }

            // Final fallback
            const fallbackTag = possibleTags[0] || (this.isCapitalized(word) && i > 0 ? 'NNP' : 'NN');
            this.log(`Fallback -> tag "${word}" as ${fallbackTag}`);
            taggedWords.push({ word, tag: fallbackTag });
        }
        return taggedWords;
    }
    // In your POSTagger class...

    //
    // In your POSTagger class, REPLACE the entire chunk() method with this one.
    //
    chunk(taggedWords) {
        this.log('[Chunker] Starting chunking process...');
        const chunks = [];
        let i = 0;

        const isNounChunkTag = (tag) => tag && (tag.startsWith('DT') || tag.startsWith('JJ') || tag.startsWith('NN') || tag === 'PRP' || tag === 'PRP$' || tag === 'POS' || tag === 'CD' || tag === 'WP$');
        const isVerbChunkTag = (tag) => tag && (tag.startsWith('VB') || tag === 'MD' || tag === 'RB');

        while (i < taggedWords.length) {
            const currentWord = taggedWords[i];
            let currentChunkTaggedWords = [];
            let chunkType = 'O';
            let j = i;

            if (isNounChunkTag(currentWord.tag)) {
                chunkType = 'NP';
                while (j < taggedWords.length && isNounChunkTag(taggedWords[j].tag)) {
                    currentChunkTaggedWords.push(taggedWords[j]);
                    j++;
                }
            } else if (isVerbChunkTag(currentWord.tag)) {
                chunkType = 'VP';
                while (j < taggedWords.length && isVerbChunkTag(taggedWords[j].tag)) {
                    currentChunkTaggedWords.push(taggedWords[j]);
                    j++;
                }
            } else {
                // It's an 'O' chunk
                currentChunkTaggedWords.push(currentWord);
                j++;
            }

            const originalPhraseText = currentChunkTaggedWords.map(t => t.word).join(' ');

            // --- THIS IS THE CRITICAL LOGIC BLOCK ---

            // 1. Get the concept text by stripping determiners FIRST.
            const conceptText = this._getConceptText(currentChunkTaggedWords);

            // 2. Lemmatize the clean concept text SECOND.
            const lemmatizedText = this.lemmatizer.lemmatize(conceptText);

            chunks.push({
                taggedWords: currentChunkTaggedWords,
                type: chunkType,
                originalText: originalPhraseText, // Storing original for clarity
                lemmatizedText: lemmatizedText    // This is now correctly lemmatized
            });

            i = j;
        }

        this.log('[Chunker] Chunking complete.');
        return chunks;
    }
}
// ===================================================================
// CLASS 2: Lemmatizer (self-contained – no external library required)
// ===================================================================
class Lemmatizer {
    constructor(irregulars = {}) {
        // Create a set of nouns that are the same in singular and plural form.
        this.invariableNouns = new Set([
            'aircraft',
            'barracks',
            'billiards',
            'bison',
            'Chinese',
            'cod',
            'crossroads',
            'deer',
            'fish',
            'gallows',
            'headquarters',
            'hovercraft',
            'Japanese',
            'mathematics',
            'means',
            'moose',
            'news',
            'physics',
            'Portuguese',
            'salmon',
            'series',
            'sheep',
            'shrimp',
            'spacecraft',
            'species',
            'squid',
            'Swiss',
            'trout',
            'Vietnamese',
            'watercraft'
        ]);

        this.irregularNouns = Object.assign({
            // Vowel Change
            men: 'man',
            women: 'woman',
            feet: 'foot',
            teeth: 'tooth',
            geese: 'goose',
            mice: 'mouse',
            lice: 'louse',

            // Ending Change
            children: 'child',
            oxen: 'ox',
            people: 'person',

            // Latin & Greek Plurals
            cacti: 'cactus',
            fungi: 'fungus',
            stimuli: 'stimulus',
            syllabi: 'syllabus',
            alumni: 'alumnus',
            algae: 'alga',
            larvae: 'larva',
            vertebrae: 'vertebra',
            criteria: 'criterion',
            phenomena: 'phenomenon',
            appendices: 'appendix',
            indices: 'index',
            matrices: 'matrix',
            analyses: 'analysis',
            axes: 'axis', // This is for 'axis' -> 'axes', not 'axe' -> 'axes'
            bases: 'basis',
            crises: 'crisis',
            diagnoses: 'diagnosis',
            ellipses: 'ellipsis',
            oases: 'oasis',
            theses: 'thesis',

            // Miscellaneous
            dice: 'die'
        }, irregulars.nouns || {});

        this.irregularVerbs = Object.assign({
            arisen: 'arise',
            arose: 'arise',
            ate: 'eat',
            awoke: 'awake',
            awoken: 'awake',
            been: 'be',
            began: 'begin',
            begun: 'begin',
            bent: 'bend',
            bet: 'bet',
            bit: 'bite',
            bitten: 'bite',
            blew: 'blow',
            blown: 'blow',
            broke: 'break',
            broken: 'break',
            brought: 'bring',
            built: 'build',
            burst: 'burst',
            bought: 'buy',
            cast: 'cast',
            caught: 'catch',
            chose: 'choose',
            chosen: 'choose',
            came: 'come',
            cost: 'cost',
            cut: 'cut',
            dealt: 'deal',
            did: 'do',
            done: 'do',
            drew: 'draw',
            drawn: 'draw',
            drank: 'drink',
            driven: 'drive',
            drove: 'drive',
            drunk: 'drink',
            eaten: 'eat',
            fell: 'fall',
            fallen: 'fall',
            felt: 'feel',
            fit: 'fit',
            flew: 'fly',
            flown: 'fly',
            forgot: 'forget',
            forgotten: 'forget',
            fought: 'fight',
            found: 'find',
            froze: 'freeze',
            frozen: 'freeze',
            gave: 'give',
            given: 'give',
            gone: 'go',
            got: 'get',
            gotten: 'get',
            grew: 'grow',
            grown: 'grow',
            had: 'have',
            hung: 'hang',
            heard: 'hear',
            held: 'hold',
            hurt: 'hurt',
            kept: 'keep',
            knew: 'know',
            known: 'know',
            laid: 'lay',
            led: 'lead',
            left: 'leave',
            lent: 'lend',
            let: 'let',
            lost: 'lose',
            made: 'make',
            meant: 'mean',
            met: 'meet',
            paid: 'pay',
            put: 'put',
            quit: 'quit',
            ran: 'run',
            rang: 'ring',
            ridden: 'ride',
            rode: 'ride',
            rung: 'ring',
            said: 'say',
            sang: 'sing',
            sank: 'sink',
            sat: 'sit',
            saw: 'see',
            seen: 'see',
            sent: 'send',
            set: 'set',
            shot: 'shoot',
            shut: 'shut',
            slept: 'sleep',
            sold: 'sell',
            sought: 'seek',
            spoke: 'speak',
            spoken: 'speak',
            spent: 'spend',
            spread: 'spread',
            stood: 'stand',
            stole: 'steal',
            stolen: 'steal',
            sung: 'sing',
            sunk: 'sink',
            swam: 'swim',
            swum: 'swim',
            taught: 'teach',
            taken: 'take',
            threw: 'throw',
            thrown: 'throw',
            thought: 'think',
            told: 'tell',
            took: 'take',
            understood: 'understand',
            was: 'be',
            went: 'go',
            were: 'be',
            won: 'win',
            woke: 'wake',
            woken: 'wake',
            wore: 'wear',
            worn: 'wear',
            wrote: 'write',
            written: 'write'
        }, irregulars.verbs || {});
    }

    lemmatize(phrase) {
        if (!phrase || typeof phrase !== 'string') return '';
        const words = phrase.trim().split(/\s+/);
        const lastIdx = words.length - 1;
        const w = words[lastIdx].toLowerCase();
        let lemma = this._lemmatizeWord(w);
        words[lastIdx] = lemma;
        return words.join(' ');
    }

    _lemmatizeWord(word) {
        if (this.invariableNouns.has(word)) {
            return word;
        }
        if (this.irregularNouns[word]) return this.irregularNouns[word];
        if (this.irregularVerbs[word]) return this.irregularVerbs[word];

        // 2. Regular noun/verb de-inflection (ordered from most specific to most general)

        // handles 'babies' -> 'baby', 'studies' -> 'study'
        if (/ies$/.test(word) && word.length > 3) return word.slice(0, -3) + 'y';

        // handles 'leaves' -> 'leave'
        if (/ves$/.test(word) && word.length > 3) return word.slice(0, -1);

        // handles nouns/verbs ending in -es after s, x, z, ch, sh
        // e.g., buses -> bus, boxes -> box, watches -> watch
        if (/(s|x|z|ch|sh)es$/.test(word) && word.length > 4) {
            return word.slice(0, -2);
        }

        // handles general plurals and 3rd-person verbs: 'cats' -> 'cat', 'makes' -> 'make'
        // This rule now correctly handles 'makes' because the rule above ignores it.
        if (/s$/.test(word) && word.length > 2 && !/ss$/.test(word)) return word.slice(0, -1);

        // 3. Regular verb participles / past tense (IMPROVED)
        const vowels = 'aeiou';
        if (/(ing|ed)$/.test(word)) {
            let stem = word.endsWith('ing') ? word.slice(0, -3) : word.slice(0, -2);

            // If the stem is too short, it was probably a base form like 'bring' or 'sing'.
            if (stem.length < 3) {
                return word; // Return the original word unchanged.
            }

            // Check for doubled consonant (e.g., running -> run)
            if (
                stem.length > 2 &&
                stem.charAt(stem.length - 1) === stem.charAt(stem.length - 2) &&
                !vowels.includes(stem.charAt(stem.length - 1)) &&
                vowels.includes(stem.charAt(stem.length - 3))
            ) {
                return stem.slice(0, -1);
            }

            // Handle i -> y (e.g., studying -> study)
            if (stem.endsWith('i')) {
                return stem.slice(0, -1) + 'y';
            }

            // --- START NEW LOGIC FOR SILENT 'E' ---
            // Check for a consonant-vowel-consonant pattern at the end of the stem.
            if (
                stem.length > 2 &&
                !vowels.includes(stem.slice(-1)) && // Ends in a consonant
                vowels.includes(stem.slice(-2, -1)) && // Preceded by a vowel
                !vowels.includes(stem.slice(-3, -2)) // Preceded by another consonant
            ) {
                const lastChar = stem.slice(-1);
                // Don't add 'e' if the last letter is w, x, or y
                if (lastChar !== 'w' && lastChar !== 'x' && lastChar !== 'y') {
                    return stem + 'e';
                }
            }
            // --- END NEW LOGIC ---

            return stem;
        }

        return word;
    }
}


// ===================================================================
// CLASS 3: DependencyParser (Refactored for a Rules Engine)
// ===================================================================
class DependencyParser {
    constructor(options = {}) {
        this.options = Object.assign({ debug: false }, options);

        // --- NEW: Rules Engine ---
        // Each rule defines a pattern of chunk types to look for.
        // The 'action' function creates the dependency links if the pattern matches.
        this.rules = [
            {
                name: 'Gerund-Subject',
                pattern: ['VP', 'VP'],
                action: (chunks) => {
                    const [subjectChunk, verbChunk] = chunks;

                    // Check if the first VP is a gerund acting as a subject.
                    if (subjectChunk.taggedWords.length === 1 && subjectChunk.taggedWords[0].tag === 'VBG') {
                        const subject = subjectChunk.lemmatizedText;;
                        const verb = verbChunk.lemmatizedText;
                        this.log(`Rule Matched: Gerund-Subject ("${verb}" -> "${subject}")`);
                        return [{ head: verb, relation: 'nsubj', dependent: subject }];
                    }
                    return [];
                }
            },
            {
                name: 'Pronoun-Subject-Verb',
                pattern: ['O', 'VP'],
                action: (chunks) => {
                    const [subjectChunk, verbChunk] = chunks;

                    // Check if the 'O' chunk is a subject pronoun (PRP or WP).
                    const subjectTag = subjectChunk.taggedWords[0]?.tag;
                    if (subjectTag === 'PRP' || subjectTag === 'WP') {
                        const subject = subjectChunk.lemmatizedText;;
                        const verb = verbChunk.lemmatizedText;
                        this.log(`Rule Matched: Pronoun-Subject ("${verb}" -> "${subject}")`);
                        return [{ head: verb, relation: 'nsubj', dependent: subject }];
                    }
                    return [];
                }
            },
            {
                name: 'Subject-Verb',
                pattern: ['NP', 'VP'],
                action: (chunks) => {
                    const [subjectChunk, verbChunk] = chunks;
                    const subject = subjectChunk.lemmatizedText;;
                    const verb = verbChunk.lemmatizedText;

                    if (this._isPassive(verbChunk)) {
                        this.log(`Rule Matched: Passive-Subject ("${verb}" -> "${subject}")`);
                        // For passive voice, the verb is the head and the subject is a passive nominal subject.
                        return [{ head: verb, relation: 'nsubj:pass', dependent: subject }];
                    } else {
                        this.log(`Rule Matched: Active-Subject ("${verb}" -> "${subject}")`);
                        // For active voice, the verb is the head and the subject is a nominal subject.
                        return [{ head: verb, relation: 'nsubj', dependent: subject }];
                    }
                }
            },
            {
                name: 'Verb-Object',
                pattern: ['VP', 'NP'],
                action: (chunks) => {
                    const [verb, object] = chunks;

                    // Prevent auxiliaries from taking direct objects.
                    const doAuxWords = new Set(['do', 'does', 'did']);
                    if (verb.taggedWords.length === 1 && doAuxWords.has(verb.taggedWords[0].word.toLowerCase())) {
                        return []; // This is an auxiliary verb, not a main verb. Bail out.
                    }

                    this.log(`Rule Matched: Verb-Object ("${verb.lemmatizedText}" -> "${object.lemmatizedText}")`);
                    return [{
                        head: verb.lemmatizedText,
                        relation: 'dobj',
                        dependent: object.lemmatizedText
                    }];
                }
            },
            {
                name: 'Relative Clause (no comma)',
                pattern: ['NP', 'O'],
                action: (chunks) => {
                    const [headNounChunk, pronounChunk] = chunks;
                    if (pronounChunk.taggedWords[0]?.tag === 'WP') {
                        const headNoun = headNounChunk.lemmatizedText;
                        const pronoun = pronounChunk.lemmatizedText;
                        this.log(`Rule Matched: Relative Clause (no comma) ("${headNoun}" -> "${pronoun}")`);
                        return [{ head: headNoun, relation: 'ref', dependent: pronoun }];
                    }
                    return [];
                }
            },
            {
                name: 'Relative Clause (comma)',
                pattern: ['NP', 'O', 'O'],
                action: (chunks) => {
                    const [headNounChunk, commaChunk, pronounChunk] = chunks;
                    if (commaChunk.taggedWords[0]?.tag === ',' && pronounChunk.taggedWords[0]?.tag === 'WP') {
                        const headNoun = headNounChunk.lemmatizedText;
                        const pronoun = pronounChunk.lemmatizedText;
                        this.log(`Rule Matched: Relative Clause (comma) ("${headNoun}" -> "${pronoun}")`);
                        return [{ head: headNoun, relation: 'ref', dependent: pronoun }];
                    }
                    return [];
                }
            },
            {
                name: 'Relative Clause (Possessive)',
                pattern: ['NP', 'O', 'NP'],
                action: (chunks) => {
                    const [headNounChunk, possPronounChunk, subjectChunk] = chunks;
                    // Check if the middle 'O' chunk is a WP$ tag
                    if (possPronounChunk.taggedWords[0]?.tag === 'WP$') {
                        const headNoun = headNounChunk.lemmatizedText;
                        const relClauseSubject = subjectChunk.lemmatizedText;
                        this.log(`Rule Matched: Relative Clause (Possessive) ("${headNoun}" -> "${relClauseSubject}")`);
                        return [{ head: headNoun, relation: 'poss', dependent: relClauseSubject }];
                    }
                    return [];
                }
            },
            {
                name: 'Passive-Agent',
                pattern: ['O', 'NP'], // <-- Use the smarter pattern
                action: (chunks, allChunks, i) => {
                    const [prepChunk, agentChunk] = chunks;

                    // 1. Check if the preposition is 'by'
                    if (prepChunk.taggedWords[0]?.word.toLowerCase() !== 'by') {
                        return []; // Not an agent, let other rules handle it.
                    }

                    // 2. Look backwards for the nearest Verb Phrase
                    const searchWindow = 5;
                    const startIndex = Math.max(0, i - searchWindow);
                    for (let j = i - 1; j >= startIndex; j--) {
                        if (allChunks[j] && allChunks[j].type === 'VP') {
                            const verbChunk = allChunks[j];
                            // 3. Check if that verb is passive
                            if (this._isPassive(verbChunk)) {
                                const verb = verbChunk.lemmatizedText;
                                const agent = agentChunk.lemmatizedText;
                                this.log(`Rule Matched: Passive-Agent ("${verb}" -> "${agent}")`);
                                return [{ head: verb, relation: 'obl:agent', dependent: agent }];
                            }
                            // Found a VP but it wasn't passive, so stop looking.
                            break;
                        }
                    }

                    // Did not find a passive verb to attach to
                    return [];
                }
            },
            {
                name: 'Coordination (NPs)',
                pattern: ['NP', 'O', 'NP'],
                action: (chunks, allChunks, i) => { // <-- Add allChunks and i to the function signature
                    const [item1, conj, item2] = chunks;

                    if (conj.taggedWords[0]?.tag === 'CC') {
                        // Check for the VP -> [NP CC NP] -> VP pattern, which indicates clause coordination.
                        const chunkBefore = allChunks[i - 1];
                        const chunkAfter = allChunks[i + 3]; // The chunk after the pattern ends

                        if (chunkBefore?.type === 'VP' && chunkAfter?.type === 'VP') {
                            this.log(`Skipping NP coordination due to surrounding VPs.`);
                            return []; // This is clause coordination, not NP coordination.
                        }

                        return [{ head: item1.lemmatizedText, relation: `conj_${conj.taggedWords[0].word}`, dependent: item2.lemmatizedText }];
                    }
                    return [];
                }
            },
            {
                name: 'Coordination (VPs)',
                pattern: ['VP', 'O', 'VP'],
                action: (chunks) => {
                    const [item1, conj, item2] = chunks;
                    if (conj.taggedWords[0]?.tag === 'CC' || conj.taggedWords[0]?.tag === ',') {
                        const conjWord = conj.taggedWords[0].word === ',' ? 'and' : conj.taggedWords[0].word;
                        return [{ head: item1.lemmatizedText, relation: `conj_${conjWord}`, dependent: item2.lemmatizedText }];
                    }
                    return [];
                }
            },
            {
                name: 'Verbal Modifier (Gerund)',
                pattern: ['NP', 'O', 'VP'],
                action: (chunks) => {
                    const [nounPhrase, prep, verbPhrase] = chunks;
                    // This pattern is most common with the preposition 'of' and a gerund (VBG)
                    if (prep.taggedWords[0]?.word.toLowerCase() === 'of' &&
                        verbPhrase.taggedWords[0]?.tag === 'VBG') {

                        this.log(`Rule Matched: Verbal Modifier ("${nounPhrase.lemmatizedText}" -> "${verbPhrase.lemmatizedText}")`);
                        return [{
                            head: nounPhrase.lemmatizedText,
                            relation: 'vmod', // Verbal Modifier
                            dependent: verbPhrase.lemmatizedText
                        }];
                    }
                    return [];
                }
            },
            // Rule for comma-separated relative clauses (e.g., "Land, which...")
            {
                name: 'Relative Clause (comma)',
                pattern: ['NP', 'O', 'O'], // Matches NP, Comma, "which"
                action: (chunks) => {
                    const [headNounChunk, commaChunk, pronounChunk] = chunks;
                    if (commaChunk.taggedWords[0]?.tag === ',' && pronounChunk.taggedWords[0]?.tag === 'WP') {
                        const headNoun = headNounChunk.lemmatizedText;
                        const pronoun = pronounChunk.lemmatizedText;
                        this.log(`Rule Matched: Relative Clause (comma) ("${headNoun}" -> "${pronoun}")`);
                        return [{ head: headNoun, relation: 'ref', dependent: pronoun }];
                    }
                    return [];
                }
            },
            // Rule for non-comma relative clauses (e.g., "developer who...")
            {
                name: 'Relative Clause (no comma)',
                pattern: ['NP', 'O'], // Matches NP, "who"
                action: (chunks) => {
                    const [headNounChunk, pronounChunk] = chunks;
                    if (pronounChunk.taggedWords[0]?.tag === 'WP') {
                        const headNoun = headNounChunk.lemmatizedText;
                        const pronoun = pronounChunk.lemmatizedText;
                        this.log(`Rule Matched: Relative Clause (no comma) ("${headNoun}" -> "${pronoun}")`);
                        return [{ head: headNoun, relation: 'ref', dependent: pronoun }];
                    }
                    return [];
                }
            },
            {
                name: 'Relative Clause (Possessive)',
                pattern: ['NP', 'NP'],
                action: (chunks) => {
                    const [headNounChunk, relClauseChunk] = chunks;

                    // Check if the second NP starts with a WP$ tag
                    if (relClauseChunk.taggedWords[0]?.tag === 'WP$') {
                        const headNoun = headNounChunk.lemmatizedText;
                        const relClauseSubject = relClauseChunk.lemmatizedText;
                        this.log(`Rule Matched: Relative Clause (Possessive) ("${headNoun}" -> "${relClauseSubject}")`);
                        // Connects "person" to "car" via the possessive "whose"
                        return [{ head: headNoun, relation: 'poss', dependent: relClauseSubject }];
                    }
                    return [];
                }
            },
            {
                name: 'Prepositional Phrase Attachment',
                pattern: ['O', 'NP'],
                bypassProcessedCheck: true,
                // --- CORRECTED ACTION LOGIC ---
                action: (chunks, allChunks, i) => {
                    const [prep, object] = chunks;
                    if (prep.taggedWords[0]?.tag !== 'IN') {
                        return [];
                    }

                    const searchWindow = 5; // Look back a max of 5 chunks
                    const startIndex = Math.max(0, i - searchWindow);

                    // --- Pass 1: Prioritize finding a recent Verb Phrase (VP) ---
                    for (let j = i - 1; j >= startIndex; j--) {
                        if (allChunks[j].type === 'VP') {
                            const headChunk = allChunks[j];
                            const headText = headChunk.lemmatizedText;
                            const dependentText = object.lemmatizedText;
                            const relation = `prep_${prep.taggedWords[0].word}`;
                            this.log(`Rule Matched: PP Attachment (VP Priority) ("${headText}" -> "${dependentText}")`);
                            return [{ head: headText, relation: relation, dependent: dependentText }];
                        }
                    }

                    // --- Pass 2: If no VP is found, fall back to the nearest Noun Phrase (NP) ---
                    for (let j = i - 1; j >= 0; j--) {
                        if (allChunks[j].type === 'NP') {
                            const headChunk = allChunks[j];
                            const headText = headChunk.lemmatizedText;
                            const dependentText = object.lemmatizedText;
                            const relation = `prep_${prep.taggedWords[0].word}`;
                            this.log(`Rule Matched: PP Attachment (NP Fallback) ("${headText}" -> "${dependentText}")`);
                            return [{ head: headText, relation: relation, dependent: dependentText }];
                        }
                    }

                    return []; // Could not find anything to attach to
                }
            }
        ];
    }

    log(message) { if (this.options.debug) console.log(`[DEP] ${message}`); }



    _isPassive(verbChunk) {
        if (!verbChunk || !verbChunk.taggedWords) return false;
        const tags = verbChunk.taggedWords.map(t => t.tag);

        // Look for any form of the verb "to be" followed by a past participle (VBN).
        // This handles "was stolen", "is generated", "are written", and crucially, "be written".
        const beVerbs = new Set(['VB', 'VBP', 'VBZ', 'VBD', 'VBN', 'VBG']); // All possible tags for a form of "to be"

        for (let i = 0; i < tags.length - 1; i++) {
            const word = verbChunk.taggedWords[i].word.toLowerCase();
            const nextTag = tags[i + 1];

            if (beVerbs.has(tags[i]) && (word === 'be' || word === 'is' || word === 'am' || word === 'are' || word === 'was' || word === 'were' || word === 'being' || word === 'been') && nextTag === 'VBN') {
                this.log(`Passive pattern found: ${word}/${tags[i]} + ${verbChunk.taggedWords[i + 1].word}/${nextTag}`);
                return true;
            }
        }
        return false;
    }

    // --- REWRITTEN: Complete coordination resolution ---
    _resolveCoordinations(dependencies) {
        this.log("Resolving coordinations...");
        const resolved = [...dependencies];
        const coordinations = dependencies.filter(d => d.relation.startsWith('conj_'));
        const depMap = new Map(resolved.map(d => [JSON.stringify(d), true]));

        for (const coord of coordinations) {
            const item1 = coord.head;
            const item2 = coord.dependent;

            for (const dep of dependencies) {
                // Direction 1: Propagate relationships FROM item1 TO item2
                // Example: (reviewed -> team) + (reviewed and approved) => (approved -> team)
                if (dep.head === item1 && !dep.relation.startsWith('conj_')) {
                    const newDep = { head: item2, relation: dep.relation, dependent: dep.dependent };
                    const newDepString = JSON.stringify(newDep);
                    if (!depMap.has(newDepString)) {
                        this.log(`Coordination resolved (from): Inferred link ("${newDep.head}" --[${newDep.relation}]--> "${newDep.dependent}")`);
                        resolved.push(newDep);
                        depMap.set(newDepString, true);
                    }
                }

                // Direction 2: Propagate relationships TO item1 and item2
                // Example: (eat -> apples) + (apples and oranges) => (eat -> oranges)
                if (dep.dependent === item1 && !dep.relation.startsWith('conj_')) {
                    const newDep = { head: dep.head, relation: dep.relation, dependent: item2 };
                    const newDepString = JSON.stringify(newDep);
                    if (!depMap.has(newDepString)) {
                        this.log(`Coordination resolved (to): Inferred link ("${newDep.head}" --[${newDep.relation}]--> "${newDep.dependent}")`);
                        resolved.push(newDep);
                        depMap.set(newDepString, true);
                    }
                }

                // --- START NEW LOGIC ---
                // Direction 3: Propagate relationships that apply to item2 back to item1
                // Example: (ate -> dog) + (cat or dog) => (ate -> cat)
                if (dep.dependent === item2 && !dep.relation.startsWith('conj_')) {
                    const newDep = { head: dep.head, relation: dep.relation, dependent: item1 };
                    const newDepString = JSON.stringify(newDep);
                    if (!depMap.has(newDepString)) {
                        this.log(`Coordination resolved (to): Inferred link ("${newDep.head}" --[${newDep.relation}]--> "${newDep.dependent}")`);
                        resolved.push(newDep);
                        depMap.set(newDepString, true);
                    }
                }
                // --- END NEW LOGIC ---
            }
        }
        return resolved;
    }

    parse(chunks) {
        this.log("Starting chunk-based dependency parse...");
        let dependencies = [];
        const processedIndices = new Set();

        // --- First Pass: Stateful List Parsing ---
        for (let i = 0; i < chunks.length - 2; i++) {
            if (processedIndices.has(i)) continue;

            const headChunk = chunks[i];
            const puncChunk = chunks[i + 1];
            const firstItemChunk = chunks[i + 2];

            if (headChunk.type === 'NP' && puncChunk.taggedWords[0]?.tag === ':' && firstItemChunk.type === 'NP') {
                const listHeadText = headChunk.lemmatizedText;
                this.log(`Found List Head: "${listHeadText}"`);

                dependencies.push({ head: listHeadText, relation: 'appos', dependent: firstItemChunk.lemmatizedText });
                processedIndices.add(i);
                processedIndices.add(i + 1);
                processedIndices.add(i + 2);
                let j = i + 3;
                // --- CORRECTED INNER LOOP LOGIC ---
                while (j < chunks.length - 1) {
                    // Pattern 1: Look for [O ','] -> [O 'CC'] -> [NP] (e.g., ", and widgets")
                    if (j < chunks.length - 2 &&
                        chunks[j].taggedWords[0]?.tag === ',' &&
                        chunks[j + 1].taggedWords[0]?.tag === 'CC' &&
                        chunks[j + 2].type === 'NP') {

                        const nextItem = chunks[j + 2];
                        this.log(`Found List Item (Oxford Comma): "${nextItem.lemmatizedText}"`);
                        dependencies.push({ head: listHeadText, relation: 'appos', dependent: nextItem.lemmatizedText });
                        processedIndices.add(j).add(j + 1).add(j + 2);
                        j += 3; // Move past the comma, conjunction, and item

                        // Pattern 2: Look for [O ','] -> [NP] OR [O 'CC'] -> [NP]
                    } else if ((chunks[j].taggedWords[0]?.tag === ',' || chunks[j].taggedWords[0]?.tag === 'CC') && chunks[j + 1].type === 'NP') {
                        const nextItem = chunks[j + 1];
                        this.log(`Found List Item: "${nextItem.lemmatizedText}"`);
                        dependencies.push({ head: listHeadText, relation: 'appos', dependent: nextItem.lemmatizedText });
                        processedIndices.add(j).add(j + 1);
                        j += 2; // Move past the separator and the item

                    } else {
                        break; // End of the list
                    }
                }
                i = j - 1;
            }
        }

        // --- Second Pass: General Rule Application (Unchanged) ---
        for (const rule of this.rules) {
            const patternLength = rule.pattern.length;
            for (let i = 0; i <= chunks.length - patternLength; i++) {

                const subChunks = chunks.slice(i, i + patternLength);
                const subChunkTypes = subChunks.map(c => c.type);

                if (JSON.stringify(subChunkTypes) === JSON.stringify(rule.pattern)) {
                    const newDependencies = rule.action(subChunks, chunks, i);
                    if (newDependencies.length > 0) {
                        dependencies.push(...newDependencies);
                        // Mark the indices of the chunks we just used as processed.
                        for (let j = 0; j < patternLength; j++) {
                            processedIndices.add(i + j);
                        }
                    }
                }
            }
        }

        this.log("Chunk-based parse complete.");
        dependencies = this._resolveCoordinations(dependencies);
        return dependencies;
    }
}

// ===================================================================
// CLASS 4: WikidataLinker (FINAL - with Dynamic Context)
// ===================================================================
class WikidataLinker {
    constructor(lemmatizer, options = {}) {
        this.options = Object.assign({ debug: false }, options);
        this.lemmatizer = lemmatizer;
        this.cache = new Map();
        // The SEMANTIC_TYPES filter is still valuable and remains.
        this.SEMANTIC_TYPES = {
            ACTION: new Set(['Q402629', 'Q3249551', 'Q1656682']),
            OBJECT: new Set(['Q488383', 'Q223557', 'Q4406616', 'Q7184903', 'Q483247', 'Q11262', 'Q39546', 'Q1183543', 'Q212437', 'Q386724', 'Q15401930', 'Q235557']),
        };
        // --- FIX #1: The hard-coded context list is REMOVED from the constructor ---
    }
    log(message, context) {
        if (!this.options.debug) return;
        console.log(`[WIKI] ${message}`, context !== undefined ? context : '');
    }

    /**
     * Fetches search results from the Wikidata API. Fault-tolerant.
     * @param {string} searchTerm The term to search for.
     * @returns {Promise<Array>} A promise that resolves to an array of search results.
     */
    async _searchEntities(searchTerm) {
        const cacheKey = `search_${searchTerm}`;
        if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);
        const apiUrl = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(searchTerm)}&language=en&format=json&origin=*`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`API response not OK: ${response.status}`);
            const data = await response.json();
            const results = data.search || [];
            this.cache.set(cacheKey, results);
            return results;
        } catch (e) {
            console.error(`Search API error for "${searchTerm}":`, e);
            return []; // Return empty array on failure
        }
    }

    /**
     * Fetches full entity data for one or more entity IDs. Fault-tolerant.
     * @param {string|string[]} entityIds A single ID or an array of IDs.
     * @returns {Promise<object|Array>} A promise resolving to an entity object or an array of entities.
     */
    async _getEntityData(entityIds) {
        const ids = Array.isArray(entityIds) ? entityIds : [entityIds];
        const uncashedIds = ids.filter(id => !this.cache.has(id));

        if (uncashedIds.length > 0) {
            const apiUrl = `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${uncashedIds.join('|')}&props=labels|descriptions|claims&languages=en&format=json&origin=*`;
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error(`API response not OK: ${response.status}`);
                const data = await response.json();
                for (const id in data.entities) {
                    this.cache.set(id, data.entities[id]);
                }
            } catch (e) {
                console.error(`Get Entity API error for IDs "${uncashedIds.join(',')}":`, e);
            }
        }
        // Return from cache; failed requests will result in undefined, which is handled downstream.
        return Array.isArray(entityIds) ? ids.map(id => this.cache.get(id)) : this.cache.get(entityIds);
    }

    _generateSearchTermCascade(term) {
        const cascade = new Set([term.toLowerCase()]);
        const words = term.toLowerCase().split(/\s+/);
        if (words.length > 1) {
            const lastWord = words[words.length - 1];
            cascade.add(lastWord);
            cascade.add(this.lemmatizer.lemmatize(lastWord));
        } else {
            cascade.add(this.lemmatizer.lemmatize(term));
        }
        return Array.from(cascade).filter(Boolean);
    }

    /**
     * The main entry point for finding the best IRI for a given term.
     * @param {string} term The term from the dependency graph (e.g., "normalized Excel spreadsheets").
     * @param {object} context Contextual information, including chunkType and other entities.
     * @returns {Promise<object|null>} A promise resolving to the best match object or null.
     */
    async findBestIRI(term, context) {
        this.log(`Finding IRI for term: "${term}"`);
        // --- FIX #2: We now get the DYNAMIC context passed in from the Analyzer ---
        const { chunkType, contextEntities } = context;

        const termCascade = this._generateSearchTermCascade(term);
        let initialCandidates = [];
        const seenIds = new Set();
        for (const searchTerm of termCascade) {
            const results = await this._searchEntities(searchTerm);
            for (const result of results) {
                if (!seenIds.has(result.id)) initialCandidates.push(result);
                seenIds.add(result.id);
            }
        }

        if (initialCandidates.length === 0) return null;

        const highValueKeywords = new Set(term.toLowerCase().split(/\s+/).map(w => this.lemmatizer.lemmatize(w)));

        const scoringPromises = initialCandidates.slice(0, 7).map(async (candidate) => {
            let score = 0;
            const label = candidate.label?.toLowerCase() || '';
            const description = candidate.description?.toLowerCase() || '';

            score += [...highValueKeywords].filter(kw => label.includes(kw)).length * 10;
            score += [...highValueKeywords].filter(kw => description.includes(kw)).length * 3;
            if (description) score += 1;

            // This is the full entity data including claims (for P31/P279)
            const fullCandidateData = await this._getEntityData(candidate.id);
            const claims = fullCandidateData?.claims;
            if (claims) {
                const typeIds = [
                    ...(claims.P31 || []).map(c => c.mainsnak.datavalue.value.id),
                    ...(claims.P279 || []).map(c => c.mainsnak.datavalue.value.id)
                ];
                if (typeIds.length > 0) {
                    const typeEntities = await this._getEntityData(typeIds);
                    for (const typeEntity of typeEntities) {
                        const typeLabelWords = typeEntity?.labels?.en?.value.toLowerCase().split(/\s+/) || [];
                        for (const tWord of typeLabelWords) {
                            // It now correctly checks against the DYNAMIC context
                            if (contextEntities.has(tWord)) {
                                this.log(`Resonance match for "${label}" on type "${tWord}"`);
                                score += 15;
                            }
                        }
                    }
                }
            }
            return { ...candidate, score, claims: claims }; // Pass claims along for the next step
        });

        const settledResults = await Promise.allSettled(scoringPromises);
        const successfulCandidates = settledResults.filter(res => res.status === 'fulfilled' && res.value).map(res => res.value);
        if (successfulCandidates.length === 0) return null;

        // --- Defensive Filtering (Now runs after resonance scoring) ---
        const expectedTypes = chunkType === 'VP' ? this.SEMANTIC_TYPES.ACTION : this.SEMANTIC_TYPES.OBJECT;
        const unexpectedTypes = chunkType === 'VP' ? this.SEMANTIC_TYPES.OBJECT : this.SEMANTIC_TYPES.ACTION;

        for (const candidate of successfulCandidates) {
            const types = new Set([
                ...(candidate.claims?.P31 || []).map(c => c.mainsnak.datavalue.value.id),
                ...(candidate.claims?.P279 || []).map(c => c.mainsnak.datavalue.value.id)
            ]);
            if ([...types].some(type => unexpectedTypes.has(type))) {
                this.log(`INCORRECT semantic type for "${candidate.label}". Penalizing.`);
                candidate.score -= 20;
            }
            if ([...types].some(type => expectedTypes.has(type))) {
                this.log(`Correct semantic type for "${candidate.label}".`);
                candidate.score += 10;
            }
        }

        successfulCandidates.sort((a, b) => b.score - a.score);
        const best = successfulCandidates[0];

        if (!best || best.score < 12) {
            this.log(`No confident match for "${term}". Best was "${best?.label}" with score ${best?.score}`);
            return null;
        }

        this.log(`Best match for "${term}": "${best.label}" (${best.id}) with score ${best.score}`);
        return { term: term, iri: `http://www.wikidata.org/entity/${best.id}`, label: best.label, description: best.description || 'N/A' };
    }
}
// ===================================================================
// CLASS 5: Analyzer (Final Version)
// ===================================================================
class Analyzer {
    constructor(lexicon, options = {}) {
        this.options = Object.assign({ debug: false }, options);
        this.tagger = new POSTagger(lexicon, this.options);
        this.parser = new DependencyParser(this.options);
        this.lemmatizer = new Lemmatizer(lexicon); // Lexicon can help the simple lemmatizer
        this.linker = new WikidataLinker(this.lemmatizer, this.options);
    }

    log(message) { if (this.options.debug) console.log(`[ANALYZER] ${message}`); }

    getGraph(sentence, chunks = [], dependencies = []) {
        this.log('--- Building Simplified Graph ---');

        if (!Array.isArray(dependencies)) {
            dependencies = [];
        }

        // The 'dependencies' from the parser are already lemmatized.
        // We just need to remove any potential duplicates.
        const uniqueLinks = Array.from(
            new Set(dependencies.map(d => JSON.stringify(d)))
        ).map(s => JSON.parse(s));

        const formattedOutput = uniqueLinks
            .map(dep => `(${dep.head}) --[${dep.relation}]--> (${dep.dependent})`)
            .join('\n');

        this.log('--- Graph Building Complete ---');
        return formattedOutput;
    }

    async getWikidataLinks(sentence, dependencies, chunks) {
        this.log("--- Starting Wikidata Linking ---");
        const uniqueNodes = new Set();
        dependencies.forEach(dep => {
            if (dep.head) uniqueNodes.add(dep.head);
            if (dep.dependent) uniqueNodes.add(dep.dependent);
        });

        const contextEntities = new Set(Array.from(uniqueNodes).map(node => this.lemmatizer.lemmatize(node.split(' ').pop())));

        const linkPromises = Array.from(uniqueNodes).map(term => {
            const chunk = chunks.find(c => c.lemmatizedText === term);
            const context = {
                originalSentence: sentence,
                chunkType: chunk?.type || 'NP',
                contextEntities: contextEntities
            };
            return this.linker.findBestIRI(term, context);
        });

        const wikidataLinks = (await Promise.all(linkPromises)).filter(Boolean);
        this.log("--- Wikidata Linking Complete ---");
        return wikidataLinks;
    }
}

class GDCService {
    constructor(taggerInstance) {
        if (!taggerInstance) {
            throw new Error("GDCService requires an instance of the POSTagger.");
        }
        this.tagger = taggerInstance;
        this.lemmatizer = new Lemmatizer();

        // --- Configuration ---
        this.GDC_BASE_IRI = "http://purl.obolibrary.org/obo/BFO_0000031";
        this.GDC_TYPE_IRI = "http://purl.obolibrary.org/obo/BFO_0000031";
        this.CONTINUANT_PART_OF = "http://purl.obolibrary.org/obo/BFO_0000176";
        this.PERSON_IRI = "https://www.commoncoreontologies.org/ont00001262";
        this.RDFS_LABEL_IRI = "http://www.w3.org/2000/01/rdf-schema#label";

        // This is the critical line, ensuring it's an array.
        this.TEXT_PROPERTIES = [
            "https://www.commoncoreontologies.org/ont00001761",
            "http://www.w3.org/2000/01/rdf-schema#label",
            "http://purl.org/dc/terms/description",
            "http://www.w3.org/2000/01/rdf-schema#comment"
        ];
    }

    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0;
        }
        return Math.abs(hash);
    }

    getConceptTextFromChunk(chunk) {
        if (!chunk || !chunk.taggedWords || chunk.taggedWords.length === 0) return '';
        const words = [];
        let foundFirstContentWord = false;
        for (const token of chunk.taggedWords) {
            if (!foundFirstContentWord && token.tag === 'DT') continue;
            foundFirstContentWord = true;
            words.push(token.word);
        }
        return words.join(' ');
    }

    processGraph(sourceGraph) {
        console.log("GDC Service: Starting graph processing with lemmatization...");
        const chunkMap = new Map();

        for (const node of sourceGraph) {
            if (node['@type'] && node['@type'].includes(this.PERSON_IRI)) continue;

            const sourceNodeIri = node['@id'];
            const textsToProcess = []; // This declaration is correctly here.

            for (const prop of this.TEXT_PROPERTIES) {
                if (node[prop] && Array.isArray(node[prop])) {
                    node[prop].forEach(item => {
                        if (item && typeof item['@value'] === 'string' && item['@value'].trim()) {
                            textsToProcess.push(item['@value']);
                        }
                    });
                }
            }

            for (const text of textsToProcess) {
                const taggedWords = this.tagger.tagSentence(text);
                const chunks = this.tagger.chunk(taggedWords);

                for (const chunk of chunks) {
                    if (chunk.type === 'O') continue;

                    const conceptText = this.getConceptTextFromChunk(chunk).trim();
                    if (!conceptText) continue;

                    const lemmatizedText = this.lemmatizer.lemmatize(conceptText);
                    const mapKey = lemmatizedText.toLowerCase();

                    if (chunkMap.has(mapKey)) {
                        const existingNode = chunkMap.get(mapKey);
                        const isAboutLinks = existingNode[this.CONTINUANT_PART_OF];
                        if (!isAboutLinks.some(link => link['@id'] === sourceNodeIri)) {
                            isAboutLinks.push({ '@id': sourceNodeIri });
                        }
                    } else {
                        const gdcId = this.hashCode(mapKey);
                        const newNode = {
                            '@id': `${this.GDC_BASE_IRI}/${gdcId}`,
                            '@type': [this.GDC_TYPE_IRI],
                            [this.RDFS_LABEL_IRI]: [{ '@value': lemmatizedText }],
                            [this.CONTINUANT_PART_OF]: [{ '@id': sourceNodeIri }]
                        };
                        chunkMap.set(mapKey, newNode);
                    }
                }
            }
        }

        const gdcNodes = Array.from(chunkMap.values());
        console.log(`GDC Service: Finished processing. Generated ${gdcNodes.length} unique GDC nodes.`);
        return gdcNodes;
    }
}

// ======================================================
// NEW CLASS: GDC & DATABASE MANAGER
// ======================================================

class GDCManager {
    constructor(taggerInstance) { // <-- REMOVED initialGraph argument
        this.gdcService = new GDCService(taggerInstance);
        // REMOVED: this.allNodesCache = initialGraph;
    }

    async updateAndSave(nodesToUpsert, currentAllNodesCache, currentDSQIdForUpdate = null) { // <-- ADDED currentAllNodesCache argument
        const isUpdate = !!currentDSQIdForUpdate;
        console.log(`[GDCManager] Starting update...`);

        // Use the PASSED-IN cache now
        const newUpsertIds = new Set(nodesToUpsert.map(n => n['@id']));
        const graphForProcessing = [
            ...currentAllNodesCache.filter(node => !newUpsertIds.has(node['@id'])),
            ...nodesToUpsert
        ];

        const newGdcNodes = this.gdcService.processGraph(graphForProcessing);
        const finalGraphToSave = [...nodesToUpsert, ...newGdcNodes];

        // --- Step 4: Perform the database transaction ---
        const db = await initIndexedDB(); // Assuming initIndexedDB is globally accessible or passed in
        const transaction = db.transaction("DSQStore", "readwrite");
        const store = transaction.objectStore("DSQStore");

        return new Promise((resolve) => {
            const getAllKeysReq = store.getAllKeys();
            getAllKeysReq.onerror = (event) => {
                console.error("Failed to get keys for cleanup:", event.target.error);
                resolve({ success: false, reason: 'Database cleanup error.' });
            };

            getAllKeysReq.onsuccess = () => {
                const allKeys = getAllKeysReq.result;
                let keysToDelete = [];

                // A. Find all *currently existing* GDC nodes in the DB.
                const existingGdcKeys = allKeys.filter(key => key.startsWith(this.gdcService.GDC_BASE_IRI));

                // B. Create a set of the *newly generated* GDC IDs for efficient lookup.
                const newGdcIds = new Set(newGdcNodes.map(n => n['@id']));

                // C. Mark old GDCs for deletion: those in the DB but NOT in the new set.
                keysToDelete = existingGdcKeys.filter(key => !newGdcIds.has(key));

                // --- START RESTORED LOGIC ---
                // D. If updating a specific DSQ, mark its old *child nodes* for deletion.
                if (isUpdate && currentDSQIdForUpdate) {
                    const dsqUniqueId = currentDSQIdForUpdate.split('/').pop().split('_').pop();
                    const oldOwnedChildKeys = allKeys.filter(key => {
                        // Check if the key belongs to the DSQ being updated
                        const isOwned = key.includes(`_${dsqUniqueId}_`);
                        // Ensure it's not a shared node (like Person, Email, Role)
                        const isShared = key.includes('/Person_') || key.includes('/EmailAddress_') || key.includes('/role_');
                        // Ensure it's not the main DSQ node itself or the sync node
                        const isMainOrSync = key === currentDSQIdForUpdate || key === 'sync_state';
                        // Ensure it's not a GDC node (already handled above)
                        const isGDC = key.startsWith(this.gdcService.GDC_BASE_IRI);

                        return isOwned && !isShared && !isMainOrSync && !isGDC;
                    });
                    console.log(`[GDCManager] Marking ${oldOwnedChildKeys.length} old child nodes for deletion for DSQ ${currentDSQIdForUpdate}.`);
                    keysToDelete.push(...oldOwnedChildKeys);
                }
                // --- END RESTORED LOGIC ---

                // E. Perform deletions and save the new/updated graph.
                const uniqueKeysToDelete = [...new Set(keysToDelete)]; // Ensure no duplicate keys
                console.log(`[GDCManager] Deleting ${uniqueKeysToDelete.length} nodes (old GDCs and/or old children).`);
                uniqueKeysToDelete.forEach(key => store.delete(key));

                console.log(`[GDCManager] Upserting ${finalGraphToSave.length} nodes (DSQ, children, GDCs, sync).`);
                finalGraphToSave.forEach(node => store.put({ ...node, id: node["@id"] }));
            };

            transaction.oncomplete = () => {
                console.log("[GDCManager] Database update complete.");
                resolve({ success: true, newJsonLD: nodesToUpsert }); // Return only the nodes that were upserted (DSQ + children + sync)
            };
            transaction.onerror = (event) => {
                console.error("Save transaction failed:", event.target.error);
                resolve({ success: false, reason: 'Database error.' });
            };
        });
    }
}