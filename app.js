const { useState } = React;

// Componentes de iconos simples (sin librería externa)
function AlertCircle(props) {
  return React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    width: props.className?.includes('w-16') ? 64 : props.className?.includes('w-8') ? 32 : 20,
    height: props.className?.includes('w-16') ? 64 : props.className?.includes('w-8') ? 32 : 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    className: props.className
  },
    React.createElement('circle', { cx: "12", cy: "12", r: "10" }),
    React.createElement('line', { x1: "12", y1: "8", x2: "12", y2: "12" }),
    React.createElement('line', { x1: "12", y1: "16", x2: "12.01", y2: "16" })
  );
}

function CheckCircle(props) {
  return React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    className: props.className
  },
    React.createElement('path', { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
    React.createElement('polyline', { points: "22 4 12 14.01 9 11.01" })
  );
}

function Code(props) {
  return React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    width: props.className?.includes('w-16') ? 64 : props.className?.includes('w-8') ? 32 : 20,
    height: props.className?.includes('w-16') ? 64 : props.className?.includes('w-8') ? 32 : 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    className: props.className
  },
    React.createElement('polyline', { points: "16 18 22 12 16 6" }),
    React.createElement('polyline', { points: "8 6 2 12 8 18" })
  );
}

function MessageSquare(props) {
  return React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    className: props.className
  },
    React.createElement('path', { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
  );
}

function Lightbulb(props) {
  return React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    className: props.className
  },
    React.createElement('path', { d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" }),
    React.createElement('path', { d: "M9 18h6" }),
    React.createElement('path', { d: "M10 22h4" })
  );
}

function Send(props) {
  return React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    className: props.className
  },
    React.createElement('line', { x1: "22", y1: "2", x2: "11", y2: "13" }),
    React.createElement('polygon', { points: "22 2 15 22 11 13 2 9 22 2" })
  );
}

function PythonTutor() {
  const [code, setCode] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const analyzeCode = async () => {
    if (!code.trim()) {
      alert('Por favor, ingresa código Python para analizar');
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `Eres un tutor virtual de Python para estudiantes que están aprendiendo. Analiza el siguiente código Python y proporciona:

1. Si hay errores, identifícalos claramente
2. Explica el tipo de error (SyntaxError, NameError, TypeError, etc.)
3. Sugiere cómo corregirlo paso a paso
4. Muestra el código corregido con comentarios explicativos
5. Incluye consejos de buenas prácticas

Si el código está correcto, felicita al estudiante y ofrece sugerencias de mejora si las hay.

Usa un tono amigable y motivador. Formatea tu respuesta en secciones claras.

Código a analizar:
\`\`\`python
${code}
\`\`\`

Responde SOLO con un objeto JSON en este formato exacto (sin markdown, sin backticks):
{
  "hasErrors": true/false,
  "errorType": "tipo de error o null",
  "explanation": "explicación del problema",
  "steps": ["paso 1", "paso 2", ...],
  "correctedCode": "código corregido",
  "bestPractices": ["consejo 1", "consejo 2", ...]
}`
            }
          ]
        })
      });

      const data = await response.json();
      const content = data.content[0].text;
      
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      const result = JSON.parse(cleanContent);
      
      setAnalysis(result);
      setChatMessages([{
        role: 'assistant',
        content: '¡Análisis completado! Revisa los resultados arriba. ¿Tienes alguna pregunta sobre el código o los errores encontrados?'
      }]);
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al analizar el código. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !analysis) return;

    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const conversationHistory = chatMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `Contexto: Eres un tutor de Python ayudando a un estudiante. Acabas de analizar este código:

\`\`\`python
${code}
\`\`\`

Análisis previo: ${JSON.stringify(analysis)}

Conversación previa:
${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}

Estudiante pregunta: ${userMessage}

Responde de forma clara, amigable y educativa. Si es necesario, proporciona ejemplos de código.`
            }
          ]
        })
      });

      const data = await response.json();
      const assistantMessage = data.content[0].text;
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Error:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Lo siento, hubo un error. Por favor, intenta preguntar de nuevo.' 
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  return React.createElement('div', { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6" },
    React.createElement('div', { className: "max-w-6xl mx-auto" },
      React.createElement('div', { className: "bg-white rounded-lg shadow-lg p-6 mb-6" },
        React.createElement('div', { className: "flex items-center gap-3 mb-2" },
          React.createElement(Code, { className: "w-8 h-8 text-indigo-600" }),
          React.createElement('h1', { className: "text-3xl font-bold text-gray-800" }, 'Tutor Virtual de Python')
        ),
        React.createElement('p', { className: "text-gray-600" }, 'Aprende Python identificando y corrigiendo errores en tu código')
      ),

      React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-2 gap-6" },
        React.createElement('div', { className: "bg-white rounded-lg shadow-lg p-6" },
          React.createElement('h2', { className: "text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2" },
            React.createElement(Code, { className: "w-5 h-5 text-indigo-600" }),
            'Tu Código Python'
          ),
          React.createElement('textarea', {
            value: code,
            onChange: (e) => setCode(e.target.value),
            placeholder: "Escribe o pega tu código Python aquí...\n\nEjemplo:\ndef saludar(nombre)\n    print('Hola ' + nombre)",
            className: "w-full h-64 p-4 font-mono text-sm border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
          }),
          React.createElement('button', {
            onClick: analyzeCode,
            disabled: loading,
            className: "w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          },
            loading ? [
              React.createElement('div', { key: 'spinner', className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }),
              'Analizando...'
            ] : [
              React.createElement(AlertCircle, { key: 'icon', className: "w-5 h-5" }),
              'Analizar Código'
            ]
          )
        ),

        React.createElement('div', { className: "bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-96" },
          React.createElement('h2', { className: "text-xl font-semibold text-gray-800 mb-4" }, 'Análisis y Correcciones'),
          
          !analysis ? 
            React.createElement('div', { className: "text-center text-gray-500 py-12" },
              React.createElement(Code, { className: "w-16 h-16 mx-auto mb-4 text-gray-300" }),
              React.createElement('p', null, 'Ingresa tu código y presiona "Analizar Código" para comenzar')
            ) :
            React.createElement('div', { className: "space-y-4" },
              React.createElement('div', { className: `p-4 rounded-lg ${analysis.hasErrors ? 'bg-red-50 border-l-4 border-red-500' : 'bg-green-50 border-l-4 border-green-500'}` },
                React.createElement('div', { className: "flex items-center gap-2 mb-2" },
                  analysis.hasErrors ? [
                    React.createElement(AlertCircle, { key: 'icon', className: "w-5 h-5 text-red-600" }),
                    React.createElement('span', { key: 'text', className: "font-semibold text-red-800" }, 'Errores Encontrados')
                  ] : [
                    React.createElement(CheckCircle, { key: 'icon', className: "w-5 h-5 text-green-600" }),
                    React.createElement('span', { key: 'text', className: "font-semibold text-green-800" }, '¡Código Correcto!')
                  ]
                ),
                analysis.errorType && React.createElement('p', { className: "text-sm text-red-700" }, 
                  'Tipo: ', 
                  React.createElement('code', { className: "bg-red-100 px-2 py-1 rounded" }, analysis.errorType)
                )
              ),

              React.createElement('div', { className: "bg-blue-50 p-4 rounded-lg" },
                React.createElement('h3', { className: "font-semibold text-blue-900 mb-2" }, '📝 Explicación'),
                React.createElement('p', { className: "text-blue-800 text-sm" }, analysis.explanation)
              ),

              analysis.steps && analysis.steps.length > 0 && React.createElement('div', { className: "bg-yellow-50 p-4 rounded-lg" },
                React.createElement('h3', { className: "font-semibold text-yellow-900 mb-2" }, '🔧 Cómo Corregirlo'),
                React.createElement('ol', { className: "list-decimal list-inside space-y-1 text-sm text-yellow-800" },
                  analysis.steps.map((step, idx) => React.createElement('li', { key: idx }, step))
                )
              ),

              analysis.correctedCode && React.createElement('div', { className: "bg-gray-50 p-4 rounded-lg" },
                React.createElement('h3', { className: "font-semibold text-gray-900 mb-2" }, '✅ Código Corregido'),
                React.createElement('pre', { className: "bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto" },
                  React.createElement('code', null, analysis.correctedCode)
                )
              ),

              analysis.bestPractices && analysis.bestPractices.length > 0 && React.createElement('div', { className: "bg-purple-50 p-4 rounded-lg" },
                React.createElement('h3', { className: "font-semibold text-purple-900 mb-2 flex items-center gap-2" },
                  React.createElement(Lightbulb, { className: "w-4 h-4" }),
                  'Consejos de Buenas Prácticas'
                ),
                React.createElement('ul', { className: "list-disc list-inside space-y-1 text-sm text-purple-800" },
                  analysis.bestPractices.map((tip, idx) => React.createElement('li', { key: idx }, tip))
                )
              )
            )
        )
      ),

      analysis && React.createElement('div', { className: "bg-white rounded-lg shadow-lg p-6 mt-6" },
        React.createElement('h2', { className: "text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2" },
          React.createElement(MessageSquare, { className: "w-5 h-5 text-indigo-600" }),
          'Chat con tu Tutor'
        ),
        
        React.createElement('div', { className: "bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto mb-4" },
          chatMessages.length === 0 ?
            React.createElement('p', { className: "text-gray-500 text-center py-8" }, 'Haz una pregunta sobre tu código o los errores encontrados') :
            React.createElement('div', { className: "space-y-3" },
              chatMessages.map((msg, idx) =>
                React.createElement('div', { key: idx, className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}` },
                  React.createElement('div', { className: `max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border-2 border-gray-200 text-gray-800'}` },
                    React.createElement('p', { className: "text-sm whitespace-pre-wrap" }, msg.content)
                  )
                )
              ),
              chatLoading && React.createElement('div', { className: "flex justify-start" },
                React.createElement('div', { className: "bg-white border-2 border-gray-200 p-3 rounded-lg" },
                  React.createElement('div', { className: "flex gap-2" },
                    React.createElement('div', { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", style: {animationDelay: '0ms'} }),
                    React.createElement('div', { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", style: {animationDelay: '150ms'} }),
                    React.createElement('div', { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce", style: {animationDelay: '300ms'} })
                  )
                )
              )
            )
        ),

        React.createElement('div', { className: "flex gap-2" },
          React.createElement('input', {
            type: "text",
            value: chatInput,
            onChange: (e) => setChatInput(e.target.value),
            onKeyPress: (e) => e.key === 'Enter' && sendChatMessage(),
            placeholder: "Escribe tu pregunta aquí...",
            className: "flex-1 p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none",
            disabled: chatLoading
          }),
          React.createElement('button', {
            onClick: sendChatMessage,
            disabled: chatLoading || !chatInput.trim(),
            className: "bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
          },
            React.createElement(Send, { className: "w-5 h-5" })
          )
        )
      )
    )
  );
}

ReactDOM.render(React.createElement(PythonTutor), document.getElementById('root'));
