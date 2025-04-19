export async function Language() {
  const listOfLanguage = await fetch("assets/languages/_groups.json").then(
    (data) => data.json()
  );
  return listOfLanguage;
}
