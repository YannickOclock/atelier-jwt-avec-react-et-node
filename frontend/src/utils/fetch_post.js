export default async function post(url, body) {
    const httpResponse = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
    });
    return await httpResponse.json();
}