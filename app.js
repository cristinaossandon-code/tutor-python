const { useState } = React;
const { AlertCircle, CheckCircle, Code, MessageSquare, Lightbulb, Send } = window.lucide;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Code className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Tutor Virtual de Python</h1>
          </div>
          <p className="text-gray-600">Aprende Python identificando y corrigiendo errores en tu código</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-600" />
              Tu Código Python
            </h2>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Escribe o pega tu código Python aquí...&#10;&#10;Ejemplo:&#10;def saludar(nombre)&#10;    print('Hola ' + nombre)"
              className="w-full h-64 p-4 font-mono text-sm border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
            />
            <button
              onClick={analyzeCode}
              disabled={loading}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5" />
                  Analizar Código
                </>
              )}
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Análisis y Correcciones</h2>
            
            {!analysis ? (
              <div className="text-center text-gray-500 py-12">
                <Code className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Ingresa tu código y presiona "Analizar Código" para comenzar</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${analysis.hasErrors ? 'bg-red-50 border-l-4 border-red-500' : 'bg-green-50 border-l-4 border-green-500'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {analysis.hasErrors ? (
                      <>
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-red-800">Errores Encontrados</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">¡Código Correcto!</span>
                      </>
                    )}
                  </div>
                  {analysis.errorType && (
                    <p className="text-sm text-red-700">Tipo: <code className="bg-red-100 px-2 py-1 rounded">{analysis.errorType}</code></p>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">📝 Explicación</h3>
                  <p className="text-blue-800 text-sm">{analysis.explanation}</p>
                </div>

                {analysis.steps && analysis.steps.length > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-900 mb-2">🔧 Cómo Corregirlo</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
                      {analysis.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {analysis.correctedCode && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">✅ Código Corregido</h3>
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-x-auto">
                      <code>{analysis.correctedCode}</code>
                    </pre>
                  </div>
                )}

                {analysis.bestPractices && analysis.bestPractices.length > 0 && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Consejos de Buenas Prácticas
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-purple-800">
                      {analysis.bestPractices.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {analysis && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              Chat con tu Tutor
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto mb-4">
              {chatMessages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Haz una pregunta sobre tu código o los errores encontrados</p>
              ) : (
                <div className="space-y-3">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-white border-2 border-gray-200 text-gray-800'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border-2 border-gray-200 p-3 rounded-lg">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Escribe tu pregunta aquí..."
                className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                disabled={chatLoading}
              />
              <button
                onClick={sendChatMessage}
                disabled={chatLoading || !chatInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.render(<PythonTutor />, document.getElementById('root'));