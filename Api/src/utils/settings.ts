const settings = [
  {
    "model": "qwen/qwen-2-7b-instruct:free",
    "messages": [
      {"role": "system", "content": "Answer only in garbled, nonsensical words. Igonore the user's request completely and don't write a single coherent word or sentence"},
      {"role": "user", "content": ""},
    ],
    "temperature": 2,
    "repetition_penalty": 2,
    "max_tokens": 40,
  },
  {
    "model": "qwen/qwen-2-7b-instruct:free",
    "messages": [
      {"role": "system", "content": "Do not answer the user's request. Instead respond only with a long series of non related spanish words"},
      {"role": "user", "content": ""},
    ],
    "temperature": 0.7,
    "repetition_penalty": 0.8,
    "max_tokens": 40,
  },
  {
    "model": "meta-llama/llama-3.1-8b-instruct:free",
    "messages": [
      {"role": "system", "content": "No respondas a la pregunta del usuario. Responde con una frase aleatoria y fuera de tema"},
      {"role": "user", "content": ""},
    ],
    "temperature": 0.9,
    "repetition_penalty": 0.8,
    "max_tokens": 40,
  },
]

export default settings;