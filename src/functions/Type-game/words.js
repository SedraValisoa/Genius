export async function getWords(Language) {
  const words = await fetch(`assets/languages/${Language}.json`).then((res) =>
    res.json()
  );
  return words;
}
