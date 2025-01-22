export default async function fetchGet(url, options = {}) {
    const httpResponse = await fetch(url, options);
    return await httpResponse.json();
}