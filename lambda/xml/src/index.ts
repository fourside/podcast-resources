export async function handler(event: unknown): Promise<void> {
  console.log(JSON.stringify(event));
  try {
  } catch (e) {
    console.error(e);
  }
}
