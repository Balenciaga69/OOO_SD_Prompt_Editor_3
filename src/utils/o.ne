@preprocessor typescript

Prompt -> (SinglePrompt [,，]):* SinglePrompt {% ([c,t]) => [...c.map((n: any[]) => n[0]),t] %}
SinglePrompt -> Plain {% id %} | WhitespaceWrapped {% id %} | _ {% () => null %}
WhitespaceWrapped -> _ ( Emphasized {% id %} | Editing {% id %} | Alternate {% id %} ) _ {% ([,d]) => d %}
Emphasized ->
	"(" Prompt ")" {% ([,c]) => ({type: 'weight_add', content: c}) %} |
	"(" Prompt ":" Number ")" {% ([,c,,w]) => ({type: 'weight_set', content: c, weight: w}) %} |
	"[" Prompt "]" {% ([,c]) => ({type: 'weight_sub', content: c}) %}
Editing -> "[" (Prompt ":"):? Prompt ":" Number "]" {% ([,a,b,,w]) => ({type: 'editing', from: a?.[0] ?? null, to: b, breakpoint: w}) %}
Alternate -> "[" Prompt ("|" Prompt):+ "]" {% ([,a,b]) => ({type: 'alternate', tags: [a, ...b.map((n: any[]) => n[1])]}) %}

Plain -> Char:+ {% ([c], l, r) => c.join('').trim() === '' ? null :({type: 'tag', name: c.join('').replace(/[  \t\n\v\f]/g, ' ').trim()}) %}
Char -> [^\\\[\]():|,，] {% id %} | "\\(" {% () => '(' %} | "\\)" {% () => ')' %} | "\\[" {% () => '[' %} | "\\]" {% () => ']' %}


Number -> _ unsigned_decimal _ {% ([,d]) => d %}

_  -> wschar:* {% function(d) {return null;} %}
wschar -> [  \t\n\v\f] {% id %}

unsigned_decimal -> [0-9]:+ ("." [0-9]:+):? {%
    function(d) {
        return parseFloat(
            d[0].join("") +
            (d[1] ? "."+d[1][1].join("") : "")
        );
    }
%}

