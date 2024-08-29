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
    "temperature": 1,
    "repetition_penalty": 1,
    "max_tokens": 40,
  },
]

export default settings;