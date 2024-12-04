// macros.js

const principiaMacros = {
    // Logical Symbols
    pmthm: "{\\vdash}",           // Turnstile symbol (⊢)
    pmimp: "{\\supset}",          // Implies symbol (⊃)
    pmnot: "{\\sim}",             // Negation symbol (∼)
    pmand: "{\\cdot}",            // Logical AND symbol (⋅)
    pmor: "{\\lor}",              // Logical OR symbol (∨)
    pmequiv: "{\\equiv}",         // Equivalence symbol (≡)
    pmuniv: "{\\forall}",         // Universal quantifier (∀)
    pmexist: "{\\exists}",        // Existential quantifier (∃)
    pmid: "{\\mid}",              // Such that symbol (∣)
    pmiff: "{\\leftrightarrow}",  // If and only if symbol (↔)
    pmthen: "{\\rightarrow}",     // Then symbol (→)
    pmproves: "{\\vdash}",        // Proves symbol (⊢)
  
    // Dots and Punctuation
    pmdot: "{\\cdot}",            // Single dot (⋅)
    pmdott: "{\\cdot\\cdot}",     // Double dot (⋅⋅)
    pmcdot: "{\\boldsymbol{\\cdot}}", // Bold dot for numbering
    pmcomma: "{\\,,}",            // Comma with small space
    pmsemicolon: "{\\,;\\,}",     // Semicolon with small spaces
    pmcolon: "{\\,:\\,}",         // Colon with small spaces
    pmquad: "{\\quad}",           // Quad space
    pmast: "{\\ast}",             // Asterisk symbol (∗)
  
    // Substitution Macros
    pmsub: ["{\\bigg[ \\small \\begin{array}{c} #1 \\\\ \\hline #2 \\end{array} \\bigg]}", 2],
    pmsubb: ["{\\bigg[ \\small \\begin{array}{cc} #1 & #3 \\\\ \\hline #2 & #4 \\end{array} \\bigg]}", 4],
  
    // Mathematical Operators
    pmplus: "{+}",                // Plus symbol (+)
    pmminus: "{-}",               // Minus symbol (−)
    pmtimes: "{\\times}",         // Multiplication symbol (×)
    pmdiv: "{\\div}",             // Division symbol (÷)
    pmleq: "{\\leq}",             // Less than or equal to (≤)
    pmgeq: "{\\geq}",             // Greater than or equal to (≥)
    pmelement: "{\\in}",          // Element of symbol (∈)
    pmnotelement: "{\\notin}",    // Not element of symbol (∉)
    pmsubset: "{\\subset}",       // Subset symbol (⊂)
    pmsupset: "{\\supset}",       // Superset symbol (⊃)
    pmemptyset: "{\\emptyset}",   // Empty set symbol (∅)
  
    // Greek Letters
    pmalpha: "{\\alpha}",
    pmbeta: "{\\beta}",
    pmgamma: "{\\gamma}",
    pmdelta: "{\\delta}",
    pmvarepsilon: "{\\varepsilon}",
    pmtheta: "{\\theta}",
    pmlambda: "{\\lambda}",
    pmxi: "{\\xi}",
    pmrho: "{\\rho}",
    pmphi: "{\\phi}",
    pmpsi: "{\\psi}",
    pmomega: "{\\omega}",
  
    // Miscellaneous Symbols
    pmperp: "{\\perp}",           // Perpendicular symbol (⊥)
    pmangle: "{\\angle}",         // Angle symbol (∠)
    pminfty: "{\\infty}",         // Infinity symbol (∞)
    pmdegree: "{^\\circ}",        // Degree symbol (°)
    pmprime: "{^\\prime}",        // Prime symbol (′)
    pmnabla: "{\\nabla}",         // Nabla symbol (∇)
    pmpartial: "{\\partial}",     // Partial derivative symbol (∂)
  
    // Delimiters
    pmabs: ["{\\left| #1 \\right|}", 1],          // Absolute value
    pmnorm: ["{\\left\\| #1 \\right\\|}", 1],     // Norm
    pmfloor: ["{\\left\\lfloor #1 \\right\\rfloor}", 1], // Floor function
    pmceil: ["{\\left\\lceil #1 \\right\\rceil}", 1],    // Ceiling function
  
    // Functions
    pmsin: "{\\sin}",
    pmcos: "{\\cos}",
    pmtan: "{\\tan}",
    pmlog: "{\\log}",
    pmln: "{\\ln}",
    pmexp: "{\\exp}",
  
    // Arrows
    pmrightarrow: "{\\rightarrow}",        // Right arrow (→)
    pmleftarrow: "{\\leftarrow}",          // Left arrow (←)
    pmleftrightarrow: "{\\leftrightarrow}",// Left-right arrow (↔)
    pmuparrow: "{\\uparrow}",              // Up arrow (↑)
    pmdownarrow: "{\\downarrow}",          // Down arrow (↓)
    pmmapsto: "{\\mapsto}",                // Mapsto symbol (↦)
  
    // Sets and Logic
    pmset: ["{\\left\\{ #1 \\right\\}}", 1],  // Set notation
    pmfunc: ["{#1\\colon #2 \\rightarrow #3}", 3], // Function notation
  
    // Formatting Macros
    pmbf: ["{\\mathbf{#1}}", 1],           // Boldface
    pmit: ["{\\mathit{#1}}", 1],           // Italic
    pmsf: ["{\\mathsf{#1}}", 1],           // Sans-serif
    pmmathbb: ["{\\mathbb{#1}}", 1],       // Blackboard bold
    pmmathcal: ["{\\mathcal{#1}}", 1],     // Calligraphic
  
    // Special Macros
    pmtext: ["{\\text{#1}}", 1],           // Text in math mode
    pmfrac: ["{\\dfrac{#1}{#2}}", 2],      // Fraction
    pmsqrt: ["{\\sqrt{#1}}", 1],           // Square root
    pmoverline: ["{\\overline{#1}}", 1],   // Overline
    pmunderline: ["{\\underline{#1}}", 1], // Underline
  
    // Limits and Integrals
    pmsum: ["{\\sum_{#1}^{#2}}", 2],       // Summation
    pmintegral: ["{\\int_{#1}^{#2}}", 2],  // Integral
    pmlim: ["{\\lim_{#1 \\to #2}}", 2],    // Limit
  
    // Accents
    pmhat: ["{\\hat{#1}}", 1],             // Hat accent
    pmtilde: ["{\\tilde{#1}}", 1],         // Tilde accent
    pmbar: ["{\\bar{#1}}", 1],             // Bar accent
    pmdotaccent: ["{\\dot{#1}}", 1],       // Dot accent
    pmdoublehat: ["{\\widehat{#1}}", 1],   // Double hat
  
    // Brackets
    pmparen: ["{\\left( #1 \\right)}", 1], // Parentheses
    pmbracket: ["{\\left[ #1 \\right]}", 1], // Square brackets
    pmbraces: ["{\\left\\{ #1 \\right\\}}", 1], // Curly braces
  
    // Matrix and Arrays
    pmmatrix: ["{\\begin{matrix} #1 \\end{matrix}}", 1],
    pmbmatrix: ["{\\begin{bmatrix} #1 \\end{bmatrix}}", 1],
    pmvmatrix: ["{\\begin{vmatrix} #1 \\end{vmatrix}}", 1],
    pmpmatrix: ["{\\begin{pmatrix} #1 \\end{pmatrix}}", 1],
  
    // Additional Logical Symbols
    pmnand: "{\\barwedge}",                 // NAND symbol
    pmnor: "{\\barvee}",                    // NOR symbol
    pmxor: "{\\veebar}",                    // Exclusive OR symbol
  
    // Miscellaneous
    pmtriangle: "{\\triangle}",             // Triangle symbol (△)
    pmcircle: "{\\circ}",                   // Circle symbol (∘)
    pmbullet: "{\\bullet}",                 // Bullet symbol (•)
    pmstar: "{\\star}",                     // Star symbol (⋆)
    pmclubsuit: "{\\clubsuit}",             // Club suit symbol (♣)
    pmheartsuit: "{\\heartsuit}",           // Heart suit symbol (♥)
    pmspadesuit: "{\\spadesuit}",           // Spade suit symbol (♠)
    pmdiamondsuit: "{\\diamondsuit}",       // Diamond suit symbol (♦)
  };
  
  