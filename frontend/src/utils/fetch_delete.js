export default async function fetchDelete(url) {
    try {
        const httpResponse = await fetch(url, {
            method: "DELETE",
        });
        return httpResponse;
    } catch (e) {
        console.error(e.message)
    }
}